// 句子与语感（影子跟读、连词成句、听音组句）测试。入口：短文阅读页和今日学习的盲听页（自由练习里已经没有这一组了）。
// 默认测离线版；测在线版：node tools/test-sense.js http://127.0.0.1:8765/bukit.html
const { chromium } = require('playwright');
const URL0 = process.argv[2] || 'file://' + require('path').join(__dirname, '..', 'bukit-offline.html');
const OFF = process.argv[3] === 'offline' || URL0.startsWith('file:');
const OUT = require('path').join(__dirname, 'shots') + '/'; require('fs').mkdirSync(OUT, { recursive: true });
const fail = [];
const check = (name, ok, extra) => { console.log((ok ? 'ok   ' : 'FAIL ') + name + (extra !== undefined ? '  ' + extra : '')); if (!ok) fail.push(name); };
const tokens = s => String(s).replace(/[\[\]«»]/g, '').split(/\s+/).map(t => t.replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}%]+$/gu, '')).filter(Boolean).map(t => t.toLowerCase());

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
  await p.evaluate(() => { localStorage.setItem('bukit.v1', JSON.stringify({ words: {}, log: {}, prefs: { goal: 10, batch: 8, interests: [], decks: {}, tips: {}, last: '', t: Date.now() }, saved: {}, flags: {} })); Storage.prototype.setItem = function () {}; });
  await p.reload(); await boot();
  const state = async () => { await p.evaluate(() => { window.dispatchEvent(new Event('pagehide')); }); return p.evaluate(() => JSON.parse(localStorage.getItem('bukit.v1'))); };
  const logR = async () => Object.values((await state()).log).reduce((a, x) => a + (x.r || 0), 0);
  const text = () => p.evaluate(() => document.querySelector('#main').innerText.replace(/\s+/g, ' '));
  const tag = OFF ? 'off' : 'on';
  const lines = await p.evaluate(() => READ_BY.kenal.s.map(x => ({ id: x[1], zh: x[2] })));
  const openPassage = async () => { await p.evaluate(() => { location.hash = 'read-kenal'; }); await p.waitForSelector('[data-act="readSen"]'); await p.waitForTimeout(200); };

  // ---- 入口
  await openPassage();
  const entries = await p.evaluate(() => [...document.querySelectorAll('[data-act="readSen"] b')].map(x => x.textContent));
  check('the reading page offers shadowing, word order and listen-and-order on its own sentences', entries.join('/') === '影子跟读/连词成句/听音组句', entries.join('/'));
  await p.evaluate(() => { location.hash = 'review'; }); await p.waitForSelector('#prac-hub'); await p.waitForTimeout(200);
  check('free practice no longer has a sentence group (it moved into today\'s session)', !(await p.$('#sen-modes, [data-act="senStart"]')));

  // ---- 影子跟读：按原文顺序，每句之后留出和这句差不多长的空档
  await openPassage();
  await p.click('[data-act="readSen"][data-m="shadow"]'); await p.waitForSelector('.sen-card'); await p.waitForTimeout(200);
  const s0 = await p.evaluate(() => ({ id: document.querySelector('.sen-id').textContent, count: document.querySelector('.s-count').textContent, head: document.querySelector('.session .eyebrow').textContent }));
  check('shadowing goes through the passage in order', s0.id === lines[0].id && s0.count === '1/' + lines.length && /影子跟读 · Kenalan di kantor/.test(s0.head), JSON.stringify(s0));
  const tSay = Date.now();
  const gotTurn = await p.waitForSelector('.sen-card.turn', { timeout: 15000 }).then(() => true, () => false);
  const said = Date.now() - tSay;
  const g = await p.evaluate(() => ({ st: (document.querySelector('#sen-st') || {}).textContent || '', dur: parseFloat(((document.querySelector('.sen-gap i') || {}).style || {}).animationDuration) || 0 }));
  const plg = await p.evaluate(() => window.__plays);
  await p.screenshot({ path: OUT + tag + '-sense-shadow.png', fullPage: true });
  await p.waitForTimeout(1200);
  const stillGap = await p.evaluate(() => !!document.querySelector('.sen-card.turn'));
  check('after the sentence there is a silent gap about as long as the sentence', gotTurn && /轮到你了/.test(g.st) && g.dur >= 1800 && g.dur >= said * 0.8 && g.dur <= said * 1.6 + 900 && stillGap && (await p.evaluate(() => window.__plays)) === plg, JSON.stringify({ said, gap: g.dur }));
  const adv = await p.waitForFunction(n => document.querySelector('.s-count').textContent === '2/' + n, lines.length, { timeout: 20000 }).then(() => true, () => false);
  check('then it moves on by itself; each sentence shadowed counts once as practice', adv && (await logR()) === 1);
  await p.click('[data-act="senToggle"]'); await p.waitForTimeout(300);
  const pz = await p.evaluate(() => ({ st: document.querySelector('#sen-st').textContent, count: document.querySelector('.s-count').textContent, plays: window.__plays }));
  await p.waitForTimeout(3000);
  check('pause really stops', /已暂停/.test(pz.st) && (await p.evaluate(() => document.querySelector('.s-count').textContent)) === pz.count && (await p.evaluate(() => window.__plays)) === pz.plays, pz.st);
  await p.click('[data-act="senSet"][data-k="senId"]'); await p.waitForTimeout(150);
  check('Indonesian text can be hidden for listening only', !(await p.$('.sen-id')) && !!(await p.$('.sen-hidden')));
  await p.click('[data-act="senSet"][data-k="senId"]'); await p.waitForTimeout(150);
  await p.click('[data-act="senExit"]'); await p.waitForTimeout(300);
  check('leaving returns to the passage', (await p.evaluate(() => location.hash)) === '#read-kenal');

  // ---- 连词成句：看中文排出印尼语
  const byZh = zh => lines.find(x => x.zh === zh);
  const pickSeq = async seq => { for (const t of seq) { const n = await p.locator('.ptile.wd:not([disabled])').evaluateAll((els, t) => { const el = els.find(x => x.textContent.toLowerCase() === t); if (el) el.click(); return !!el; }, t); if (!n) throw new Error('找不到词块 ' + t); await p.waitForTimeout(40); } };
  await p.click('[data-act="readSen"][data-m="order"]'); await p.waitForSelector('.ptile.wd'); await p.waitForTimeout(200);
  const qi = () => p.evaluate(() => ({ zh: (document.querySelector('.sen-q') || {}).textContent || '', say: ((document.querySelector('.qprompt .bigplay') || {}).dataset || {}).say || '', tiles: [...document.querySelectorAll('.ptile.wd')].map(x => x.textContent), count: document.querySelector('.s-count').textContent, shown: document.querySelector('.session').innerText }));
  const q0 = await qi(), src0 = byZh(q0.zh), ans0 = tokens(src0.id), n = +q0.count.split('/')[1];
  check('word order: Chinese prompt, one tile per word, shuffled, the sentence itself not shown', !!src0 && q0.tiles.length === ans0.length && q0.tiles.map(t => t.toLowerCase()).join(' ') !== ans0.join(' ') && !q0.shown.includes(src0.id) && n >= 6, JSON.stringify({ zh: q0.zh, tiles: q0.tiles, n }));
  await p.screenshot({ path: OUT + tag + '-sense-order.png', fullPage: true });
  await p.locator('.ptile.wd:not([disabled])').first().click(); await p.waitForTimeout(60);
  await p.click('.stile'); await p.waitForTimeout(60);
  check('a picked word can be taken back', (await p.evaluate(() => document.querySelectorAll('.stile').length)) === 0);
  const wrongSeq = ans0.slice().reverse().join(' ') === ans0.join(' ') ? ans0.slice(1).concat(ans0[0]) : ans0.slice().reverse();
  await pickSeq(wrongSeq); await p.click('[data-act="senCheck"]'); await p.waitForTimeout(250);
  const w0 = await p.evaluate(() => ({ wrong: !!document.querySelector('.sline.wrong'), ex: (document.querySelector('.session .ex-id') || {}).textContent }));
  check('wrong order is marked and the original sentence shown', w0.wrong && w0.ex === src0.id, JSON.stringify(w0));
  await p.click('[data-act="senNext"]'); await p.waitForTimeout(200);
  let okN = 0;
  for (let k = 0; k < 12; k++) {
    if (!(await p.$('.ptile.wd'))) break;
    const q = await qi(); await pickSeq(tokens(byZh(q.zh).id)); await p.click('[data-act="senCheck"]'); await p.waitForTimeout(150);
    if (await p.$('.sline.right')) okN++;
    await p.click('[data-act="senNext"]'); await p.waitForTimeout(150);
  }
  const od = await text();
  check('word order: the rest accepted, summary lists the missed sentence', okN === n - 1 && new RegExp('答对 ' + (n - 1) + ' / ' + n).test(od) && od.includes(src0.id), okN + ' | ' + od.slice(0, 80));
  await p.click('[data-act="senExit"]'); await p.waitForTimeout(300);

  // ---- 听音组句：只听句子，词块里多 2 个干扰词
  const pl0 = await p.evaluate(() => window.__plays);
  await p.click('[data-act="readSen"][data-m="hear"]'); await p.waitForSelector('.ptile.wd'); await p.waitForTimeout(500);
  const h0 = await qi(), hans = tokens(h0.say);
  check('listen and order: audio plays from clips, text hidden, tiles = the words + 2 extra', (await p.evaluate(() => window.__plays)) > pl0 && !h0.shown.includes(h0.say) && h0.tiles.length === hans.length + 2, JSON.stringify({ n: hans.length, tiles: h0.tiles.length }));
  await p.screenshot({ path: OUT + tag + '-sense-hear.png', fullPage: true });
  let hearOk = 0, hn = 0;
  for (let k = 0; k < 12; k++) {
    if (!(await p.$('.ptile.wd'))) break;
    const q = await qi(); hn++;
    await pickSeq(tokens(q.say)); await p.click('[data-act="senCheck"]'); await p.waitForTimeout(150);
    if (await p.$('.sline.right')) hearOk++;
    await p.click('[data-act="senNext"]'); await p.waitForTimeout(150);
  }
  check('listen and order: all right', hearOk === hn && new RegExp('答对 ' + hn + ' / ' + hn).test(await text()), hearOk + '/' + hn);
  const ov = await p.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  check('no horizontal overflow', ov <= 0, String(ov));
  await p.click('[data-act="senExit"]'); await p.waitForTimeout(200);

  check('device speech never used', (await p.evaluate(() => window.__tts)) === 0);
  if (OFF) check('no network requests', net.length === 0, net.slice(0, 3).join(' '));
  check('no page errors', errs.length === 0, errs.slice(0, 3).join(' | '));
  await b.close();
  console.log(fail.length ? 'FAILED: ' + fail.join('; ') : 'ALL SENTENCE CHECKS PASSED (' + (OFF ? 'offline' : 'online') + ')');
  process.exit(fail.length ? 1 : 0);
})().catch(e => { console.error('TEST CRASHED', e); process.exit(2); });
