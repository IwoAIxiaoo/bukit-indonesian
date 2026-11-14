// 检查 MSWC 真人录音：单词卡播放的是真人条目（没有慢速条目），慢速按钮按 0.65 倍变速；来源链接正确；不调用设备语音
const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required'] });
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 } });
  await ctx.addInitScript(() => {
    window.__tts = 0; window.__plays = [];
    try { const orig = speechSynthesis.speak.bind(speechSynthesis); speechSynthesis.speak = u => { window.__tts++; return orig(u); }; } catch (e) {}
    const op = HTMLMediaElement.prototype.play;
    HTMLMediaElement.prototype.play = function () { window.__plays.push({ len: (this.src || '').length, rate: this.playbackRate, pitch: this.preservesPitch }); return op.call(this); };
  });
  const p = await ctx.newPage(); const errs = [];
  p.on('pageerror', e => errs.push(e.message));
  await p.route(/fonts\./, r => r.abort());
  await p.goto('http://127.0.0.1:8765/bukit.html#t-greet'); await p.waitForTimeout(1200);
  const info = await p.evaluate(async () => {
    const src = { ll: 0, mswc: 0 }; Object.keys(AUDIO_HUMAN).forEach(id => { src[AUDIO_HUMAN[id][3] === 1 ? 'mswc' : 'll']++; });
    // 所有包里 MSWC 条目的长度（页面把条目转成 data URI，长度可由字节数算出）
    const expect = {}; let slowEntries = 0;
    for (const n of AUDIO_PACKS) {
      const off = await (await fetch('audio/' + n + '.json')).json();
      for (const id in off) if (AUDIO_HUMAN[id] && AUDIO_HUMAN[id][3] === 1) { expect['data:audio/mpeg;base64,'.length + 4 * Math.ceil(off[id][1] / 3)] = id; if (off[id].length > 2) slowEntries++; }
    }
    const rows = [...document.querySelectorAll('.wrow')].filter(r => r.querySelector('.hum') && r.querySelector('.w').textContent.trim().toLowerCase() !== 'selamat pagi');
    const r = rows[0];
    return { src, rows: rows.length, word: r.querySelector('.w').textContent.trim(), wid: r.querySelector('.wrow-main').dataset.id, expect, slowEntries };
  });
  console.log('human sources', JSON.stringify(info.src), '| greet rows with 真人 badge', info.rows, '| test word', info.word, '| MSWC entries with a slow part:', info.slowEntries);
  await p.click('.wrow-main[data-id="' + info.wid + '"]'); await p.waitForTimeout(900);
  const tag = await p.evaluate(() => { const s = document.querySelector('.sheet-panel .w-src'); return s ? s.textContent.trim() + ' | ' + [...s.querySelectorAll('a')].map(a => a.href).join(' ') : 'NO SRC LINE'; });
  console.log('source line:', tag);
  await p.click('.sheet-panel .w-audio .say >> nth=0'); await p.waitForTimeout(1600);
  await p.click('.sheet-panel .w-audio .say >> nth=1'); await p.waitForTimeout(2200);
  const st = await p.evaluate(() => ({ tts: window.__tts, plays: window.__plays.filter(x => x.len > 2000) }));
  console.log('plays', JSON.stringify(st.plays), 'tts calls', st.tts);
  const okNormal = st.plays.length >= 1 && !!info.expect[st.plays[0].len] && st.plays[0].rate === 1;
  const okSlow = st.plays.length >= 2 && st.plays[1].len === st.plays[0].len && Math.abs(st.plays[1].rate - 0.65) < 0.01;
  console.log('normal plays an MSWC entry at 1x:', okNormal, '| slow plays the same entry at 0.65x:', okSlow);
  await p.goto('http://127.0.0.1:8765/bukit.html#me'); await p.waitForTimeout(1200);
  const cred = await p.evaluate(() => { const h = [...document.querySelectorAll('h2.h-sec')].find(x => x.textContent.includes('真人录音来源')); if (!h) return 'NO CREDITS'; const sec = h.closest('section'); return h.textContent + ' || ' + [...sec.querySelectorAll('.credits:not(.small) li')].map(li => li.textContent).join(' ; ') + ' || links: ' + [...new Set([...sec.querySelectorAll('a')].map(a => a.hostname))].join(', '); });
  console.log('credits:', cred);
  console.log('errors', errs.length ? errs : 'none');
  await b.close();
})().catch(e => { console.error('FAILED', e); process.exit(1); });
