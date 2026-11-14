"""对得分差的单词重新打分（把 Whisper 写成数字的结果换回印尼语读法、单个字母换成字母名），重选候选并重建对应 MP3；顺便修 rb/jt"""
import json, os, re, numpy as np
import gen
from gen_words import cut, TMP, OUT, SR, LETTER_NAMES
from faster_whisper import WhisperModel
HERE = os.path.dirname(os.path.abspath(__file__))
gen.NOISE[:] = [0.3, 0.4]
scores = {}
for k, v in json.load(open(os.path.join(HERE, 'word_scores.json'))).items():
    c, j = k.rsplit('|', 1); scores.setdefault(c, {})[int(j)] = v
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

items = [x for x in json.load(open(os.path.join(HERE, 'texts.json'))) if x.get('slow')]
san = lambda c: re.sub(r'[^a-z0-9]', '_', c)[:60]
by_prefix = {}
for cid in scores: by_prefix.setdefault(cid.rsplit('_', 1)[0], []).append(cid)
plan = {}; ref_of = {}
for it in items:
    lst = []
    for c, pause in gen.normalize(it['text']):
        cids = by_prefix.get(san(c))
        if not cids: lst = None; break
        cid = cids[0]; ref_of[cid] = c; lst.append((cid, pause))
    if lst: plan[it['id']] = lst
print('items mapped', len(plan), 'of', len(items), flush=True)

model = WhisperModel('deepdml/faster-whisper-large-v3-turbo-ct2', device='cpu', compute_type='int8', cpu_threads=4)
def asr_batch(arrs):
    parts = [np.zeros(int(0.3 * SR), np.float32)]; spans = []; t = 0.3; gap = int(0.9 * SR)
    for y in arrs:
        y = y / (np.max(np.abs(y)) or 1) * 0.9; spans.append((t, t + len(y) / SR)); parts += [y, np.zeros(gap, np.float32)]; t += (len(y) + gap) / SR
    segs, _ = model.transcribe(np.concatenate(parts), language='id', beam_size=1, temperature=0, vad_filter=False, condition_on_previous_text=False, word_timestamps=True)
    got = [[] for _ in arrs]
    for s in segs:
        for w in (s.words or []):
            mid = (w.start + w.end) / 2
            for i, (a, b) in enumerate(spans):
                if a - 0.35 <= mid <= b + 0.35: got[i].append(w.word); break
    return [' '.join(g) for g in got]

bad = [cid for cid, d in scores.items() if min(d.values()) > 0.5 and cid in ref_of]
print('re-scoring', len(bad), flush=True)
cands = [(cid, j) for cid in bad for j in range(3)]
for b0 in range(0, len(cands), 12):
    batch = cands[b0:b0 + 12]
    hyps = asr_batch([np.load(os.path.join(TMP, f'{cid}_{j}.npy')) for cid, j in batch])
    for (cid, j), h in zip(batch, hyps):
        ref = norm_ref(ref_of[cid]); hy = norm_hyp(h)
        e = cer(ref, hy)
        if ref_of[cid] in LETTER_NAMES: e = min(e, cer([ref_of[cid][0]], [x[0] if x in LET.values() else x for x in hy]))
        scores[cid][j] = e
best = {cid: min(d, key=lambda j: (d[j], j)) for cid, d in scores.items()}
print('after re-scoring: CER>0.5 chunks', sum(1 for cid, d in scores.items() if min(d.values()) > 0.5), flush=True)

def write(iid, lst, pick):
    for suffix, f in (('', pick), ('~s', lambda cid: f'{cid}_s')):
        parts = [np.zeros(int(0.04 * SR), np.float32)]
        for cid, pause in lst:
            parts.append(np.load(os.path.join(TMP, f(cid) + '.npy')))
            if pause: parts.append(np.zeros(int(pause * SR), np.float32))
        parts.append(np.zeros(int(0.12 * SR), np.float32))
        y = np.concatenate(parts); y = (y * (0.92 / (float(np.max(np.abs(y))) or 1))).astype(np.float32)
        open(os.path.join(OUT, iid + suffix + '.mp3'), 'wb').write(gen.mp3(y))
changed = set(bad)
n = 0
for iid, lst in plan.items():
    if any(cid in changed for cid, _ in lst): write(iid, lst, lambda cid: f'{cid}_{best[cid]}'); n += 1
print('rebuilt items', n, flush=True)

# rb / jt：按“ribu / juta”的读法重做
for it in items:
    if it['key'] in ('rb', 'jt'):
        word = {'rb': 'ribu', 'jt': 'juta'}[it['key']]; cid = 'fix_' + it['key']
        arrs = []
        for j, p in enumerate(['kata ini dibaca', 'kata ini dibaca', 'saya bilang']):
            y = cut(word, p, 1.0); np.save(os.path.join(TMP, f'{cid}_{j}.npy'), y); arrs.append(y)
        np.save(os.path.join(TMP, f'{cid}_s.npy'), cut(word, 'kata ini dibaca', 1.55))
        hyps = asr_batch(arrs); es = [cer([word], norm_hyp(h)) for h in hyps]; j = int(np.argmin(es))
        write(it['id'], [(cid, 0.0)], lambda c: f'{c}_{j}')
        print('fixed', it['key'], '->', word, 'cer', round(es[j], 2), flush=True)
json.dump({f'{c}|{j}': v for c, d in scores.items() for j, v in d.items()}, open(os.path.join(HERE, 'word_scores.json'), 'w'))
print('done', flush=True)
