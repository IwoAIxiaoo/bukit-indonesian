// 自由练习测试（选择、拼写、填空、模拟；跟打和听写在 test-flow.js 里）。默认测离线版；测在线版：node tools/test-practice.js http://127.0.0.1:8765/bukit.html
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
  await p.goto(URL0 + '#home'); await p.waitForSelector('#nav a[data-nav="learn"]'); await p.waitForTimeout(500);
  // 造 12 个已学的词（都没到期）
  const seed = await p.evaluate(() => {
    const t = Math.floor((Date.now() - new Date().getTimezoneOffset() * 6e4) / 864e5), now = Date.now(), words = {};
    const ws = TOPICS[0].words.slice(0, 12);
    ws.forEach(w => { words[w.id] = [3, t + 5, now - 864e5, 2, 0, t - 9, 2, 0]; });
    localStorage.setItem('bukit.v1', JSON.stringify({ words, log: {}, prefs: { goal: 10, batch: 8, interests: [], decks: {}, tips: {}, last: '', t: now }, saved: {}, flags: {} }));
    Storage.prototype.setItem = function () {};
    return { t, ids: ws.map(w => w.id), topic6: TOPICS[5].id, topic6words: TOPICS[5].words.map(w => w.w) };
  });
  await p.reload(); await p.waitForSelector('#nav a[data-nav="learn"]'); await p.waitForTimeout(400);
  const save = () => p.evaluate(() => { window.dispatchEvent(new Event('pagehide')); });
  const state = () => p.evaluate(() => JSON.parse(localStorage.getItem('bukit.v1')));

  check('home has the practice entry', !!(await p.$('[data-act="pracHub"]')));
  await p.click('[data-act="pracHub"]'); await p.waitForSelector('#prac-hub'); await p.waitForTimeout(300);
  const hub = await p.evaluate(() => ({ modes: [...document.querySelectorAll('.pmode:not(.smode) b')].map(x => x.textContent), opts: document.querySelectorAll('#pscope option').length, sel: document.querySelector('#pscope').value, xp: /XP|经验值|等级/.test(document.querySelector('#main').innerText) }));
  check('hub: 10 modes, scope list (learned + error book + favourites + all + 31 lessons), no XP or levels', hub.modes.length === 10 && hub.opts === 35 && hub.sel === 'learned' && !hub.xp, hub.modes.join(' / '));
  await p.locator('#prac-hub').screenshot({ path: OUT + (OFF ? 'off' : 'on') + '-prac-hub.png' });

  // 读出当前题目的正确答案（按题型）
  const info = () => p.evaluate(() => {
    const head = (document.querySelector('.session .eyebrow') || {}).textContent || '';
    const pr = document.querySelector('.qprompt'); if (!pr) return { head, none: true };
    const opts = [...document.querySelectorAll('.qopt')].map(o => o.dataset.v);
    const slots = document.querySelector('.pslots');
    let right = null, kind = '';
    if (slots) { kind = 'spell'; right = pr.querySelector('.say').dataset.say; }
    else if (pr.querySelector('.bigplay')) { kind = 'listen'; const w = pr.querySelector('.bigplay').dataset.say; right = opts.find(v => WORDS[v].w === w); }
    else if (pr.querySelector('.cloze')) { kind = 'fill'; const z = pr.querySelector('.ex-zh').textContent, s = pr.querySelector('.cloze').textContent; right = opts.find(v => WORDS[v].ex.some(e => e.zh === z && e.id.replace(/\[[^\]]+\]/g, '') === s)); }
    else if (pr.querySelector('.w-word')) { kind = 'id2zh'; const w = pr.querySelector('.w-word').textContent; right = opts.find(v => WORDS[v].w === w); }
    else { kind = 'zh2id'; const z = pr.querySelector('.zh-big').textContent; right = opts.find(v => WORDS[v].zh === z); }
    return { head, kind, opts, right, count: document.querySelector('.s-count').textContent, timer: (document.querySelector('#ptimer') || {}).textContent || '', word: kind === 'spell' ? right : (WORDS[right] || {}).w };
  });
  const answer = async (correct, byKeys) => {
    const q = await info();
    if (!q.right) throw new Error('看不出正确答案：' + JSON.stringify(q) + ' | ' + (await p.evaluate(() => document.querySelector('#main').innerText.replace(/\s+/g, ' ').slice(0, 200))));
    if (q.kind === 'spell') {
      const letters = q.right.toLowerCase().replace(/[^a-z]/g, '').split('');
      const seq = correct ? letters : letters.slice().reverse();
      if (byKeys) for (const c of seq) await p.keyboard.press(c);
      else for (const c of seq) { await p.locator('.ptile:not([disabled]):not(.back)', { hasText: new RegExp('^' + c + '$') }).first().click(); }
    } else {
      const v = correct ? q.right : q.opts.find(x => x !== q.right);
      await p.locator('.qopt[data-v="' + v.replace(/"/g, '\\"') + '"]').click();
    }
    await p.waitForTimeout(120);
    return q;
  };
  const runMode = async (mode, wrongAt) => {
    await p.click('.pmode[data-m="' + mode + '"]'); await p.waitForSelector('.session'); await p.waitForTimeout(250);
    const seen = [];
    for (let k = 0; k < 20; k++) {
      if (!(await p.$('.qprompt'))) break;
      const q = await answer(k !== wrongAt, k % 2 === 1);
      seen.push(q);
      const nx = await p.$('[data-act="pracNext"]'); if (nx) { await nx.click(); await p.waitForTimeout(120); }
    }
    return { seen, done: await p.evaluate(() => document.querySelector('#main').innerText.replace(/\s+/g, ' ')) };
  };

  // 1) 单词卡
  await p.click('.pmode[data-m="cards"]'); await p.waitForSelector('.pcard'); await p.waitForTimeout(700);
  const c1 = await p.evaluate(() => ({ word: (document.querySelector('.pcard .w-word') || {}).textContent, zh: !!document.querySelector('.pcard .zh-big'), plays: window.__plays, count: document.querySelector('.s-count').textContent }));
  await p.click('.pcard'); await p.waitForTimeout(200);
  const c2 = await p.evaluate(() => ({ zh: (document.querySelector('.pcard .zh-big') || {}).textContent, ex: document.querySelectorAll('.session .exs .ex').length }));
  await p.screenshot({ path: OUT + (OFF ? 'off' : 'on') + '-prac-card.png' });
  check('word cards: front shows the word and reads it, tap flips to meaning and examples', !!c1.word && !c1.zh && c1.plays >= 1 && /^1\/12$/.test(c1.count) && !!c2.zh && c2.ex >= 2, JSON.stringify([c1, c2]));
  await p.keyboard.press('ArrowRight'); await p.waitForTimeout(150); await p.keyboard.press('ArrowLeft'); await p.waitForTimeout(150);
  for (let k = 0; k < 12; k++) { const nx = await p.$('[data-act="pracNext"]'); if (!nx) break; await nx.click(); await p.waitForTimeout(60); }
  const cd = await p.evaluate(() => document.querySelector('#main').innerText.replace(/\s+/g, ' '));
  check('word cards finish with a plain summary', /看完了 12 张单词卡/.test(cd), cd.slice(0, 80));
  await p.click('[data-act="pracExit"]'); await p.waitForSelector('#prac-hub');

  // 2) 看词选义：故意错第 1 题
  const before = await state();
  const r1 = await runMode('id2zh', 0);
  await save(); const after = await state();
  const wid = r1.seen[0].right, sb = before.words[wid], sa = after.words[wid];
  const logR = Object.values(after.log).reduce((a, x) => a + (x.r || 0), 0);
  check('看词选义: 10 questions, all of the right type, the answer is among 4 options', r1.seen.length === 10 && r1.seen.every(q => q.kind === 'id2zh' && q.opts.length === 4 && !!q.right), r1.seen.map(q => q.kind).join(','));
  check('summary: 9 of 10, the missed word is listed', /答对 9 \/ 10/.test(r1.done) && r1.done.includes(r1.seen[0].word), r1.done.slice(0, 120));
  check('a wrong answer only marks the word weak; level and due date unchanged; answers counted in the daily log', sa[6] === 1 && sa[0] === sb[0] && sa[1] === sb[1] && logR === 10, JSON.stringify({ sb, sa, logR }));
  await p.screenshot({ path: OUT + (OFF ? 'off' : 'on') + '-prac-done.png' });
  await p.click('[data-act="pracRetry"]'); await p.waitForSelector('.qprompt'); await p.waitForTimeout(200);
  const retry = await info();
  check('retry contains only the missed word', /^1\/1$/.test(retry.count) && retry.right === wid, JSON.stringify(retry).slice(0, 120));
  await answer(true); await p.click('[data-act="pracNext"]'); await p.waitForTimeout(150);
  await p.click('[data-act="pracExit"]'); await p.waitForSelector('#prac-hub');

  // 3) 其余几种选择题，全部答对
  for (const [mode, name] of [['zh2id', '看义选词'], ['listen', '听音选义'], ['fill', '句子填空']]) {
    const plays0 = await p.evaluate(() => window.__plays);
    const r = await runMode(mode, -1);
    const plays1 = await p.evaluate(() => window.__plays);
    check(name + ': 10 questions of that type, all answered right', r.seen.length === 10 && r.seen.every(q => q.kind === mode && !!q.right) && /答对 10 \/ 10/.test(r.done) && /全部答对/.test(r.done) && (mode !== 'listen' || plays1 - plays0 >= 10), r.done.slice(0, 60));
    if (mode === 'fill') await p.screenshot({ path: OUT + (OFF ? 'off' : 'on') + '-prac-fill-done.png' });
    await p.click('[data-act="pracExit"]'); await p.waitForSelector('#prac-hub');
  }

  // 4) 拼写挑战：点字母和键盘都能拼；拼错有提示
  await p.click('.pmode[data-m="spell"]'); await p.waitForSelector('.pslots'); await p.waitForTimeout(300);
  const s0 = await p.evaluate(() => ({ slots: document.querySelectorAll('.pslot').length, tiles: document.querySelectorAll('.ptile:not(.back)').length, word: document.querySelector('.qprompt .say').dataset.say, shown: document.querySelector('.session').innerText }));
  const letters = s0.word.replace(/[^a-z]/gi, '').length;
  check('spelling: one slot per letter, tiles = letters + 3 extra, the word itself is not shown', s0.slots === letters && s0.tiles === letters + 3 && !s0.shown.toLowerCase().includes(s0.word.toLowerCase()), JSON.stringify({ slots: s0.slots, tiles: s0.tiles, word: s0.word }));
  await p.screenshot({ path: OUT + (OFF ? 'off' : 'on') + '-prac-spell.png' });
  // 先点一个字母再退格
  await p.locator('.ptile:not([disabled]):not(.back)').first().click(); await p.waitForTimeout(80);
  const on1 = await p.evaluate(() => document.querySelectorAll('.pslot.on').length);
  await p.click('.ptile.back'); await p.waitForTimeout(80);
  const on0 = await p.evaluate(() => document.querySelectorAll('.pslot.on').length);
  check('backspace removes the last letter', on1 === 1 && on0 === 0);
  await answer(false, false);
  const sw = await p.evaluate(() => ({ wrong: !!document.querySelector('.pslots.wrong'), why: (document.querySelector('.why') || {}).textContent, shown: (document.querySelector('.session b[lang="id"]') || {}).textContent }));
  check('wrong spelling is marked and the correct word is shown', sw.wrong && /答错了/.test(sw.why || '') && sw.shown === s0.word, JSON.stringify(sw));
  await p.click('[data-act="pracNext"]'); await p.waitForTimeout(150);
  let spellOk = 0, spellN = 0;
  for (let k = 0; k < 20; k++) {
    if (!(await p.$('.pslots'))) break;
    await answer(true, k % 2 === 0); spellN++;
    if (await p.$('.pslots.right')) spellOk++;
    await p.click('[data-act="pracNext"]'); await p.waitForTimeout(120);
  }
  const sd = await p.evaluate(() => document.querySelector('#main').innerText.replace(/\s+/g, ' '));
  check('spelling: tiles and keyboard both work, summary counts them', spellN === 9 && spellOk === 9 && /答对 9 \/ 10/.test(sd), spellOk + '/' + spellN + ' | ' + sd.slice(0, 40));
  await p.click('[data-act="pracExit"]'); await p.waitForSelector('#prac-hub');

  // 5) 模拟挑战：15 题混合、有倒计时、不逐题讲解
  await p.click('.pmode[data-m="mock"]'); await p.waitForSelector('.qprompt'); await p.waitForTimeout(300);
  const kinds = []; let timer0 = '', feedback = false;
  for (let k = 0; k < 15; k++) {
    const q = await answer(true, true); kinds.push(q.kind); if (k === 0) timer0 = q.timer;
    if (k < 14 && await p.$('.why')) feedback = true;
    await p.waitForTimeout(60);
  }
  const md = await p.evaluate(() => document.querySelector('#main').innerText.replace(/\s+/g, ' '));
  check('mock: 15 mixed questions with a countdown from 10:00 and no per-question feedback', kinds.length === 15 && new Set(kinds).size >= 4 && /^(10:00|9:5\d)$/.test(timer0) && !feedback, [...new Set(kinds)].join(',') + ' timer ' + timer0);
  check('mock summary shows score and time used', /答对 15 \/ 15/.test(md) && /用时 0:\d\d/.test(md), md.slice(0, 80));
  await p.click('[data-act="pracStart"]'); await p.waitForSelector('.qprompt'); await p.waitForTimeout(300);
  for (let k = 0; k < 3; k++) { await answer(true, true); await p.waitForTimeout(60); }
  await p.evaluate(() => { const o = Date.now.bind(Date); Date.now = () => o() + 11 * 60000; });
  await p.waitForFunction(() => /时间到/.test(document.querySelector('#main').innerText), null, { timeout: 5000 }).catch(() => {});
  const mt = await p.evaluate(() => document.querySelector('#main').innerText.replace(/\s+/g, ' '));
  check('mock ends by itself when time runs out; unanswered questions count as wrong', /时间到/.test(mt) && /答对 3 \/ 15/.test(mt), mt.slice(0, 80));
  await p.evaluate(() => { location.reload(); }); await p.waitForSelector('#nav a[data-nav="learn"]'); await p.waitForTimeout(400);

  // 6) 换范围：只练第 6 课
  await p.goto(URL0 + '#review'); await p.waitForSelector('#prac-hub'); await p.waitForTimeout(200);
  await p.selectOption('#pscope', seed.topic6); await p.waitForTimeout(200);
  const r6 = await runMode('id2zh', -1);
  check('scope: questions come only from the chosen lesson', r6.seen.length === 10 && r6.seen.every(q => seed.topic6words.includes(q.word)), r6.seen.map(q => q.word).slice(0, 4).join(', '));
  await p.click('[data-act="pracExit"]'); await p.waitForSelector('#prac-hub');
  const ov = await p.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  check('no horizontal overflow', ov <= 0, String(ov));
  check('device speech never used', (await p.evaluate(() => window.__tts)) === 0);
  if (OFF) check('no network requests', net.length === 0, net.slice(0, 3).join(' '));
  check('no page errors', errs.length === 0, errs.slice(0, 3).join(' | '));
  await b.close();
  console.log(fail.length ? 'FAILED: ' + fail.join('; ') : 'ALL PRACTICE CHECKS PASSED (' + (OFF ? 'offline' : 'online') + ')');
  process.exit(fail.length ? 1 : 0);
})().catch(e => { console.error('TEST CRASHED', e); process.exit(2); });
