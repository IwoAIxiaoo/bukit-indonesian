"""把生成的 MP3 按课打包：audio/<pack>.mp3（各条首尾相接）+ audio/<pack>.json（偏移表）+ audio/index.json"""
import json, os, sys
HERE = os.path.dirname(os.path.abspath(__file__))
OUTDIR = os.path.join(os.environ.get('BUKIT_ROOT') or os.path.dirname(HERE), 'audio')   # 默认：tools/ 的上一级；脚本放在别处时用 BUKIT_ROOT 指定
SYN = os.environ.get('MMS_OUT', 'out')
items = json.load(open(os.path.join(HERE, 'texts.json')))
hp = os.path.join(HERE, 'human.json')
human = {k: v for k, v in (json.load(open(hp)) if os.path.exists(hp) else {}).items() if os.path.exists(os.path.join(HERE, 'out_human', k + '.mp3'))}
lp = os.path.join(HERE, 'human_lic.json')
lic = json.load(open(lp)) if os.path.exists(lp) else {}
# MSWC（MLCommons 多语种口语词语料库，从 Common Voice 句子里切出的单词）；同一个词两边都有时用 Lingua Libre
mp = os.path.join(HERE, 'human_mswc.json')
mswc = {k: v for k, v in (json.load(open(mp)) if os.path.exists(mp) else {}).items() if k not in human and os.path.exists(os.path.join(HERE, 'out_human', k + '.mp3'))}
speakers, licenses, hidx = [], [], {}
for iid, h in human.items():
    if h['speaker'] not in speakers: speakers.append(h['speaker'])
    L = lic.get(h['title']) or ['许可见文件页', '']
    if L not in licenses: licenses.append(L)
    rest = h['title'][len('LL-Q9240 (ind)-' + h['speaker'] + '-'):]
    hidx[iid] = [speakers.index(h['speaker']), licenses.index(L), rest]          # 来源 0：Lingua Libre
if mswc:
    SP, L = 'Common Voice 志愿者', ['CC BY 4.0', 'https://creativecommons.org/licenses/by/4.0/']
    if SP not in speakers: speakers.append(SP)
    if L not in licenses: licenses.append(L)
    for iid in mswc: hidx[iid] = [speakers.index(SP), licenses.index(L), '', 1]   # 来源 1：MSWC
# 可对比的读法：主读法之外的真人录音（别的说话人）和合成语音。条目放在同一个包里，键是 "<id>~<序号>"
# index.json 的 var 记录每个词各读法的类型，按顺序：m 男声 / f 女声 / h 真人（性别未标注）/ s 合成；第一个是主读法
variants, var = {}, {}
for iid in hidx:
    v = []
    for k, a in enumerate((mswc.get(iid) or {}).get('alts', []), 1):
        f = os.path.join(HERE, 'out_human', f'{iid}~h{k}.mp3')
        if os.path.exists(f): v.append((a.get('g', 'h'), f, None))
    syn, syn_s = os.path.join(HERE, SYN, iid + '.mp3'), os.path.join(HERE, SYN, iid + '~s.mp3')
    if os.path.exists(syn): v.append(('s', syn, syn_s if os.path.exists(syn_s) else None))
    if v:
        variants[iid] = v
        var[iid] = (mswc.get(iid) or {}).get('g', 'h') + ''.join(x[0] for x in v)
names = []
for it in items:
    for p in it['packs']:
        if p not in names: names.append(p)
names.sort(key=lambda n: (n != 'core', n))
os.makedirs(OUTDIR, exist_ok=True)
idx, missing, total = {}, [], 0
for pi, name in enumerate(names):
    buf, off = bytearray(), {}
    for it in items:
        if name not in it['packs']: continue
        f = os.path.join(HERE, SYN, it['id'] + '.mp3')
        hf = os.path.join(HERE, 'out_human', it['id'] + '.mp3')
        is_h = it['id'] in hidx
        if is_h: f = hf
        if not os.path.exists(f): missing.append(it['text']); continue
        b = open(f, 'rb').read(); entry = [len(buf), len(b)]; buf += b
        fs = os.path.join(HERE, SYN, it['id'] + '~s.mp3')
        if it.get('slow') and not is_h and os.path.exists(fs) and name != 'ref' and not name.startswith('read-'):   # 速查表的包不带慢读版，慢速时由页面放慢
            bs = open(fs, 'rb').read(); entry += [len(buf), len(bs)]; buf += bs
        off[it['id']] = entry
        if is_h:
            for k, (kind, vf, vs) in enumerate(variants.get(it['id'], []), 1):
                vb = open(vf, 'rb').read(); ve = [len(buf), len(vb)]; buf += vb
                if vs: sb = open(vs, 'rb').read(); ve += [len(buf), len(sb)]; buf += sb
                off[it['id'] + '~' + str(k)] = ve
    open(os.path.join(OUTDIR, name + '.mp3'), 'wb').write(buf)
    json.dump(off, open(os.path.join(OUTDIR, name + '.json'), 'w'), separators=(',', ':'))
    total += len(buf)
    print(f'{name:10s} {len(off):4d} clips {len(buf)/1024:7.0f} KB')
for it in items:
    f = os.path.join(HERE, SYN, it['id'] + '.mp3')
    if os.path.exists(f): idx[it['id']] = names.index(it['packs'][0])
json.dump({'packs': names, 'idx': idx, 'human': hidx, 'var': var, 'credit': {'speakers': speakers, 'licenses': licenses}}, open(os.path.join(OUTDIR, 'index.json'), 'w'), separators=(',', ':'), ensure_ascii=False)
print('human clips', len(hidx), '(Lingua Libre', len(human), '+ MSWC', len(mswc), ') speakers', len(speakers), 'licenses', licenses)
import collections
print('words with several takes', len(var), dict(collections.Counter(len(v) for v in var.values())))
print('packs', len(names), 'indexed', len(idx), 'missing', len(missing), 'total MB', round(total / 1048576, 1))
if missing: print('missing sample:', missing[:10])
