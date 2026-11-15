"""短文阅读的句子和标题：每句先合成一个候选，用 Whisper 识别核对；字符错误率高于阈值的重新合成，最多 4 轮，留识别最准的。
为了快，把几句连成一条（不超过 26 秒，正好一个识别窗口）一起识别，再按词序对齐分回各句（gen_fix.align_spans）。
只处理 texts.json 里属于 read-* 包、还没有音频的整句（slow 为假）。生词仍由 gen_new.py 按单词的做法处理。输出到 out3/，分数写进 read_scores.json。"""
import json, os, sys, time, random, numpy as np
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, HERE)
import gen
from gen_new import norm_hyp, norm_ref, cer
from gen_fix import align_spans
gen.NOISE[:] = [0.3, 0.4]
SR = gen.SR
OUT = os.path.join(HERE, 'out3')
ROUNDS, GOOD, MAXLEN, GAP = 4, 0.08, 26.0, 0.7

if __name__ == '__main__':
    t0 = time.time()
    items = [x for x in json.load(open(os.path.join(HERE, 'texts.json')))
             if not x.get('slow') and any(p.startswith('read-') for p in x['packs']) and not os.path.exists(os.path.join(OUT, x['id'] + '.mp3'))]
    print('sentences to make', len(items), flush=True)
    os.environ.setdefault('HF_HUB_OFFLINE', '1')
    from faster_whisper import WhisperModel
    model = WhisperModel('deepdml/faster-whisper-large-v3-turbo-ct2', device='cpu', compute_type='int8', cpu_threads=4)
    sp = os.path.join(HERE, 'read_scores.json')
    scores = json.load(open(sp)) if os.path.exists(sp) else {}
    refs = {it['id']: norm_ref(' '.join(c for c, _ in gen.normalize(it['text']))) for it in items}
    best = {}                      # id → (cer, audio, round)
    todo = [it for it in items if refs[it['id']]]
    for rnd in range(ROUNDS):
        if not todo: break
        cand = {}
        for it in todo:
            y = gen.synth(it['text'], 1.0)
            if y is not None: cand[it['id']] = y
        order = [it['id'] for it in todo if it['id'] in cand]; random.Random(7 + rnd).shuffle(order)
        batches, cur, dur = [], [], 0.3
        for iid in order:
            d = len(cand[iid]) / SR + GAP
            if cur and dur + d > MAXLEN: batches.append(cur); cur, dur = [], 0.3
            cur.append(iid); dur += d
        if cur: batches.append(cur)
        for bn, bt in enumerate(batches):
            parts = [np.zeros(int(0.3 * SR), np.float32)]
            for iid in bt: parts += [cand[iid], np.zeros(int(GAP * SR), np.float32)]
            segs, _ = model.transcribe(np.concatenate(parts), language='id', beam_size=5, temperature=0, vad_filter=False, condition_on_previous_text=False, without_timestamps=True)
            errs = align_spans([refs[iid] for iid in bt], norm_hyp(' '.join(s.text for s in segs)))
            for iid, e in zip(bt, errs):
                if iid not in best or e < best[iid][0]: best[iid] = (float(e), cand[iid], rnd + 1)
            if bn % 10 == 0: print('round', rnd + 1, 'batch', bn, '/', len(batches), f'{time.time() - t0:.0f}s', flush=True)
        todo = [it for it in todo if it['id'] in best and best[it['id']][0] > GOOD]
        print('round', rnd + 1, 'done; still above', GOOD, ':', len(todo), f'{time.time() - t0:.0f}s', flush=True)
    for it in items:
        b = best.get(it['id'])
        if not b: print('nothing to say for', repr(it['text']), flush=True); continue
        open(os.path.join(OUT, it['id'] + '.mp3'), 'wb').write(gen.mp3(b[1]))
        scores[it['id']] = {'text': it['text'], 'cer': round(b[0], 3), 'round': b[2]}
    json.dump(scores, open(sp, 'w'), ensure_ascii=False, indent=0)
    cs = [v['cer'] for v in scores.values()]
    print(f'done {time.time() - t0:.0f}s; sentences {len(cs)}; mean CER {np.mean(cs):.3f}; exact {sum(1 for c in cs if c == 0)}; CER>0.08: {sum(1 for c in cs if c > 0.08)}; CER>0.2: {sum(1 for c in cs if c > 0.2)}', flush=True)
    for v in sorted(scores.values(), key=lambda v: -v['cer'])[:30]:
        if v['cer'] > 0.08: print(f"  {v['cer']:.2f}  {v['text']}", flush=True)
