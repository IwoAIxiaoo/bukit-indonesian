"""只给 texts.json 里还没有音频的条目生成合成语音（不动已有的文件）。
单词类条目（slow）：每段放进句尾合成 3 个候选，用 Whisper 挑识别最准的，另生成慢读版；句子类：直接合成。输出到 out3/。"""
import json, os, re, sys, time, hashlib, numpy as np
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, HERE)
import gen
gen.NOISE[:] = [0.3, 0.4]
SR = gen.SR
OUT = os.path.join(HERE, 'out3'); TMP = os.path.join(HERE, 'cand_new'); os.makedirs(TMP, exist_ok=True)
CARRIERS = ['kata ini dibaca', 'kata ini dibaca', 'saya bilang']

def run(text, ls):
    ids = [gen.TOK[c] for c in text]
    seq = [0] * (len(ids) * 2 + 1); seq[1::2] = ids
    x = np.array([seq], dtype=np.int64)
    y, dur = gen.session().run(None, {'x': x, 'x_length': np.array([x.shape[1]], dtype=np.int64),
        'noise_scale': np.array([gen.NOISE[0]], np.float32), 'length_scale': np.array([ls], np.float32), 'noise_scale_w': np.array([gen.NOISE[1]], np.float32)})
    return y.reshape(-1).astype(np.float32), dur.reshape(-1)

def cut(word, prefix, ls):
    y, d = run(prefix + ' ' + word, ls)
    cum = np.cumsum(d); k = len(prefix) + 1
    y = y[int(cum[2 * k - 1] * 256):]
    idx = np.where(np.abs(y) > 0.012)[0]
    if len(idx): y = y[max(0, idx[0] - int(0.03 * SR)):min(len(y), idx[-1] + int(0.05 * SR))]
    return y

def synth_job(args):
    cid, chunk = args
    for j, p in enumerate(CARRIERS):
        f = os.path.join(TMP, f'{cid}_{j}.npy')
        if not os.path.exists(f): np.save(f, cut(chunk, p, 1.0))
    f = os.path.join(TMP, f'{cid}_s.npy')
    if not os.path.exists(f): np.save(f, cut(chunk, CARRIERS[0], 1.55))
    return cid

LET = {'a': 'a', 'b': 'be', 'c': 'ce', 'd': 'de', 'e': 'e', 'f': 'ef', 'g': 'ge', 'h': 'ha', 'i': 'i', 'j': 'je', 'k': 'ka', 'l': 'el', 'm': 'em', 'n': 'en', 'o': 'o', 'p': 'pe', 'q': 'ki', 'r': 'er', 's': 'es', 't': 'te', 'u': 'u', 'v': 've', 'w': 'we', 'x': 'eks', 'y': 'ye', 'z': 'zet'}
def norm_hyp(t):
    t = re.sub(r'\d+', lambda m: ' ' + gen.say_int(int(m.group(0))) + ' ', t)
    toks = re.sub(r'[^a-zA-Z ]', ' ', t.replace('-', ' ')).split()
    return [LET[x.lower()] if len(x) == 1 and x.isalpha() else x.lower() for x in toks]
norm_ref = lambda t: re.sub(r'[^a-z ]', '', t.lower().replace('-', ' ')).split()
def cer(a, b):
    a, b = ' '.join(a), ' '.join(b); d = list(range(len(b) + 1))
    for i, ca in enumerate(a, 1):
        prev, d[0] = d[0], i
        for j, cb in enumerate(b, 1): prev, d[j] = d[j], min(d[j] + 1, d[j - 1] + 1, prev + (ca != cb))
    return d[len(b)] / max(1, len(a))

