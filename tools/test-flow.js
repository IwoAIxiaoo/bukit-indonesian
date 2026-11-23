// 错词本、收藏、已掌握、今日学习、跟打、听写 的测试。默认测离线版；测在线版：node tools/test-flow.js http://127.0.0.1:8765/bukit.html
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
  // 10 个已学的词：6 个今天到期（其中 1 个上次“模糊”，2 个是旧格式的 6 项记录），4 个没到期
  const seed = await p.evaluate(() => {
    const t = Math.floor((Date.now() - new Date().getTimezoneOffset() * 6e4) / 864e5), now = Date.now(), words = {};
    const ws = TOPICS[0].words;
    words[ws[0].id] = [2, t, now - 2 * 864e5, 2, 1, t - 9, 1, 0];
    words[ws[1].id] = [2, t, now - 2 * 864e5, 1, 0, t - 5];
    words[ws[2].id] = [2, t, now - 2 * 864e5, 1, 0, t - 5];
    [3, 4, 5].forEach(k => { words[ws[k].id] = [2, t, now - 2 * 864e5, 2, 0, t - 9, 2, 0]; });
    [6, 7, 8, 9].forEach(k => { words[ws[k].id] = [3, t + 5, now - 864e5, 2, 0, t - 9, 2, 0]; });
    localStorage.setItem('bukit.v1', JSON.stringify({ words, log: {}, prefs: { goal: 10, batch: 4, interests: [], decks: {}, tips: {}, last: '', t: now }, saved: {}, flags: {} }));
    Storage.prototype.setItem = function () {};
    return { t, topic: TOPICS[0].id, ids: ws.map(w => w.id), w: ws.map(w => w.w) };
  });
  await p.reload(); await boot();
  const save = () => p.evaluate(() => { window.dispatchEvent(new Event('pagehide')); });
  const state = async () => { await save(); return p.evaluate(() => JSON.parse(localStorage.getItem('bukit.v1'))); };
  const text = () => p.evaluate(() => document.querySelector('#main').innerText.replace(/\s+/g, ' '));
  const tag = OFF ? 'off' : 'on';
  const id = k => seed.ids[k];

  // ---- 首页：今日学习的安排
  const home0 = await text();
  check('home shows today\'s plan: review, new words, spelling', !!(await p.$('[data-act="flowStart"]')) && home0.includes('复习到期的词 → 学一组新词 → 默写今天学的词') && home0.includes('6 个词到期'), home0.slice(0, 120));
  await p.locator('[data-act="flowStart"]').locator('xpath=ancestor::section').screenshot({ path: OUT + tag + '-flow-card.png' });

  // ---- 单词卡：收藏、已掌握
  await p.goto(URL0 + '#t-' + seed.topic); await p.waitForSelector('.wrow-main'); await p.waitForTimeout(300);
  const openWord = async k => { await p.click('.wrow-main[data-id="' + id(k) + '"]'); await p.waitForSelector('#sheet .w-acts'); await p.waitForTimeout(250); };
  const closeSheet = async () => { await p.keyboard.press('Escape'); await p.waitForTimeout(200); };
  const pressed = a => p.evaluate(a => document.querySelector('#sheet [data-act="' + a + '"]').getAttribute('aria-pressed'), a);
  await openWord(3);
  check('word card has 收藏 and 已掌握, both off', (await pressed('fav')) === 'false' && (await pressed('known')) === 'false');
  await p.click('#sheet [data-act="fav"]'); await p.waitForTimeout(200);
  let st = await state();
  check('收藏: saved in prefs and the button stays pressed', (await pressed('fav')) === 'true' && st.prefs.fav && st.prefs.fav[id(3)] === 1, JSON.stringify(st.prefs.fav));
  await p.click('#sheet [data-act="known"]'); await p.waitForTimeout(200);
  st = await state();
  const kn = st.words[id(3)];
  const sheetTxt = await p.evaluate(() => document.querySelector('#sheet').innerText);
  check('已掌握: flag set, due date far away, previous level remembered', (await pressed('known')) === 'true' && kn[8] === 1 && kn[1] > seed.t + 30000 && kn[9] === 2 && /已掌握 · 不再复习/.test(sheetTxt), JSON.stringify(kn));
  await p.locator('#sheet .sheet-panel').screenshot({ path: OUT + tag + '-word-acts.png' });
  await p.click('#sheet [data-act="known"]'); await p.waitForTimeout(200);
  st = await state();
  check('undo 已掌握: back to its old level, due tomorrow, flag gone', st.words[id(3)][0] === 2 && st.words[id(3)][1] === seed.t + 1 && st.words[id(3)][8] === undefined, JSON.stringify(st.words[id(3)]));
  await closeSheet();
  // 没学过的词标成已掌握，再取消：变回没学过，不占今天的新词数
  await openWord(11);
  await p.click('#sheet [data-act="known"]'); await p.waitForTimeout(200);
  st = await state(); const k11 = st.words[id(11)];
  await p.click('#sheet [data-act="known"]'); await p.waitForTimeout(200);
  st = await state();
  const logN = Object.values(st.log).reduce((a, x) => a + (x.n || 0), 0);
  check('marking an unlearned word and undoing leaves it unlearned and does not count as a new word', k11[8] === 1 && k11[9] === 0 && st.words[id(11)][0] === 0 && logN === 0, JSON.stringify([k11, st.words[id(11)], logN]));
  await closeSheet();
  // 一个到期的词标成已掌握并保留
  await openWord(5); await p.click('#sheet [data-act="known"]'); await p.waitForTimeout(200); await closeSheet();
  await p.goto(URL0 + '#home'); await p.waitForTimeout(400);
  const home1 = await text();
  check('a mastered word leaves today\'s review (6 due → 4: one mastered, one moved to tomorrow)', home1.includes('4 个词到期'), (home1.match(/\d+ 个词到期/) || [''])[0]);

  // ---- 复习页：错词本和收藏的列表、练习范围
  await p.goto(URL0 + '#review'); await p.waitForSelector('#prac-hub'); await p.waitForTimeout(300);
  const lists = await p.evaluate(() => ({ txt: (document.querySelector('#lists-card') || {}).innerText || '', modes: [...document.querySelectorAll('.pmode:not(.smode) b')].map(x => x.textContent), opts: [...document.querySelectorAll('#pscope option')].slice(0, 4).map(o => o.textContent) }));
  check('review page lists the error book (1) and favourites (1)', /错词本\s*1 个/.test(lists.txt) && lists.txt.includes(seed.w[0]) && /收藏的词\s*1 个/.test(lists.txt) && lists.txt.includes(seed.w[3]), lists.txt.replace(/\s+/g, ' ').slice(0, 140));
  check('practice: ten modes incl. 跟打 and 听写; scope offers 错词本 and 收藏的词', lists.modes.length === 10 && lists.modes.includes('跟打') && lists.modes.includes('听写') && /错词本（1 个）/.test(lists.opts[1]) && /收藏的词（1 个）/.test(lists.opts[2]), lists.modes.join('/') + ' | ' + lists.opts.join(' '));
  await p.locator('#lists-card').screenshot({ path: OUT + tag + '-lists.png' });
  await p.click('#lists-card [data-act="pracScopeSet"][data-v="weak"]'); await p.waitForTimeout(250);
  check('"练这些词" switches the practice scope to the error book', (await p.evaluate(() => document.querySelector('#pscope').value)) === 'weak');

  // ---- 跟打：逐字母提示，打对自动提交
  await p.click('.pmode[data-m="copy"]'); await p.waitForSelector('#ptype-in'); await p.waitForTimeout(400);
  const word0 = seed.w[0], norm = s => s.toLowerCase().replace(/[^a-z]+/g, ' ').trim();
  const echo = () => p.evaluate(() => ({ txt: document.querySelector('#pecho').textContent.replace(/ /g, ' '), cls: [...document.querySelectorAll('#pecho span')].map(s => s.className[0]).join(''), focus: document.activeElement && document.activeElement.id, count: document.querySelector('.s-count').textContent }));
  const e0 = await echo();
  check('跟打: shows the word from the error book, nothing typed yet, input focused', e0.txt.toLowerCase() === word0.toLowerCase() && /^t+$/.test(e0.cls) && e0.focus === 'ptype-in' && e0.count === '1/1', JSON.stringify(e0));
  const wrongCh = norm(word0)[0] === 'z' ? 'q' : 'z';
  await p.keyboard.type(wrongCh); await p.waitForTimeout(80);
  const e1 = await echo();
  await p.keyboard.press('Backspace'); await p.keyboard.type(norm(word0).slice(0, 2)); await p.waitForTimeout(80);
  const e2 = await echo();
  await p.screenshot({ path: OUT + tag + '-copy.png' });
  check('跟打: a wrong letter is marked, right letters turn green one by one', e1.cls[0] === 'b' && e2.cls.slice(0, 2) === 'oo' && e2.cls[2] === 't', e1.cls + ' → ' + e2.cls);
  await p.keyboard.type(norm(word0).slice(2)); await p.waitForTimeout(300);
  const c3 = await p.evaluate(() => ({ why: (document.querySelector('.why') || {}).textContent, right: !!document.querySelector('#ptype-in.right'), dis: document.querySelector('#ptype-in').disabled }));
  check('跟打: finishing the word submits by itself and counts as right', /答对了/.test(c3.why || '') && c3.right && c3.dis, JSON.stringify(c3));
  await p.keyboard.press('Enter'); await p.waitForTimeout(250);
  const cd = await text();
  st = await state();
  check('跟打 summary; practising does not clear the error book', /答对 1 \/ 1/.test(cd) && /跟打 · 错词本/.test(cd) && st.words[id(0)][6] === 1, cd.slice(0, 60));
  await p.click('[data-act="pracExit"]'); await p.waitForSelector('#prac-hub');

  // ---- 听写：不显示单词，只听
  await p.selectOption('#pscope', 'learned'); await p.waitForTimeout(200);
  const plays0 = await p.evaluate(() => window.__plays);
  await p.click('.pmode[data-m="dict"]'); await p.waitForSelector('#ptype-in'); await p.waitForTimeout(700);
  const d0 = await p.evaluate(() => ({ w: document.querySelector('.qprompt .bigplay').dataset.say, shown: document.querySelector('.session').innerText, plays: window.__plays, echo: !!document.querySelector('#pecho'), focus: document.activeElement && document.activeElement.id }));
  check('听写: the word is not shown, audio plays, input focused', !d0.shown.toLowerCase().includes(d0.w.toLowerCase()) && d0.plays > plays0 && !d0.echo && d0.focus === 'ptype-in', JSON.stringify({ w: d0.w, plays: d0.plays - plays0 }));
  await p.screenshot({ path: OUT + tag + '-dict.png' });
  await p.keyboard.type('zzz'); await p.keyboard.press('Enter'); await p.waitForTimeout(300);
  const d1 = await p.evaluate(() => ({ why: (document.querySelector('.why') || {}).textContent, wrong: !!document.querySelector('#ptype-in.wrong'), shown: (document.querySelector('.session b[lang="id"]') || {}).textContent }));
  check('听写: a wrong answer is marked and the word is shown', /答错了/.test(d1.why || '') && d1.wrong && d1.shown === d0.w, JSON.stringify(d1));
  const dWrongId = seed.ids[seed.w.indexOf(d0.w)];
  await p.click('[data-act="pracNext"]'); await p.waitForSelector('#ptype-in:not([disabled])'); await p.waitForTimeout(300);
  const w2 = await p.evaluate(() => document.querySelector('.qprompt .bigplay').dataset.say);
  await p.keyboard.type('  ' + w2.toUpperCase() + ' '); await p.click('.spell button[type="submit"]'); await p.waitForTimeout(300);
  check('听写: the right word is accepted regardless of case and stray spaces', !!(await p.$('#ptype-in.right')), w2);
  await p.click('[data-act="pracExit"]'); await p.waitForSelector('#prac-hub'); await p.waitForTimeout(200);
  st = await state();
  const wk = st.words[dWrongId];
  const lists2 = await p.evaluate(() => (document.querySelector('#lists-card') || {}).innerText || '');
  // 标了已掌握的词答错不进错词本
  const expectWeak = wk[8] === 1 ? 1 : (dWrongId === id(0) ? 1 : 2);
  check('a wrong answer in practice puts a learned word into the error book', new RegExp('错词本\\s*' + expectWeak + ' 个').test(lists2) && (wk[8] === 1 || wk[6] === 1 || wk[6] === 0), lists2.replace(/\s+/g, ' ').slice(0, 60));

  // ---- 今日学习：中途退出
  await p.goto(URL0 + '#home'); await p.waitForSelector('[data-act="flowStart"]'); await p.waitForTimeout(300);
  await p.click('[data-act="flowStart"]'); await p.waitForSelector('[data-act="reveal"]'); await p.waitForTimeout(300);
  const f0 = await text();
  check('today\'s session starts with the review', /今日学习/.test(f0) && /1\/4/.test(await p.evaluate(() => document.querySelector('.s-count').textContent.replace(/\s/g, ''))), f0.slice(0, 60));
  await p.click('[data-act="reveal"]'); await p.waitForTimeout(250); await p.click('[data-act="grade"][data-v="2"]'); await p.waitForTimeout(250);
  await p.click('[data-act="revExit"]'); await p.waitForTimeout(300);
  await p.goto(URL0 + '#home'); await p.waitForTimeout(400);
  const f1 = await text();
  check('leaving midway: home shows it in progress with 继续 and 结束', /今日学习 · 进行中/.test(f1) && !!(await p.$('[data-act="flowNext"]')) && !!(await p.$('[data-act="flowQuit"]')), f1.slice(0, 80));
  await p.click('[data-act="flowQuit"]'); await p.waitForTimeout(300);
  check('结束 returns to the plain start card', !!(await p.$('[data-act="flowStart"]')) && !(await p.$('[data-act="flowQuit"]')));

  // ---- 今日学习：完整走一遍
  await p.click('[data-act="flowStart"]'); await p.waitForSelector('.session'); await p.waitForTimeout(300);
  for (let k = 0; k < 20; k++) {
    if (await p.$('[data-act="flowNext"]')) break;
    if (await p.$('[data-act="reveal"]')) { await p.click('[data-act="reveal"]'); await p.waitForTimeout(200); await p.click('[data-act="grade"][data-v="2"]'); await p.waitForTimeout(200); }
    else if (await p.$('.qopt:not([disabled])')) { await p.locator('.qopt:not([disabled])').first().click(); await p.waitForTimeout(200); }
    else if (await p.$('[data-act="rqnext"]')) { await p.click('[data-act="rqnext"]'); await p.waitForTimeout(200); }
    else await p.waitForTimeout(150);
  }
  const fb1 = await p.evaluate(() => (document.querySelector('[data-act="flowNext"]') || {}).textContent);
  st = await state();
  const old1 = st.words[id(1)], w0 = st.words[id(0)];
  check('after the review the next step is offered: new words', fb1 === '下一步：学一组新词', String(fb1));
  check('old 6-field records are graded normally', old1.length === 8 && old1[0] === 3 && old1[1] === seed.t + 7 && old1[6] === 2, JSON.stringify(old1));
  check('grading 认识 in review removes the word from the error book', w0[6] === 2, JSON.stringify(w0));
  await p.screenshot({ path: OUT + tag + '-flow-next.png' });
  await p.click('[data-act="flowNext"]'); await p.waitForSelector('.session'); await p.waitForTimeout(400);
  // 学新词：一路点下去，小测随便答
  let studied = false;
  for (let k = 0; k < 60; k++) {
    if (await p.$('[data-act="flowNext"]')) { studied = true; break; }
    if (await p.$('.s-foot [data-act="next"]')) { await p.click('.s-foot [data-act="next"]'); await p.waitForTimeout(150); }
    else if (await p.$('[data-act="qnext"]')) { await p.click('[data-act="qnext"]'); await p.waitForTimeout(200); }
    else if (await p.$('.qopt:not([disabled])')) { await p.locator('.qopt:not([disabled])').first().click(); await p.waitForTimeout(250); }
    else if (await p.$('#spell-in:not([disabled])')) { await p.fill('#spell-in', 'x'); await p.keyboard.press('Enter'); await p.waitForTimeout(250); }
    else await p.waitForTimeout(250);
  }
  const fb2 = await p.evaluate(() => (document.querySelector('[data-act="flowNext"]') || {}).textContent);
  st = await state();
  const newToday = Object.keys(st.words).filter(x => st.words[x][5] === seed.t && st.words[x][0] > 0 && st.words[x][8] !== 1);
  check('after the new words the next step is offered: spelling', studied && fb2 === '下一步：默写今天学的词' && newToday.length === 4, fb2 + ' new=' + newToday.length);
  await p.click('[data-act="flowNext"]'); await p.waitForSelector('.pslots'); await p.waitForTimeout(300);
  const sp0 = await p.evaluate(() => ({ head: document.querySelector('.session .eyebrow').textContent, count: document.querySelector('.s-count').textContent, w: document.querySelector('.qprompt .say').dataset.say }));
  const newWords = newToday.map(x => p.evaluate(x => WORDS[x].w, x));
  const nw = await Promise.all(newWords);
  check('spelling step uses exactly the words learned today', /拼写挑战/.test(sp0.head) && sp0.count === '1/' + nw.length && nw.includes(sp0.w), JSON.stringify(sp0));
  for (let k = 0; k < 10; k++) {
    if (!(await p.$('.pslots'))) break;
    const w = await p.evaluate(() => document.querySelector('.qprompt .say').dataset.say);
    for (const c of w.toLowerCase().replace(/[^a-z]/g, '')) await p.keyboard.press(c);
    await p.waitForTimeout(150);
    await p.click('[data-act="pracNext"]'); await p.waitForTimeout(150);
  }
  const fb3 = await p.evaluate(() => (document.querySelector('[data-act="flowNext"]') || {}).textContent);
  const spd = await text();
  check('spelling done: last step offers to finish', fb3 === '完成今日学习' && new RegExp('答对 ' + nw.length + ' / ' + nw.length).test(spd) && /今天学的词/.test(spd), fb3 + ' | ' + spd.slice(0, 50));
  await p.click('[data-act="flowNext"]'); await p.waitForTimeout(400);
  const fin = await text();
  const route = await p.evaluate(() => location.hash);
  check('finishing returns home with a plain summary (no points, no levels)', route === '#home' && /今天这一轮做完了/.test(fin) && /新学 4 个词/.test(fin) && !/XP|经验值|积分/.test(fin), fin.slice(0, 80));
  await p.screenshot({ path: OUT + tag + '-flow-done.png' });
  const ov = await p.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  check('no horizontal overflow', ov <= 0, String(ov));

  // ---- 没有内容的步骤自动跳过
  st = await state();
  const dk = Object.keys(st.log)[0];
  const reseed = async (mut) => {
    await p.evaluate(([mut, t, dk]) => {
      const s = JSON.parse(localStorage.getItem('bukit.v1')), now = Date.now();
      Object.keys(s.words).forEach(k => { const w = s.words[k]; if (w[0] > 0 && w[8] !== 1) { w[1] = t + 5; w[7] = 0; if (mut !== 'today') w[5] = t - 3; } });
      s.log = {}; s.log[dk] = { n: mut === 'goal' ? 10 : 0, r: 0, s: 0 };
      localStorage.setItem('bukit.v1', JSON.stringify(s));
      Storage.prototype.setItem = function () {};
    }, [mut, seed.t, dk]);
    await p.reload(); await boot();
    return { txt: await text(), start: !!(await p.$('[data-act="flowStart"]')) };
  };
  const a1 = await reseed('nogoal');
  check('nothing due: the plan skips the review', a1.start && a1.txt.includes('学一组新词 → 默写今天学的词') && !a1.txt.includes('复习到期的词 →'), a1.txt.slice(0, 80));
  const a2 = await reseed('goal');
  check('nothing due and the daily goal met: no "today" card at all', !a2.start && !/今日学习/.test(a2.txt), a2.txt.slice(0, 60));

  check('device speech never used', (await p.evaluate(() => window.__tts)) === 0);
  if (OFF) check('no network requests', net.length === 0, net.slice(0, 3).join(' '));
  check('no page errors', errs.length === 0, errs.slice(0, 3).join(' | '));
  await b.close();
  console.log(fail.length ? 'FAILED: ' + fail.join('; ') : 'ALL FLOW CHECKS PASSED (' + (OFF ? 'offline' : 'online') + ')');
  process.exit(fail.length ? 1 : 0);
})().catch(e => { console.error('TEST CRASHED', e); process.exit(2); });
