// 语法速查表测试。用法：node test-ref.js <url> [offline]
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
  await p.goto(URL0 + '#learn'); await p.waitForSelector('#nav a[data-nav="learn"]'); await p.waitForTimeout(500);
  if (await p.$('[data-act="onbDone"]')) { await p.goto(URL0 + '#home'); await p.click('[data-act="onbDone"]'); await p.goto(URL0 + '#learn'); await p.waitForTimeout(300); }

  const link = await p.$eval('.reflink', e => e.textContent);
  check('lessons page has the reference entry', /语法速查表/.test(link) && /26 张/.test(link), link);
  await p.click('.reflink'); await p.waitForSelector('.refd'); await p.waitForTimeout(600);
  const page1 = await p.evaluate(() => ({ n: document.querySelectorAll('.refd').length, open: document.querySelectorAll('.refd[open]').length, groups: [...document.querySelectorAll('.h-sec')].map(h => h.textContent.trim()), nav: (document.querySelector('#nav a[aria-current="page"]') || {}).dataset.nav, titles: [...document.querySelectorAll('.refd summary b')].map(x => x.textContent) }));
  check('reference page lists 26 collapsed sheets in 3 groups, under 课程', page1.n === 26 && page1.open === 0 && page1.groups.length === 3 && page1.nav === 'learn', JSON.stringify(page1.groups));
  console.log('sheets:', page1.titles.join(' | '));
  await p.screenshot({ path: OUT + (OFF ? 'off' : 'on') + '-ref-list.png' });

  // 打开 me- 总表：四列，九行
  await p.click('#ref-me summary'); await p.waitForTimeout(300);
  const me = await p.evaluate(() => { const d = document.querySelector('#ref-me'); const t = d.querySelector('table'); return { open: d.open, head: [...t.querySelectorAll('th')].map(x => x.textContent), rows: t.querySelectorAll('tbody tr').length, tables: d.querySelectorAll('table').length, terms: d.querySelectorAll('.say-inline').length, row1: t.querySelector('tbody tr').innerText.replace(/\s+/g, ' ') }; });
  check('me- sheet: columns 词根开头 / 前缀 / 是否脱落 / 例子, 9 rows', me.open && me.head.join('|') === '词根开头|前缀|是否脱落|例子' && me.rows === 9 && me.tables === 2 && me.terms > 30, JSON.stringify(me).slice(0, 220));
  await p.locator('#ref-me').screenshot({ path: OUT + (OFF ? 'off' : 'on') + '-ref-me.png' });

  // 点表里的词：播放预先生成的音频，不用设备语音
  const tapAll = async (sheet, n) => {
    const loc = p.locator('#ref-' + sheet + ' .say-inline'); const cnt = await loc.count(); let ok = 0; const bad = [];
    for (let i = 0; i < Math.min(n, cnt); i++) {
      const k = Math.floor(i * cnt / Math.min(n, cnt));
      const before = await p.evaluate(() => window.__plays);
      await loc.nth(k).click(); await p.waitForTimeout(350);
      const after = await p.evaluate(() => window.__plays);
      if (after > before) ok++; else bad.push(await loc.nth(k).textContent());
    }
    return { ok, n: Math.min(n, cnt), bad };
  };
  const t1 = await tapAll('me', 12);
  check('tapping terms in the me- sheet plays packed audio', t1.ok === t1.n, JSON.stringify(t1));
  await p.click('#ref-nya summary'); await p.waitForTimeout(200);
  await p.locator('#ref-nya').screenshot({ path: OUT + (OFF ? 'off' : 'on') + '-ref-nya.png' });
  const t2 = await tapAll('nya', 10);
  check('tapping terms in the -nya sheet plays packed audio', t2.ok === t2.n, JSON.stringify(t2));
  await p.click('#ref-num summary'); await p.waitForTimeout(200);
  const t3 = await tapAll('num', 8);
  check('tapping terms in the numbers sheet plays packed audio', t3.ok === t3.n, JSON.stringify(t3));
  // 例句的播放按钮
  const exBtn = p.locator('#ref-nya .exs .ex .say').first();
  const b0 = await p.evaluate(() => window.__plays); await exBtn.click(); await p.waitForTimeout(500);
  check('example sentence in a sheet plays', (await p.evaluate(() => window.__plays)) > b0);

  // 每张表都能展开、没有空表、所有可点读的词都有音频
  const all = await p.evaluate(async off => {
    document.querySelectorAll('.refd').forEach(d => { d.open = true; });
    const empty = [...document.querySelectorAll('.refd')].filter(d => !d.querySelector('table')).map(d => d.id);
    const ragged = [...document.querySelectorAll('.refd table')].filter(t => { const n = t.querySelectorAll('th').length; return [...t.querySelectorAll('tbody tr')].some(r => r.children.length !== n); }).length;
    return { empty, ragged, terms: document.querySelectorAll('.refd .say-inline').length, tables: document.querySelectorAll('.refd table').length, overflow: document.documentElement.scrollWidth - window.innerWidth };
  }, OFF);
  check('every sheet has a table, no ragged rows, no horizontal overflow', all.empty.length === 0 && all.ragged === 0 && all.overflow <= 0, JSON.stringify(all));
  await p.screenshot({ path: OUT + (OFF ? 'off' : 'on') + '-ref-open.png' });

  // 直达链接：#ref-nya 打开对应的表
  await p.goto(URL0 + '#ref-nya'); await p.reload(); await p.waitForSelector('.refd'); await p.waitForTimeout(400);
  const deep = await p.evaluate(() => ({ open: [...document.querySelectorAll('.refd[open]')].map(d => d.id), top: Math.round(document.querySelector('#ref-nya').getBoundingClientRect().top) }));
  check('direct link opens that sheet and scrolls to it', deep.open.join() === 'ref-nya' && deep.top < 400, JSON.stringify(deep));

  // 语法卡片里有指向总表的链接；设置页有入口
  await p.goto(URL0 + '#t-daily'); await p.reload(); await p.waitForSelector('[data-act="deck"]'); await p.waitForTimeout(300);
  await p.click('[data-act="deck"] >> nth=0'); await p.waitForTimeout(300);
  const dl = await p.evaluate(() => { const a = document.querySelector('.sheet-panel .deck-ref a'); return a ? a.textContent + ' ' + a.getAttribute('href') : ''; });
  check('grammar card links to its reference sheet', /总表/.test(dl) && /#ref-/.test(dl), dl);
  if (dl) { await p.click('.sheet-panel .deck-ref a'); await p.waitForTimeout(400); check('following the link lands on the open sheet', (await p.evaluate(() => document.querySelectorAll('.refd[open]').length)) === 1); }
  await p.goto(URL0 + '#me'); await p.reload(); await p.waitForSelector('h1.h-page'); await p.waitForTimeout(300);
  check('settings page links to the reference', !!(await p.$('a[href="#ref"]')));

  check('device speech never used', (await p.evaluate(() => window.__tts)) === 0);
  if (OFF) check('no network requests', net.length === 0, net.slice(0, 3).join(' '));
  check('no page errors', errs.length === 0, errs.slice(0, 3).join(' | '));
  await b.close();
  console.log(fail.length ? 'FAILED: ' + fail.join('; ') : 'ALL REFERENCE CHECKS PASSED (' + (OFF ? 'offline' : 'online') + ')');
  process.exit(fail.length ? 1 : 0);
})().catch(e => { console.error('TEST CRASHED', e); process.exit(2); });
