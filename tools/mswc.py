"""从 MLCommons 多语种口语词语料库（MSWC，CC BY 4.0）里给单词挑真人录音。
MSWC 的每段是 1 秒：中间是从 Common Voice 句子里按强制对齐切出的单词，两边补数字静音。
流程：匹配 → 解包 → 信号指标 → 选候选 → Whisper 复核 → 处理成 MP3 → 再复核 → human_mswc.json
用法（在 tts 目录外也可以）：venv/bin/python -I mswc.py select | asr | render
数据放在 mswc_raw/（splits.tar.gz、train/dev/test.tar.gz），中间结果在 mswc_work/。"""
import sys, os, json, csv, io, re, tarfile, subprocess, collections, random
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import numpy as np

RAW = os.path.join(HERE, 'mswc_raw'); CLIPS = os.path.join(RAW, 'clips'); WORK = os.path.join(HERE, 'mswc_work')
OUTH = os.path.join(HERE, 'out_human')
SR_IN = 48000
PER_WORD = 60            # 每个词最多解出多少段
CANDS = (4, 4)           # 第一轮 / 第二轮 Whisper 候选数
TARGET_RMS_DB = -15.0    # 处理后语音部分的响度（合成单词约 -13.6 dBFS）
SAFE = re.compile(r"^[a-z0-9_'\-]+\.opus$")

def jload(name, default=None):
    p = os.path.join(WORK, name)
    return json.load(open(p)) if os.path.exists(p) else default
def jsave(name, obj):
    json.dump(obj, open(os.path.join(WORK, name), 'w'), ensure_ascii=False)

def decode(path, sr=SR_IN):
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', path, '-ac', '1', '-ar', str(sr), '-f', 'f32le', 'pipe:1'], capture_output=True).stdout
    return np.frombuffer(raw, np.float32).copy()

def region(x, sr):
    """非零部分（单词本身）的起止样本"""
    nz = np.where(np.abs(x) > 1e-5)[0]
    if len(nz) < sr // 100: return None
    return int(nz[0]), int(nz[-1]) + 1

# ---------------- select：匹配、解包、信号指标 ----------------
def load_rows():
    tf = tarfile.open(os.path.join(RAW, 'splits.tar.gz'))
    rows = []
    for m in tf.getmembers():
        if not m.name.endswith('.csv'): continue
        sp = os.path.basename(m.name)[:-4]
        for r in csv.DictReader(io.StringIO(tf.extractfile(m).read().decode('utf-8'))):
            if r['VALID'] == 'True':
                rows.append({'link': r['LINK'], 'word': r['WORD'], 'spk': r['SPEAKER'], 'split': sp, 'file': r['LINK'].replace('/', '_', 1), 'g': {'MALE': 'm', 'FEMALE': 'f'}.get(r['GENDER'], 'h')})
    return rows

def targets():
    items = json.load(open(os.path.join(HERE, 'texts.json')))
    hp = os.path.join(HERE, 'human.json')
    ll = json.load(open(hp)) if os.path.exists(hp) else {}
    out = {}
    for it in items:
        k = it['key'].strip().lower()
        if it.get('slow') and ' ' not in k and it['id'] not in ll: out.setdefault(k, []).append(it['id'])
    return out

def core(x, sr):
    """单词主体：帧能量高于最大值 -40 dB 的首尾帧之间（去掉解码器拖出的极弱尾巴）"""
    h, n = sr // 100, sr // 50
    if len(x) < n: return None
    fr = np.lib.stride_tricks.sliding_window_view(x, n)[::h]
    e = 10 * np.log10((fr ** 2).mean(1) + 1e-12)
    p95 = float(np.percentile(e[e > -100], 95)) if np.any(e > -100) else -120.0
    idx = np.where(e > p95 - 40)[0]
    if not len(idx): return None
    return int(idx[0] * h), int(idx[-1] * h + n), e[idx[0]:idx[-1] + 1], p95

