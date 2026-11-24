// 收集课程里所有需要发音的文本，输出 texts.json：[{key, text, pack}]
const fs = require('fs'), vm = require('vm');
const SRC = (process.env.BUKIT_ROOT || require('path').join(__dirname, '..')) + '/src/';   // 默认：tools/ 的上一级；脚本放在别处时用 BUKIT_ROOT 指定
const code = ['pre.js', 'content-1.js', 'content-2.js', 'content-3.js', 'content-4.js', 'content-5.js', 'content-6.js', 'grammar.js', 'ref.js', 'pron.js', 'reading.js', 'dialogue-1.js', 'dialogue-2.js', 'dialogue-3.js'].map(f => fs.readFileSync(SRC + f, 'utf8')).join('\n')
  + '\n;globalThis.__out = { TOPICS, DECKS, ALPHABET, RULES, PAIRS, REFS, READS, READ_GLOSS, DIALOGS };';
const ctx = { console }; vm.createContext(ctx); vm.runInContext(code, ctx);
const { TOPICS, DECKS, ALPHABET, RULES, PAIRS, REFS, READS, READ_GLOSS, DIALOGS } = ctx.__out;
const key = t => String(t).toLowerCase().replace(/[\[\]«»“”"]/g, '').replace(/\s+/g, ' ').trim();
const plain = t => String(t).replace(/[\[\]«»]/g, '');
const items = new Map();
function hash(x) { let h = 5381; x = String(x); for (let i = 0; i < x.length; i++) h = ((h << 5) + h + x.charCodeAt(i)) | 0; return (h >>> 0).toString(36); }
const add = (text, pack, slow) => {
  const k = key(text); if (!k) return;
  let it = items.get(k);
  if (!it) { it = { key: k, id: hash(k), text: plain(text).trim(), packs: [], slow: false }; items.set(k, it); }
  if (!it.packs.includes(pack)) it.packs.push(pack);
  if (slow) it.slow = true;
};
const inline = (s, pack) => { String(s || '').replace(/«(.+?)»/g, (m, x) => { add(x, pack, true); return m; }); };
const deckTopic = {};
TOPICS.forEach(t => Object.values(t.anchors).forEach(d => { deckTopic[d] = t.id; }));
// 各课：单词（带慢速版）、例句、文化贴士里的点读词、挂在这一课的语法卡片
TOPICS.forEach(t => {
  t.words.forEach(w => { add(w.w, t.id, true); w.ex.forEach(e => add(e.id, t.id)); });
  t.tips.forEach(x => inline(x.b, t.id));
});
Object.values(DECKS).forEach(d => {
  const p = deckTopic[d.id] || 'core';
  d.cards.forEach(c => { inline(c.p, p); (c.t || []).forEach(r => r.forEach(cell => inline(cell, p))); (c.ex || []).forEach(e => add(e[0], p)); });
  d.quiz.forEach(q => { inline(q.q, p); inline(q.why, p); });
});
// 发音页（允许和课程重复，发音页只需加载这一个包）
ALPHABET.forEach(a => { add(a[1], 'core', true); add(a[4], 'core', true); });
RULES.forEach(r => r.w.forEach(x => add(x[0], 'core', true)));
PAIRS.forEach(p => { add(p[0], 'core', true); add(p[2], 'core', true); });
['Selamat pagi', 'Selamat siang', 'Selamat sore', 'Selamat malam', 'Halo, apa kabar?', 'Selamat datang di Indonesia. Senang bertemu dengan Anda.'].forEach(t => add(t, 'core'));
// 语法速查表：放在最后，已有的词仍然先算在原来的课里，只有新词才只属于 ref 包
// 课程里已经有的词不重复装进 ref 包（点到时再加载它所在那一课的包），ref 包只装新词
const refAdd = (text, slow) => { if (!items.has(key(text))) add(text, 'ref', slow); };
const refInline = s => { String(s || '').replace(/«(.+?)»/g, (m, x) => { refAdd(x, true); return m; }); };
REFS.forEach(r => r.cards.forEach(c => { refInline(c.p); refInline(c.n); (c.t || []).forEach(row => row.forEach(refInline)); (c.ex || []).forEach(e => refAdd(e[0], false)); }));
// 短文阅读：和速查表一样只装新内容，按难度分三个包（read-a / read-b / read-c）；句子和标题是整句，生词带 slow 标记走单词的做法
const readAdd = (text, pack, slow) => { if (!items.has(key(text))) add(text, pack, slow); };
READS.forEach(r => { const p = 'read-' + r.lv; readAdd(r.t, p, false); r.s.forEach(x => readAdd(x[1], p, false)); r.g.forEach(g => readAdd(g[0], p, true)); });
READ_GLOSS.forEach(g => readAdd(g[0], 'read-a', true));
// 每课的短对话：第 1–10 课、11–21 课、22–31 课各一个包（dlg-1 / dlg-2 / dlg-3），只装新句子，不带慢读版
const dlgPack = topic => { const i = TOPICS.findIndex(t => t.id === topic); return 'dlg-' + (i < 10 ? 1 : i < 21 ? 2 : 3); };
DIALOGS.forEach(d => d.s.forEach(x => readAdd(x[1], dlgPack(d.topic), false)));
const arr = [...items.values()];
fs.writeFileSync(__dirname + '/texts.json', JSON.stringify(arr));
const packs = {}; arr.forEach(x => x.packs.forEach(p => { packs[p] = (packs[p] || 0) + 1; }));
const ids = new Set(arr.map(x => x.id)); if (ids.size !== arr.length) throw new Error('hash collision');
console.log('unique texts:', arr.length, 'slow variants:', arr.filter(x => x.slow).length, 'chars:', arr.reduce((a, x) => a + x.text.length, 0));
console.log(JSON.stringify(packs));
const odd = arr.filter(x => /[^a-z\s'\-.,!?;:]/.test(x.key)).map(x => x.text);
if (0) console.log('needs normalizing (' + odd.length + '):\n' + odd.join('\n'));
