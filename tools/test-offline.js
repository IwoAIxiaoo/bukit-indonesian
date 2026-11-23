// 离线版测试：断网 + file:// 打开 bukit-offline.html，走一遍主要流程
const { chromium } = require('playwright');
const fs = require('fs');
const ROOT = require('path').join(__dirname, '..');
const FILE = process.argv[2] || ROOT + '/bukit-offline.html';
const URL0 = 'file://' + FILE;
const OUT = require('path').join(__dirname, 'shots') + '/'; require('fs').mkdirSync(OUT, { recursive: true });
const fail = [];
const check = (name, ok, extra) => { console.log((ok ? 'ok   ' : 'FAIL ') + name + (extra !== undefined ? '  ' + extra : '')); if (!ok) fail.push(name); };

(async () => {
  // 1) 文件完整性：每个音频包与 audio/ 里的原文件逐字节相同，偏移表一致
  const html = fs.readFileSync(FILE, 'utf8');
  const idx = JSON.parse(fs.readFileSync(ROOT + '/audio/index.json', 'utf8'));
  const offM = html.match(/const AUDIO_OFF = (\{.*\});\n/);
  const AOFF = JSON.parse(offM[1]);
  let same = 0, clips = 0;
  for (const n of idx.packs) {
    const m = html.match(new RegExp('<script type="application/octet-stream" id="pk-' + n + '">([A-Za-z0-9+/=]*)</script>'));
    const a = m ? Buffer.from(m[1], 'base64') : Buffer.alloc(0), b = fs.readFileSync(ROOT + '/audio/' + n + '.mp3');
    const j = JSON.parse(fs.readFileSync(ROOT + '/audio/' + n + '.json', 'utf8'));
    if (a.equals(b) && JSON.stringify(j) === JSON.stringify(AOFF[n])) same++;
    clips += Object.keys(j).length;
  }
  check('all audio packs embedded byte-for-byte', same === idx.packs.length, same + '/' + idx.packs.length + ' packs, ' + clips + ' pack entries');
  const ext = (html.match(/(?:src|href)\s*=\s*["']?https?:[^"'\s>]+/g) || []).filter(u => !/target=/.test(u));
  const loaders = (html.match(/<(?:link|script|img|iframe|audio|video|source)\b[^>]*\b(?:src|href)=["']https?:[^>]*>/g) || []);
  check('no external resources referenced by tags', loaders.length === 0, loaders.slice(0, 3).join(' | '));

  const browser = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required'] });
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 });
  await ctx.setOffline(true);
  await ctx.addInitScript(() => {
    window.__tts = 0; window.__plays = [];
    try { const orig = speechSynthesis.speak.bind(speechSynthesis); speechSynthesis.speak = u => { window.__tts++; return orig(u); }; } catch (e) {}
    const op = HTMLMediaElement.prototype.play;
    HTMLMediaElement.prototype.play = function () { window.__last = this; window.__plays.push({ len: (this.src || '').length, rate: this.playbackRate }); return op.call(this); };
    try { if (/[?&]mkdue\b/.test(location.search)) { const orig = Storage.prototype.getItem; let done = false; Storage.prototype.getItem = function (k) { const v = orig.call(this, k); if (k !== 'bukit.v1' || done || !v) return v; done = true; const o = JSON.parse(v); const t = Math.floor((Date.now() - new Date().getTimezoneOffset() * 6e4) / 864e5); Object.values(o.words).forEach(s => { s[1] = t; s[7] = 0; }); o.log['2026-11-01'] = { n: 5, r: 12, s: 600 }; o.log['2026-11-03'] = { n: 8, r: 3, s: 300 }; return JSON.stringify(o); }; } } catch (e) {}
  });
  const page = await ctx.newPage();
  const errors = [], net = [];
  page.on('pageerror', e => errors.push('pageerror: ' + e.message));
  page.on('console', m => { if (m.type() === 'error') errors.push('console: ' + m.text()); });
  page.on('request', r => { const u = r.url(); if (!/^(file|data|blob):/.test(u)) net.push(u); });
  const shot = async name => { await page.waitForTimeout(250); await page.screenshot({ path: OUT + name + '.png' }); };

  const t0 = Date.now();
  await page.goto(URL0, { waitUntil: 'commit' });
  await page.waitForSelector('#nav a[data-nav="learn"]');
  const tUi = Date.now() - t0;
  await page.waitForLoadState('domcontentloaded');
  const tDom = Date.now() - t0;
  console.log('load: UI ready after', tUi, 'ms; whole file parsed after', tDom, 'ms');
  await page.waitForTimeout(500);
  const boot = await page.evaluate(async () => {
    await document.fonts.ready;
    return { offline: OFFLINE, build: BUILD, title: document.title, brand: document.querySelector('.topbar .brand').textContent,
      fontUi: (await document.fonts.load('600 16px "Plus Jakarta Sans"', 'Selamat pagi')).filter(f => f.status === 'loaded').length, fontIpa: (await document.fonts.load('16px "Charis SIL"', 'səŋɲʃʔ')).filter(f => f.status === 'loaded').length,
      ls: (() => { try { localStorage.setItem('__t', '1'); localStorage.removeItem('__t'); return true; } catch (e) { return false; } })(),
      onb: !!document.querySelector('[data-act="onbDone"]'), chips: document.querySelectorAll('[data-act="interest"]').length, sync: document.querySelector('#sync-dot').parentElement.title };
  });
  console.log('boot', JSON.stringify(boot));
  check('offline flag, title and brand', boot.offline === true && /离线版/.test(boot.title) && /离线版/.test(boot.brand));
  check('embedded fonts load (UI font and IPA font)', boot.fontUi >= 1 && boot.fontIpa >= 2, boot.fontUi + ' + ' + boot.fontIpa + ' faces');
  check('localStorage available on file://', boot.ls);
  check('first-run card has no AI interest chips', boot.onb && boot.chips === 0);
  await shot('off-home');
  await page.click('[data-act="pref"][data-k="goal"][data-v="10"]');
  await page.click('[data-act="onbDone"]');

  // 课程列表与搜索
  await page.click('#nav a[data-nav="learn"]');
  await page.fill('#q', 'makan'); await page.waitForTimeout(150);
  check('search works', (await page.$$eval('#search-res .wrow', r => r.length)) >= 1);
  await page.fill('#q', 'zzzz'); await page.waitForTimeout(150);
  const none = await page.$eval('#search-res', e => e.textContent);
  check('empty search text has no AI mention', !/AI/.test(none), none.trim());
  await page.fill('#q', '');

  // 主题页、单词卡、播放
  await page.goto(URL0 + '#t-greet'); await page.waitForTimeout(400);
  check('topic page has no AI dialogue box', !(await page.$('.aibox')));
  await page.click('.wrow-main >> nth=1'); await page.waitForTimeout(500);
  const card = await page.evaluate(() => ({ ai: !!document.querySelector('.sheet-panel .aibox'), gloss: [...document.querySelectorAll('.sheet-panel [data-act="gloss"]')].filter(b => !b.hidden).length, src: (document.querySelector('.sheet-panel .w-src') || {}).textContent, ipa: (document.querySelector('.sheet-panel .w-ipa') || {}).textContent, word: document.querySelector('.sheet-panel .w-word').textContent }));
  console.log('word card', JSON.stringify(card));
  check('word card: no AI box, no gloss buttons, has IPA and source line', !card.ai && card.gloss === 0 && !!card.ipa && !!card.src);
  await shot('off-word');
  const playAndWait = async sel => {
    const before = await page.evaluate(() => window.__plays.length);
    await page.click(sel); await page.waitForTimeout(450);
    const mid = await page.evaluate(() => ({ playing: !!document.querySelector('.is-playing'), t: window.__last ? window.__last.currentTime : -1, err: window.__last && window.__last.error ? window.__last.error.code : 0, n: window.__plays.length }));
    await page.waitForFunction(() => !document.querySelector('.is-playing'), null, { timeout: 15000 }).catch(() => {});
    const end = await page.evaluate(() => ({ playing: !!document.querySelector('.is-playing'), p: window.__plays[window.__plays.length - 1] }));
    return { started: mid.n > before, playing: mid.playing, t: mid.t, err: mid.err, stopped: !end.playing, clip: end.p };
  };
  const w1 = await playAndWait('.sheet-panel .w-audio .say >> nth=0');
  check('word plays from embedded audio', w1.started && w1.t > 0 && !w1.err && w1.stopped && w1.clip.len > 2000 && w1.clip.rate === 1, JSON.stringify(w1));
  const w2 = await playAndWait('.sheet-panel .w-audio .say >> nth=1');
  check('slow word plays', w2.started && w2.t > 0 && !w2.err && w2.stopped && w2.clip.len > 2000, JSON.stringify(w2));
  const w3 = await playAndWait('.sheet-panel .exs .ex .say >> nth=0');
  check('example sentence plays', w3.started && w3.t > 0 && !w3.err && w3.stopped && w3.clip.len > 2000, JSON.stringify(w3));
  await page.click('.sheet-panel [data-act="flag"]'); await page.waitForTimeout(200);
  const toast = await page.$eval('#toast', e => e.textContent);
  check('flag toast is the offline wording', /设置/.test(toast) && !/Claude/.test(toast), toast);
  await page.click('.sheet-bar [data-act="closeSheet"]');

  // 学一组
  await page.click('[data-act="study"]');
  let guard = 0, idle = 0;
  while (guard++ < 160) {
    if (await page.$('.s-foot [data-act="next"], .qopt:not([disabled]), #spell-in:not([disabled]), [data-act="qnext"]')) idle = 0;   // 只数连续没东西可点的次数
    if (await page.$('.s-foot [data-act="next"]')) {
      if (await page.$('.deck')) { await page.click('.deck [data-act="dnext"]'); await page.waitForTimeout(300); }
      await page.click('.s-foot [data-act="next"]'); continue;
    }
    const opt = await page.$('.qopt:not([disabled])');
    if (opt) { await opt.click(); await page.waitForTimeout(900); const qn = await page.$('[data-act="qnext"]'); if (qn) await qn.click(); continue; }
    const sp = await page.$('#spell-in:not([disabled])');
    if (sp) { await sp.fill('salah'); await page.click('.spell button[type=submit]'); await page.waitForTimeout(200); const qn = await page.$('[data-act="qnext"]'); if (qn) await qn.click(); continue; }
    const qn = await page.$('[data-act="qnext"]'); if (qn) { await qn.click(); continue; }
    // 答对后页面会停一下再自动跳到下一题；结束页上就真的没有可点的了
    if (await page.$('.done-big') || ++idle > 6) break;
    await page.waitForTimeout(400);
  }
  const learned = await page.evaluate(() => Object.keys(JSON.parse(localStorage.getItem('bukit.v1')).words).length);
  check('study session records learned words', learned >= 5 && !!(await page.$('.done-big')), learned + ' words | ' + (await page.evaluate(() => document.querySelector('#main').innerText.replace(/\s+/g, ' ').slice(0, 160))));
  await shot('off-study-done');

  // 重新打开文件后进度还在
  await page.reload(); await page.waitForSelector('#nav a[data-nav="learn"]'); await page.waitForTimeout(400);
  const after = await page.evaluate(() => ({ n: Object.keys(JSON.parse(localStorage.getItem('bukit.v1')).words).length, onb: !!document.querySelector('[data-act="onbDone"]') }));
  check('progress survives reopening the file', after.n === learned && !after.onb, JSON.stringify(after));

  // 复习
  // 地址里带 ?mkdue 的这一次打开：读进度时把词都改成今天到期（之后换回原地址就不再改）
  await page.goto(URL0 + '?mkdue=1#review'); await page.waitForSelector('[data-act="revStart"]'); await page.waitForTimeout(300);
  await page.click('[data-act="revStart"]'); await page.click('[data-act="reveal"]'); await shot('off-review');
  for (let i = 0; i < 40; i++) { const g = await page.$('[data-act="grade"][data-v="2"]'); if (!g) { const r = await page.$('[data-act="reveal"]'); if (r) { await r.click(); continue; } break; } await g.click(); await page.waitForTimeout(80); }
  check('review session completes', !(await page.$('[data-act="grade"]')));

  // 发音页
  await page.click('#nav a[data-nav="pron"]'); await page.waitForTimeout(400);
  const l1 = await playAndWait('.ltile >> nth=2');
  check('alphabet letter plays', l1.started && l1.t > 0 && !l1.err && l1.clip.len > 2000, JSON.stringify(l1));
  const l2 = await playAndWait('.rule .wchip .say >> nth=0');
  check('pronunciation rule word plays', l2.started && l2.t > 0 && !l2.err && l2.clip.len > 2000, JSON.stringify(l2));
  await page.click('[data-act="pairNew"]'); await page.waitForTimeout(1200); await page.click('[data-act="pairPick"] >> nth=0'); await page.waitForTimeout(200);
  await shot('off-pron');

  // 进度页、设置页
  await page.click('#nav a[data-nav="stats"]'); await page.waitForTimeout(400); await shot('off-stats');
  await page.goto(URL0 + '#me'); await page.reload(); await page.waitForSelector('h1.h-page'); await page.waitForTimeout(400);
  const me = await page.evaluate(() => { const hs = [...document.querySelectorAll('h2.h-sec')].map(h => h.childNodes[0].textContent.trim()); return { hs, sync: document.querySelector('#sync-text').textContent, about: [...document.querySelectorAll('section')].pop().textContent, chips: document.querySelectorAll('[data-act="interest"]').length, flagged: hs.includes('读音问题清单') }; });
  console.log('settings sections', JSON.stringify(me.hs));
  check('settings: offline sections and wording', me.hs.includes('学习记录') && !me.hs.includes('数据与同步') && !me.hs.includes('AI 句子用的设备语音') && me.chips === 0 && /离线版/.test(me.sync) && /离线版 · \d{4}-\d\d-\d\d 生成/.test(me.about) && me.flagged, me.sync);
  await page.screenshot({ path: OUT + 'off-me-full.png', fullPage: true });
  const tts0 = await page.evaluate(() => window.__tts);
  const s1 = await playAndWait('[data-say^="Selamat datang di Indonesia"]');
  check('settings sample sentence plays from embedded audio', s1.started && s1.t > 0 && s1.clip.len > 2000, JSON.stringify(s1));

  // 备份 → 清除 → 恢复
  await page.click('[data-act="backup"]'); await page.waitForTimeout(400);
  const bk = await page.evaluate(() => { const ta = document.querySelector('#backup-text'); return { fallback: !!ta, toast: document.querySelector('#toast').textContent, txt: ta ? ta.value : '' }; });
  let backup = bk.txt;
  if (!backup) backup = await page.evaluate(() => navigator.clipboard.readText().catch(() => ''));
  let parsed = null; try { parsed = JSON.parse(backup); } catch (e) {}
  check('backup text produced and includes flags', !!parsed && Object.keys(parsed.words).length === learned && parsed.flags && Object.keys(parsed.flags).length === 1, (bk.fallback ? 'via text box' : 'via clipboard: ' + bk.toast) + ', ' + backup.length + ' chars');
  await page.click('[data-act="resetAsk"]'); await page.click('[data-act="resetGo"]'); await page.waitForTimeout(200);
  const cleared = await page.evaluate(() => Object.keys(JSON.parse(localStorage.getItem('bukit.v1')).words).length);
  await page.click('[data-act="restoreOpen"]'); await page.fill('#restore-text', backup); await page.click('[data-act="restore"]'); await page.waitForTimeout(300);
  const restored = await page.evaluate(() => { const o = JSON.parse(localStorage.getItem('bukit.v1')); return { n: Object.keys(o.words).length, f: Object.keys(o.flags || {}).length }; });
  check('clear then restore from backup', cleared === 0 && restored.n === learned && restored.f === 1, 'cleared ' + cleared + ', restored ' + JSON.stringify(restored));

  // 手机宽度下没有横向滚动
  const over = [];
  for (const h of ['home', 'learn', 't-coal', 'review', 'pron', 'stats', 'me']) {
    await page.goto(URL0 + '#' + h); await page.reload(); await page.waitForSelector('#nav a[data-nav="learn"]'); await page.waitForTimeout(250);
    const ov = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    if (ov > 0) over.push(h + ':' + ov);
  }
  check('no horizontal overflow at 390px', over.length === 0, over.join(' '));
  check('device speech never used', (await page.evaluate(() => window.__tts)) === 0);

  // 桌面 + 深色
  const d = await browser.newContext({ viewport: { width: 1280, height: 860 }, colorScheme: 'dark' });
  await d.setOffline(true);
  const p2 = await d.newPage();
  p2.on('pageerror', e => errors.push('desktop pageerror: ' + e.message));
  p2.on('request', r => { const u = r.url(); if (!/^(file|data|blob):/.test(u)) net.push(u); });
  await p2.goto(URL0 + '#t-metal'); await p2.waitForSelector('#nav a[data-nav="learn"]'); await p2.waitForTimeout(500);
  await p2.screenshot({ path: OUT + 'off-d-topic-dark.png' });
  check('desktop nav brand shows offline label', /离线版/.test(await p2.$eval('#nav .brand', e => e.textContent)));
  await p2.click('[data-act="deck"] >> nth=0'); await p2.waitForTimeout(300); await p2.keyboard.press('Escape');

  // 慢手机模拟：CPU 降到 1/6，页面还没读完就点播放，读完后应当自动播出来
  const slow = await browser.newContext({ viewport: { width: 390, height: 844 } });
  await slow.setOffline(true);
  await slow.addInitScript(() => { window.__plays = []; const op = HTMLMediaElement.prototype.play; HTMLMediaElement.prototype.play = function () { window.__last = this; window.__plays.push((this.src || '').length); return op.call(this); }; });
  const p3 = await slow.newPage();
  p3.on('pageerror', e => errors.push('slow pageerror: ' + e.message));
  p3.on('request', r => { const u = r.url(); if (!/^(file|data|blob):/.test(u)) net.push(u); });
  const cdp = await slow.newCDPSession(p3);
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 6 });
  const s0 = Date.now();
  await p3.goto(URL0 + '#t-greet', { waitUntil: 'commit' });
  await p3.waitForSelector('.wrow .say');
  const sUi = Date.now() - s0;
  const early = await p3.evaluate(() => { const st = document.readyState; document.querySelector('.wrow .say').click(); return st; });
  await p3.waitForLoadState('domcontentloaded');
  const sDom = Date.now() - s0;
  await p3.waitForFunction(() => window.__plays.some(n => n > 2000) && window.__last && window.__last.currentTime > 0, null, { timeout: 20000 }).catch(() => {});
  const sp = await p3.evaluate(() => ({ plays: window.__plays.filter(n => n > 2000).length, t: window.__last ? window.__last.currentTime : -1 }));
  console.log('slow device (CPU 1/6): UI ready after', sUi, 'ms; whole file parsed after', sDom, 'ms; clicked while document was', early);
  check('tap during loading still plays once the file is read', sp.plays >= 1 && sp.t > 0, JSON.stringify(sp));
  await slow.close();

  // 浏览器不让保存数据时要有明显提示
  const nols = await browser.newContext({ viewport: { width: 390, height: 844 } });
  await nols.setOffline(true);
  await nols.addInitScript(() => { Storage.prototype.setItem = function () { throw new DOMException('denied', 'SecurityError'); }; });
  const p4 = await nols.newPage();
  p4.on('pageerror', e => errors.push('nols pageerror: ' + e.message));
  await p4.goto(URL0); await p4.waitForSelector('#nav a[data-nav="learn"]'); await p4.waitForTimeout(300);
  const warn = await p4.evaluate(() => { const c = document.querySelector('.voicewarn'); return c ? c.textContent : ''; });
  await p4.screenshot({ path: OUT + 'off-nostorage.png' });
  check('warning shown when the browser cannot save progress', /进度存不下来/.test(warn), warn.slice(0, 40));
  await page.goto(URL0 + '#home'); await page.reload(); await page.waitForSelector('#nav a[data-nav="learn"]'); await page.waitForTimeout(250);
  check('no such warning in the normal case', !(await page.$('.voicewarn')) && !!(await page.$('.hero')));
  await nols.close();

  check('no network requests attempted', net.length === 0, net.slice(0, 5).join(' '));
  check('no page errors', errors.length === 0, errors.slice(0, 5).join(' | '));
  const mem = await page.evaluate(() => performance.memory ? Math.round(performance.memory.usedJSHeapSize / 1048576) : -1);
  console.log('JS heap after full run:', mem, 'MB');
  await browser.close();
  console.log(fail.length ? 'FAILED: ' + fail.join('; ') : 'ALL OFFLINE CHECKS PASSED');
  process.exit(fail.length ? 1 : 0);
})().catch(e => { console.error('TEST CRASHED', e); process.exit(2); });
