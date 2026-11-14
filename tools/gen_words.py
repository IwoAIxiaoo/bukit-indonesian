"""单词和字母：放进句尾合成再剪出来，每个生成 3 个候选，用 Whisper 挑识别最准的；慢速版同法生成 1 个。
输出 out3/<id>.mp3、out3/<id>~s.mp3；例句沿用 out2。"""
import json, os, re, sys, time, shutil, numpy as np
from concurrent.futures import ProcessPoolExecutor
import gen
HERE = os.path.dirname(os.path.abspath(__file__)); SR = gen.SR
OUT = os.path.join(HERE, 'out3'); TMP = os.path.join(HERE, 'cand'); os.makedirs(OUT, exist_ok=True); os.makedirs(TMP, exist_ok=True)
gen.NOISE[:] = [0.3, 0.4]
CARRIERS = ['kata ini dibaca', 'kata ini dibaca', 'saya bilang']
LETTER_NAMES = {'a', 'be', 'ce', 'de', 'e', 'ef', 'ge', 'ha', 'i', 'je', 'ka', 'el', 'em', 'en', 'o', 'pe', 'ki', 'er', 'es', 'te', 'u', 've', 'we', 'eks', 'ye', 'zet'}

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
    cid, chunk, letter = args
    out = {}
    pre = ['huruf', 'huruf', 'saya bilang huruf'] if letter else CARRIERS
    for j, p in enumerate(pre):
        f = os.path.join(TMP, f'{cid}_{j}.npy')
        if not os.path.exists(f): np.save(f, cut(chunk, p, 1.0))
    f = os.path.join(TMP, f'{cid}_s.npy')
    if not os.path.exists(f): np.save(f, cut(chunk, pre[0], 1.55))
    return cid

items = [x for x in json.load(open(os.path.join(HERE, 'texts.json'))) if x.get('slow')]
chunks = {}   # cid -> (chunk text, is letter)
plan = {}     # item id -> [(cid, pause)]
for it in items:
    ch = gen.normalize(it['text'])
    lst = []
    for c, pause in ch:
        cid = re.sub(r'[^a-z0-9]', '_', c)[:60] + '_' + str(abs(hash(c)) % 100000)
        chunks[cid] = (c, it['key'] in LETTER_NAMES and len(ch) == 1)
        lst.append((cid, pause))
    plan[it['id']] = lst
print('items', len(items), 'unique chunks', len(chunks), flush=True)

if __name__ == '__main__':
    t0 = time.time()
    jobs = [(cid, c, letter) for cid, (c, letter) in chunks.items()]
    with ProcessPoolExecutor(4) as ex:
        for n, _ in enumerate(ex.map(synth_job, jobs, chunksize=8)):
            if n % 300 == 0: print('synth', n, '/', len(jobs), f'{time.time()-t0:.0f}s', flush=True)
    print('synth done', f'{time.time()-t0:.0f}s', flush=True)

    from faster_whisper import WhisperModel
    model = WhisperModel('deepdml/faster-whisper-large-v3-turbo-ct2', device='cpu', compute_type='int8', cpu_threads=4)
    norm = lambda t: re.sub(r'[^a-z ]', '', t.lower().replace('-', ' ')).split()
    def cer(a, b):
        a, b = ' '.join(a), ' '.join(b); d = list(range(len(b) + 1))
        for i, ca in enumerate(a, 1):
            prev, d[0] = d[0], i
            for j, cb in enumerate(b, 1): prev, d[j] = d[j], min(d[j] + 1, d[j - 1] + 1, prev + (ca != cb))
        return d[len(b)] / max(1, len(a))
    cands = [(cid, j) for cid in chunks for j in range(3)]
    score = {}
    GAP = int(0.9 * SR)
    for b0 in range(0, len(cands), 12):
        batch = cands[b0:b0 + 12]; parts = [np.zeros(int(0.3 * SR), np.float32)]; spans = []; t = 0.3
        for cid, j in batch:
            y = np.load(os.path.join(TMP, f'{cid}_{j}.npy')); y = y / (np.max(np.abs(y)) or 1) * 0.9
            spans.append((t, t + len(y) / SR)); parts += [y, np.zeros(GAP, np.float32)]; t += (len(y) + GAP) / SR
        segs, _ = model.transcribe(np.concatenate(parts), language='id', beam_size=1, temperature=0, vad_filter=False,
                                   condition_on_previous_text=False, word_timestamps=True)
        got = [[] for _ in batch]
        for s in segs:
            for w in (s.words or []):
                mid = (w.start + w.end) / 2
                for i, (a, bb) in enumerate(spans):
                    if a - 0.35 <= mid <= bb + 0.35: got[i].append(w.word); break
        for i, (cid, j) in enumerate(batch):
            c, letter = chunks[cid]
            hyp = norm(' '.join(got[i])); ref = norm(c)
            e = cer(ref, hyp)
            if letter: e = min(e, cer([c[0]], hyp))
            score[(cid, j)] = e
        if (b0 // 12) % 40 == 0: print('asr', b0, '/', len(cands), f'{time.time()-t0:.0f}s', flush=True)
    best = {cid: min(range(3), key=lambda j: (score[(cid, j)], j)) for cid in chunks}
    avg_best = sum(score[(cid, best[cid])] for cid in chunks) / len(chunks)
    avg_first = sum(score[(cid, 0)] for cid in chunks) / len(chunks)
    print(f'chunk CER: first candidate {avg_first:.3f}, best of 3 {avg_best:.3f}', flush=True)
    json.dump({f'{c}|{j}': v for (c, j), v in score.items()}, open(os.path.join(HERE, 'word_scores.json'), 'w'))
    for iid, lst in plan.items():
        for suffix, pick in (('', lambda cid: f'{cid}_{best[cid]}'), ('~s', lambda cid: f'{cid}_s')):
            parts = [np.zeros(int(0.04 * SR), np.float32)]
            for cid, pause in lst:
                parts.append(np.load(os.path.join(TMP, pick(cid) + '.npy')))
                if pause: parts.append(np.zeros(int(pause * SR), np.float32))
            parts.append(np.zeros(int(0.12 * SR), np.float32))
            y = np.concatenate(parts); y = (y * (0.92 / (float(np.max(np.abs(y))) or 1))).astype(np.float32)
            open(os.path.join(OUT, iid + suffix + '.mp3'), 'wb').write(gen.mp3(y))
    # 例句和其他非单词条目沿用 out2
    for f in os.listdir(os.path.join(HERE, 'out2')):
        if not os.path.exists(os.path.join(OUT, f)): shutil.copy(os.path.join(HERE, 'out2', f), os.path.join(OUT, f))
    print('done', len(os.listdir(OUT)), f'{time.time()-t0:.0f}s', flush=True)
