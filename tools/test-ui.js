// 整套界面测试（需要先在项目根目录运行 python3 tools/serve.py）
const { chromium } = require('playwright');
const OUT = require('path').join(__dirname, 'shots') + '/'; require('fs').mkdirSync(OUT, { recursive: true });
(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 });
  await ctx.addInitScript(() => { try { if (/[?&]mkdue\b/.test(location.search)) { const orig = Storage.prototype.getItem; let done = false; Storage.prototype.getItem = function (k) { const v = orig.call(this, k); if (k !== 'bukit.v1' || done || !v) return v; done = true; const o = JSON.parse(v); const t = Math.floor((Date.now() - new Date().getTimezoneOffset() * 6e4) / 864e5); Object.values(o.words).forEach(s => { s[1] = t; s[7] = 0; }); o.log['2026-11-01'] = { n: 5, r: 12, s: 600 }; o.log['2026-11-03'] = { n: 8, r: 3, s: 300 }; o.log['2026-10-20'] = { n: 3, r: 30, s: 900 }; o.log['2026-09-12'] = { n: 10, r: 4, s: 900 }; o.log['2026-11-07'] = { n: 6, r: 18, s: 1200 }; return JSON.stringify(o); }; } } catch (e) {} });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push('pageerror: ' + e.message));
  page.on('console', m => { if (m.type() === 'error' && !/ERR_FAILED|fonts/.test(m.text())) errors.push('console: ' + m.text()); });
  await page.route(/fonts\.(googleapis|gstatic)\.com/, r => r.abort());
  await page.goto('http://127.0.0.1:8765/bukit.html');
  await page.waitForTimeout(400);

  // 内容完整性
  const stats = await page.evaluate(() => {
    const words = Object.values(WORDS);
    const lt2 = words.filter(w => w.ex.length < 2).map(w => w.topic + ':' + w.w);
    const noMark = [];
    words.forEach(w => w.ex.forEach(e => { if (!/\[[^\]]+\]/.test(e.id)) noMark.push(w.w + ' | ' + e.id); }));
    const dupIds = words.filter(w => w.id.includes('@')).map(w => w.id);
    const deckMissing = []; TOPICS.forEach(t => Object.values(t.anchors).forEach(d => { if (!DECKS[d]) deckMissing.push(t.id + ':' + d); }));
    const unusedDecks = Object.keys(DECKS).filter(d => !TOPICS.some(t => Object.values(t.anchors).includes(d)));
    const badPos = words.filter(w => !['n','v','adj','adv','pron','num','cl','prep','conj','q','intj','phr','part','neg','aux'].includes(w.pos)).map(w => w.w + ':' + w.pos);
    const exCount = words.reduce((a, w) => a + w.ex.length, 0);
    const tips = TOPICS.reduce((a, t) => a + t.tips.length, 0);
    const perTopic = TOPICS.map(t => t.id + '=' + t.words.length).join(' ');
    return { topics: TOPICS.length, words: words.length, exCount, tips, decks: Object.keys(DECKS).length, lt2, noMark, dupIds, deckMissing, unusedDecks, badPos, perTopic };
  });
  console.log(JSON.stringify(stats));

  const shot = async (name) => { await page.waitForTimeout(250); await page.screenshot({ path: OUT + name + '.png', fullPage: false }); };
  await shot('m-home');
  await page.click('[data-act="interest"][data-v="site"]');
  await page.click('[data-act="onbDone"]');
  // 课程列表
  await page.click('#nav a[data-nav="learn"]'); await shot('m-learn');
  await page.fill('#q', 'makan'); await page.waitForTimeout(150);
  const sr = await page.$$eval('#search-res .wrow', r => r.length); console.log('search makan ->', sr);
  await page.fill('#q', '');
  // 主题页
  await page.goto('http://127.0.0.1:8765/bukit.html#t-greet'); await page.waitForTimeout(300); await shot('m-topic');
  // 单词弹层
  await page.click('.wrow-main >> nth=0'); await shot('m-word-sheet');
  await page.click('.sheet-bar [data-act="closeSheet"]');
  // 学习一组
  await page.click('[data-act="study"]');
  let guard = 0, idle = 0;
  while (guard++ < 160) {
    if (await page.$('.s-foot [data-act="next"], .qopt:not([disabled]), #spell-in:not([disabled]), [data-act="qnext"]')) idle = 0;   // 只数连续没东西可点的次数
    const st = await page.evaluate(() => { const s = window.__s; return null; });
    const hasNext = await page.$('.s-foot [data-act="next"]');
    if (hasNext) {
      const kind = await page.evaluate(() => document.querySelector('.deck') ? 'deck' : document.querySelector('.wcard') ? 'word' : document.querySelector('.tipcard') ? 'tip' : '?');
      if (guard < 4) await shot('m-study-' + guard + '-' + kind);
      if (kind === 'deck') { await shot('m-study-deck'); await page.click('.deck [data-act="dnext"]'); await page.waitForTimeout(400); }
      await page.click('.s-foot [data-act="next"]');
      continue;
    }
    const opt = await page.$('.qopt:not([disabled])');
    if (opt) {
      if (!(await page.$('#shot-quiz-done'))) { await shot('m-quiz'); await page.evaluate(() => { const d = document.createElement('i'); d.id = 'shot-quiz-done'; d.hidden = true; document.body.appendChild(d); }); }
      // 选正确答案或错误答案交替
      const correct = await page.evaluate(() => null);
      await opt.click(); await page.waitForTimeout(1100);
      const qn = await page.$('[data-act="qnext"]'); if (qn) await qn.click();
      continue;
    }
    const sp = await page.$('#spell-in:not([disabled])');
    if (sp) { await sp.fill('salah'); await page.click('.spell button[type=submit]'); await page.waitForTimeout(200); const qn = await page.$('[data-act="qnext"]'); if (qn) await qn.click(); continue; }
    const qn = await page.$('[data-act="qnext"]'); if (qn) { await qn.click(); continue; }
    if (await page.$('.done-big') || ++idle > 6) break;
    await page.waitForTimeout(400);
  }
  await shot('m-study-done');
  const learned = await page.evaluate(() => Object.keys(JSON.parse(localStorage.getItem('bukit.v1')).words).length);
  console.log('learned after session:', learned);
  // 让这些词今天到期，测试复习
  await page.goto('http://127.0.0.1:8765/bukit.html?mkdue=1#review'); await page.waitForSelector('[data-act="revStart"]'); await page.waitForTimeout(500); await shot('m-review-start');
  await page.click('[data-act="revStart"]'); await shot('m-review-front');
  await page.click('[data-act="reveal"]'); await shot('m-review-back');
  for (let i = 0; i < 12; i++) { const g = await page.$('[data-act="grade"][data-v="2"]'); if (!g) { const r = await page.$('[data-act="reveal"]'); if (r) { await r.click(); continue; } break; } await g.click(); await page.waitForTimeout(80); }
  await shot('m-review-done');
  await page.click('#nav a[data-nav="pron"]'); await shot('m-pron');
  await page.click('.ltile >> nth=2'); await page.waitForTimeout(100);
  await page.click('[data-act="pairNew"]'); await page.click('[data-act="pairPick"] >> nth=0'); await page.waitForTimeout(100);
  await page.click('#nav a[data-nav="stats"]'); await page.waitForTimeout(300); await shot('m-stats');
  await page.screenshot({ path: OUT + 'm-stats-full.png', fullPage: true });
  await page.goto('http://127.0.0.1:8765/bukit.html#me'); await page.reload(); await page.waitForTimeout(300); await page.screenshot({ path: OUT + 'm-me-full.png', fullPage: true });
  await page.goto('http://127.0.0.1:8765/bukit.html#home'); await page.reload(); await page.waitForTimeout(300); await page.screenshot({ path: OUT + 'm-home-full.png', fullPage: true });
  // 横向溢出检查
  for (const h of ['home', 'learn', 't-coal', 'review', 'pron', 'stats', 'me']) {
    await page.goto('http://127.0.0.1:8765/bukit.html#' + h); await page.reload(); await page.waitForTimeout(250);
    const ov = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    if (ov > 0) console.log('OVERFLOW', h, ov);
  }
  // 桌面 + 深色
  const d = await browser.newContext({ viewport: { width: 1280, height: 860 }, colorScheme: 'dark' });
  const p2 = await d.newPage();
  p2.on('pageerror', e => errors.push('desktop pageerror: ' + e.message));
  await p2.route(/fonts\.(googleapis|gstatic)\.com/, r => r.abort());
  await p2.goto('http://127.0.0.1:8765/bukit.html#t-metal'); await p2.waitForTimeout(400);
  await p2.screenshot({ path: OUT + 'd-topic-dark.png' });
  await p2.click('[data-act="deck"] >> nth=0'); await p2.waitForTimeout(300);
  await p2.screenshot({ path: OUT + 'd-deck-dark.png' });
  await p2.keyboard.press('Escape');
  await p2.goto('http://127.0.0.1:8765/bukit.html#home'); await p2.waitForTimeout(300);
  await p2.screenshot({ path: OUT + 'd-home-dark.png' });
  console.log('ERRORS:', errors.length ? errors.join('\n') : 'none');
  await browser.close();
})().catch(e => { console.error('TEST FAILED', e); process.exit(1); });
