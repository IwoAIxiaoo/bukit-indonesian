// “换个读法对比”测试：在线版（http）和离线版（file://，断网）都能用
// 用法：node test-variants.js <url> [offline]
const { chromium } = require('playwright');
const URL0 = process.argv[2] || 'file://' + require('path').join(__dirname, '..', 'bukit-offline.html');
const OFF = process.argv[3] === 'offline' || URL0.startsWith('file:');
const OUT = require('path').join(__dirname, 'shots') + '/'; require('fs').mkdirSync(OUT, { recursive: true });
const fail = [];
const check = (name, ok, extra) => { console.log((ok ? 'ok   ' : 'FAIL ') + name + (extra !== undefined ? '  ' + extra : '')); if (!ok) fail.push(name); };
const uriLen = n => 'data:audio/mpeg;base64,'.length + 4 * Math.ceil(n / 3);

(async () => {
  const b = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required'] });
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 } });
  if (OFF) await ctx.setOffline(true);
  await ctx.addInitScript(() => {
    window.__tts = 0; window.__plays = [];
    try { const orig = speechSynthesis.speak.bind(speechSynthesis); speechSynthesis.speak = u => { window.__tts++; return orig(u); }; } catch (e) {}
    const op = HTMLMediaElement.prototype.play;
    HTMLMediaElement.prototype.play = function () { window.__last = this; window.__plays.push({ len: (this.src || '').length, rate: this.playbackRate }); return op.call(this); };
  });
  const p = await ctx.newPage(); const errs = [], net = [];
  p.on('pageerror', e => errs.push(e.message));
  p.on('request', r => { const u = r.url(); if (OFF && !/^(file|data|blob):/.test(u)) net.push(u); });
  await p.route(/fonts\./, r => r.abort());
  await p.goto(URL0 + '#t-greet'); await p.waitForSelector('.wrow'); await p.waitForTimeout(800);
  if (await p.$('[data-act="onbDone"]')) await p.click('[data-act="onbDone"]');

  // 找一个有 4 种读法的词，读出它各读法在包里的长度
  // 逐个打开有“真人”标记的词，找一个 4 种读法长度各不相同的（这样能靠长度认出播的是哪一个）
  const nRows = await p.locator('.wrow').count();
  let opened = false, info = null;
  for (let i = 0; i < nRows && !opened; i++) {
    const r = p.locator('.wrow').nth(i);
    if (!(await r.locator('.hum').count())) continue;
    await r.locator('.wrow-main').click(); await p.waitForTimeout(350);
    info = await p.evaluate(async off => {
      const chip = document.querySelector('.sheet-panel .vchip');
      if (!chip) return null;
      const id = chip.dataset.key.split(':')[1], v = AUDIO_VAR[id];
      const packOff = off ? AUDIO_OFF.greet : await (await fetch('audio/greet.json')).json();
      const kinds = {}; Object.values(AUDIO_VAR).forEach(x => { kinds[x.length] = (kinds[x.length] || 0) + 1; });
      if (!v || v.length !== 4 || !packOff[id + '~3'] || packOff[id + '~3'].length < 4) return null;
      const ents = [packOff[id], packOff[id + '~1'], packOff[id + '~2'], packOff[id + '~3']];
      if (new Set(ents.map(e => e[1]).concat([ents[3][3]])).size !== 5) return null;
      return { kinds, pick: id, v, ents, total: Object.keys(AUDIO_VAR).length };
    }, OFF);
    if (info) { opened = true; break; }
    await p.click('.sheet-bar [data-act="closeSheet"]'); await p.waitForTimeout(150);
  }
  check('word card with a compare row opened', opened);
  console.log('words with several takes:', info.total, JSON.stringify(info.kinds), '| test id', info.pick, info.v, JSON.stringify(info.ents));
  const row = await p.evaluate(() => ({ labels: [...document.querySelectorAll('.sheet-panel .vchip')].map(x => x.textContent.trim()), pressed: [...document.querySelectorAll('.sheet-panel .vchip')].map(x => x.getAttribute('aria-pressed')), src: document.querySelector('.sheet-panel .w-src').textContent, word: document.querySelector('.sheet-panel .w-word').textContent }));
  console.log('word', row.word, '| chips', JSON.stringify(row.labels), '| source line:', row.src);
  check('compare row lists every take, first one selected', row.labels.length === info.v.length && row.pressed[0] === 'true' && row.pressed.slice(1).every(x => x === 'false') && /合成语音/.test(row.labels[row.labels.length - 1]) && /真人 1/.test(row.labels[0]));
  await p.screenshot({ path: OUT + (OFF ? 'off' : 'on') + '-variants.png' });

  const tap = async sel => {
    const n = await p.evaluate(() => window.__plays.length);
    await p.click(sel); await p.waitForTimeout(500);
    const mid = await p.evaluate(() => ({ t: window.__last ? window.__last.currentTime : -1, playingChip: (document.querySelector('.vchip.is-playing') || {}).textContent || '' }));
    await p.waitForFunction(() => !document.querySelector('.is-playing'), null, { timeout: 15000 }).catch(() => {});
    const plays = await p.evaluate(k => window.__plays.slice(k).filter(x => x.len > 2000), n);
    return { play: plays[plays.length - 1] || {}, t: mid.t, chip: mid.playingChip.trim() };
  };
  // 依次点 4 个读法
  const got = [];
  for (let k = 0; k < 4; k++) got.push(await tap('.sheet-panel .vchip >> nth=' + k));
  const okEach = got.map((g, k) => g.play.len === uriLen(info.ents[k][1]) && g.play.rate === 1 && g.t > 0);
  check('each take plays its own recording', okEach.every(Boolean), JSON.stringify(got.map(g => g.play.len)) + ' expected ' + JSON.stringify(info.ents.map(e => uriLen(e[1]))));
  const st = await p.evaluate(() => ({ pressed: [...document.querySelectorAll('.sheet-panel .vchip')].map(x => x.getAttribute('aria-pressed')), src: document.querySelector('.sheet-panel .w-src').textContent, v: JSON.parse(localStorage.getItem('bukit.v1')).prefs.var }));
  check('last tapped take (synthetic) is selected and saved', st.pressed[3] === 'true' && st.pressed.filter(x => x === 'true').length === 1 && /合成语音/.test(st.src) && st.v[info.pick] === 3, JSON.stringify(st.v));
  // 选中合成语音后：“播放”用合成语音，“慢速”用专门的慢读音频（原速播放）
  const a1 = await tap('.sheet-panel .w-audio .say >> nth=0');
  const a2 = await tap('.sheet-panel .w-audio .say >> nth=1');
  check('Play and Slow follow the selected take (synthetic: native slow clip)', a1.play.len === uriLen(info.ents[3][1]) && a2.play.len === uriLen(info.ents[3][3]) && a2.play.rate === 1, JSON.stringify([a1.play, a2.play]));
  // 重新打开页面后选择还在；词表里的播放按钮也用选中的读法
  await p.reload(); await p.waitForSelector('.wrow'); await p.waitForTimeout(800);
  let listPlay = null;
  for (let i = 0; i < nRows; i++) {
    const r = p.locator('.wrow').nth(i);
    if ((await r.locator('.w').textContent()).trim() !== row.word) continue;
    const n = await p.evaluate(() => window.__plays.length);
    await r.locator('.say').click(); await p.waitForTimeout(600);
    await p.waitForFunction(() => !document.querySelector('.is-playing'), null, { timeout: 15000 }).catch(() => {});
    listPlay = (await p.evaluate(k => window.__plays.slice(k).filter(x => x.len > 2000), n)).pop();
    await p.locator('.wrow').nth(i).locator('.wrow-main').click(); await p.waitForTimeout(400);
    break;
  }
  const st2 = await p.evaluate(() => ({ pressed: [...document.querySelectorAll('.sheet-panel .vchip')].map(x => x.getAttribute('aria-pressed')), src: document.querySelector('.sheet-panel .w-src').textContent }));
  check('choice survives reload and is used in the word list', st2.pressed[3] === 'true' && /合成语音/.test(st2.src) && listPlay && listPlay.len === uriLen(info.ents[3][1]), JSON.stringify(listPlay));
  // 换回第 2 个真人读法：慢速按 0.65 倍变速
  const h2 = await tap('.sheet-panel .vchip >> nth=1');
  const s2 = await tap('.sheet-panel .w-audio .say >> nth=1');
  const st3 = await p.evaluate(() => document.querySelector('.sheet-panel .w-src').textContent);
  check('second human take: source line and 0.65x slow', h2.play.len === uriLen(info.ents[1][1]) && s2.play.len === uriLen(info.ents[1][1]) && Math.abs(s2.play.rate - 0.65) < 0.01 && /真人录音/.test(st3), JSON.stringify(s2.play));
  // 选回默认读法后不再保存这个词的选择
  await tap('.sheet-panel .vchip >> nth=0');
  const v0 = await p.evaluate(() => JSON.parse(localStorage.getItem('bukit.v1')).prefs.var);
  check('back to the default take clears the saved choice', v0 && v0[info.pick] === undefined, JSON.stringify(v0));
  // 没有多种读法的词不显示对比行
  await p.click('.sheet-bar [data-act="closeSheet"]'); await p.waitForTimeout(150);
  for (let i = 0; i < nRows; i++) { const r = p.locator('.wrow').nth(i); if (await r.locator('.hum').count()) continue; await r.locator('.wrow-main').click(); await p.waitForTimeout(350); break; }
  check('words with a single voice show no compare row', !(await p.$('.sheet-panel .w-vars')) && !!(await p.$('.sheet-panel .w-word')));
  const ov = await p.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  check('no horizontal overflow', ov <= 0, String(ov));
  check('device speech never used', (await p.evaluate(() => window.__tts)) === 0);
  if (OFF) check('no network requests', net.length === 0, net.slice(0, 3).join(' '));
  check('no page errors', errs.length === 0, errs.slice(0, 3).join(' | '));
  await b.close();
  console.log(fail.length ? 'FAILED: ' + fail.join('; ') : 'ALL VARIANT CHECKS PASSED (' + (OFF ? 'offline' : 'online') + ')');
  process.exit(fail.length ? 1 : 0);
})().catch(e => { console.error('TEST CRASHED', e); process.exit(2); });
