"""用 Whisper 识别率比较 MMS 不同参数下例句的清晰度"""
import json, random, re, os, sys, io, subprocess, numpy as np
import gen
from faster_whisper import WhisperModel

items = [x for x in json.load(open('texts.json')) if not x.get('slow') and len(x['text'].split()) >= 3]
random.seed(7); sample = random.sample(items, 60)
model = WhisperModel('deepdml/faster-whisper-large-v3-turbo-ct2', device='cpu', compute_type='int8', cpu_threads=4)

def norm(t):
    return ' '.join(c for c, _ in gen.normalize(t)).split()
def wer(ref, hyp):
    d = list(range(len(hyp) + 1))
    for i, r in enumerate(ref, 1):
        prev, d[0] = d[0], i
        for j, h in enumerate(hyp, 1):
            prev, d[j] = d[j], min(d[j] + 1, d[j - 1] + 1, prev + (r != h))
    return d[len(hyp)], len(ref)
def asr(wav):
    segs, _ = model.transcribe(wav, language='id', beam_size=1, temperature=0, vad_filter=False, condition_on_previous_text=False)
    return ' '.join(s.text for s in segs)
def decode(mp3):
    p = subprocess.run(['ffmpeg', '-v', 'error', '-i', 'pipe:0', '-ac', '1', '-ar', '16000', '-f', 'f32le', 'pipe:1'], input=mp3, capture_output=True, check=True)
    return np.frombuffer(p.stdout, np.float32)

variants = {'current (0.667/0.8)': None, 'clear (0.4/0.5)': (0.4, 0.5), 'clearer (0.3/0.4)': (0.3, 0.4)}
res = {}
for name, nz in variants.items():
    E = N = 0; worst = []
    for it in sample:
        if nz is None: y = decode(open(f"out/{it['id']}.mp3", 'rb').read())
        else:
            gen.NOISE[:] = nz; y = gen.synth(it['text'])
            y = decode(gen.mp3(y))
        hyp = asr(y); e, n = wer(norm(it['text']), norm(hyp)); E += e; N += n
        worst.append((e / n, it['text'], hyp))
    res[name] = E / N
    print(f'{name}: WER {E/N:.3f}', flush=True)
    for w in sorted(worst, reverse=True)[:3]: print('   ', round(w[0], 2), '|', w[1], '=>', w[2].strip(), flush=True)
json.dump(res, open('asr_eval.json', 'w'))
