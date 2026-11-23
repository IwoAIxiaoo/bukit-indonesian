// 检查易混词（src/confuse.js）：每个词都在课程里，每个词至少有一句例句把它本身标出来（“易混辨析”要挖空），没有重复的组。
// 用法：node tools/check-confuse.js
const fs = require('fs'), vm = require('vm'), path = require('path');
const SRC = path.join(process.env.BUKIT_ROOT || path.join(__dirname, '..'), 'src') + '/';
const files = ['pre.js', 'content-1.js', 'content-2.js', 'content-3.js', 'content-4.js', 'content-5.js', 'content-6.js', 'ref.js', 'confuse.js'];
const code = files.map(f => fs.readFileSync(SRC + f, 'utf8')).join('\n') + '\n;globalThis.__out = { WORDS, CONFUSE, CONFUSE_KINDS };';
const ctx = { console }; vm.createContext(ctx); vm.runInContext(code, ctx);
const { WORDS, CONFUSE, CONFUSE_KINDS } = ctx.__out;
let bad = 0;
const fail = m => { console.log(m); bad++; };
const ids = new Set(), sets = new Set(), per = {};
const exact = w => w.ex.some(e => { const m = e.id.match(/\[([^\]]+)\]/); return m && m[1].toLowerCase() === w.w.toLowerCase(); });
CONFUSE.forEach(g => {
  if (ids.has(g.id)) fail('重复的 id ' + g.id); ids.add(g.id);
  if (!CONFUSE_KINDS.some(k => k[0] === g.k)) fail('类型不对 ' + g.id);
  if (!g.t || !g.tip) fail('缺标题或说明 ' + g.id);
  if (!Array.isArray(g.w) || g.w.length < 2) fail('少于 2 个词 ' + g.id);
  const key = g.w.map(x => x[0]).sort().join('|');
  if (sets.has(key)) fail('和别的组完全一样 ' + g.id); sets.add(key);
  g.w.forEach(([wid, note]) => {
    const w = WORDS[wid];
    if (!w) return fail('课程里没有这个词：' + g.id + ' ' + wid);
    if (!note) fail('缺区分说明 ' + g.id + ' ' + wid);
    if (!exact(w)) fail('没有标出这个词本身的例句：' + g.id + ' ' + wid);
    (per[wid] = per[wid] || []).push(g.id);
  });
  if (new Set(g.w.map(x => x[0])).size !== g.w.length) fail('组里有重复的词 ' + g.id);
});
const many = Object.entries(per).filter(([, v]) => v.length > 2);
console.log('易混词', CONFUSE.length, '组；' + CONFUSE_KINDS.map(k => k[1] + ' ' + CONFUSE.filter(g => g.k === k[0]).length).join('，') + '；涉及', Object.keys(per).length, '个词');
if (many.length) console.log('出现在 3 组以上的词（单词卡上只显示前 2 组）：' + many.map(([k, v]) => k + '(' + v.join(',') + ')').join('；'));
console.log(bad ? '有 ' + bad + ' 处问题' : '全部通过');
process.exit(bad ? 1 : 0);
