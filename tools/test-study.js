// 学新词流程（先听例句、每 2 个词在句子里拼写一次、易混词对比、最后一轮 = 第一次 FSRS 复习）、易混词（单词卡、干扰项、易混辨析、速查表）的测试。
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
    const pr = document.querySelector('.qprompt'), rc = document.querySelector('.rev-card');
    let kind = 'word', right = null, opts = [];
    if (rc) { kind = 'rev'; right = WORDS[rc.dataset.w].w; }
    else if (pr) {
      opts = [...document.querySelectorAll('.qopt')].map(o => o.dataset.v);
      if (document.querySelector('#spell-in')) { kind = 'ctx'; right = WORDS[pr.dataset.w].w; }
      else { kind = 'zh'; right = pr.dataset.w; }
    }
    const done = /这一组完成了/.test(document.querySelector('#main').innerText);
    const step = done ? 'done' : rc ? (document.querySelector('[data-act="revNext"]') ? 'revres' : 'final') : /^新词/.test(eb) ? 'word' : /^回想刚学的词/.test(eb) ? 'check' : /^对比一下/.test(eb) ? (pr ? 'cmpq' : 'cmp') : 'other';
    return { eb, step, kind, right, opts, cmpT: (document.querySelector('.cfcard h3') || {}).textContent || '', id: rc ? rc.dataset.w : pr ? pr.dataset.w : '', ctx: !!document.querySelector('.ctx-card'), forms: (document.querySelector('.wcard .w-forms') || {}).textContent || '', word: (document.querySelector('.wcard .w-word') || {}).textContent || '', again: rc ? /再来一次/.test(rc.innerText) : false, ov: document.documentElement.scrollWidth - window.innerWidth };
  });
  const log = [], checks = [], finals = [], words = [];
  let wrongCheck = null, skipFinal = null, shotCmp = false, shotWord = false, maxOv = 0, ctxSay = null, kakakForms = '', cmpLeak = false;
  for (let n = 0; n < 90; n++) {
    const q = await where();
    maxOv = Math.max(maxOv, q.ov);
    if (q.step === 'done' || q.step === 'other') { log.push(q.step === 'other' ? 'other:' + q.eb + ':' + (await text()).slice(0, 80) : q.step); break; }
    if (q.step === 'word') {
      log.push('W'); words.push(q);
      if (q.word === 'kakak') kakakForms = q.forms;
      if (!shotWord) { shotWord = true; ctxSay = await p.evaluate(() => (document.querySelector('.ctx-card .bigplay') || {}).dataset ? document.querySelector('.ctx-card .bigplay').dataset.say : ''); await p.screenshot({ path: OUT + tag + '-study-word.png', fullPage: true }); }
      await p.click('.s-foot [data-act="next"]', { timeout: 5000 }).catch(async e => { console.log('DEBUG word step:', JSON.stringify(q).slice(0, 300), (await text()).slice(0, 200)); await p.screenshot({ path: OUT + 'debug-word.png', fullPage: true }); throw e; }); await p.waitForTimeout(150); continue;
    }
    if (q.step === 'check') {
      if (log[log.length - 1] !== 'C') { log.push('C'); checks.push([]); }
      checks[checks.length - 1].push({ id: q.id, kind: q.kind, carried: /刚才答错的/.test(q.eb) });
      const ok = !!wrongCheck;
      if (!wrongCheck) wrongCheck = q.id;
      if (q.kind === 'ctx') { await p.fill('#spell-in', ok ? q.right : 'zzz'); await p.keyboard.press('Enter'); }
      else await p.locator('.qopt[data-v="' + (ok ? q.right : q.opts.find(x => x !== q.right)) + '"]').click();
      await p.waitForTimeout(150);
      if (await p.$('[data-act="qnext"]')) await p.click('[data-act="qnext"]'); else await p.waitForTimeout(1100);
      await p.waitForTimeout(150); continue;
    }
    if (q.step === 'cmp') {
      log.push('M:' + q.cmpT);
      if (!shotCmp) { shotCmp = true; await p.screenshot({ path: OUT + tag + '-study-cmp.png', fullPage: true }); }
      await p.click('.s-foot [data-act="next"]'); await p.waitForTimeout(150);
      if (await p.$('.cfcard')) cmpLeak = true;
      continue;
    }
    if (q.step === 'cmpq') {
      await p.locator('.qopt[data-v="' + q.right + '"]').click(); await p.waitForTimeout(150);
      await p.click('[data-act="qnext"]'); await p.waitForTimeout(150); continue;
    }
    if (q.step === 'final') {
      if (log[log.length - 1] !== 'F') log.push('F');
      finals.push({ id: q.id, again: q.again });
      if (!skipFinal && !q.again) { skipFinal = q.id; await p.click('[data-act="revSkip"]'); }
      else { await p.fill('#rev-in', q.right); await p.keyboard.press('Enter'); }
      await p.waitForTimeout(150); continue;
    }
    if (q.step === 'revres') { await p.click('[data-act="revNext"]'); await p.waitForTimeout(150); continue; }
  }
  await p.screenshot({ path: OUT + tag + '-study-done.png', fullPage: true });
  const seq = log.filter(x => !x.startsWith('M:')).join('');
  check('8 words, a contextual spelling check after every 2, then the final round on the review card', seq === 'WWCWWCWWCWWCF' + 'done', seq);
  check('each new word starts with its example sentence (read aloud first), then the word card', words.every(w => w.ctx) && !!ctxSay && ctxSay.toLowerCase().includes('keluarga'), ctxSay);
  check('word card shows the colloquial form (kakak → kak)', /口语\s*kak/.test(kakakForms), kakakForms);
  const second = checks[1] || [];
  check('checks are typed cloze sentences; a word missed in one comes back in the next', checks.every(c => c.every(x => x.kind === 'ctx')) && checks[0].length === 2 && second.some(x => x.id === wrongCheck && x.carried) && second.length === 3, JSON.stringify(checks.map(c => c.length)));
  const cmps = log.filter(x => x.startsWith('M:'));
  check('compare cards: the table is hidden while the question is asked', !cmpLeak);
  check('compare cards: ayah/ayam (learned before) and the family set (both in this group), at most 2', cmps.length === 2 && cmps.includes('M:ayah / ayam') && cmps.includes('M:哥姐、弟妹、爷爷、奶奶'), cmps.join(' '));
  const firstFinal = finals.filter(x => !x.again).map(x => x.id);
  check('final round: all 8 words once on the review card, the skipped one again at the end', firstFinal.length === 8 && new Set(firstFinal).size === 8 && finals[finals.length - 1].again && finals[finals.length - 1].id === skipFinal, JSON.stringify(finals.map(x => x.id + (x.again ? '*' : ''))));
  const done = await text();
  check('summary: 8 new words with their ratings and next review', /这一组完成了/.test(done) && /\+8/.test(done) && /极熟练 \d · 认识 \d · 模糊 \d · 不认识 1/.test(done) && /明天复习/.test(done), done.slice(0, 200));
  check('no horizontal overflow during the session', maxOv <= 0, String(maxOv));

  // ---- 记录：最后一轮就是第一次 FSRS 复习，没有“3 小时后再见”
  let st = await state();
  const recs = seed.words.map(id => [id, st.words[id]]);
  const bad = recs.filter(([id, r]) => !r || !Array.isArray(r[10]) || r[10][3] !== 2 || r[10][4] !== 1 || r[5] !== seed.t || r[7] !== 0 || (id === skipFinal ? (r[1] !== seed.t + 1 || r[6] !== 0) : (r[1] < seed.t + 1 || r[6] !== 2)));
  check('final round = first FSRS review: Review cards, skipped word due tomorrow and weak, the rest later and not weak', bad.length === 0, JSON.stringify(bad.slice(0, 2)));
  await p.evaluate(() => { location.hash = 'home'; }); await p.waitForTimeout(200);
  await p.evaluate(() => { location.hash = 'review'; }); await p.waitForTimeout(400);
  const rv = await text();
  check('review page: nothing due today and no “come back in 3 hours” list', /复习/.test(rv) && !!rv.match(/今日复习/) && !/个词到期/.test(rv) && !/今天新学的词/.test(rv) && !/以后回到复习里再看一次/.test(rv), rv.slice(0, 160));

  // ---- 选择题干扰项优先用易混词：只练收藏的 ayah，看义选词
  await p.evaluate(() => { const s = JSON.parse(localStorage.getItem('bukit.v1')); return s; });
  await p.click('#nav a[data-nav="learn"]'); await p.waitForTimeout(200);
  await p.goto(URL0 + '#t-family'); await p.waitForSelector('.wrow-main'); await p.waitForTimeout(200);
  await p.click('.wrow-main[data-id="ayah"]'); await p.waitForSelector('#sheet [data-act="fav"]'); await p.click('#sheet [data-act="fav"]'); await p.waitForTimeout(150); await p.keyboard.press('Escape');
  await p.evaluate(() => { location.hash = 'review'; }); await p.waitForSelector('#prac-hub'); await p.waitForTimeout(200);
  await p.selectOption('#pscope', 'fav'); await p.waitForTimeout(200);
  await p.click('.warm summary'); await p.waitForTimeout(100);
  await p.click('.pmode[data-m="zh2id"]'); await p.waitForSelector('.qopt'); await p.waitForTimeout(200);
  const ayahOpts = await p.evaluate(() => [...document.querySelectorAll('.qopt')].map(o => o.dataset.v));
  check('multiple-choice distractors include the confusable word (ayah ↔ ayam)', ayahOpts.includes('ayah') && ayahOpts.includes('ayam'), JSON.stringify(ayahOpts));
  await p.click('[data-act="pracExit"]'); await p.waitForTimeout(200);

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
