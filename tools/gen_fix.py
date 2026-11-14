"""gen_new.py 里识别不准的片段（CER > 0.5）：再多合成几个候选，换一种更稳的办法打分后重选，并重建用到它们的音频。
打分：把 10 个不同的片段连成一条识别，按词序对齐（不靠时间戳），随机分组做 3 次，取平均字符错误率。"""
import json, os, re, sys, random, hashlib, numpy as np
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, HERE)
import gen, gen_new
from gen_new import cut, norm_hyp, norm_ref, cer, TMP, OUT, SR
EXTRA = ['yang ini', 'dia bilang', 'coba baca', 'kata ini dibaca', 'saya bilang']

def align_spans(refs, hyp):
    """refs：每段的参考词列表；hyp：整条识别出的词。动态规划把 hyp 切给各段，返回每段的 CER"""
    flat = [w for r in refs for w in r]; n, m = len(flat), len(hyp)
    D = np.zeros((n + 1, m + 1)); D[:, 0] = np.arange(n + 1); D[0, :] = np.arange(m + 1)
    for i in range(1, n + 1):
        for j in range(1, m + 1):
            sub = cer([flat[i - 1]], [hyp[j - 1]])
            D[i, j] = min(D[i - 1, j - 1] + sub, D[i - 1, j] + 1, D[i, j - 1] + 1)
    i, j = n, m; owner = [[] for _ in flat]
    while i > 0 and j > 0:
        sub = cer([flat[i - 1]], [hyp[j - 1]])
        if D[i, j] == D[i - 1, j - 1] + sub: owner[i - 1].append(hyp[j - 1]); i -= 1; j -= 1
        elif D[i, j] == D[i - 1, j] + 1: i -= 1
        else: owner[i - 1].append(hyp[j - 1]); j -= 1
    out, k = [], 0
    for r in refs:
        got = [w for x in owner[k:k + len(r)] for w in reversed(x)]; k += len(r)
        out.append(cer(r, got))
    return out

if __name__ == '__main__':
    sc = json.load(open(os.path.join(HERE, 'new_scores.json')))
    by = {}
    for k, v in sc.items(): c, j = k.rsplit('|', 1); by.setdefault(c, {})[int(j)] = v
    weak = sorted(c for c, d in by.items() if min(d.values()) > 0.5)
    cid = lambda c: re.sub(r'[^a-z0-9]', '_', c)[:50] + '_' + hashlib.md5(c.encode()).hexdigest()[:6]
    print('weak chunks', len(weak), flush=True)
    for c in weak:
        for j, p in enumerate(EXTRA, 3):
            f = os.path.join(TMP, f'{cid(c)}_{j}.npy')
            if not os.path.exists(f): np.save(f, cut(c, p, 1.0))
    os.environ.setdefault('HF_HUB_OFFLINE', '1')
    from faster_whisper import WhisperModel
    model = WhisperModel('deepdml/faster-whisper-large-v3-turbo-ct2', device='cpu', compute_type='int8', cpu_threads=4)
    cands = [(c, j) for c in weak for j in range(8)]
    tot = {x: [] for x in cands}
    for ps in range(3):
        order = cands[:]; random.Random(40 + ps).shuffle(order)
        batches = []
        for x in order:
            for bt in batches:
                if len(bt) < 10 and all(y[0] != x[0] for y in bt): bt.append(x); break
            else: batches.append([x])
        for bt in batches:
            parts = [np.zeros(int(0.3 * SR), np.float32)]
            for c, j in bt:
                y = np.load(os.path.join(TMP, f'{cid(c)}_{j}.npy')); parts += [(y / (np.max(np.abs(y)) or 1) * 0.9).astype(np.float32), np.zeros(int(0.5 * SR), np.float32)]
            segs, _ = model.transcribe(np.concatenate(parts), language='id', beam_size=5, temperature=0, vad_filter=False, condition_on_previous_text=False, without_timestamps=True)
            errs = align_spans([norm_ref(c) for c, _ in bt], norm_hyp(' '.join(s.text for s in segs)))
            for x, e in zip(bt, errs): tot[x].append(e)
        print('pass', ps + 1, 'done', flush=True)
    best, still = {}, []
    for c in weak:
        m = {j: float(np.mean(tot[(c, j)])) for j in range(8)}
        j = min(m, key=lambda k: (m[k], k)); best[c] = j
        print(f'  {c:28s} old {min(by[c].values()):.2f} -> pick #{j} mean CER {m[j]:.2f}   first three: ' + ' '.join(f'{m[k]:.2f}' for k in range(3)), flush=True)
        if m[j] > 0.34: still.append(c)
    print('still weak after retry:', len(still), still, flush=True)
    # 重建用到这些片段的条目
    old_ids = {x['id'] for x in json.load(open(os.path.join(HERE, 'texts.v8.json')))}
    items = [x for x in json.load(open(os.path.join(HERE, 'texts.json'))) if x.get('slow') and x['id'] not in old_ids]
    n = 0
    for it in items:
        ch = gen.normalize(it['text'])
        if not any(c in best for c, _ in ch): continue
        if not all(os.path.exists(os.path.join(TMP, f'{cid(c)}_0.npy')) for c, _ in ch): continue   # 只处理这一批新条目
        parts = [np.zeros(int(0.04 * SR), np.float32)]
        for c, pause in ch:
            j = best.get(c)
            if j is None:
                d = by[c]; j = min(d, key=lambda k: (d[k], k))
            parts.append(np.load(os.path.join(TMP, f'{cid(c)}_{j}.npy')))
            if pause: parts.append(np.zeros(int(pause * SR), np.float32))
        parts.append(np.zeros(int(0.12 * SR), np.float32))
        y = np.concatenate(parts); y = (y * (0.92 / (float(np.max(np.abs(y))) or 1))).astype(np.float32)
        open(os.path.join(OUT, it['id'] + '.mp3'), 'wb').write(gen.mp3(y)); n += 1
    print('rebuilt items', n, flush=True)
