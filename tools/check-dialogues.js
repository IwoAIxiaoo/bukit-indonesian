// 检查短对话（src/dialogue-*.js）：每课每段都有对话；对话用上了这一段多少个词（目标 ≥ 60%）；格式正确。
// 用法：node tools/check-dialogues.js [-v]   -v 列出每段漏掉的词
const fs = require('fs'), vm = require('vm'), path = require('path');
const SRC = path.join(process.env.BUKIT_ROOT || path.join(__dirname, '..'), 'src') + '/';
const dl = fs.readdirSync(SRC).filter(f => /^dialogue-\d+\.js$/.test(f)).sort();
const files = ['pre.js', 'content-1.js', 'content-2.js', 'content-3.js', 'content-4.js', 'content-5.js', 'content-6.js', 'lexicon.js', 'lookup.js'].concat(dl);
const code = files.map(f => fs.readFileSync(SRC + f, 'utf8')).join('\n') + '\n;applyLexicon();globalThis.__out = { TOPICS, DIALOGS, dlgChunks: typeof dlgChunks === "function" ? dlgChunks : null, dlgCovers: typeof dlgCovers === "function" ? dlgCovers : null };';
const ctx = { console }; vm.createContext(ctx); vm.runInContext(code, ctx);
const { TOPICS, DIALOGS, dlgChunks, dlgCovers } = ctx.__out;
const V = process.argv.includes('-v');
let bad = 0, low = 0, sum = 0, n = 0;
const fail = m => { console.log(m); bad++; };
const ids = new Set();
DIALOGS.forEach(d => {
  if (ids.has(d.id)) fail('重复的对话 ' + d.id); ids.add(d.id);
  if (!Array.isArray(d.s) || d.s.length < 4 || d.s.length > 10) fail('句数应在 4–10 之间：' + d.id + ' ' + (d.s || []).length);
  (d.s || []).forEach((x, k) => {
    if (!Array.isArray(x) || x.length !== 3 || !/^[AB]$/.test(x[0]) || !x[1] || !x[2]) fail('格式不对：' + d.id + ' #' + (k + 1));
    else if (/[一-鿿]/.test(x[1]) || !/[一-鿿]/.test(x[2])) fail('印尼语和中文放反了：' + d.id + ' #' + (k + 1));
  });
});
TOPICS.forEach(t => {
  const chunks = dlgChunks(t);
  chunks.forEach((ws, k) => {
    const d = DIALOGS.find(x => x.topic === t.id && x.n === k + 1);
    if (!d) return fail('缺对话：' + t.id + ' 第 ' + (k + 1) + ' 段（' + ws.map(w => w.w).join('、') + '）');
    const hit = ws.filter(w => dlgCovers(d, w.id)), r = hit.length / ws.length;
    sum += r; n++;
    if (r < 0.6) { low++; console.log('覆盖不足 ' + d.id + '：' + hit.length + '/' + ws.length + '，漏了 ' + ws.filter(w => !hit.includes(w)).map(w => w.w).join('、')); }
    else if (V && hit.length < ws.length) console.log('  ' + d.id + ' ' + hit.length + '/' + ws.length + '，漏了 ' + ws.filter(w => !hit.includes(w)).map(w => w.w).join('、'));
  });
  DIALOGS.filter(x => x.topic === t.id && x.n > chunks.length).forEach(x => fail('多出来的对话：' + x.id));
});
DIALOGS.forEach(d => { if (!TOPICS.some(t => t.id === d.topic)) fail('没有这一课：' + d.id); });
console.log('对话 ' + DIALOGS.length + ' 段，' + DIALOGS.reduce((a, d) => a + d.s.length, 0) + ' 句；平均覆盖 ' + Math.round(sum / Math.max(1, n) * 100) + '%；覆盖不足 60% 的 ' + low + ' 段');
console.log(bad || low ? '有 ' + (bad + low) + ' 处问题' : '全部通过');
process.exit(bad || low ? 1 : 0);
