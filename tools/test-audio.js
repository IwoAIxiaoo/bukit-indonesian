// 音频播放测试（需要先在项目根目录运行 python3 tools/serve.py）
const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required'] });
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 } });
  await ctx.addInitScript(() => {
    window.__tts = 0; window.__plays = [];
    try { const orig = speechSynthesis.speak.bind(speechSynthesis); speechSynthesis.speak = u => { window.__tts++; return orig(u); }; } catch (e) {}
    const op = HTMLMediaElement.prototype.play;
    HTMLMediaElement.prototype.play = function () { window.__plays.push({ len: (this.src || '').length, rate: this.playbackRate }); return op.call(this); };
  });
  const p = await ctx.newPage(); const errs = [];
  p.on('pageerror', e => errs.push(e.message));
  await p.route(/fonts\./, r => r.abort());
  await p.goto('http://127.0.0.1:8765/bukit.html#t-greet'); await p.waitForTimeout(1500);
  const r1 = await p.evaluate(() => ({ packs: AUDIO_PACKS.length, idx: Object.keys(AUDIO_IDX).length }));
  console.log('index', JSON.stringify(r1));
  // 单词（正常、慢速）、例句
  await p.click('.wrow-main >> nth=0'); await p.waitForTimeout(800);
  await p.click('.sheet-panel .w-audio .say >> nth=0'); await p.waitForTimeout(300);
  const playing = await p.evaluate(() => !!document.querySelector('.is-playing'));
  await p.waitForTimeout(2500);
  const stopped = await p.evaluate(() => !document.querySelector('.is-playing'));
  await p.click('.sheet-panel .w-audio .say >> nth=1'); await p.waitForTimeout(2600);
  await p.click('.sheet-panel .exs .ex .say >> nth=0'); await p.waitForTimeout(3500);
  const st = await p.evaluate(() => ({ tts: window.__tts, plays: window.__plays.filter(x => x.len > 2000) }));
  console.log('word playing->stopped', playing, stopped, 'tts calls', st.tts, 'clip plays', JSON.stringify(st.plays));
  // 发音页字母
  await p.goto('http://127.0.0.1:8765/bukit.html#pron'); await p.reload(); await p.waitForTimeout(1500);
  await p.click('.ltile >> nth=2'); await p.waitForTimeout(1500);
  await p.click('.rule .wchip .say >> nth=0'); await p.waitForTimeout(1500);
  console.log('pron', JSON.stringify(await p.evaluate(() => ({ tts: window.__tts, plays: window.__plays.length }))));
  // 每个包都能下载并且偏移表对得上
  const chk = await p.evaluate(async () => {
    const out = [];
    for (const n of AUDIO_PACKS) {
      const off = await (await fetch('audio/' + n + '.json')).json();
      const buf = await (await fetch('audio/' + n + '.mp3')).arrayBuffer();
      let bad = 0; for (const k in off) { const e = off[k]; const u = new Uint8Array(buf, e[0], 3); if (!(u[0] === 0x49 && u[1] === 0x44) && u[0] !== 0xff) bad++; if (e[0] + e[1] > buf.byteLength) bad++; }
      out.push(n + ':' + Object.keys(off).length + (bad ? ' BAD ' + bad : ''));
    }
    return out.join(' ');
  });
  console.log(chk);
  console.log('errors', errs.length ? errs : 'none');
  await b.close();
})().catch(e => { console.error('FAILED', e); process.exit(1); });
