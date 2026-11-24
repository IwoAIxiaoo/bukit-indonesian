// 复习打字卡测试：挖空短句出题、打字作答、客观自动评分（evaluateAttempt）、FSRS 排程、本轮错题队列。
// 默认测离线版；测在线版：node tools/test-recall.js http://127.0.0.1:8765/bukit.html
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
    // 用 window.__shift 模拟“过了多久”：作答前加几秒就是“想了这么久”
    window.__shift = +(sessionStorage.getItem('shift') || 0);
    const o = Date.now.bind(Date); Date.now = () => o() + window.__shift;
    window.__tts = 0;
    try { const orig = speechSynthesis.speak.bind(speechSynthesis); speechSynthesis.speak = u => { window.__tts++; return orig(u); }; } catch (e) {}
  });
  const p = await ctx.newPage(); const errs = [], net = [];
  p.on('pageerror', e => errs.push(e.message));
  p.on('request', r => { const u = r.url(); if (OFF && !/^(file|data|blob):/.test(u)) net.push(u); });
  await p.route(/fonts\./, r => r.abort());
  const boot = async () => { await p.waitForSelector('#nav a[data-nav="learn"]'); await p.waitForTimeout(400); };
  await p.goto(URL0 + '#home'); await boot();
  // 20 个今天到期的旧记录（没有 FSRS 卡片，测换算）：tidak 上次不认识，排第一；一个旧的 6 项记录；还有一个 2 天后到期的
  const seed = await p.evaluate(() => {
    const t = Math.floor((Date.now() - new Date().getTimezoneOffset() * 6e4) / 864e5), now = Date.now(), old = now - 2 * 864e5;
    const ws = TOPICS[0].words.concat(TOPICS[1].words).filter(w => w.id !== 'tidak' && /^[a-z]+$/i.test(w.w)).slice(0, 19);
    const words = {};
    words.tidak = [2, t, old, 3, 1, t - 20, 0, 0];
    ws.forEach((w, k) => { words[w.id] = k === 0 ? [1, t - 3, old, 2, 0, t - 20] : [2 + (k % 3), t, old, 2 + k % 4, 0, t - 20, 2, 0]; });
    words[TOPICS[2].words[0].id] = [3, t + 2, old, 2, 0, t - 20, 2, 0];
    localStorage.setItem('bukit.v1', JSON.stringify({ words, log: {}, prefs: { goal: 10, batch: 8, interests: [], decks: {}, tips: {}, last: '', t: now }, saved: {}, flags: {} }));
    Storage.prototype.setItem = function () {};
    return { t, old6: ws[0].id };
  });
  await p.reload(); await boot();
  const rec = async () => { await p.evaluate(() => window.dispatchEvent(new Event('pagehide'))); return p.evaluate(() => JSON.parse(localStorage.getItem('bukit.v1')).words); };
  const card = () => p.evaluate(() => {
    const c = document.querySelector('.rev-card'); if (!c) return null;
    const w = WORDS[c.dataset.w];
    return { id: w.id, w: w.w, letters: (w.w.match(/\p{L}/gu) || []).length, blank: !!c.querySelector('.blank'), shown: c.innerText.toLowerCase().includes(w.w.toLowerCase()), input: !!document.querySelector('#rev-in'), again: /再来一次/.test(c.innerText), count: document.querySelector('.s-count').textContent };
  });
  const result = () => p.evaluate(() => { const r = document.querySelector('.rev-res'); return r ? { txt: r.innerText.replace(/\s+/g, ' '), cls: r.className } : null; });
  const answer = async (text) => { await p.fill('#rev-in', text); await p.keyboard.press('Enter'); await p.waitForTimeout(200); };
  const think = ms => p.evaluate(ms => { window.__shift += ms; }, ms);

  // ---- 复习页和首页：没有自评按钮
  const land = await p.evaluate(() => { location.hash = 'review'; return null; }).then(() => p.waitForTimeout(300)).then(() => p.evaluate(() => document.querySelector('#main').innerText.replace(/\s+/g, ' ')));
  check('review page explains automatic rating and FSRS; 20 due', /自动|不用自己评分/.test(land) && /FSRS/.test(land) && /20 个词到期/.test(land), land.slice(0, 120));
  await p.click('[data-act="revStart"]'); await p.waitForSelector('.rev-card'); await p.waitForTimeout(200);

  // 1) tidak：上次不认识，排第一；打口语形式 gak，又快又对
  let c = await card();
  const ui = await p.evaluate(() => ({ grades: document.querySelectorAll('[data-act="grade"], .grades').length, reveal: !!document.querySelector('[data-act="reveal"]'), hint: !!document.querySelector('[data-act="revHint"]'), skip: !!document.querySelector('[data-act="revSkip"]') }));
  check('card: cloze sentence with a blank, the word itself hidden, a text box, 提示 and 看答案; no self-grading buttons', c.id === 'tidak' && c.blank && !c.shown && c.input && ui.hint && ui.skip && !ui.grades && !ui.reveal, JSON.stringify([c, ui]));
  await p.screenshot({ path: OUT + (OFF ? 'off' : 'on') + '-recall-front.png' });
  await answer('gak');
  let r = await result();
  check('colloquial form counts as right, with the standard spelling shown; fast → 4 极熟练', /口语说法/.test(r.txt) && /tidak/.test(r.txt) && /极熟练/.test(r.txt) && /4 分/.test(r.txt), r.txt);
  await p.screenshot({ path: OUT + (OFF ? 'off' : 'on') + '-recall-back.png', fullPage: true });
  await p.keyboard.press('Enter'); await p.waitForTimeout(200);

  const plan = [];   // 记下每张卡怎么答的，最后核对记录
  // 2) 用提示 → 2
  c = await card(); await p.click('[data-act="revHint"]'); await p.waitForTimeout(100);
  const hintTxt = await p.evaluate(() => (document.querySelector('.rev-hint') || {}).textContent || '');
  await answer(c.w); r = await result();
  check('hint shows the first letter and length; using it → 2 模糊', /首字母/.test(hintTxt) && /模糊/.test(r.txt) && /用了提示/.test(r.txt), hintTxt + ' | ' + r.txt);
  plan.push([c.id, 2]); await p.click('[data-act="revNext"]'); await p.waitForTimeout(200);
  // 3) 错一次再对 → 2
  c = await card(); await answer('zzzz');
  const why = await p.evaluate(() => (document.querySelector('.why') || {}).textContent || '');
  await answer(c.w); r = await result();
  check('first wrong answer: try again message; right on the 2nd try → 2', /再试一次/.test(why) && /模糊/.test(r.txt) && /第 2 次/.test(r.txt), why + ' | ' + r.txt);
  plan.push([c.id, 2]); await p.click('[data-act="revNext"]'); await p.waitForTimeout(200);
  // 4) 想得久（扣除打字补偿后 > 10 秒）→ 2
  c = await card(); await think(c.letters * 300 + 12000); await answer(c.w); r = await result();
  check('slow (over 10 s after the typing allowance) → 2', /模糊/.test(r.txt) && /想了比较久/.test(r.txt), r.txt);
  plan.push([c.id, 2]); await p.click('[data-act="revNext"]'); await p.waitForTimeout(200);
  // 5) 正常速度 → 3
  c = await card(); await think(c.letters * 300 + 7000); await answer(c.w); r = await result();
  check('normal speed (7 s after the allowance) → 3 认识', /认识（3 分/.test(r.txt), r.txt);
  plan.push([c.id, 3]); await p.click('[data-act="revNext"]'); await p.waitForTimeout(200);
  // 6) 看答案 → 1，排到本轮末尾
  c = await card(); const skipId = c.id; await p.click('[data-act="revSkip"]'); await p.waitForTimeout(200); r = await result();
  check('看答案 → 1 不认识, next review tomorrow, again at the end of this round', /不认识/.test(r.txt) && /看了答案/.test(r.txt) && /明天/.test(r.txt) && /最后再考一次/.test(r.txt), r.txt);
  plan.push([c.id, 1]); await p.click('[data-act="revNext"]'); await p.waitForTimeout(200);
  // 7) 错两次 → 自动给答案，1
  c = await card(); const twiceId = c.id; await answer('zzzz'); await answer('yyyy'); r = await result();
  const shownAfter = await p.evaluate(() => (document.querySelector('.rev-card .w-word') || {}).textContent);
  check('two wrong answers → answer shown automatically, 1', /不认识/.test(r.txt) && /拼错了 1 次|两次都不对/.test(r.txt) && shownAfter === c.w, r.txt);
  plan.push([c.id, 1]); await p.click('[data-act="revNext"]'); await p.waitForTimeout(200);
  // 8) 旧 6 项记录也能复习：卡片会轮到它，正常答对
  // 其余的都正常速度答对；第 10 张后插一道选择题
  let quiz = null;
  for (let k = 0; k < 30; k++) {
    if (await p.$('.qopts .qopt:not([disabled])') && !(await p.$('.rev-card'))) {
      quiz = quiz || await p.evaluate(() => ({ head: document.querySelector('.session .eyebrow:last-of-type') ? document.querySelector('.session').innerText : '', n: document.querySelectorAll('.qopt').length }));
      // 选对：听音题按读的词找，填空题按例句找（答错会把那个词标成没记牢，影响后面的核对）
      const right = await p.evaluate(() => {
        const opts = [...document.querySelectorAll('.qopt')].map(o => o.dataset.v), say = document.querySelector('.qprompt .bigplay'), cz = document.querySelector('.qprompt .cloze');
        if (say) return opts.find(v => WORDS[v].w === say.dataset.say);
        if (cz) { const z = document.querySelector('.qprompt .ex-zh').textContent, t = cz.textContent; return opts.find(v => WORDS[v].ex.some(e => e.zh === z && e.id.replace(/\[[^\]]+\]/g, '') === t)); }
        const ww = document.querySelector('.qprompt .w-word'); return opts.find(v => ww && WORDS[v].w === ww.textContent);
      });
      await p.locator('.qopt[data-v="' + String(right).replace(/"/g, '\\"') + '"]').click(); await p.waitForTimeout(150); await p.click('[data-act="rqnext"]'); await p.waitForTimeout(150); continue;
    }
    c = await card(); if (!c) break;
    if (c.again) break;   // 到了本轮末尾的错题
    await think(c.letters * 300 + 7000); await answer(c.w);
    plan.push([c.id, 3]); await p.click('[data-act="revNext"]'); await p.waitForTimeout(150);
  }
  check('a multiple-choice question is still mixed in after 10 cards', !!quiz && /选择题/.test(quiz.head) && quiz.n === 4, JSON.stringify(quiz).slice(0, 80));
  // 本轮末尾：两个 1 分的词再练一次，不改记录
  let w0 = await rec();
  const again = [];
  for (let k = 0; k < 3; k++) {
    c = await card(); if (!c || !c.again) break;
    again.push(c.id); await answer(c.w); r = await result();
    if (!/这次只练/.test(r.txt)) again.push('graded!');
    await p.click('[data-act="revNext"]'); await p.waitForTimeout(150);
  }
  let w1 = await rec();
  check('end of round: the two missed words come back once, practice only (records unchanged)', again.length === 2 && again.includes(skipId) && again.includes(twiceId) && JSON.stringify(w0[skipId]) === JSON.stringify(w1[skipId]) && JSON.stringify(w0[twiceId]) === JSON.stringify(w1[twiceId]), JSON.stringify(again));
  const done = await p.evaluate(() => document.querySelector('#main').innerText.replace(/\s+/g, ' '));
  const counts = { 4: 1, 3: plan.filter(x => x[1] === 3).length, 2: 3, 1: 2 };
  check('summary: 20 words in four ratings, missed words listed', /复习了 20 个词/.test(done) && done.includes('极熟练 1 · 认识 ' + counts[3] + ' · 模糊 3 · 不认识 2') && /明天会再复习/.test(done), done.slice(0, 160));
  await p.screenshot({ path: OUT + (OFF ? 'off' : 'on') + '-recall-done.png', fullPage: true });

  // ---- 记录
  const t = seed.t;
  const all = [['tidak', 4]].concat(plan);
  const bad = all.filter(([id, g]) => { const s = w1[id]; return !Array.isArray(s[10]) || s[10].length !== 9 || s[6] !== (g === 1 ? 0 : g === 2 ? 1 : 2) || s[7] !== 0 || (g === 1 ? s[1] !== t + 1 : s[1] < t + 1); });
  check('every reviewed word now has an FSRS card (item 10) and updated old fields', bad.length === 0 && all.length === 20, JSON.stringify(bad.slice(0, 2).map(([id]) => [id, w1[id]])));
  check('old 6-item record was converted and reviewed', Array.isArray(w1[seed.old6][10]) && w1[seed.old6][3] === 3, JSON.stringify(w1[seed.old6]));
  const lapsed = w1[skipId];
  check('a 1-rating counts a lapse and lowers the level', lapsed[4] === 1 && lapsed[0] <= 2, JSON.stringify(lapsed));

  // ---- 再过一遍没想起来的：练习，不改 FSRS
  await p.click('[data-act="revMissed"]'); await p.waitForSelector('.rev-card'); await p.waitForTimeout(150);
  c = await card(); await answer(c.w); r = await result();
  const w2 = await rec();
  check('“再过一遍” is practice: no rating saved', /这次只练/.test(r.txt) && JSON.stringify(w2[c.id]) === JSON.stringify(w1[c.id]), r.txt);
  await p.click('[data-act="revExit"]'); await p.waitForTimeout(200);

  // ---- 早复习：没到期的词也能用 FSRS 排
  await p.evaluate(() => { location.hash = 'home'; }); await p.waitForTimeout(200); await p.evaluate(() => { location.hash = 'review'; }); await p.waitForTimeout(300);
  const soon = await p.$('[data-act="revSoon"]');
  check('early review is still offered for words due soon', !!soon);

  const ov = await p.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  check('no horizontal overflow', ov <= 0, String(ov));
  check('device speech never used', (await p.evaluate(() => window.__tts)) === 0);
  if (OFF) check('no network requests', net.length === 0, net.slice(0, 3).join(' '));
  check('no page errors', errs.length === 0, errs.slice(0, 3).join(' | '));
  await b.close();
  console.log(fail.length ? 'FAILED: ' + fail.join('; ') : 'ALL RECALL CHECKS PASSED (' + (OFF ? 'offline' : 'online') + ')');
  process.exit(fail.length ? 1 : 0);
})().catch(e => { console.error('TEST CRASHED', e); process.exit(2); });