def metrics(path):
    x = decode(path)
    if len(x) < SR_IN // 2: return None
    rg, cr = region(x, SR_IN), core(x, SR_IN)
    if not rg or not cr: return None
    a, b, e, p95 = cr; seg = x[a:b]
    floor = float(np.percentile(e, 5))
    # 频带宽度：长时功率谱高于峰值 -50 dB 的最高频率
    n = 2048
    if len(seg) >= n:
        w = np.hanning(n); frames = np.lib.stride_tricks.sliding_window_view(seg, n)[::n // 2] * w
        ps = (np.abs(np.fft.rfft(frames, axis=1)) ** 2).mean(0)
    else:
        ps = np.abs(np.fft.rfft(seg * np.hanning(len(seg)), n)) ** 2
    f = np.fft.rfftfreq(n, 1 / SR_IN)
    above = np.where(ps > ps.max() * 1e-5)[0]
    bw = float(f[above[-1]]) if len(above) else 0.0
    band = (f >= 300) & (f < 8000)
    hf = float(ps[(f >= 4000) & (f < 8000)].sum() / (ps[band].sum() + 1e-20))
    edge = SR_IN // 100
    return {'dur': round((b - a) / SR_IN, 3), 'touch': bool(rg[0] < edge or rg[1] > len(x) - edge or a < edge or b > len(x) - edge),
            'peak': round(float(np.abs(seg).max()), 3), 'clip': round(float(np.mean(np.abs(seg) > 0.98)), 4),
            'p95': round(p95, 1), 'range': round(p95 - floor, 1), 'rms': round(float(10 * np.log10((seg ** 2).mean() + 1e-12)), 1),
            'bw': round(bw), 'hf': round(hf, 4)}

def _m(args):
    name = args
    try: return name, metrics(os.path.join(CLIPS, name))
    except Exception as ex: return name, None

def select():
    os.makedirs(CLIPS, exist_ok=True); os.makedirs(WORK, exist_ok=True)
    rows, tg = load_rows(), targets()
    by = collections.defaultdict(list)
    for r in rows:
        if r['word'] in tg: by[r['word']].append(r)
    rnd = random.Random(7); pick = {}
    for wd, lst in by.items():
        spk = collections.defaultdict(list)
        for r in lst: spk[r['spk']].append(r)
        groups = list(spk.values()); rnd.shuffle(groups)
        for g in groups: rnd.shuffle(g)
        out = []
        while len(out) < PER_WORD and any(groups):
            for g in groups:
                if g and len(out) < PER_WORD: out.append(g.pop())
        pick[wd] = out
    need = {r['file']: r for lst in pick.values() for r in lst}
    print('words matched', len(pick), 'of', len(tg), '; clips to extract', len(need), flush=True)
    have = set(os.listdir(CLIPS))
    for sp in ('train', 'dev', 'test'):
        want = {f for f, r in need.items() if r['split'] == sp and f not in have}
        if not want: continue
        with tarfile.open(os.path.join(RAW, sp + '.tar.gz'), 'r:gz') as tf:
            for m in tf:
                base = os.path.basename(m.name)
                if m.isfile() and base in want and SAFE.match(base):
                    open(os.path.join(CLIPS, base), 'wb').write(tf.extractfile(m).read()); want.discard(base)
        print(sp, 'extracted; missing', len(want), flush=True)
    from multiprocessing import Pool
    names = [f for f in need if os.path.exists(os.path.join(CLIPS, f))]
    with Pool(4) as pool: res = dict(pool.map(_m, names, chunksize=32))
    spk_ids = {}
    clips = {}
    for f, r in need.items():
        m = res.get(f)
        if not m: continue
        sid = spk_ids.setdefault(r['spk'], len(spk_ids))   # 只存匿名序号，不存说话人哈希
        clips[f] = dict(m, word=r['word'], link=r['link'], spk=sid)
    jsave('clips.json', clips)
    jsave('targets.json', tg)
    print('metrics for', len(clips), 'clips;', len(spk_ids), 'speakers', flush=True)

# ---------------- 候选：过滤 + 说话人排序 ----------------
def plan_candidates(clips):
    by = collections.defaultdict(list)
    for f, c in clips.items(): by[c['word']].append((f, c))
    med = {w: float(np.median([c['dur'] for _, c in lst])) for w, lst in by.items()}
    for w, lst in by.items():   # 同一个词内比较“动态范围”（低能量帧离峰值多远），近似底噪高低
        m = float(np.median([c['range'] for _, c in lst]))
        for _, c in lst: c['rel'] = round(c['range'] - m, 1)
    why = collections.Counter(); ok = {}
    for f, c in clips.items():
        m = med[c['word']]
        r = ('clip' if c['clip'] > 0.002 else 'touch' if c['touch'] else 'short' if c['dur'] < 0.12
             else 'dur' if not (0.6 * m <= c['dur'] <= 1.6 * m) else 'quiet' if c['peak'] < 0.02
             else 'narrow' if c['bw'] < 3800 else 'noisy' if c['rel'] < -12 else None)
        why[r or 'ok'] += 1
        if not r: ok[f] = c
    def q(c):
        bwt = min(6.0, 2 * (c['bw'] - 5000) / 1000) if c['bw'] >= 5000 else 3 * (c['bw'] - 5000) / 1000
        return c['rel'] + bwt - (2 if c['p95'] < -25 else 0)
    per = collections.defaultdict(list)
    for c in ok.values(): per[c['spk']].append(q(c))
    sscore = {s: float(np.median(v)) + 2 * np.log10(len(v)) - (3 if len(v) < 5 else 0) for s, v in per.items()}   # 录得多的人略优先，声音更统一
    rank = {s: i for i, s in enumerate(sorted(sscore, key=lambda s: -sscore[s]))}
    order = {}
    for w, lst in by.items():
        good = [(f, c) for f, c in lst if f in ok]
        bonus = lambda c: 6 if rank[c['spk']] < 10 else 3 if rank[c['spk']] < 25 else 0
        good.sort(key=lambda fc: -(q(fc[1]) + bonus(fc[1])))
        out, n = [], collections.Counter()
        for f, c in good:
            if n[c['spk']] < 2: out.append(f); n[c['spk']] += 1
        order[w] = out
    return order, rank, why

# ---------------- Whisper ----------------
_model = None
def model():
    global _model
    if _model is None:
        os.environ.setdefault('HF_HUB_OFFLINE', '1')
        from faster_whisper import WhisperModel
        _model = WhisperModel('deepdml/faster-whisper-large-v3-turbo-ct2', device='cpu', compute_type='int8', cpu_threads=4)
    return _model

def say_int(n):
    import gen
    return gen.say_int(n)
LET = {'a': 'a', 'b': 'be', 'c': 'ce', 'd': 'de', 'e': 'e', 'f': 'ef', 'g': 'ge', 'h': 'ha', 'i': 'i', 'j': 'je', 'k': 'ka', 'l': 'el', 'm': 'em', 'n': 'en', 'o': 'o', 'p': 'pe', 'q': 'ki', 'r': 'er', 's': 'es', 't': 'te', 'u': 'u', 'v': 've', 'w': 'we', 'x': 'eks', 'y': 'ye', 'z': 'zet'}
def norm_hyp(t):
    t = re.sub(r'\d+', lambda m: ' ' + say_int(int(m.group(0))) + ' ', t)
    toks = re.sub(r'[^a-zA-Z ]', ' ', t.replace('-', ' ')).split()
    return [LET[x.lower()] if len(x) == 1 and x.isalpha() else x.lower() for x in toks]
norm_ref = lambda t: re.sub(r'[^a-z ]', '', t.lower().replace('-', ' ')).split()

def asr_batch(arrs, sr=16000, filler=()):
    """10 段拼成一条识别（单段识别容易“幻听”）；不足 10 段时用 filler 补齐，只返回前 len(arrs) 段的结果"""
    n = len(arrs); arrs = list(arrs) + list(filler)[:max(0, 10 - n)]
    parts = [np.zeros(int(0.3 * sr), np.float32)]; spans = []; t = 0.3; gap = int(0.9 * sr)
    for y in arrs:
        y = y / (np.max(np.abs(y)) or 1) * 0.9; spans.append((t, t + len(y) / sr)); parts += [y.astype(np.float32), np.zeros(gap, np.float32)]; t += (len(y) + gap) / sr
    segs, _ = model().transcribe(np.concatenate(parts), language='id', beam_size=1, temperature=0, vad_filter=False, condition_on_previous_text=False, word_timestamps=True)
    got = [[] for _ in arrs]; prob = [[] for _ in arrs]
    for s in segs:
        for w in (s.words or []):
            mid = (w.start + w.end) / 2
            for i, (a, b) in enumerate(spans):
                if a - 0.35 <= mid <= b + 0.35: got[i].append(w.word); prob[i].append(w.probability); break
    return [(' '.join(g).strip(), float(np.mean(p)) if p else 0.0) for g, p in zip(got, prob)][:n]

def word16(f):
    x = decode(os.path.join(CLIPS, f), 16000)
    cr = core(x, 16000)
    if cr: x = x[max(0, cr[0] - 800):cr[1] + 800]
    return x

def asr():
    clips = jload('clips.json'); order, rank, why = plan_candidates(clips)
    print('filter:', dict(why), flush=True)
    print('words with >=1 candidate', sum(1 for v in order.values() if v), 'of', len(order), flush=True)
    res = jload('asr.json', {})
    for rnd_i, k in enumerate(CANDS):
        lo = sum(CANDS[:rnd_i])
        todo = []
        for w, lst in order.items():
            if any(res.get(f, {}).get('ok') for f in lst): continue
            todo += [(w, f) for f in lst[lo:lo + k] if f not in res]
        print(f'round {rnd_i + 1}: {len(todo)} clips', flush=True)
        for b0 in range(0, len(todo), 10):
            batch = todo[b0:b0 + 10]
            fill = [word16(f) for _, f in todo[:10]] if len(batch) < 10 else ()
            outs = asr_batch([word16(f) for _, f in batch], filler=fill)
            for (w, f), (h, p) in zip(batch, outs):
                res[f] = {'hyp': h, 'prob': round(p, 3), 'ok': norm_hyp(h) == norm_ref(w)}
            if (b0 // 10) % 20 == 0:
                jsave('asr.json', res)
                print(f'  {b0 + len(batch)}/{len(todo)}  ok so far {sum(1 for r in res.values() if r["ok"])}', flush=True)
        jsave('asr.json', res)
    passed = {w for w, lst in order.items() if any(res.get(f, {}).get('ok') for f in lst)}
    print('words with an accepted clip:', len(passed), 'of', len(order), flush=True)

# ---------------- render：处理成 MP3 并再复核 ----------------
def process(f):
    """裁出单词主体 → 淡入淡出（对齐切口处不爆音）→ 高通 70 Hz → 响度统一 → 前 0.1 s / 后 0.15 s 静音 → MP3 24 kHz 48 kbps"""
    x = decode(os.path.join(CLIPS, f))
    a, b, _, _ = core(x, SR_IN)
    a = max(0, a - SR_IN // 100); b = min(len(x), b + SR_IN // 100)
    seg = x[a:b].astype(np.float32).copy()
    fi, fo = int(0.008 * SR_IN), int(0.025 * SR_IN)
    seg[:fi] *= np.linspace(0, 1, fi, dtype=np.float32); seg[-fo:] *= np.linspace(1, 0, fo, dtype=np.float32)
    pad = np.zeros(int(0.25 * SR_IN), np.float32)
    q = subprocess.run(['ffmpeg', '-v', 'error', '-f', 'f32le', '-ar', str(SR_IN), '-ac', '1', '-i', 'pipe:0', '-af', 'highpass=f=70',
                        '-ar', '24000', '-f', 'f32le', 'pipe:1'], input=np.concatenate([pad, seg, pad]).tobytes(), capture_output=True, check=True).stdout
    z = np.frombuffer(q, np.float32).copy()
    fr = np.lib.stride_tricks.sliding_window_view(z, 480)[::240]
    e = (fr ** 2).mean(1); act = e > e.max() * 1e-3
    rms = 10 * np.log10(e[act].mean() + 1e-12)
    g = min(10 ** ((TARGET_RMS_DB - rms) / 20), 0.95 / (np.abs(z).max() + 1e-9))
    z = (z[int(0.15 * 24000):len(z) - int(0.10 * 24000)] * g).astype(np.float32)
    return subprocess.run(['ffmpeg', '-v', 'error', '-f', 'f32le', '-ar', '24000', '-ac', '1', '-i', 'pipe:0', '-codec:a', 'libmp3lame', '-b:a', '48k', '-f', 'mp3', 'pipe:1'],
                          input=z.tobytes(), capture_output=True, check=True).stdout

def align(ref, hyp):
    """按词序做编辑距离对齐：返回每个参考词是否被原样识别出来（多出来的词让前后两个都不算通过）"""
    n, m = len(ref), len(hyp)
    D = np.zeros((n + 1, m + 1), int); D[:, 0] = range(n + 1); D[0, :] = range(m + 1)
    for i in range(1, n + 1):
        for j in range(1, m + 1):
            D[i, j] = min(D[i - 1, j - 1] + (ref[i - 1] != hyp[j - 1]), D[i - 1, j] + 1, D[i, j - 1] + 1)
    i, j, ops = n, m, []
    while i > 0 or j > 0:
        if i > 0 and j > 0 and D[i, j] == D[i - 1, j - 1] + (ref[i - 1] != hyp[j - 1]):
            ops.append(('M' if ref[i - 1] == hyp[j - 1] else 'S', i - 1, j - 1)); i, j = i - 1, j - 1
        elif i > 0 and D[i, j] == D[i - 1, j] + 1: ops.append(('D', i - 1, None)); i -= 1
        else: ops.append(('I', i, j - 1)); j -= 1
    ok = [False] * n
    for op, i, j in ops:
        if op == 'M': ok[i] = True
    for op, i, j in ops:
        if op == 'I':
            for k in (i - 1, i):
                if 0 <= k < n: ok[k] = False
    return ok

def seq_check(arrs, refs, sr=16000):
    """20 段左右连成一条（间隔 0.4 s）整体识别，按词序对齐判断每段对不对"""
    parts = [np.zeros(int(0.3 * sr), np.float32)]
    for y in arrs: parts += [(y / (np.max(np.abs(y)) or 1) * 0.9).astype(np.float32), np.zeros(int(0.4 * sr), np.float32)]
    segs, _ = model().transcribe(np.concatenate(parts), language='id', beam_size=5, temperature=0, vad_filter=False, condition_on_previous_text=False, without_timestamps=True)
    return align([norm_ref(r)[0] for r in refs], norm_hyp(' '.join(s.text for s in segs)))

def batches(items, seed, size=20):
    """打乱后分批，同一批里不出现同一个词"""
    items = list(items); random.Random(seed).shuffle(items); out = []
    for it in items:
        for bt in out:
            if len(bt) < size and all(x[0] != it[0] for x in bt): bt.append(it); break
        else: out.append([it])
    return out

def render():
    """最终复核：每个词最多 6 段候选（先用第一轮通过的），处理成 MP3 后在 3 次不同的随机分组里各识别一次，至少 2 次原样识别出来才算通过"""
    clips = jload('clips.json'); tg = jload('targets.json'); res = jload('asr.json', {})
    order, rank, _ = plan_candidates(clips)
    cands = {}
    for w, lst in order.items():
        good = [f for f in lst if res.get(f, {}).get('ok')]
        untested = [f for f in lst if f not in res]
        cands[w] = (good + untested)[:6]
    os.makedirs(os.path.join(WORK, 'mp3'), exist_ok=True)
    mp3 = lambda f: os.path.join(WORK, 'mp3', f[:-5] + '.mp3')
    todo = [f for v in cands.values() for f in v if not os.path.exists(mp3(f))]
    from multiprocessing import Pool
    with Pool(4) as pool:
        for f, data in zip(todo, pool.map(process, todo, chunksize=16)): open(mp3(f), 'wb').write(data)
    items = [(w, f) for w, v in cands.items() for f in v]
    print('final check:', len(items), 'clips for', sum(1 for v in cands.values() if v), 'words', flush=True)
    audio = {f: decode(mp3(f), 16000) for _, f in items}
    vr = jload('verify.json', {})
    for ps in range(3):
        bts = batches(items, 100 + ps)
        for bi, bt in enumerate(bts):
            key = f'{ps}:{bi}'
            if key in vr: continue
            ok = seq_check([audio[f] for _, f in bt], [w for w, _ in bt])
            vr[key] = [[f, o] for (_, f), o in zip(bt, ok)]
            if bi % 25 == 0:
                jsave('verify.json', vr); print(f'  pass {ps + 1}/3 batch {bi + 1}/{len(bts)}', flush=True)
        jsave('verify.json', vr)
    score = collections.Counter()
    for v in vr.values():
        for f, o in v: score[f] += o
    chosen = {}
    for w, v in cands.items():
        ranked = sorted([f for f in v if score[f] >= 2], key=lambda f: (-score[f], v.index(f)))
        if ranked:
            f = ranked[0]; c = clips[f]
            chosen[w] = {'clip': c['link'], 'file': f, 'mp3': mp3(f), 'votes': score[f], 'rel': c['rel'], 'bw': c['bw'], 'spk': rank[c['spk']]}
    print(f'final: {len(chosen)} words passed (3/3: {sum(1 for c in chosen.values() if c["votes"] == 3)}, 2/3: {sum(1 for c in chosen.values() if c["votes"] == 2)}) of {len(cands)} matched', flush=True)
    old = json.load(open(os.path.join(HERE, 'human_mswc.json'))) if os.path.exists(os.path.join(HERE, 'human_mswc.json')) else {}
    out = {}
    for w, c in chosen.items():
        for iid in tg[w]:
            open(os.path.join(OUTH, iid + '.mp3'), 'wb').write(open(c['mp3'], 'rb').read())
            out[iid] = {'word': w, 'clip': c['clip'], 'spk': c['spk'], 'votes': c['votes'], 'rel': c['rel'], 'bw': c['bw']}
    for iid in old:
        if iid not in out and os.path.exists(os.path.join(OUTH, iid + '.mp3')): os.remove(os.path.join(OUTH, iid + '.mp3'))
    json.dump(out, open(os.path.join(HERE, 'human_mswc.json'), 'w'), ensure_ascii=False, indent=0)
    items_all = json.load(open(os.path.join(HERE, 'texts.json')))
    per = collections.defaultdict(lambda: [0, 0])
    for it in items_all:
        k = it['key'].strip().lower()
        if it.get('slow') and ' ' not in k:
            per[it['packs'][0]][1] += 1; per[it['packs'][0]][0] += it['id'] in out
    print('per pack (human/single words):', ' '.join(f'{p}:{a}/{b}' for p, (a, b) in sorted(per.items())), flush=True)
    print('speakers used:', len({c['spk'] for c in out.values()}), '; from top-10 speakers', sum(1 for c in out.values() if c['spk'] < 10), '/', len(out), flush=True)
    rnd = random.Random(5)
    for w in rnd.sample(sorted(chosen), min(20, len(chosen))):
        c = chosen[w]; print(f'   {w:16s} {c["file"]:50s} votes={c["votes"]} rel={c["rel"]:+.0f}dB bw={c["bw"]}Hz spk#{c["spk"]}', flush=True)
    print('matched but no clip passed:', sorted(set(cands) - set(chosen)), flush=True)

def alts():
    """给已有真人录音的词再挑最多 2 段别的说话人的录音，方便对比着听。
    只用最终复核里 3 次至少通过 2 次的段；优先 3/3、优先和主录音不同性别的说话人。结果写回 human_mswc.json（g = 性别，alts = 备选）"""
    clips = jload('clips.json'); tg = jload('targets.json'); vr = jload('verify.json', {})
    order, rank, _ = plan_candidates(clips)
    score = collections.Counter()
    for v in vr.values():
        for f, o in v: score[f] += o
    gender = {r['file']: r['g'] for r in load_rows()}
    hp = os.path.join(HERE, 'human_mswc.json'); hm = json.load(open(hp))
    mp3 = lambda f: os.path.join(WORK, 'mp3', f[:-5] + '.mp3')
    for f in os.listdir(OUTH):
        if '~h' in f: os.remove(os.path.join(OUTH, f))
    n_alt = collections.Counter(); done = {}
    for iid, h in hm.items():
        w = h['word']
        if w not in done:
            prim = h['clip'].replace('/', '_', 1)
            pool = [f for f in order[w] if f != prim and score[f] >= 2 and os.path.exists(mp3(f))]
            pool.sort(key=lambda f: (-score[f], gender.get(f, 'h') == gender.get(prim, 'h'), order[w].index(f)))
            used = {clips[prim]['spk']}; pick = []
            for f in pool:
                if clips[f]['spk'] in used: continue
                used.add(clips[f]['spk']); pick.append(f)
                if len(pick) == 2: break
            done[w] = (prim, pick)
        prim, pick = done[w]
        h['g'] = gender.get(prim, 'h')
        h['alts'] = [{'clip': clips[f]['link'], 'spk': rank[clips[f]['spk']], 'votes': score[f], 'g': gender.get(f, 'h')} for f in pick]
        for k, f in enumerate(pick, 1):
            open(os.path.join(OUTH, f'{iid}~h{k}.mp3'), 'wb').write(open(mp3(f), 'rb').read())
        n_alt[len(pick)] += 1
    json.dump(hm, open(hp, 'w'), ensure_ascii=False, indent=0)
    g = collections.Counter(h['g'] for h in hm.values()); ga = collections.Counter(a['g'] for h in hm.values() for a in h['alts'])
    print('entries', len(hm), '; extra human takes per entry:', dict(sorted(n_alt.items())), flush=True)
    print('gender of main take:', dict(g), '; of extra takes:', dict(ga), '; extra takes with 3/3 votes:', sum(1 for h in hm.values() for a in h['alts'] if a['votes'] == 3), 'of', sum(len(h['alts']) for h in hm.values()), flush=True)

if __name__ == '__main__':
    {'select': select, 'asr': asr, 'render': render, 'alts': alts}[sys.argv[1]]()
