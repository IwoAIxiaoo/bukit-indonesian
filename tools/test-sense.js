// 句子与语感（连续播放、影子跟读、连词成句、听音组句）测试。默认测离线版；测在线版：node tools/test-sense.js http://127.0.0.1:8765/bukit.html
const { chromium } = require('playwright');
const URL0 = process.argv[2] || 'file://' + require('path').join(__dirname, '..', 'bukit-offline.html');
const OFF = process.argv[3] === 'offline' || URL0.startsWith('file:');
const OUT = require('path').join(__dirname, 'shots') + '/'; require('fs').mkdirSync(OUT, { recursive: true });
const fail = [];
const check = (name, ok, extra) => { console.log((ok ? 'ok   ' : 'FAIL ') + name + (extra !== undefined ? '  ' + extra : '')); if (!ok) fail.push(name); };
// 和程序里一样的拆词：去掉标记，按空格分，去掉词两头的标点
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
  await p.evaluate(() => {
    const t = Math.floor((Date.now() - new Date().getTimezoneOffset() * 6e4) / 864e5), now = Date.now(), words = {};
    TOPICS[0].words.slice(0, 12).forEach(w => { words[w.id] = [3, t + 5, now - 864e5, 2, 0, t - 9, 2, 0]; });
    localStorage.setItem('bukit.v1', JSON.stringify({ words, log: {}, prefs: { goal: 10, batch: 8, interests: [], decks: {}, tips: {}, last: '', t: now }, saved: {}, flags: {} }));
    Storage.prototype.setItem = function () {};
  });
  await p.reload(); await boot();
  const state = async () => { await p.evaluate(() => { window.dispatchEvent(new Event('pagehide')); }); return p.evaluate(() => JSON.parse(localStorage.getItem('bukit.v1'))); };
  const logR = async () => Object.values((await state()).log).reduce((a, x) => a + (x.r || 0), 0);
  const text = () => p.evaluate(() => document.querySelector('#main').innerText.replace(/\s+/g, ' '));
  const tag = OFF ? 'off' : 'on';
  const plays = () => p.evaluate(() => window.__plays);
  const view = () => p.evaluate(() => ({ count: (document.querySelector('.s-count') || {}).textContent || '', id: (document.querySelector('.sen-id') || {}).textContent || '', zh: (document.querySelector('.sen-zh') || {}).textContent || '', st: (document.querySelector('#sen-st') || {}).textContent || '', turn: !!document.querySelector('.sen-card.turn'), hidden: !!document.querySelector('.sen-hidden') }));
  const waitCount = (re, ms) => p.waitForFunction(re => new RegExp(re).test((document.querySelector('.s-count') || {}).textContent || ''), re, { timeout: ms || 20000 }).then(() => true, () => false);

  await p.goto(URL0 + '#review'); await p.waitForSelector('#sen-modes'); await p.waitForTimeout(300);
  const hub = await p.evaluate(() => [...document.querySelectorAll('#sen-modes .smode b')].map(x => x.textContent));
  check('practice hub offers the four sentence modes', hub.join('/') === '连续播放/影子跟读/连词成句/听音组句', hub.join('/'));
  await p.locator('#prac-hub').screenshot({ path: OUT + tag + '-sense-hub.png' });

  // ---- 连续播放
  const pl0 = await plays();
  await p.click('.smode[data-m="play"]'); await p.waitForSelector('.sen-card'); await p.waitForTimeout(500);
  const v0 = await view();
  check('连续播放: starts by itself with sentence, Chinese and status', v0.count === '1/12' && v0.id.length > 3 && v0.zh.length > 0 && /正在播放/.test(v0.st) && (await plays()) > pl0, JSON.stringify(v0));
  await p.screenshot({ path: OUT + tag + '-sense-play.png' });
  const adv = await waitCount('^2/12$');
  const v1 = await view();
  check('连续播放: moves on to the next sentence without a tap', adv && v1.id !== v0.id, v1.count + ' ' + v1.id.slice(0, 30));
  await p.click('[data-act="senToggle"]'); await p.waitForTimeout(300);
  const pz = await view(), plz = await plays();
  await p.waitForTimeout(4000);
  const pz2 = await view();
  check('pause really stops: same sentence and no audio 4 s later', /已暂停/.test(pz.st) && pz2.count === pz.count && (await plays()) === plz, pz.st + ' ' + pz2.count);
  await p.click('[data-act="senSet"][data-k="senReps"][data-v="2"]'); await p.waitForTimeout(150);
  await p.click('[data-act="senToggle"]'); await p.waitForTimeout(300);
  const r1 = await view();
  const rep2 = await p.waitForFunction(() => /第 2 \/ 2 遍/.test((document.querySelector('#sen-st') || {}).textContent || ''), null, { timeout: 15000 }).then(() => true, () => false);
  const r2 = await view();
  check('repeat ×2: the same sentence is played a second time before moving on', /第 1 \/ 2 遍/.test(r1.st) && rep2 && r2.count === r1.count, r1.st + ' → ' + r2.st);
  await p.click('[data-act="senSet"][data-k="senReps"][data-v="1"]'); await p.waitForTimeout(150);
  await p.click('[data-act="senSkip"]'); await p.waitForTimeout(300);
  const s1 = await view();
  await p.click('[data-act="senPrev"]'); await p.waitForTimeout(300);
  const s2 = await view();
  check('next / previous buttons move one sentence', s1.count === '3/12' && s2.count === '2/12', s1.count + ' ' + s2.count);
  await p.click('[data-act="senSet"][data-k="senZh"]'); await p.waitForTimeout(150);
  const z0 = await view();
  await p.click('[data-act="senSet"][data-k="senId"]'); await p.waitForTimeout(150);
  const z1 = await view();
  await p.screenshot({ path: OUT + tag + '-sense-hidden.png' });
  check('Chinese and Indonesian text can each be hidden', z0.zh === '' && z0.id !== '' && z1.id === '' && z1.hidden, JSON.stringify([z0.zh, z1.id, z1.hidden]));
  await p.click('[data-act="senSet"][data-k="senZh"]'); await p.click('[data-act="senSet"][data-k="senId"]'); await p.waitForTimeout(150);
  // 离开页面就暂停
  await p.evaluate(() => { location.hash = 'home'; }); await p.waitForTimeout(500);
  const plh = await plays();
  await p.waitForTimeout(3500);
  const quiet = (await plays()) === plh;
  await p.evaluate(() => { location.hash = 'sense'; }); await p.waitForTimeout(400);
  const back = await view();
  check('leaving the page pauses playback; coming back shows it paused', quiet && /已暂停/.test(back.st), back.st);
  // 跳到最后一句，播完自动结束
  for (let k = 0; k < 12; k++) { if (await p.$('[data-act="senSkip"][disabled]')) break; await p.click('[data-act="senSkip"]'); await p.waitForTimeout(60); }
  await p.click('[data-act="senToggle"]');
  const fin = await p.waitForFunction(() => /听完了 12 句/.test(document.querySelector('#main').innerText), null, { timeout: 20000 }).then(() => true, () => false);
  const r0 = await logR();
  check('连续播放 ends with a plain summary and is not counted as practice', fin && r0 === 0, (await text()).slice(0, 50) + ' r=' + r0);
  await p.click('[data-act="senExit"]'); await p.waitForSelector('#prac-hub');

  // ---- 影子跟读
  await p.click('.smode[data-m="shadow"]'); await p.waitForSelector('.sen-card'); await p.waitForTimeout(200);
  const tSay = Date.now();
  const gotTurn = await p.waitForSelector('.sen-card.turn', { timeout: 15000 }).then(() => true, () => false);
  const tGap = Date.now();
  const g = await p.evaluate(() => ({ st: (document.querySelector('#sen-st') || {}).textContent || '', dur: parseFloat(((document.querySelector('.sen-gap i') || {}).style || {}).animationDuration) || 0, count: document.querySelector('.s-count').textContent }));
  const plg = await plays();
  await p.screenshot({ path: OUT + tag + '-sense-shadow.png' });
  await p.waitForTimeout(1200);
  const stillGap = await p.evaluate(() => !!document.querySelector('.sen-card.turn'));
  const said = tGap - tSay;
  check('影子跟读: after the sentence there is a silent gap about as long as the sentence', gotTurn && /轮到你了/.test(g.st) && g.dur >= 1800 && g.dur >= said * 0.8 && g.dur <= said * 1.6 + 900 && stillGap && (await plays()) === plg && g.count === '1/12', JSON.stringify({ said, gap: g.dur }));
  const adv2 = await waitCount('^2/12$', 20000);
  const r1s = await logR();
  check('影子跟读: goes on to the next sentence after the gap; each sentence counts once as practice', adv2 && r1s === 1, 'r=' + r1s);
  await p.click('[data-act="senExit"]'); await p.waitForSelector('#prac-hub'); await p.waitForTimeout(200);

  // ---- 连词成句
  const qinfo = () => p.evaluate(() => ({ zh: (document.querySelector('.sen-q') || {}).textContent || '', say: ((document.querySelector('.qprompt .bigplay') || {}).dataset || {}).say || '', tiles: [...document.querySelectorAll('.ptile.wd')].map(x => x.textContent), count: document.querySelector('.s-count').textContent, shown: document.querySelector('.session').innerText }));
  // 按中文找出这句的印尼语（同一句中文可能对应几句，挑词块对得上的）
  const findByZh = (zh, tiles) => p.evaluate(([zh, tiles]) => {
    const tok = s => String(s).replace(/[\[\]«»]/g, '').split(/\s+/).map(t => t.replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}%]+$/gu, '')).filter(Boolean).map(t => t.toLowerCase());
    const want = tiles.map(t => t.toLowerCase()).sort().join(' ');
    for (const id in WORDS) for (const e of WORDS[id].ex) if (e.zh === zh && tok(e.id).slice().sort().join(' ') === want) return e.id;
    return null;
  }, [zh, tiles]);
  const pickSeq = async seq => { for (const t of seq) { const n = await p.locator('.ptile.wd:not([disabled])').evaluateAll((els, t) => { const el = els.find(x => x.textContent.toLowerCase() === t); if (el) el.click(); return !!el; }, t); if (!n) throw new Error('找不到词块 ' + t); await p.waitForTimeout(40); } };
  await p.click('.smode[data-m="order"]'); await p.waitForSelector('.ptile.wd'); await p.waitForTimeout(300);
  const q0 = await qinfo();
  const src0 = await findByZh(q0.zh, q0.tiles);
  const ans0 = src0 ? tokens(src0) : [];
  check('连词成句: Chinese prompt, one tile per word, shuffled, sentence itself not shown', q0.count === '1/8' && !!src0 && q0.tiles.length === ans0.length && q0.tiles.map(t => t.toLowerCase()).join(' ') !== ans0.join(' ') && !q0.shown.includes(src0.replace(/[\[\]]/g, '')), JSON.stringify({ zh: q0.zh, tiles: q0.tiles }));
  await p.screenshot({ path: OUT + tag + '-sense-order.png' });
  // 点一个再点掉；退格
  await p.locator('.ptile.wd:not([disabled])').first().click(); await p.waitForTimeout(80);
  const n1 = await p.evaluate(() => document.querySelectorAll('.stile').length);
  await p.click('.stile'); await p.waitForTimeout(80);
  const n0 = await p.evaluate(() => document.querySelectorAll('.stile').length);
  await p.locator('.ptile.wd:not([disabled])').first().click(); await p.waitForTimeout(80);
  await p.click('[data-act="senBack"]'); await p.waitForTimeout(80);
  const n00 = await p.evaluate(() => ({ n: document.querySelectorAll('.stile').length, dis: document.querySelector('[data-act="senCheck"]').disabled }));
  check('a picked word can be taken back by tapping it or with 退格; 确定 is disabled while empty', n1 === 1 && n0 === 0 && n00.n === 0 && n00.dis);
  // 第一题故意排错（倒着排）
  const rev = ans0.slice().reverse();
  const wrongSeq = rev.join(' ') === ans0.join(' ') ? ans0.slice(1).concat(ans0[0]) : rev;
  await pickSeq(wrongSeq); await p.click('[data-act="senCheck"]'); await p.waitForTimeout(300);
  const w0 = await p.evaluate(() => ({ wrong: !!document.querySelector('.sline.wrong'), why: (document.querySelector('.why') || {}).textContent, ex: (document.querySelector('.session .ex-id') || {}).textContent }));
  check('wrong order is marked and the example sentence is shown', w0.wrong && /和例句不一样/.test(w0.why || '') && w0.ex === src0.replace(/[\[\]]/g, ''), JSON.stringify(w0));
  await p.click('[data-act="senNext"]'); await p.waitForTimeout(250);
  let okN = 0;
  for (let k = 0; k < 10; k++) {
    if (!(await p.$('.ptile.wd'))) break;
    const q = await qinfo(); const src = await findByZh(q.zh, q.tiles);
    if (!src) throw new Error('找不到原句：' + q.zh);
    await pickSeq(tokens(src));
    if (k % 2) await p.keyboard.press('Enter'); else await p.click('[data-act="senCheck"]');
    await p.waitForTimeout(200);
    if (await p.$('.sline.right')) okN++;
    if (k % 2) await p.keyboard.press('Enter'); else await p.click('[data-act="senNext"]');
    await p.waitForTimeout(200);
  }
  const od = await text(); const r2s = await logR();
  check('连词成句: 8 sentences, right order accepted, summary lists the missed one, answers counted', okN === 7 && /答对 7 \/ 8/.test(od) && od.includes(src0.replace(/[\[\]]/g, '')) && r2s === 9, okN + ' | ' + od.slice(0, 60) + ' r=' + r2s);
  await p.screenshot({ path: OUT + tag + '-sense-done.png' });
  await p.click('[data-act="senExit"]'); await p.waitForSelector('#prac-hub'); await p.waitForTimeout(200);

  // ---- 听音组句
  const plh0 = await plays();
  await p.click('.smode[data-m="hear"]'); await p.waitForSelector('.ptile.wd'); await p.waitForTimeout(500);
  const h0 = await qinfo(); const hans = tokens(h0.say);
  check('听音组句: audio plays, text is hidden, tiles = the words + 2 extra', (await plays()) > plh0 && h0.say.length > 3 && !h0.shown.includes(h0.say) && h0.tiles.length === hans.length + 2, JSON.stringify({ n: hans.length, tiles: h0.tiles.length }));
  await p.screenshot({ path: OUT + tag + '-sense-hear.png' });
  let hearOk = 0;
  for (let k = 0; k < 10; k++) {
    if (!(await p.$('.ptile.wd'))) break;
    const q = await qinfo();
    await pickSeq(tokens(q.say)); await p.click('[data-act="senCheck"]'); await p.waitForTimeout(200);
    const res = await p.evaluate(() => ({ right: !!document.querySelector('.sline.right'), ex: (document.querySelector('.session .ex-id') || {}).textContent }));
    if (res.right && res.ex === q.say) hearOk++;
    await p.click('[data-act="senNext"]'); await p.waitForTimeout(200);
  }
  const hd = await text();
  check('听音组句: all 8 right; the sentence and its meaning appear only after answering', hearOk === 8 && /答对 8 \/ 8/.test(hd) && /全部排对/.test(hd), hearOk + ' | ' + hd.slice(0, 50));
  await p.click('[data-act="senAgain"]'); await p.waitForSelector('.ptile.wd'); await p.waitForTimeout(300);
  check('再来一组 starts a fresh round', (await qinfo()).count === '1/8');
  const ov = await p.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  check('no horizontal overflow', ov <= 0, String(ov));
  await p.click('[data-act="senExit"]'); await p.waitForSelector('#prac-hub');

  check('device speech never used', (await p.evaluate(() => window.__tts)) === 0);
  if (OFF) check('no network requests', net.length === 0, net.slice(0, 3).join(' '));
  check('no page errors', errs.length === 0, errs.slice(0, 3).join(' | '));
  await b.close();
  console.log(fail.length ? 'FAILED: ' + fail.join('; ') : 'ALL SENTENCE CHECKS PASSED (' + (OFF ? 'offline' : 'online') + ')');
  process.exit(fail.length ? 1 : 0);
})().catch(e => { console.error('TEST CRASHED', e); process.exit(2); });
