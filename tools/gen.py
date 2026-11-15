"""用 MMS-TTS（印尼语，ONNX）为课程文本生成 MP3。用法：python gen.py [--test N]"""
import json, re, sys, subprocess, base64, time, os
import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
TOK = {}
for line in open(os.path.join(HERE, 'model/tokens.txt'), encoding='utf-8'):
    line = line.rstrip('\n')
    if not line.strip(): continue
    num = line.split(' ')[-1]
    TOK[line[:-(len(num) + 1)]] = int(num)

UNITS = ['nol', 'satu', 'dua', 'tiga', 'empat', 'lima', 'enam', 'tujuh', 'delapan', 'sembilan']
def say_int(n):
    if n < 10: return UNITS[n]
    if n == 10: return 'sepuluh'
    if n == 11: return 'sebelas'
    if n < 20: return UNITS[n - 10] + ' belas'
    if n < 100: return UNITS[n // 10] + ' puluh' + ('' if n % 10 == 0 else ' ' + UNITS[n % 10])
    if n < 200: return 'seratus' + ('' if n == 100 else ' ' + say_int(n - 100))
    if n < 1000: return UNITS[n // 100] + ' ratus' + ('' if n % 100 == 0 else ' ' + say_int(n % 100))
    if n < 2000: return 'seribu' + ('' if n == 1000 else ' ' + say_int(n - 1000))
    for size, name in ((10**12, 'triliun'), (10**9, 'miliar'), (10**6, 'juta'), (10**3, 'ribu')):
        if n >= size:
            head = say_int(n // size) + ' ' + name
            return head + ('' if n % size == 0 else ' ' + say_int(n % size))
def say_num(s):
    s = s.replace('.', '')
    if ',' in s:
        a, b = s.split(',', 1)
        return say_int(int(a)) + ' koma ' + ' '.join(UNITS[int(ch)] for ch in b)
    return say_int(int(s))

LETTER = dict(a='a', b='be', c='ce', d='de', e='e', f='ef', g='ge', h='ha', i='i', j='je', k='ka', l='el', m='em', n='en', o='o', p='pe', q='ki', r='er', s='es', t='te', u='u', v='fe', w='we', x='eks', y='ye', z='zet')
SPECIAL = {
    'AMDAL': 'amdal', 'HALAL': 'halal', 'QRIS': 'kris', 'WhatsApp': 'wotsap', 'IUPnya': 'i u pe nya',
    'AC': 'a se', 'WiFi': 'waifai', 'APAR': 'apar', 'P3K': 'pe tiga ka', 'K3': 'ka tiga', 'B3': 'be tiga', 'P2H': 'pe dua ha', 'kkal/kg': 'kilokalori per kilogram',
    'Yth.': 'yang terhormat', 'check-in': 'cek in', 'Check-in': 'cek in',
}
def spell(tok):
    return ' '.join(LETTER.get(ch.lower(), '') for ch in tok)

def normalize(text):
    t = re.sub(r'[\[\]«»“”"]', '', text)
    t = t.replace('…', ' ').replace('→', ', ').replace(' / ', ', ').replace('/', ' ').replace('–', ', ').replace('—', ', ')
    for k, v in SPECIAL.items():
        t = re.sub(r'(?<![A-Za-z0-9])' + re.escape(k) + r'(?![A-Za-z0-9])', v, t)
    # 货币和数字：Rp15.000 / US$1,5 miliar / Rp2 triliun / 4.200 / 0,8 / 2020 / 25%
    def money(m):
        cur, num, scale = m.group(1), m.group(2), m.group(3) or ''
        if not cur and len(num) > 1 and num[0] == '0' and num.isdigit():
            return ' '.join(UNITS[int(ch)] for ch in num) + (' ' + scale if scale else '')
        words = say_num(num) + (' ' + scale if scale else '')
        if cur == 'Rp': words += ' rupiah'
        elif cur: words += ' dolar a es'
        return words
    t = re.sub(r'(?:(Rp|US\$)\s?)?(\d[\d.]*(?:,\d+)?)(?:\s(ribu|juta|miliar|triliun))?', money, t)
    t = t.replace('%', ' persen')
    # 大写缩写按字母读，单个大写字母（如 Blok M、ukuran M）也按字母读
    t = re.sub(r'\b[A-Z]{2,}\b', lambda m: spell(m.group(0)), t)
    t = re.sub(r'(?<![A-Za-z\'-])([A-Z])(?![A-Za-z\'-])', lambda m: LETTER[m.group(1).lower()], t)
    t = t.lower().replace('q', 'k').replace('x', 'ks')
    chunks = []
    for part in re.split(r'([,.;:!?]+)', t):
        if not part: continue
        if re.fullmatch(r'[,.;:!?]+', part):
            if chunks: chunks[-1][1] = 0.30 if re.search(r'[.!?]', part) else 0.17
            continue
        clean = ''.join(ch for ch in part if ch in TOK or ch == ' ')
        clean = re.sub(r'\s+', ' ', clean).strip(" -'")
        if clean: chunks.append([clean, 0.0])
    return chunks

SR = 16000
_sess = None
def session():
    global _sess
    if _sess is None:
        import onnxruntime as ort
        o = ort.SessionOptions(); o.intra_op_num_threads = 1; o.inter_op_num_threads = 1
        _sess = ort.InferenceSession(os.path.join(HERE, 'model/model.onnx'), o, providers=['CPUExecutionProvider'])
    return _sess

NOISE = [float(x) for x in os.environ.get('MMS_NOISE', '0.667,0.8').split(',')]
def synth_chunk(text, length_scale):
    ids = [TOK[ch] for ch in text]
    seq = [0] * (len(ids) * 2 + 1); seq[1::2] = ids
    x = np.array([seq], dtype=np.int64)
    out = session().run(None, {'x': x, 'x_length': np.array([x.shape[1]], dtype=np.int64),
                               'noise_scale': np.array([NOISE[0]], dtype=np.float32),
                               'length_scale': np.array([length_scale], dtype=np.float32),
                               'noise_scale_w': np.array([NOISE[1]], dtype=np.float32)})[0]
    y = out.reshape(-1).astype(np.float32)
    idx = np.where(np.abs(y) > 0.012)[0]
    if len(idx):
        a = max(0, idx[0] - int(0.03 * SR)); b = min(len(y), idx[-1] + int(0.05 * SR))
        y = y[a:b]
    return y

def synth(text, length_scale=1.0):
    parts = []
    for chunk, pause in normalize(text):
        parts.append(synth_chunk(chunk, length_scale))
        if pause: parts.append(np.zeros(int(pause * SR * (1.25 if length_scale > 1 else 1)), np.float32))
    if not parts: return None
    y = np.concatenate([np.zeros(int(0.04 * SR), np.float32)] + parts + [np.zeros(int(0.12 * SR), np.float32)])
    peak = float(np.max(np.abs(y))) or 1.0
    return (y * (0.92 / peak)).astype(np.float32)

def mp3(y):
    p = subprocess.run(['ffmpeg', '-v', 'error', '-f', 'f32le', '-ar', str(SR), '-ac', '1', '-i', 'pipe:0',
                        '-codec:a', 'libmp3lame', '-b:a', '32k', '-ar', str(SR), '-f', 'mp3', 'pipe:1'],
                       input=y.tobytes(), capture_output=True, check=True)
    return p.stdout

OUT = os.path.join(HERE, os.environ.get('MMS_OUT', 'out'))
def work(item):
    os.makedirs(OUT, exist_ok=True)
    res = {'id': item['id']}
    for suffix, ls, need in (('', 1.0, True), ('~s', 1.55, item.get('slow'))):
        if not need: continue
        f = os.path.join(OUT, item['id'] + suffix + '.mp3')
        if os.path.exists(f) and os.path.getsize(f) > 0: continue
        y = synth(item['text'], ls)
        if y is None: continue
        tmp = f + '.tmp'
        open(tmp, 'wb').write(mp3(y)); os.replace(tmp, f)
    return res

if __name__ == '__main__':
    items = json.load(open(os.path.join(HERE, 'texts.json')))
    if '--norm' in sys.argv:
        for it in items:
            n = ' | '.join(c for c, _ in normalize(it['text']))
            if n.replace(' | ', ' ') != re.sub(r'[^a-z\' -]', '', it['text'].lower()).strip():
                print(repr(it['text']), '->', n)
        sys.exit()
    if '--test' in sys.argv:
        k = int(sys.argv[sys.argv.index('--test') + 1])
        t0 = time.time(); [work(it) for it in items[:k]]; print('ok', time.time() - t0); sys.exit()
    from concurrent.futures import ProcessPoolExecutor
    t0 = time.time()
    with ProcessPoolExecutor(4) as ex:
        for i, r in enumerate(ex.map(work, items, chunksize=6)):
            if i % 200 == 0: print(i, '/', len(items), f'{time.time()-t0:.0f}s', flush=True)
    print('done', len(items), f'{time.time()-t0:.0f}s', flush=True)
