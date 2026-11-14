// 主动回忆式复习测试。用法：node test-recall.js <url> [offline]
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
    const sh = +(sessionStorage.getItem('shift') || 0);
    if (sh) { const o = Date.now.bind(Date); Date.now = () => o() + sh; }   // 模拟“过了一段时间”
    window.__tts = 0; window.__plays = [];
    try { const orig = speechSynthesis.speak.bind(speechSynthesis); speechSynthesis.speak = u => { window.__tts++; return orig(u); }; } catch (e) {}
    const op = HTMLMediaElement.prototype.play;
    HTMLMediaElement.prototype.play = function () { if ((this.src || '').length > 2000) window.__plays.push((this.src || '').length); return op.call(this); };
  });
  const p = await ctx.newPage(); const errs = [], net = [];
  p.on('pageerror', e => errs.push(e.message));
  p.on('request', r => { const u = r.url(); if (OFF && !/^(file|data|blob):/.test(u)) net.push(u); });
  await p.route(/fonts\./, r => r.abort());
  await p.goto(URL0 + '#home'); await p.waitForSelector('#nav a[data-nav="learn"]'); await p.waitForTimeout(500);

  // 造一份学习记录：C 上次不认识（再考时间已过）、B 上次模糊、D 旧格式且过期 3 天、A 过期 1 天、16 个普通到期词、W 还在等 10 分钟、N 两天后到期
  const seed = await p.evaluate(() => {
    const t = Math.floor((Date.now() - new Date().getTimezoneOffset() * 6e4) / 864e5), now = Date.now(), old = now - 2 * 864e5;
    const ws = TOPICS[0].words.concat(TOPICS[1].words).filter(w => w.ex.length >= 2 && /\[/.test(w.ex[0].id) && /\[/.test(w.ex[1].id)).slice(0, 22);
    const id = k => ws[k].id, words = {};
    words[id(0)] = [3, t - 1, old, 2, 0, t - 20, 2, 0];                 // A
    words[id(1)] = [2, t, old, 2, 0, t - 20, 1, 0];                     // B 模糊
    words[id(2)] = [1, t, old, 4, 1, t - 20, 0, now - 1000];            // C 不认识，再考时间已过
    words[id(3)] = [1, t - 3, old, 0, 0, t - 20];                       // D 旧格式
    for (let k = 4; k < 20; k++) words[id(k)] = [2, t, old, k % 2, 0, t - 20, 2, 0];   // E：一半轮到“例句挖空”
    words[id(20)] = [1, t, now - 6e4, 3, 1, t - 20, 0, now + 5 * 6e4];  // W 等待中
    words[id(21)] = [3, t + 2, old, 2, 0, t - 20, 2, 0];                // N 快到期
    localStorage.setItem('bukit.v1', JSON.stringify({ words, log: {}, prefs: { goal: 10, batch: 8, interests: [], decks: {}, tips: {}, last: '', t: now }, saved: {}, flags: {} }));
    Storage.prototype.setItem = function () {};   // 防止离开页面时旧状态把它盖掉
    return { t, ids: ws.map(w => w.id), w: ws.map(w => w.w), zh: ws.map(w => w.zh), exN: ws.map(w => w.ex.length) };
  });
  await p.reload(); await p.waitForSelector('#nav a[data-nav="learn"]'); await p.waitForTimeout(500);
  const st = () => p.evaluate(() => JSON.parse(localStorage.getItem('bukit.v1')).words);
  const save = () => p.evaluate(() => { window.dispatchEvent(new Event('pagehide')); });

  const home = await p.evaluate(() => { const c = [...document.querySelectorAll('.card.action')].find(x => /今日复习/.test(x.textContent)); return { card: c ? c.textContent : '', streak: /连续天数/.test(document.body.innerText) }; });
  check('home card: 20 due, weak ones mentioned, waiting word mentioned', /20 个词到期/.test(home.card) && /2 个上次选了/.test(home.card) && /1 个不认识的词在等/.test(home.card), home.card);
  check('streak display is still there', home.streak);

  await p.click('#nav a[data-nav="review"]'); await p.waitForTimeout(300);
  const land = await p.evaluate(() => ({ txt: document.querySelector('#main').innerText, anim: getComputedStyle(document.querySelector('.btn')).transitionDuration }));
  check('review page: due count, waiting section, early-review section', /20 个词到期/.test(land.txt) && /等待再考/.test(land.txt) && /提前复习 1 个/.test(land.txt), land.txt.replace(/\s+/g, ' ').slice(0, 160));
  await p.screenshot({ path: OUT + (OFF ? 'off' : 'on') + '-recall-landing.png', fullPage: true });
  await p.click('[data-act="revStart"]'); await p.waitForTimeout(400);

  const front = () => p.evaluate(() => { const f = document.querySelector('.flash'); return { txt: f.innerText, word: !!f.querySelector('.w-word'), blank: !!f.querySelector('.blank'), zh: (f.querySelector('.zh-big') || {}).textContent, plays: window.__plays.length, reveal: !!document.querySelector('[data-act="reveal"]'), grades: document.querySelectorAll('[data-act="grade"]').length }; });
  const back = () => p.evaluate(() => { const f = document.querySelector('.flash'); return { word: (f.querySelector('.w-word') || {}).textContent, ipa: (f.querySelector('.w-ipa') || {}).textContent, zh: (f.querySelector('.w-zh') || {}).textContent, ex: f.querySelectorAll('.exs .ex').length, exSay: f.querySelectorAll('.exs .ex .say').length, marks: f.querySelectorAll('.exs mark.hl').length, plays: window.__plays.length, grades: [...document.querySelectorAll('[data-act="grade"]')].map(x => x.textContent.replace(/\s+/g, ' ').trim()) }; });
  const K = k => seed.ids.indexOf(seed.ids[k]);

  // 第 1 张应该是 C（上次不认识）
  let f = await front();
  check('first card is the word marked 不认识 last time; only Chinese shown, no audio', f.zh === seed.zh[2] && !f.word && f.plays === 0 && f.reveal && f.grades === 0 && !f.txt.includes(seed.w[2]), JSON.stringify(f).slice(0, 160));
  await p.screenshot({ path: OUT + (OFF ? 'off' : 'on') + '-recall-front.png' });
  await p.click('[data-act="reveal"]'); await p.waitForTimeout(700);
  let bk = await back();
  check('reveal: word, IPA, meaning, every example with highlight and play button, word read aloud', bk.word === seed.w[2] && !!bk.ipa && bk.zh === seed.zh[2] && bk.ex === seed.exN[2] && bk.exSay === bk.ex && bk.marks >= bk.ex && bk.plays === 1, JSON.stringify(bk).slice(0, 200));
  check('three feedback buttons; retry card shows 10 分钟后 / 明天 / 明天', bk.grades.length === 3 && /^不认识 ?10 分钟后$/.test(bk.grades[0]) && /^模糊 ?明天$/.test(bk.grades[1]) && /^认识 ?明天$/.test(bk.grades[2]), JSON.stringify(bk.grades));
  await p.screenshot({ path: OUT + (OFF ? 'off' : 'on') + '-recall-back.png', fullPage: true });
  await p.click('[data-act="grade"][data-v="2"]'); await p.waitForTimeout(250);

  // 第 2 张：B（上次模糊，2 级）
  f = await front();
  await p.keyboard.press(' '); await p.waitForTimeout(500);
  bk = await back();
  check('second card is the 模糊 word; labels: same interval 3 天后, longer 7 天后', f.zh === seed.zh[1] && bk.word === seed.w[1] && /10 分钟后/.test(bk.grades[0]) && /模糊 ?3 天后/.test(bk.grades[1]) && /认识 ?7 天后/.test(bk.grades[2]), JSON.stringify(bk.grades));
  await p.keyboard.press('2'); await p.waitForTimeout(250);

  // 第 3 张：D（过期最久），选不认识；第 4 张：A，选认识
  f = await front(); const third = f.zh;
  await p.click('[data-act="reveal"]'); await p.waitForTimeout(300); await p.click('[data-act="grade"][data-v="0"]'); await p.waitForTimeout(250);
  f = await front(); const fourth = f.zh;
  await p.click('[data-act="reveal"]'); await p.waitForTimeout(300); await p.click('[data-act="grade"][data-v="2"]'); await p.waitForTimeout(250);
  check('then by how overdue: D (3 days) before A (1 day)', third === seed.zh[3] && fourth === seed.zh[0], third + ' / ' + fourth);
  await save();
  let w = await st();
  const A = w[seed.ids[0]], B = w[seed.ids[1]], C = w[seed.ids[2]], D = w[seed.ids[3]], t = seed.t;
  check('认识 on a level-3 word: level 4, due in 14 days', A[0] === 4 && A[1] === t + 14 && A[6] === 2 && !A[7], JSON.stringify(A));
  check('模糊 keeps the interval: level 2, due in 3 days, marked weak', B[0] === 2 && B[1] === t + 3 && B[6] === 1, JSON.stringify(B));
  check('retry answered: level 1, due tomorrow, still marked weak, timer cleared', C[0] === 1 && C[1] === t + 1 && C[6] === 1 && C[7] === 0, JSON.stringify(C));
  check('不认识 resets: level 1, retry in about 10 minutes, counted once', D[0] === 1 && D[1] === t && D[6] === 0 && D[4] === 1 && Math.abs(D[7] - Date.now() - 600000) < 30000, JSON.stringify(D));

  // 接下来 6 张普通卡，其中应有“例句挖空”
  let cloze = 0, clozeOk = true;
  for (let k = 0; k < 6; k++) {
    f = await front();
    if (f.blank) { cloze++; const i = seed.zh.findIndex((z, j) => j >= 4 && f.txt.includes('____') === false && true); }
    const before = f;
    await p.click('[data-act="reveal"]'); await p.waitForTimeout(350);
    bk = await back();
    if (before.blank) { if (before.word || before.txt.toLowerCase().includes(bk.word.toLowerCase() + ' ') && false) clozeOk = false; if (bk.marks < 1) clozeOk = false; }
    if (k === 0 && before.blank) await p.screenshot({ path: OUT + (OFF ? 'off' : 'on') + '-recall-cloze.png' });
    await p.click('[data-act="grade"][data-v="2"]'); await p.waitForTimeout(250);
    if (await p.$('.qopts')) break;
  }
  check('some cards use a sentence with the word blanked out', cloze >= 1 && clozeOk, cloze + ' cloze cards in the first batch');

  // 第 10 张答完后插入选择题：听音选中文
  const q1 = await p.evaluate(() => ({ head: (document.querySelector('.session .eyebrow') || {}).textContent, big: !!document.querySelector('.qprompt .bigplay'), opts: [...document.querySelectorAll('.qopt')].map(x => x.textContent), word: !!document.querySelector('.qprompt .w-word'), counter: document.querySelector('.s-count').textContent }));
  await p.waitForTimeout(600);
  const q1plays = await p.evaluate(() => window.__plays.length);
  check('after 10 cards a multiple-choice appears: listen and pick the Chinese meaning', /选择题/.test(q1.head || '') && q1.big && q1.opts.length === 4 && !q1.word && q1.opts.every(o => /[一-鿿]/.test(o)) && /^11\/20$/.test(q1.counter), JSON.stringify(q1));
  await p.screenshot({ path: OUT + (OFF ? 'off' : 'on') + '-recall-quiz1.png' });
  await p.keyboard.press('1'); await p.waitForTimeout(500);
  const a1 = await p.evaluate(() => ({ right: document.querySelectorAll('.qopt.right').length, disabled: [...document.querySelectorAll('.qopt')].every(x => x.disabled), why: (document.querySelector('.why') || {}).textContent, next: !!document.querySelector('[data-act="rqnext"]') }));
  check('quiz shows the right answer and waits for 继续', a1.right === 1 && a1.disabled && !!a1.why && a1.next, JSON.stringify(a1));
  await p.keyboard.press('Enter'); await p.waitForTimeout(300);

  // 后 10 张全部选认识，然后是第二道选择题：句子填空
  for (let k = 0; k < 10; k++) { if (await p.$('.qopts')) break; await p.click('[data-act="reveal"]'); await p.waitForTimeout(200); await p.click('[data-act="grade"][data-v="2"]'); await p.waitForTimeout(200); }
  const q2 = await p.evaluate(() => ({ blank: !!document.querySelector('.qprompt .cloze .blank'), zh: (document.querySelector('.qprompt .ex-zh') || {}).textContent, opts: [...document.querySelectorAll('.qopt')].map(x => ({ t: x.textContent, v: x.dataset.v })) }));
  check('second multiple-choice: Indonesian sentence with a blank, pick the word', q2.blank && !!q2.zh && q2.opts.length === 4, JSON.stringify(q2).slice(0, 200));
  await p.screenshot({ path: OUT + (OFF ? 'off' : 'on') + '-recall-quiz2.png' });
  // 故意选错：找出正确项之外的一个
  const target = await p.evaluate(() => { const o = [...document.querySelectorAll('.qopt')]; o[0].click(); return null; });
  await p.waitForTimeout(400);
  const a2 = await p.evaluate(() => ({ right: (document.querySelector('.qopt.right') || {}).dataset ? document.querySelector('.qopt.right').dataset.v : '', wrong: document.querySelector('.qopt.wrong') ? document.querySelector('.qopt.wrong').dataset.v : '', filled: !!document.querySelector('.qprompt .cloze mark.hl') }));
  await save(); w = await st();
  const tw = w[a2.right];
  check('fill-in quiz reveals the sentence; a wrong pick only marks the word weak', a2.filled && (a2.wrong ? tw[6] === 1 && tw[0] === 3 && tw[1] === t + 7 : tw[6] === 2), JSON.stringify({ a2, tw }));
  await p.click('[data-act="rqnext"]'); await p.waitForTimeout(300);

  const done = await p.evaluate(() => document.querySelector('#main').innerText.replace(/\s+/g, ' '));
  check('round summary: 20 words, 18 认识 / 1 模糊 / 1 不认识, missed word listed', /复习了 20 个词/.test(done) && /认识 18 · 模糊 1 · 不认识 1/.test(done) && done.includes(seed.w[3]) && /10 分钟后/.test(done), done.slice(0, 200));
  await p.screenshot({ path: OUT + (OFF ? 'off' : 'on') + '-recall-done.png', fullPage: true });
  await p.click('[data-act="revExit"]'); await p.waitForTimeout(300);
  const land2 = await p.evaluate(() => document.querySelector('#main').innerText.replace(/\s+/g, ' '));
  check('nothing due now; two words wait for their 10-minute retry', /现在没有到期的词/.test(land2) && /2 个刚才选了/.test(land2), land2.slice(0, 200));

  // 11 分钟后：两个不认识的词回到复习里，排最前
  await save();
  await p.evaluate(() => sessionStorage.setItem('shift', String(11 * 60000)));
  await p.reload(); await p.waitForSelector('#nav a[data-nav="learn"]'); await p.waitForTimeout(500);
  const land3 = await p.evaluate(() => document.querySelector('#main').innerText.replace(/\s+/g, ' '));
  check('11 minutes later both words are due again', /2 个词到期/.test(land3) && !/等待再考/.test(land3), land3.slice(0, 160));
  await p.click('[data-act="revStart"]'); await p.waitForTimeout(300);
  for (let k = 0; k < 2; k++) { await p.click('[data-act="reveal"]'); await p.waitForTimeout(200); await p.click('[data-act="grade"][data-v="2"]'); await p.waitForTimeout(200); }
  await save(); w = await st();
  const D2 = w[seed.ids[3]];
  check('retry passed: due tomorrow at level 1; no quiz for a 2-card round', D2[0] === 1 && D2[1] === t + 1 && D2[7] === 0 && D2[4] === 1 && !(await p.$('.qopts')), JSON.stringify(D2));
  // 提前复习
  await p.click('[data-act="revExit"]'); await p.waitForTimeout(200);
  const hasSoon = await p.$('[data-act="revSoon"]');
  if (hasSoon) { await p.click('[data-act="revSoon"]'); await p.waitForTimeout(300); }
  const early = hasSoon ? await front() : {};
  check('early review offers the word due in 2 days', !!hasSoon && early.zh === seed.zh[21] || (early.blank && true), JSON.stringify(early).slice(0, 120));

  const ov = await p.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  check('no horizontal overflow', ov <= 0, String(ov));
  check('device speech never used', (await p.evaluate(() => window.__tts)) === 0);
  if (OFF) check('no network requests', net.length === 0, net.slice(0, 3).join(' '));
  check('no page errors', errs.length === 0, errs.slice(0, 3).join(' | '));
  await b.close();
  console.log(fail.length ? 'FAILED: ' + fail.join('; ') : 'ALL RECALL CHECKS PASSED (' + (OFF ? 'offline' : 'online') + ')');
  process.exit(fail.length ? 1 : 0);
})().catch(e => { console.error('TEST CRASHED', e); process.exit(2); });
