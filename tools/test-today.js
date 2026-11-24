// “今日学习”主流程测试：首页唯一主入口 → 复习旧词（句子挖空）→ 学新词（听例句、语境拼写、最后一轮 = FSRS 第一次复习）→ 盲听短对话；
// 还有自由练习的减法和“靠回忆作答的题每天最多计入 FSRS 一次”。
// 默认测离线版；测在线版：node tools/test-today.js http://127.0.0.1:8765/bukit.html
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
  // 第 2 课的 3 个旧词今天到期；第 1 课还没学（下一组新词就是它的前 4 个）。文化贴士和语法卡片都先标成看过
  const seed = await p.evaluate(() => {
    const t = Math.floor((Date.now() - new Date().getTimezoneOffset() * 6e4) / 864e5), now = Date.now(), words = {}, decks = {}, tips = {};
    TOPICS[1].words.slice(0, 3).forEach(w => { words[w.id] = [3, t, now - 3 * 864e5, 2, 0, t - 9, 2, 0]; });
    TOPICS.forEach(x => { Object.values(x.anchors).forEach(d => { decks[d] = 1; }); x.tips.forEach((_, i) => { tips[x.id + ':' + i] = 1; }); });
    localStorage.setItem('bukit.v1', JSON.stringify({ words, log: {}, prefs: { goal: 10, batch: 4, interests: [], decks, tips, last: '', t: now }, saved: {}, flags: {} }));
    Storage.prototype.setItem = function () {};
    return { t, old: TOPICS[1].words.slice(0, 3).map(w => w.id), fresh: TOPICS[0].words.slice(0, 4).map(w => w.id) };
  });
  await p.reload(); await boot();
  const state = async () => { await p.evaluate(() => window.dispatchEvent(new Event('pagehide'))); return p.evaluate(() => JSON.parse(localStorage.getItem('bukit.v1'))); };
  const text = () => p.evaluate(() => document.querySelector('#main').innerText.replace(/\s+/g, ' '));
  const tag = OFF ? 'off' : 'on';
  const go = async h => { await p.evaluate(h => { location.hash = h; }, h); await p.waitForTimeout(300); };

  // ---- 首页：今日学习是唯一的主入口
  const home = await p.evaluate(() => ({ txt: document.querySelector('#main').innerText.replace(/\s+/g, ' '), steps: [...document.querySelectorAll('.flowmain .fstep b')].map(x => x.textContent), start: !!document.querySelector('.flowmain [data-act="flowStart"]'), primaries: document.querySelectorAll('#main .btn.primary').length, study: !!document.querySelector('#main [data-act="study"]'), prac: !!document.querySelector('#main [data-act="pracHub"]') }));
  check('home: one main card with the three steps and their counts, the only primary button', home.start && home.steps.length === 3 && /句子挖空/.test(home.steps[0]) && /听例句/.test(home.steps[1]) && /盲听/.test(home.steps[2]) && /3 个词到期/.test(home.txt) && /4 个新词/.test(home.txt) && home.primaries === 1, JSON.stringify(home.steps));
  check('home: the old separate entries (今日新词 / 自由练习 cards) are gone', !home.study && !home.prac && !/今日新词 \d/.test(home.txt) && !/练单词，也练句子/.test(home.txt));
  await p.locator('.flowmain').screenshot({ path: OUT + tag + '-today-card.png' });

  // ---- 第 1 步：复习旧词（打字卡）
  await p.click('[data-act="flowStart"]'); await p.waitForSelector('.rev-card'); await p.waitForTimeout(200);
  const r0 = await p.evaluate(() => ({ title: document.querySelector('.session').innerText, blank: !!document.querySelector('.rev-card .blank') }));
  check('step 1 is the review: cloze sentence typing card', /今日学习 · 复习旧词/.test(r0.title) && r0.blank, r0.title.slice(0, 60));
  const answerRev = async () => { const w = await p.evaluate(() => WORDS[document.querySelector('.rev-card').dataset.w].w); await p.fill('#rev-in', w); await p.keyboard.press('Enter'); await p.waitForTimeout(150); await p.click('[data-act="revNext"]'); await p.waitForTimeout(150); };
  await answerRev();
  // 中途回首页：显示进行中，可以继续
  await go('home');
  const mid = await text();
  check('leaving midway: home shows it in progress with 继续 / 结束', /今日学习 · 进行中/.test(mid) && !!(await p.$('.flowmain [data-act="flowNext"]')) && !!(await p.$('[data-act="flowQuit"]')), mid.slice(0, 80));
  await p.click('.flowmain [data-act="flowNext"]'); await p.waitForTimeout(300);
  check('继续 resumes the same review round where it stopped', (await p.evaluate(() => document.querySelector('.s-count').textContent)) === '2/3');
  for (let k = 0; k < 4 && await p.$('.rev-card'); k++) await answerRev();
  const fb1 = await p.evaluate(() => (document.querySelector('[data-act="flowNext"]') || {}).textContent);
  check('after the review the next step is offered: new words', /下一步：学新词/.test(fb1 || ''), String(fb1));
  await p.click('[data-act="flowNext"]'); await p.waitForSelector('.session'); await p.waitForTimeout(300);

  // ---- 第 2 步：学新词
  let words = 0, ctxCards = 0, checks = 0, finals = 0, shot = false;
  for (let n = 0; n < 60; n++) {
    if (await p.$('[data-act="flowNext"]')) break;
    const st = await p.evaluate(() => ({ eb: (document.querySelector('.session .eyebrow') || {}).textContent || '', ctx: !!document.querySelector('.ctx-card'), next: !!document.querySelector('.s-foot [data-act="next"]'), qw: (document.querySelector('.qprompt') || { dataset: {} }).dataset.w, spell: !!document.querySelector('#spell-in:not([disabled])'), qnext: !!document.querySelector('[data-act="qnext"]'), opt: !!document.querySelector('.qopt:not([disabled])'), rev: (document.querySelector('.rev-card') || { dataset: {} }).dataset.w, revNext: !!document.querySelector('[data-act="revNext"]') }));
    if (st.rev && st.revNext) { await p.click('[data-act="revNext"]'); await p.waitForTimeout(150); continue; }
    if (st.rev) { finals++; await p.fill('#rev-in', await p.evaluate(id => WORDS[id].w, st.rev)); await p.keyboard.press('Enter'); await p.waitForTimeout(150); continue; }
    if (st.next) { if (/^新词/.test(st.eb)) { words++; if (st.ctx) ctxCards++; if (!shot) { shot = true; await p.screenshot({ path: OUT + tag + '-today-word.png', fullPage: true }); } } await p.click('.s-foot [data-act="next"]'); await p.waitForTimeout(150); continue; }
    if (st.spell) { checks++; await p.fill('#spell-in', await p.evaluate(id => WORDS[id].w, st.qw)); await p.keyboard.press('Enter'); await p.waitForTimeout(150); if (await p.$('[data-act="qnext"]')) await p.click('[data-act="qnext"]'); else await p.waitForTimeout(1100); continue; }
    if (st.opt) { await p.locator('.qopt[data-v="' + st.qw + '"]').click(); await p.waitForTimeout(150); if (await p.$('[data-act="qnext"]')) await p.click('[data-act="qnext"]'); else await p.waitForTimeout(1100); continue; }
    if (st.qnext) { await p.click('[data-act="qnext"]'); await p.waitForTimeout(150); continue; }
    await p.waitForTimeout(300);
  }
  const fb2 = await p.evaluate(() => (document.querySelector('[data-act="flowNext"]') || {}).textContent);
  let st = await state();
  const fresh = seed.fresh.map(id => st.words[id]);
  check('new words: 4 words, each opens with its example sentence; typed checks; final round on the review card', words === 4 && ctxCards === 4 && checks === 4 && finals === 4, JSON.stringify({ words, ctxCards, checks, finals }));
  check('the final round is the first FSRS review (Review cards, no 3-hour revisit)', fresh.every(r => Array.isArray(r[10]) && r[10][3] === 2 && r[1] >= seed.t + 1 && r[7] === 0 && r[6] === 2), JSON.stringify(fresh[0]));
  check('after the new words the next step is offered: blind listening', /下一步：盲听/.test(fb2 || ''), String(fb2));
  await p.click('[data-act="flowNext"]'); await p.waitForSelector('.lis-lines'); await p.waitForTimeout(300);

  // ---- 第 3 步：盲听
  const b0 = await p.evaluate(() => ({ route: location.hash, lines: document.querySelectorAll('.lis-line').length, text: document.querySelectorAll('.lis-line .rs-id').length, showDisabled: !!document.querySelector('[data-act="lisShow"][disabled]'), sub: document.querySelector('.page .sub').textContent, flow: !!document.querySelector('[data-act="flowNext"]') }));
  check('blind listening: a dialogue with today\'s words, no text yet, 显示文字 only after listening', b0.route === '#listen' && b0.lines >= 4 && b0.text === 0 && b0.showDisabled && /今天学的 [1-4] 个词/.test(b0.sub) && !b0.flow, JSON.stringify(b0));
  await p.screenshot({ path: OUT + tag + '-today-listen-blind.png', fullPage: true });
  const pl0 = await p.evaluate(() => window.__plays);
  await p.click('[data-act="lisPlay"]');
  const played = await p.waitForFunction(() => document.querySelector('.lis-line.cur'), null, { timeout: 8000 }).then(() => true, () => false);
  const pl1 = await p.evaluate(() => window.__plays);
  check('playing reads the dialogue from recorded clips and highlights the current line', played && pl1 > pl0, 'clips played ' + (pl1 - pl0));
  await p.click('[data-act="lisPlay"]'); await p.waitForTimeout(200);   // 再点一次停下
  await p.click('[data-act="lisShow"]'); await p.waitForTimeout(300);
  const b1 = await p.evaluate(() => ({ text: document.querySelectorAll('.lis-line .rs-id').length, zh: document.querySelectorAll('.lis-line .rs-zh').length, marks: [...document.querySelectorAll('.lis-line mark.hl')].map(m => m.textContent.toLowerCase()), chips: document.querySelectorAll('.wchip').length, say: document.querySelectorAll('.lis-line .say').length, flow: (document.querySelector('[data-act="flowNext"]') || {}).textContent }));
  const freshW = await p.evaluate(ids => ids.map(id => WORDS[id].w.toLowerCase()), seed.fresh);
  check('显示文字: Indonesian, Chinese and a play button per line; today\'s words highlighted and listed', b1.text === b0.lines && b1.zh === b0.lines && b1.say === b0.lines && b1.marks.length >= 2 && b1.marks.every(m => freshW.includes(m)) && b1.chips >= 2, JSON.stringify(b1));
  check('the last step offers to finish today\'s session', b1.flow === '完成今日学习', String(b1.flow));
  await p.screenshot({ path: OUT + tag + '-today-listen-shown.png', fullPage: true });
  // 可选：用这段对话做影子跟读，退出后回到对话
  await p.click('[data-act="lisSen"][data-m="shadow"]'); await p.waitForSelector('.sen-card'); await p.waitForTimeout(200);
  const sh = await p.evaluate(() => ({ head: document.querySelector('.session .eyebrow').textContent, id: document.querySelector('.sen-id').textContent }));
  const first = await p.evaluate(() => document.querySelector('.sen-id') && null);
  await p.click('[data-act="senExit"]'); await p.waitForTimeout(300);
  check('optional shadowing uses this dialogue and returns to it', /影子跟读/.test(sh.head) && (await p.evaluate(() => location.hash)) === '#listen' && !!(await p.$('.lis-line .rs-id')), JSON.stringify(sh));
  await p.click('[data-act="flowNext"]'); await p.waitForTimeout(400);
  const fin = await text();
  check('finishing returns home with a plain summary', (await p.evaluate(() => location.hash)) === '#home' && /今天这一轮做完了/.test(fin) && /新学 4 个词/.test(fin) && !/XP|积分|等级/.test(fin), fin.slice(0, 100));

  // ---- 没有内容的步骤自动跳过
  const reseed = async (goalMet) => {
    await p.evaluate(([goalMet, t]) => {
      const s = JSON.parse(localStorage.getItem('bukit.v1'));
      Object.values(s.words).forEach(w => { if (w[0] > 0) { w[1] = t + 5; w[5] = t - 3; if (Array.isArray(w[10])) w[10][0] = (t + 5) * 864e5; } });
      s.log = {}; const k = new Date(Date.now() - new Date().getTimezoneOffset() * 6e4).toISOString().slice(0, 10); s.log[k] = { n: goalMet ? 10 : 0, r: 0, s: 0 };
      localStorage.setItem('bukit.v1', JSON.stringify(s)); Storage.prototype.setItem = function () {};
    }, [goalMet, seed.t]);
    await p.reload(); await boot();
    return text();
  };
  const a1 = await reseed(false);
  await p.click('[data-act="flowStart"]'); await p.waitForTimeout(400);
  const a1r = await p.evaluate(() => ({ route: location.hash, eb: (document.querySelector('.session .eyebrow') || {}).textContent || '' }));
  check('nothing due: today\'s session starts straight with new words', /0|现在没有到期的词/.test(a1) && a1r.route === '#study' && /^新词/.test(a1r.eb), JSON.stringify(a1r));
  await p.click('[data-act="quit"]'); await p.waitForTimeout(200);
  const a2 = await reseed(true);
  check('nothing due and the daily goal met: the card says so and offers 再学一组 / 自由练习', /今天没有要做的了/.test(a2) && !!(await p.$('.flowmain [data-act="study"]')) && !!(await p.$('.flowmain [data-act="pracHub"]')), a2.slice(0, 140));

  // ---- 自由练习做减法
  await p.click('.flowmain [data-act="pracHub"]'); await p.waitForSelector('#prac-hub'); await p.waitForTimeout(200);
  const hub = await p.evaluate(() => ({ main: [...document.querySelectorAll('#prac-hub > .pmodes .pmode b')].map(x => x.textContent), warm: [...document.querySelectorAll('#prac-hub .warm .pmode b')].map(x => x.textContent), warmOpen: document.querySelector('#prac-hub .warm').open, sen: !!document.querySelector('#sen-modes, [data-act="senStart"]') }));
  check('free practice: typed modes up front, the four choice modes folded into 辅助巩固 / 热身, no sentence group', hub.main.join('/') === '句子填空/听写/拼写挑战/跟打/易混辨析/模拟挑战' && hub.warm.join('/') === '单词卡/看词选义/看义选词/听音选义' && !hub.warmOpen && !hub.sen, JSON.stringify(hub));
  await p.screenshot({ path: OUT + tag + '-today-prac-hub.png', fullPage: true });

  // ---- 句子填空要打字；靠回忆作答的题每天最多计入 FSRS 一次
  // 收藏一个今天没复习过的旧词，只练它
  const target = seed.old[0];
  await p.evaluate(([id, t]) => {
    const s = JSON.parse(localStorage.getItem('bukit.v1')), now = Date.now();
    s.words[id] = [3, t + 5, now - 3 * 864e5, 2, 0, t - 9, 2, 0]; s.prefs.fav = { [id]: 1 };
    localStorage.setItem('bukit.v1', JSON.stringify(s)); Storage.prototype.setItem = function () {};
  }, [target, seed.t]);
  await p.reload(); await boot(); await go('review'); await p.waitForSelector('#prac-hub');
  await p.selectOption('#pscope', 'fav'); await p.waitForTimeout(200);
  const fillOnce = async () => {
    await p.click('.pmode[data-m="fill"]'); await p.waitForSelector('#ptype-in'); await p.waitForTimeout(200);
    const q = await p.evaluate(() => ({ blank: !!document.querySelector('.qprompt .blank'), opts: document.querySelectorAll('.qopt').length, zh: (document.querySelector('.qprompt .ex-zh') || {}).textContent }));
    await p.fill('#ptype-in', await p.evaluate(id => WORDS[id].w, target)); await p.keyboard.press('Enter'); await p.waitForTimeout(200);
    const r = await p.evaluate(() => document.querySelector('.session').innerText.replace(/\s+/g, ' '));
    await p.click('[data-act="pracNext"]'); await p.waitForTimeout(200); await p.click('[data-act="pracExit"]'); await p.waitForTimeout(200);
    return { q, r };
  };
  const f1 = await fillOnce();
  st = await state();
  const rec1 = st.words[target];
  check('句子填空 is typed (cloze + Chinese, no options)', f1.q.blank && f1.q.opts === 0 && !!f1.q.zh, JSON.stringify(f1.q));
  check('a typed practice answer on a learned word is rated and written to FSRS', /已计入复习计划/.test(f1.r) && Array.isArray(rec1[10]) && rec1[6] === 2 && rec1[1] > seed.t, f1.r.slice(0, 120));
  const f2 = await fillOnce();
  st = await state();
  check('the same word again today: not counted a second time', /今天已经复习过/.test(f2.r) && JSON.stringify(st.words[target]) === JSON.stringify(rec1), f2.r.slice(0, 120));
  // 跟打（看着词打）只练不计分
  await p.click('.pmode[data-m="copy"]'); await p.waitForSelector('#ptype-in'); await p.waitForTimeout(200);
  await p.fill('#ptype-in', await p.evaluate(id => WORDS[id].w, target)); await p.waitForTimeout(300);
  const cp = await p.evaluate(() => document.querySelector('.session').innerText);
  check('跟打 is practice only (no rating line)', !/计入复习计划|今天已经复习过/.test(cp));

  const ov = await p.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  check('no horizontal overflow', ov <= 0, String(ov));
  check('device speech never used', (await p.evaluate(() => window.__tts)) === 0);
  if (OFF) check('no network requests', net.length === 0, net.slice(0, 3).join(' '));
  check('no page errors', errs.length === 0, errs.slice(0, 3).join(' | '));
  await b.close();
  console.log(fail.length ? 'FAILED: ' + fail.join('; ') : 'ALL TODAY CHECKS PASSED (' + (OFF ? 'offline' : 'online') + ')');
  process.exit(fail.length ? 1 : 0);
})().catch(e => { console.error('TEST CRASHED', e); process.exit(2); });
