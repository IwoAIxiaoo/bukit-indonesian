"""比较单词的几种生成方式：直接合成 vs 放进句尾再剪出来（用 Whisper 识别单词是否正确）"""
import json, random, re, subprocess, numpy as np
import gen
from faster_whisper import WhisperModel
gen.NOISE[:] = [0.3, 0.4]
SR = gen.SR

def run(text, ls=1.0):
    ids = [gen.TOK[c] for c in text]
    seq = [0] * (len(ids) * 2 + 1); seq[1::2] = ids
    x = np.array([seq], dtype=np.int64)
    y, dur = gen.session().run(None, {'x': x, 'x_length': np.array([x.shape[1]], dtype=np.int64),
        'noise_scale': np.array([gen.NOISE[0]], np.float32), 'length_scale': np.array([ls], np.float32), 'noise_scale_w': np.array([gen.NOISE[1]], np.float32)})
    return y.reshape(-1).astype(np.float32), dur.reshape(-1)

def trim(y):
    idx = np.where(np.abs(y) > 0.012)[0]
    if len(idx): y = y[max(0, idx[0] - int(0.03 * SR)):min(len(y), idx[-1] + int(0.05 * SR))]
    return y

def carrier(word, prefix, ls=1.0):
    y, d = run(prefix + ' ' + word, ls)
    cum = np.cumsum(d)
    k = len(prefix) + 1                      # 单词第一个字符的位置
    start = int(cum[2 * k - 1] * 256)          # 空格后面那个空白位置的开头
    return trim(y[start:])

def direct(word, ls=1.0):
    return trim(run(word, ls)[0])

items = [x for x in json.load(open('texts.json')) if x.get('slow')]
words = []
for it in items:
    ch = gen.normalize(it['text'])
    if len(ch) == 1 and re.fullmatch(r"[a-z' -]+", ch[0][0]) and len(ch[0][0]) >= 3: words.append(ch[0][0])
random.seed(11); sample = random.sample(sorted(set(words)), 150)
model = WhisperModel('deepdml/faster-whisper-large-v3-turbo-ct2', device='cpu', compute_type='int8', cpu_threads=4)
norm = lambda t: re.sub(r'[^a-z ]', '', t.lower().replace('-', ' ')).split()
def cer(a, b):
    a, b = ' '.join(a), ' '.join(b); d = list(range(len(b) + 1))
    for i, ca in enumerate(a, 1):
        prev, d[0] = d[0], i
        for j, cb in enumerate(b, 1): prev, d[j] = d[j], min(d[j] + 1, d[j - 1] + 1, prev + (ca != cb))
    return d[len(b)] / max(1, len(a))
variants = {
    'direct': lambda w: direct(w),
    'kata ini dibaca': lambda w: carrier(w, 'kata ini dibaca'),
    'saya bilang': lambda w: carrier(w, 'saya bilang'),
    'yang ini': lambda w: carrier(w, 'yang ini'),
}
def wer(ref, hyp):
    d = list(range(len(hyp) + 1))
    for i, r in enumerate(ref, 1):
        prev, d[0] = d[0], i
        for j, h in enumerate(hyp, 1): prev, d[j] = d[j], min(d[j] + 1, d[j - 1] + 1, prev + (r != h))
    return d[len(hyp)]
for name, f in variants.items():
    E = N = 0; shown = []
    for k in range(0, len(sample), 10):
        group = sample[k:k + 10]; parts = []
        for w in group:
            y = f(w); parts += [y / (np.max(np.abs(y)) or 1) * 0.9, np.zeros(int(0.8 * SR), np.float32)]
        audio = np.concatenate([np.zeros(4000, np.float32)] + parts)
        segs, _ = model.transcribe(audio, language='id', beam_size=5, temperature=0, vad_filter=False, condition_on_previous_text=False)
        hyp = norm(' '.join(s.text for s in segs)); ref = norm(' '.join(group))
        E += wer(ref, hyp); N += len(ref)
        if len(shown) < 3: shown.append(' '.join(group) + '  =>  ' + ' '.join(hyp))
    print(f'{name:16s} word error {E/N:.3f}', flush=True)
    for x in shown: print('    ', x, flush=True)