if __name__ == '__main__':
    t0 = time.time()
    items = [x for x in json.load(open(os.path.join(HERE, 'texts.json'))) if not os.path.exists(os.path.join(OUT, x['id'] + '.mp3'))]
    slow = [x for x in items if x.get('slow')]; sent = [x for x in items if not x.get('slow')]
    print('new items', len(items), 'word-like', len(slow), 'sentences', len(sent), flush=True)
    for it in sent:
        y = gen.synth(it['text'], 1.0)
        if y is not None: open(os.path.join(OUT, it['id'] + '.mp3'), 'wb').write(gen.mp3(y))
    chunks, plan = {}, {}
    for it in slow:
        lst = []
        for c, pause in gen.normalize(it['text']):
            cid = re.sub(r'[^a-z0-9]', '_', c)[:50] + '_' + hashlib.md5(c.encode()).hexdigest()[:6]
            chunks[cid] = c; lst.append((cid, pause))
        if lst: plan[it['id']] = lst
        else: print('nothing to say for', repr(it['text']), flush=True)
    print('unique chunks', len(chunks), flush=True)
    from concurrent.futures import ProcessPoolExecutor
    with ProcessPoolExecutor(4) as ex:
        for n, _ in enumerate(ex.map(synth_job, list(chunks.items()), chunksize=8)):
            if n % 200 == 0: print('synth', n, '/', len(chunks), f'{time.time() - t0:.0f}s', flush=True)
    os.environ.setdefault('HF_HUB_OFFLINE', '1')
    from faster_whisper import WhisperModel
    model = WhisperModel('deepdml/faster-whisper-large-v3-turbo-ct2', device='cpu', compute_type='int8', cpu_threads=4)
    cands = [(cid, j) for cid in chunks for j in range(3)]
    score = {}; GAP = int(0.9 * SR)
    for b0 in range(0, len(cands), 12):
        batch = cands[b0:b0 + 12]; parts = [np.zeros(int(0.3 * SR), np.float32)]; spans = []; t = 0.3
        for cid, j in batch:
            y = np.load(os.path.join(TMP, f'{cid}_{j}.npy')); y = y / (np.max(np.abs(y)) or 1) * 0.9
            spans.append((t, t + len(y) / SR)); parts += [y, np.zeros(GAP, np.float32)]; t += (len(y) + GAP) / SR
        segs, _ = model.transcribe(np.concatenate(parts), language='id', beam_size=1, temperature=0, vad_filter=False, condition_on_previous_text=False, word_timestamps=True)
        got = [[] for _ in batch]
        for s in segs:
            for w in (s.words or []):
                mid = (w.start + w.end) / 2
                for i, (a, bb) in enumerate(spans):
                    if a - 0.35 <= mid <= bb + 0.35: got[i].append(w.word); break
        for i, (cid, j) in enumerate(batch):
            score[(cid, j)] = cer(norm_ref(chunks[cid]), norm_hyp(' '.join(got[i])))
        if (b0 // 12) % 20 == 0: print('asr', b0, '/', len(cands), f'{time.time() - t0:.0f}s', flush=True)
    best = {cid: min(range(3), key=lambda j: (score[(cid, j)], j)) for cid in chunks}
    bs = [score[(cid, best[cid])] for cid in chunks]
    print(f'chunk CER best-of-3: mean {np.mean(bs):.3f}; exact {sum(1 for x in bs if x == 0)}/{len(bs)}; CER>0.5: {sum(1 for x in bs if x > 0.5)}', flush=True)
    print('weak chunks:', sorted(chunks[c] for c in chunks if score[(c, best[c])] > 0.5), flush=True)
    for iid, lst in plan.items():
        for suffix, pick in (('', lambda cid: f'{cid}_{best[cid]}'), ('~s', lambda cid: f'{cid}_s')):
            parts = [np.zeros(int(0.04 * SR), np.float32)]
            for cid, pause in lst:
                parts.append(np.load(os.path.join(TMP, pick(cid) + '.npy')))
                if pause: parts.append(np.zeros(int(pause * SR), np.float32))
            parts.append(np.zeros(int(0.12 * SR), np.float32))
            y = np.concatenate(parts); y = (y * (0.92 / (float(np.max(np.abs(y))) or 1))).astype(np.float32)
            open(os.path.join(OUT, iid + suffix + '.mp3'), 'wb').write(gen.mp3(y))
    json.dump({f'{chunks[c]}|{j}': v for (c, j), v in score.items()}, open(os.path.join(HERE, 'new_scores.json'), 'w'), ensure_ascii=False)
    left = [x['text'] for x in json.load(open(os.path.join(HERE, 'texts.json'))) if not os.path.exists(os.path.join(OUT, x['id'] + '.mp3'))]
    print('done', f'{time.time() - t0:.0f}s', '; still without audio:', len(left), left[:10], flush=True)
