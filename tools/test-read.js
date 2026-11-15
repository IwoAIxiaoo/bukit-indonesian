// 短文阅读测试。默认测离线版；测在线版：node tools/test-read.js http://127.0.0.1:8765/bukit.html
const { chromium } = require('playwright');
const URL0 = process.argv[2] || 'file://' + require('path').join(__dirname, '..', 'bukit-offline.html');
const OFF = process.argv[3] === 'offline' || URL0.startsWith('file:');
const OUT = require('path').join(__dirname, 'shots') + '/'; require('fs').mkdirSync(OUT, { recursive: true });
const fail = [];
const check = (name, ok, extra) => { console.log((ok ? 'ok   ' : 'FAIL ') + name + (extra !== undefined ? '  ' + extra : '')); if (!ok) fail.push(name); };

(async () => {
  const b = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required'] });
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 } });
  if (OFF) await ctx.setOffline(true);
  await ctx.addInitScript(() => {
    window.__tts = 0; window.__plays = 0;
    try { const orig = speechSynthesis.speak.bind(speechSynthesis); speechSynthesis.speak = u => { window.__tts++; return orig(u); }; } catch (e) {}
    const op = HTMLMediaElement.prototype.play;
    HTMLMediaElement.prototype.play = function () { if ((this.src || '').length > 2000) window.__plays++; return op.call(this); };
  });
  const p = await ctx.newPage(); const errs = [], net = [];
  p.on('pageerror', e => errs.push(e.message));
  p.on('request', r => { const u = r.url(); if (OFF && !/^(file|data|blob):/.test(u)) net.push(u); });
  await p.route(/fonts\./, r => r.abort());
  const boot = async () => { await p.waitForSelector('#nav a[data-nav="learn"]'); await p.waitForTimeout(400); };
  await p.goto(URL0 + '#home'); await boot();
  await p.evaluate(() => {
    const t = Math.floor((Date.now() - new Date().getTimezoneOffset() * 6e4) / 864e5), now = Date.now(), words = {};
    TOPICS[0].words.slice(0, 6).forEach(w => { words[w.id] = [3, t + 5, now - 864e5, 2, 0, t - 9, 2, 0]; });
    localStorage.setItem('bukit.v1', JSON.stringify({ words, log: {}, prefs: { goal: 10, batch: 8, interests: [], decks: {}, tips: {}, last: '', t: now }, saved: {}, flags: {} }));
    Storage.prototype.setItem = function () {};
  });
  await p.reload(); await boot();
  const state = async () => { await p.evaluate(() => { window.dispatchEvent(new Event('pagehide')); }); return p.evaluate(() => JSON.parse(localStorage.getItem('bukit.v1'))); };
  const text = () => p.evaluate(() => document.querySelector('#main').innerText.replace(/\s+/g, ' '));
  const plays = () => p.evaluate(() => window.__plays);
  const tag = OFF ? 'off' : 'on';
  const go = async h => { await p.evaluate(h => { location.hash = h; }, h); await p.waitForTimeout(350); };

  // ---- 入口和列表
  const home = await text();
  check('home has a reading card pointing at the first unread passage', /短文阅读 · 已读 0 \/ 24/.test(home) && !!(await p.$('a[href="#read-kenal"]')), (home.match(/短文阅读[^。]{0,40}/) || [''])[0]);
  await go('learn');
  check('lessons page links to the reading list', !!(await p.$('a.reflink[href="#read"]')));
  await p.click('a.reflink[href="#read"]'); await p.waitForTimeout(400);
  const list = await p.evaluate(() => ({ rows: document.querySelectorAll('.readrow').length, secs: [...document.querySelectorAll('#main section')].map(s => s.querySelectorAll('.readrow').length).filter(Boolean), h: [...document.querySelectorAll('#main h2')].map(x => x.textContent.replace(/\s+/g, ' ').trim()) }));
  check('list: 24 passages in three levels of 8', list.rows === 24 && list.secs.join(',') === '8,8,8' && /入门/.test(list.h[0]) && /生活/.test(list.h[1]) && /职场与矿业/.test(list.h[2]), JSON.stringify(list));
  await p.screenshot({ path: OUT + tag + '-read-list.png' });
  const ovL = await p.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);

  // ---- 每一篇都能打开；句子、标题、生词都有音频
  const audit = await p.evaluate(() => {
    const key = t => String(t).toLowerCase().replace(/[\[\]«»“”"]/g, '').replace(/\s+/g, ' ').trim();
    const hash = x => { let h = 5381; x = String(x); for (let i = 0; i < x.length; i++) h = ((h << 5) + h + x.charCodeAt(i)) | 0; return (h >>> 0).toString(36); };
    const miss = []; let n = 0;
    const need = t => { n++; if (AUDIO_IDX[hash(key(t))] == null) miss.push(t); };
    READS.forEach(r => { need(r.t); r.s.forEach(x => need(x[1])); r.g.forEach(g => need(g[0])); });
    READ_GLOSS.forEach(g => need(g[0]));
    return { n, miss, ids: READS.map(r => r.id), sents: READS.map(r => r.s.length), packs: AUDIO_PACKS.filter(x => /^read-/.test(x)) };
  });
  check('every sentence, title and glossary word has a clip, in three reading packs', audit.miss.length === 0 && audit.packs.length === 3, audit.n + ' texts; missing ' + audit.miss.length + ' ' + audit.miss.slice(0, 4).join(' | '));
  let opened = 0, bad = [];
  for (let k = 0; k < audit.ids.length; k++) {
    await go('read-' + audit.ids[k]);
    const v = await p.evaluate(() => ({ h1: (document.querySelector('.thead h1') || {}).textContent, rs: document.querySelectorAll('.rs').length, zh: document.querySelectorAll('.rs-zh').length, words: document.querySelectorAll('.rw').length, say: document.querySelectorAll('.rs .say').length, gl: document.querySelectorAll('.rgrow').length, glSay: document.querySelectorAll('.rgrow .say[data-say]').length, ov: document.documentElement.scrollWidth - window.innerWidth }));
    if (v.rs === audit.sents[k] && v.zh === v.rs && v.say === v.rs && v.words > v.rs * 2 && v.gl === v.glSay && v.ov <= 0) opened++; else bad.push(audit.ids[k] + JSON.stringify(v));
  }
  check('all 24 passages open with every sentence, its translation, a play button, and no sideways scroll', opened === 24 && ovL <= 0, opened + '/24 ' + bad.slice(0, 2).join(' '));

  // ---- 点词查意思
  await go('read-kenal'); await p.waitForSelector('.rs');
  const tap = async (k, word) => { await p.locator('.rs[data-k="' + k + '"] .rw', { hasText: new RegExp('^' + word + '$') }).first().click(); await p.waitForTimeout(250); return p.evaluate(() => ({ t: document.querySelector('#rgloss').innerText.replace(/\s+/g, ' '), hidden: document.querySelector('#rgloss').hidden, card: !!document.querySelector('#rgloss [data-act="word"]'), say: !!document.querySelector('#rgloss .say'), on: (document.querySelector('.rw.on') || {}).textContent })); };
  const pl0 = await plays();
  const g1 = await tap(1, 'bertemu');
  check('tap a glossary word: meaning shown and it is read aloud', !g1.hidden && /bertemu/.test(g1.t) && /见面/.test(g1.t) && g1.say && !g1.card && g1.on === 'bertemu' && (await plays()) > pl0, g1.t);
  await p.screenshot({ path: OUT + tag + '-read-gloss.png' });
  const g2 = await tap(0, 'Nama');
  check('tap a course word: meaning plus a link to its word card', /名字/.test(g2.t) && g2.card, g2.t);
  await p.click('#rgloss [data-act="word"]'); await p.waitForSelector('#sheet .w-acts'); await p.waitForTimeout(200);
  const sheetW = await p.evaluate(() => (document.querySelector('#sheet .w-word') || {}).textContent);
  check('the link opens the word card', sheetW === 'nama', String(sheetW));
  await p.keyboard.press('Escape'); await p.waitForTimeout(200);
  const g3 = await tap(0, 'Wei');
  check('tap a name: explained as a name, no audio button', /人名：李伟/.test(g3.t) && !g3.say && !g3.card, g3.t);
  const g4 = await tap(0, 'pagi');
  check('tap one word of a phrase: the phrase is found', /selamat pagi/i.test(g4.t) && /早上好/.test(g4.t), g4.t);
  await go('read-buah'); await p.waitForSelector('.rs');
  const g5 = await tap(6, 'uangnya');
  check('tap a word with -nya: the root is shown with a note on -nya', /词根/.test(g5.t) && /uang/.test(g5.t) && /钱/.test(g5.t) && /-nya/.test(g5.t), g5.t);
  await p.click('[data-act="rgClose"]'); await p.waitForTimeout(150);
  check('the gloss bar can be closed', await p.evaluate(() => document.querySelector('#rgloss').hidden && !document.querySelector('.rw.on')));

  // ---- 显示 / 隐藏
  await go('read-kenal'); await p.waitForSelector('.rs');
  await p.click('[data-act="readSet"][data-k="readId"]'); await p.waitForTimeout(150);
  const h1 = await p.evaluate(() => ({ id: document.querySelectorAll('.rs-id').length, hid: document.querySelectorAll('.rs-hid').length, zh: document.querySelectorAll('.rs-zh').length, say: document.querySelectorAll('.rs .say').length }));
  await p.click('[data-act="readSet"][data-k="readZh"]'); await p.waitForTimeout(150);
  const h2 = await p.evaluate(() => ({ id: document.querySelectorAll('.rs-id').length, zh: document.querySelectorAll('.rs-zh').length }));
  await p.screenshot({ path: OUT + tag + '-read-blind.png' });
  check('Indonesian text and Chinese can each be hidden; play buttons stay', h1.id === 0 && h1.hid === 8 && h1.zh === 8 && h1.say === 8 && h2.id === 0 && h2.zh === 0, JSON.stringify([h1, h2]));
  await p.click('[data-act="readSet"][data-k="readId"]'); await p.click('[data-act="readSet"][data-k="readZh"]'); await p.waitForTimeout(150);

  // ---- 连续播放：逐句高亮，再点一次停止
  const pl1 = await plays();
  await p.click('[data-act="readPlay"]'); await p.waitForTimeout(500);
  const c0 = await p.evaluate(() => ({ on: document.querySelector('[data-act="readPlay"]').classList.contains('is-playing'), cur: [...document.querySelectorAll('.rs.cur')].map(x => x.dataset.k).join(','), label: document.querySelector('[data-act="readPlay"]').innerText.trim() }));
  const moved = await p.waitForSelector('.rs.cur[data-k="1"]', { timeout: 15000 }).then(() => true, () => false);
  await p.screenshot({ path: OUT + tag + '-read-play.png' });
  await p.click('[data-act="readPlay"]'); await p.waitForTimeout(500);
  const pl2 = await plays();
  await p.waitForTimeout(2500);
  const c1 = await p.evaluate(() => ({ on: document.querySelector('[data-act="readPlay"]').classList.contains('is-playing'), cur: document.querySelectorAll('.rs.cur').length }));
  check('continuous play highlights the sentence being read and moves on by itself', c0.on && c0.cur === '0' && /停止/.test(c0.label) && moved && pl2 - pl1 >= 2, JSON.stringify(c0) + ' plays ' + (pl2 - pl1));
  check('tapping the button again stops it', !c1.on && c1.cur === 0 && (await plays()) === pl2, JSON.stringify(c1));

  // ---- 用这一篇做练习
  await p.click('[data-act="readSen"][data-m="order"]'); await p.waitForSelector('.ptile.wd'); await p.waitForTimeout(250);
  const o = await p.evaluate(() => ({ head: document.querySelector('.session .eyebrow').textContent, count: document.querySelector('.s-count').textContent, zh: document.querySelector('.sen-q').textContent }));
  const zhs = await p.evaluate(() => READ_BY.kenal.s.map(x => x[2]));
  check('连词成句 uses only this passage\'s sentences', /连词成句 · Kenalan di kantor/.test(o.head) && /^1\/[5-8]$/.test(o.count) && zhs.includes(o.zh), JSON.stringify(o));
  await p.click('[data-act="senExit"]'); await p.waitForTimeout(350);
  check('leaving the exercise returns to the passage', (await p.evaluate(() => location.hash)) === '#read-kenal' && !!(await p.$('.rs')));
  await p.click('[data-act="readSen"][data-m="shadow"]'); await p.waitForSelector('.sen-card'); await p.waitForTimeout(300);
  const sh = await p.evaluate(() => ({ id: document.querySelector('.sen-id').textContent, count: document.querySelector('.s-count').textContent }));
  const first = await p.evaluate(() => READ_BY.kenal.s[0][1]);
  check('影子跟读 goes through the passage in order from the first sentence', sh.id === first && sh.count === '1/8', JSON.stringify(sh));
  await p.click('[data-act="senExit"]'); await p.waitForTimeout(350);

  // ---- 标为已读
  await p.click('[data-act="readDone"]'); await p.waitForTimeout(250);
  let st = await state();
  const d1 = await text();
  await go('read');
  const row = await p.evaluate(() => { const a = document.querySelector('a[href="#read-kenal"]'); return { seen: a.classList.contains('seen'), t: a.innerText.replace(/\s+/g, ' ') }; });
  await go('home');
  const home2 = await text();
  check('marking as read is saved and shown on the passage, the list and the home card', st.prefs.read && st.prefs.read.kenal === 1 && /已读（点一下取消）/.test(d1) && row.seen && /已读/.test(row.t) && /短文阅读 · 已读 1 \/ 24/.test(home2) && !!(await p.$('a[href="#read-keluarga"]')), row.t + ' | ' + (home2.match(/短文阅读[^。]{0,30}/) || [''])[0]);
  await go('read-kenal'); await p.waitForSelector('.rs');
  await p.click('[data-act="readDone"]'); await p.waitForTimeout(250);
  st = await state();
  check('the mark can be removed', !(st.prefs.read && st.prefs.read.kenal), JSON.stringify(st.prefs.read));
  await p.click('a[href="#read-keluarga"]'); await p.waitForTimeout(400);
  check('"下一篇" opens the next passage', (await p.evaluate(() => (document.querySelector('.thead h1') || {}).textContent)) === 'Keluarga saya');

  check('device speech never used', (await p.evaluate(() => window.__tts)) === 0);
  if (OFF) check('no network requests', net.length === 0, net.slice(0, 3).join(' '));
  check('no page errors', errs.length === 0, errs.slice(0, 3).join(' | '));
  await b.close();
  console.log(fail.length ? 'FAILED: ' + fail.join('; ') : 'ALL READING CHECKS PASSED (' + (OFF ? 'offline' : 'online') + ')');
  process.exit(fail.length ? 1 : 0);
})().catch(e => { console.error('TEST CRASHED', e); process.exit(2); });
