// 学新词流程（每看 2 个词回想一次、易混词对比、最后一轮）、当天再见一次、易混词（单词卡、易混辨析、速查表）的测试。
// 默认测离线版；测在线版：node tools/test-study.js http://127.0.0.1:8765/bukit.html
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
    window.__tts = 0;
    try { const orig = speechSynthesis.speak.bind(speechSynthesis); speechSynthesis.speak = u => { window.__tts++; return orig(u); }; } catch (e) {}
  });
  const p = await ctx.newPage(); const errs = [], net = [];
  p.on('pageerror', e => errs.push(e.message));
  p.on('request', r => { const u = r.url(); if (OFF && !/^(file|data|blob):/.test(u)) net.push(u); });
  await p.route(/fonts\./, r => r.abort());
  const boot = async () => { await p.waitForSelector('#nav a[data-nav="learn"]'); await p.waitForTimeout(400); };
  await p.goto(URL0 + '#home'); await boot();
  // 已经学过 ayam（和 ayah 是易混词）和第 1 课的 4 个词；“家人”这一课还没学。这一课的语法卡片和文化贴士先标成看过，流程里只剩单词和答题
  const seed = await p.evaluate(() => {
    const t = Math.floor((Date.now() - new Date().getTimezoneOffset() * 6e4) / 864e5), now = Date.now(), words = {};
    words.ayam = [3, t + 5, now - 864e5, 2, 0, t - 9, 2, 0];
    TOPICS[0].words.slice(0, 4).forEach(w => { words[w.id] = [3, t + 5, now - 864e5, 2, 0, t - 9, 2, 0]; });
    const fam = TOPICS.find(x => x.id === 'family'), decks = {}, tips = {};
    Object.values(fam.anchors).forEach(d => { decks[d] = 1; });
    fam.tips.forEach((_, i) => { tips['family:' + i] = 1; });
    localStorage.setItem('bukit.v1', JSON.stringify({ words, log: {}, prefs: { goal: 10, batch: 8, interests: [], decks, tips, last: '', t: now }, saved: {}, flags: {} }));
    Storage.prototype.setItem = function () {};
    return { t, words: fam.words.slice(0, 8).map(w => w.id) };
  });
  await p.reload(); await boot();
  const state = async () => { await p.evaluate(() => { window.dispatchEvent(new Event('pagehide')); }); return p.evaluate(() => JSON.parse(localStorage.getItem('bukit.v1'))); };
  const text = () => p.evaluate(() => document.querySelector('#main').innerText.replace(/\s+/g, ' '));
  const tag = OFF ? 'off' : 'on';

  // ---- 走一遍学新词
  await p.goto(URL0 + '#t-family'); await p.waitForSelector('[data-act="study"]'); await p.waitForTimeout(300);
  await p.click('[data-act="study"][data-t="family"]'); await p.waitForSelector('.session'); await p.waitForTimeout(300);
  // 看当前是哪一步、正确答案是什么
  const where = () => p.evaluate(() => {
    const eb = (document.querySelector('.session .eyebrow') || {}).textContent || '';
    const pr = document.querySelector('.qprompt');
    let kind = 'word', right = null, opts = [];
    if (pr) {
      opts = [...document.querySelectorAll('.qopt')].map(o => o.dataset.v);
      if (document.querySelector('#spell-in')) { kind = 'spell'; right = pr.querySelector('.say').dataset.say; }
      else if (pr.querySelector('.bigplay')) { kind = 'listen'; const w = pr.querySelector('.bigplay').dataset.say; right = opts.find(v => WORDS[v].w === w); }
      else if (pr.querySelector('.w-word')) { kind = 'id2zh'; const w = pr.querySelector('.w-word').textContent; right = opts.find(v => WORDS[v].w === w); }
      else { kind = 'zh'; const z = pr.querySelector('.zh-big').textContent; right = opts.find(v => WORDS[v].zh === z); }
    }
    const step = /^新词/.test(eb) ? 'word' : /^回想刚学的词/.test(eb) ? 'check' : /^对比一下/.test(eb) ? 'cmp' : /^最后一轮/.test(eb) ? 'final' : /这一组完成了/.test(document.querySelector('#main').innerText) ? 'done' : 'other';
    return { eb, step, kind, right, opts, cmpT: (document.querySelector('.cfcard h3') || {}).textContent || '', word: step === 'word' ? document.querySelector('.wcard .w-word').textContent : '', ov: document.documentElement.scrollWidth - window.innerWidth };
  });
  const answer = async (q, correct) => {
    if (q.kind === 'spell') { await p.fill('#spell-in', correct ? q.right : 'zzz'); await p.keyboard.press('Enter'); }
    else { const v = correct ? q.right : q.opts.find(x => x !== q.right); await p.locator('.qopt[data-v="' + v.replace(/"/g, '\\"') + '"]').click(); }
    await p.waitForTimeout(150);
    if (await p.$('[data-act="qnext"]')) { await p.click('[data-act="qnext"]'); } else { await p.waitForTimeout(1100); }
    await p.waitForTimeout(150);
  };
  const log = [];
  let cmpLeak = false, wrongCheck = null, finalWrong = null, finalSeen = [], ayahOpts = null, shotCmp = false, maxOv = 0, checkSizes = [], cur = [];
  for (let n = 0; n < 80; n++) {
    const q = await where();
    maxOv = Math.max(maxOv, q.ov);
    if (q.step === 'done' || q.step === 'other') { log.push(q.step); break; }
    if (q.step === 'word') { log.push('W'); await p.click('.s-foot [data-act="next"]'); await p.waitForTimeout(150); continue; }
    if (q.step === 'check') {
      if (log[log.length - 1] !== 'C') { log.push('C'); checkSizes.push(0); }
      checkSizes[checkSizes.length - 1]++;
      cur.push({ right: q.right, eb: q.eb });
      if (q.right === 'ayah' || (q.kind === 'spell' && q.right === 'ayah')) ayahOpts = q.opts;
      if (!wrongCheck) { wrongCheck = q.right; await answer(q, false); continue; }
      await answer(q, true); continue;
    }
    if (q.step === 'cmp' && !q.right) {
      // 先看对比表，点“看好了，考一下”后表收起来出题
      log.push('M:' + q.cmpT);
      if (!shotCmp) { shotCmp = true; await p.screenshot({ path: OUT + tag + '-study-cmp.png', fullPage: true }); }
      await p.click('.s-foot [data-act="next"]'); await p.waitForTimeout(150);
      const hid = await p.evaluate(() => !document.querySelector('.cfcard') && !!document.querySelector('.qprompt'));
      if (!hid) cmpLeak = true;
      continue;
    }
    if (!q.right) throw new Error('看不出正确答案 ' + JSON.stringify(q));
    if (q.step === 'cmp') {
      await answer(q, true);
      continue;
    }
    if (q.step === 'final') {
      if (log[log.length - 1] !== 'F') log.push('F');
      finalSeen.push({ id: q.right, re: /再来一次/.test(q.eb), kind: q.kind });
      if (!finalWrong && q.kind === 'spell') { finalWrong = q.right; await answer(q, false); continue; }
      if (finalWrong && q.right === finalWrong && /再来一次/.test(q.eb)) { await answer(q, false); continue; }
      await answer(q, true); continue;
    }
  }
  await p.screenshot({ path: OUT + tag + '-study-done.png', fullPage: true });
  const seq = log.filter(x => !x.startsWith('M:')).join('');
  check('8 words, a recall after every 2, then one final round', seq === 'WWCWWCWWCWWCF' + 'done', seq);
  // 第一次回想故意答错的词，出现在第二次回想里
  const second = cur.slice(checkSizes[0], checkSizes[0] + checkSizes[1]);
  check('a word missed in a recall comes back in the next recall', checkSizes[0] === 2 && second.some(x => x.right === wrongCheck && /刚才答错的/.test(x.eb)) && checkSizes[1] === 3, JSON.stringify({ checkSizes, wrongCheck }));
  check('recall questions use the confusable word as a distractor (ayah ↔ ayam)', !!ayahOpts && ayahOpts.includes('ayam'), JSON.stringify(ayahOpts));
  const cmps = log.filter(x => x.startsWith('M:'));
  check('compare cards: the table is hidden while the question is asked', !cmpLeak);
  check('compare cards: ayah/ayam (learned before) and the family set (both in this group), at most 2', cmps.length === 2 && cmps.includes('M:ayah / ayam') && cmps.includes('M:哥姐、弟妹、爷爷、奶奶'), cmps.join(' '));
  const firstFinal = finalSeen.filter(x => !x.re).map(x => x.id);
  check('final round asks all 8 words once, spelling where possible, and repeats a miss at the end', firstFinal.length === 8 && finalSeen.some(x => x.kind === 'spell') && finalSeen[finalSeen.length - 1].re && finalSeen[finalSeen.length - 1].id === finalWrong, JSON.stringify(finalSeen.map(x => x.id + (x.re ? '*' : ''))));
  const done = await text();
  check('summary shows recall count and marks the word missed twice as 没记牢', /一共回想 \d+ 次/.test(done) && /没记牢/.test(done) && /以后会在复习里再出现一次/.test(done), done.slice(0, 160));
  check('no horizontal overflow during the session', maxOv <= 0, String(maxOv));

  // ---- 记录：当天再见一次
  let st = await state();
  const recs = seed.words.map(id => st.words[id]);
  const now = Date.now();
  const okNew = seed.words.filter(id => id !== finalWrong).map(id => st.words[id]).filter(r => r && r[0] === 1 && r[1] === seed.t && r[5] === seed.t && r[6] === 3 && r[7] > now + 2.8 * 3600e3 && r[7] < now + 3.2 * 3600e3);
  check('all 8 learned; the 7 recalled ones come back in about 3 hours', okNew.length === 7 && recs.every(r => r && r[0] === 1), JSON.stringify(recs.slice(0, 2)));
  const weakRec = st.words[finalWrong];
  check('the word missed twice in the final round is marked weak and comes back in 10 minutes', weakRec[6] === 1 && weakRec[7] > now + 8 * 60e3 && weakRec[7] < now + 11 * 60e3, JSON.stringify(weakRec));
  await p.goto(URL0 + '#review'); await p.waitForTimeout(400);
  const rv = await text();
  check('review page: new words are listed as coming back later, the weak one as waiting 10 minutes, none due now', /今天新学的词/.test(rv) && /7 个词\d\d:\d\d以后回到复习里再看一次/.test(rv.replace('明天 ', '')) && /等待再考/.test(rv) && rv.includes(finalWrong) && !/个词到期/.test(rv), (rv.match(/今天新学的词[^：]*/) || [''])[0]);
  // 3 小时后
  await p.evaluate(() => { const o = Date.now.bind(Date); Date.now = () => o() + 3.1 * 3600e3; });
  await p.evaluate(() => { location.hash = 'home'; }); await p.waitForTimeout(300);
  await p.evaluate(() => { location.hash = 'review'; }); await p.waitForTimeout(400);
  const rv2 = await text();
  check('three hours later the 8 words are due', /8 个词到期/.test(rv2), (rv2.match(/\d+ 个词到期/) || [''])[0]);
  await p.click('[data-act="revStart"]'); await p.waitForSelector('[data-act="reveal"]'); await p.waitForTimeout(200);
  const ids = [];
  for (let k = 0; k < 8; k++) {
    if (await p.$('.qopts')) { await p.locator('.qopt').first().click(); await p.waitForTimeout(150); await p.click('[data-act="rqnext"]').catch(() => {}); await p.waitForTimeout(150); }
    if (!(await p.$('[data-act="reveal"]'))) break;
    await p.click('[data-act="reveal"]'); await p.waitForTimeout(150);
    await p.click('[data-act="grade"][data-v="' + (k === 0 ? 0 : 2) + '"]'); await p.waitForTimeout(150);
  }
  st = await state();
  const after = seed.words.map(id => [id, st.words[id]]);
  const known = after.filter(([id, r]) => r[6] === 2);
  const again = after.filter(([id, r]) => r[6] === 0);
  check('“认识” on the same-day revisit: due tomorrow at level 1, not weak; “不认识”: back in 10 minutes', known.length >= 6 && known.every(([id, r]) => r[0] === 1 && r[1] === seed.t + 1 && r[7] === 0) && again.length === 1 && again[0][1][7] > Date.now() && again[0][1][1] === seed.t, JSON.stringify(after.slice(0, 3)));

  // ---- 单词卡上的易混词
  await p.evaluate(() => { location.hash = 't-family'; }); await p.waitForSelector('.wrow-main'); await p.waitForTimeout(300);
  await p.click('.wrow-main[data-id="kakak"]'); await p.waitForSelector('#sheet .w-cf'); await p.waitForTimeout(200);
  const cf = await p.evaluate(() => ({ groups: [...document.querySelectorAll('#sheet .cfg .cft b')].map(x => x.textContent), links: [...document.querySelectorAll('#sheet .cfw')].map(x => x.dataset.id) }));
  await p.locator('#sheet .sheet-panel').screenshot({ path: OUT + tag + '-word-cf.png' });
  check('word card shows up to 2 confusable groups, spelling first', cf.groups.length === 2 && cf.groups[0] === 'kakak / kakek' && cf.links.includes('kakek') && cf.links.includes('adik'), JSON.stringify(cf));
  await p.click('#sheet .cfw[data-id="kakek"]'); await p.waitForTimeout(300);
  check('tapping a confusable word opens its word card', (await p.evaluate(() => document.querySelector('#sheet .w-word').textContent)) === 'kakek');
  await p.keyboard.press('Escape'); await p.waitForTimeout(200);

  // ---- 易混辨析
  await p.evaluate(() => { location.hash = 'review'; }); await p.waitForTimeout(300);
  if (await p.$('[data-act="revExit"]')) { await p.click('[data-act="revExit"]'); await p.waitForTimeout(200); }
  await p.waitForSelector('#prac-hub'); await p.waitForTimeout(200);
  await p.selectOption('#pscope', 'all'); await p.waitForTimeout(200);
  const modes = await p.evaluate(() => [...document.querySelectorAll('.pmode:not(.smode) b')].map(x => x.textContent));
  check('practice has 10 word modes including 易混辨析', modes.length === 10 && modes.includes('易混辨析'), modes.join('/'));
  await p.click('.pmode[data-m="cf"]'); await p.waitForSelector('.cloze'); await p.waitForTimeout(250);
  let cfOk = 0, cfN = 0, sameGroup = 0;
  for (let k = 0; k < 12; k++) {
    if (!(await p.$('.cloze'))) break;
    const q = await p.evaluate(() => {
      const opts = [...document.querySelectorAll('.qopt')].map(o => o.dataset.v), z = document.querySelector('.ex-zh').textContent, s = document.querySelector('.cloze').textContent;
      const right = opts.find(v => WORDS[v].ex.some(e => e.zh === z && e.id.replace(/\[[^\]]+\]/g, '') === s));
      const grp = CONFUSE.some(g => opts.every(v => g.w.some(x => x[0] === v)));
      return { opts, right, grp };
    });
    cfN++; if (q.grp) sameGroup++;
    await p.locator('.qopt[data-v="' + q.right.replace(/"/g, '\\"') + '"]').click(); await p.waitForTimeout(150);
    if (await p.$('.why') && /答对了/.test(await p.evaluate(() => document.querySelector('.why').textContent))) cfOk++;
    if (k === 0) { await p.screenshot({ path: OUT + tag + '-prac-cf.png', fullPage: true }); }
    const hasTable = await p.$('.cfcard .cfrow');
    if (!hasTable) cfOk -= 100;
    await p.click('[data-act="pracNext"]'); await p.waitForTimeout(150);
  }
  const cd = await text();
  check('易混辨析: 10 cloze questions, options are always one confusable group, explanation shown after answering', cfN === 10 && sameGroup === 10 && cfOk === 10 && /答对 10 \/ 10/.test(cd), cfN + ' ' + sameGroup + ' ' + cfOk);
  await p.click('[data-act="pracExit"]'); await p.waitForTimeout(200);

  // ---- 速查表
  await p.evaluate(() => { location.hash = 'ref'; }); await p.waitForTimeout(400);
  const ref = await p.evaluate(() => ({ ids: ['cf-s', 'cf-c', 'cf-u'].map(id => !!document.getElementById('ref-' + id)), h: [...document.querySelectorAll('#main h2')].map(x => x.textContent) }));
  await p.click('#ref-cf-u summary'); await p.waitForTimeout(200);
  const refRows = await p.evaluate(() => document.querySelectorAll('#ref-cf-u .refc').length);
  const ov = await p.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  check('reference page has the three confusable sheets', ref.ids.every(Boolean) && ref.h.some(x => /易混词/.test(x)) && refRows >= 10 && ov <= 0, JSON.stringify({ ids: ref.ids, refRows, ov }));

  check('device speech never used', (await p.evaluate(() => window.__tts)) === 0);
  if (OFF) check('no network requests', net.length === 0, net.slice(0, 3).join(' '));
  check('no page errors', errs.length === 0, errs.slice(0, 3).join(' | '));
  await b.close();
  console.log(fail.length ? 'FAILED: ' + fail.join('; ') : 'ALL STUDY CHECKS PASSED (' + (OFF ? 'offline' : 'online') + ')');
  process.exit(fail.length ? 1 : 0);
})().catch(e => { console.error('TEST CRASHED', e); process.exit(2); });
