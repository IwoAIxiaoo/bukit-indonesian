// 检查短文（src/reading.js）：每个词点下去能不能查到。列出查不到的词，以及靠去词缀猜出词根的词（要人工看一眼意思对不对）。
// 用法：node tools/check-reading.js [-v]
const fs = require('fs'), vm = require('vm'), path = require('path');
const SRC = path.join(process.env.BUKIT_ROOT || path.join(__dirname, '..'), 'src') + '/';
const files = ['pre.js', 'content-1.js', 'content-2.js', 'content-3.js', 'content-4.js', 'content-5.js', 'content-6.js', 'reading.js', 'lookup.js'];
const code = files.map(f => fs.readFileSync(SRC + f, 'utf8')).join('\n') + '\n;globalThis.__out = { TOPICS, READS, READ_GLOSS, READ_NAMES, READ_LEVELS, lexTokens, lexKey, lookupToken };';
const ctx = { console }; vm.createContext(ctx); vm.runInContext(code, ctx);
const { TOPICS, READS, READ_GLOSS, READ_NAMES, READ_LEVELS, lexTokens, lexKey, lookupToken } = ctx.__out;
const V = process.argv.includes('-v');
const lex = new Map();
TOPICS.forEach(t => t.words.forEach(w => { const k = lexKey(w.w); if (!lex.has(k)) lex.set(k, w); }));
const all = new Map();
READ_GLOSS.forEach(g => all.set(lexKey(g[0]), g));
READS.forEach(r => r.g.forEach(g => { if (!all.has(lexKey(g[0]))) all.set(lexKey(g[0]), g); }));
let bad = 0, sent = 0, toks = 0;
const roots = new Map(), unusedAll = [], ids = new Set();
READS.forEach(r => {
  if (ids.has(r.id)) { console.log('重复的 id', r.id); bad++; } ids.add(r.id);
  if (!READ_LEVELS.some(l => l[0] === r.lv)) { console.log('难度不对', r.id); bad++; }
  if (r.s.length < 6 || r.s.length > 10) { console.log('句数不在 6–10 之间', r.id, r.s.length); bad++; }
  const own = new Map(r.g.map(g => [lexKey(g[0]), g]));
  const dict = { gloss: k => own.get(k) || all.get(k) || null, word: k => lex.get(k) || null, name: t => READ_NAMES[t] || null };
  const used = new Set();
  const lines = [[r.id + ' 标题', r.t]].concat(r.s.map((x, k) => [r.id + ' #' + (k + 1), x[1]]));
  lines.forEach(([where, text]) => {
    const t = lexTokens(text); sent++;
    t.forEach((tok, i) => {
      toks++;
      const res = lookupToken(t, i, dict);
      if (res.kind === 'none') { console.log('查不到  ' + where + '  ' + tok + '   ← ' + text); bad++; }
      if (res.kind === 'root') { const k = tok.toLowerCase() + ' → ' + res.root + '：' + res.zh; roots.set(k, (roots.get(k) || 0) + 1); }
      if (res.kind === 'gloss') used.add(lexKey(res.text));
      if (res.kind === 'root' && !res.word) used.add(lexKey(res.root));
    });
  });
  r.s.forEach((x, k) => { if (!x[2] || /[a-z]{4,}/i.test(x[2].replace(/RKAB|WiFi|AMDAL|PLTU|THR|HP/g, ''))) { console.log('中文翻译可疑', r.id, k + 1, x[2]); bad++; } });
  r.g.forEach(g => { if (!used.has(lexKey(g[0]))) unusedAll.push(r.id + ': ' + g[0]); });
});
console.log('短文', READS.length, '篇；句子（含标题）', sent, '；词', toks, '；各难度', READ_LEVELS.map(l => l[1] + ' ' + READS.filter(r => r.lv === l[0]).length).join('，'));
if (unusedAll.length) console.log('生词表里有、但这一篇没用上的（' + unusedAll.length + '）：' + unusedAll.join('；'));
if (V || roots.size) { console.log('靠去词缀找到词根的（' + roots.size + '），请核对释义是否合适：'); [...roots.keys()].sort().forEach(k => console.log('  ' + k)); }
console.log(bad ? '有 ' + bad + ' 处问题' : '全部能查到');
process.exit(bad ? 1 : 0);
