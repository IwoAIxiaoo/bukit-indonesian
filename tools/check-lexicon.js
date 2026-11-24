// 检查词条扩展（src/lexicon.js）：键都存在；词根、口语形式写法正确；挖空句正好一处 [..]；每个词补齐后三个字段都有值。
// 用法：node tools/check-lexicon.js [-v]
const fs = require('fs'), vm = require('vm'), path = require('path');
const SRC = path.join(process.env.BUKIT_ROOT || path.join(__dirname, '..'), 'src') + '/';
const files = ['pre.js', 'content-1.js', 'content-2.js', 'content-3.js', 'content-4.js', 'content-5.js', 'content-6.js', 'lexicon.js'];
const code = files.map(f => fs.readFileSync(SRC + f, 'utf8')).join('\n') + '\n;applyLexicon();globalThis.__out = { WORDS, LEXICON };';
const ctx = { console }; vm.createContext(ctx); vm.runInContext(code, ctx);
const { WORDS, LEXICON } = ctx.__out;
const V = process.argv.includes('-v');
let bad = 0;
const fail = m => { console.log(m); bad++; };
const form = /^[\p{L}]+(?:[ -][\p{L}]+)*$/u;
const vocab = new Set(Object.values(WORDS).map(w => w.w.toLowerCase()));
const outside = [];
Object.entries(LEXICON).forEach(([id, x]) => {
  const w = WORDS[id];
  if (!w) return fail('课程里没有这个词：' + id);
  if (x.rootWord != null) {
    if (!form.test(x.rootWord)) fail('词根写法不对：' + id + ' → ' + x.rootWord);
    if (!vocab.has(x.rootWord.toLowerCase())) outside.push(id + ' → ' + x.rootWord);
  }
  if (x.colloquial != null) {
    if (!Array.isArray(x.colloquial) || !x.colloquial.length) fail('口语形式应是非空数组：' + id);
    else x.colloquial.forEach(c => {
      if (!form.test(c)) fail('口语形式写法不对：' + id + ' → ' + c);
      if (c.toLowerCase() === w.w.toLowerCase()) fail('口语形式和标准写法一样：' + id);
    });
  }
  if (x.clozeSentence != null) {
    const c = x.clozeSentence;
    if (!c.id || !c.zh) fail('挖空句缺印尼语或中文：' + id);
    else if ((c.id.match(/\[[^\]]+\]/g) || []).length !== 1) fail('挖空句应正好有一处 [..]：' + id + '  ' + c.id);
  }
});
// 补齐后：每个词都有三个字段，挖空句都有一处标记
let noCloze = [];
Object.values(WORDS).forEach(w => {
  if (typeof w.rootWord !== 'string' || !w.rootWord) fail('补齐后缺 rootWord：' + w.id);
  if (!Array.isArray(w.colloquial)) fail('补齐后 colloquial 不是数组：' + w.id);
  if (!w.clozeSentence) noCloze.push(w.id);
  else if (!/\[[^\]]+\]/.test(w.clozeSentence.id) || !w.clozeSentence.hint) fail('挖空句没有标记或提示：' + w.id);
});
if (noCloze.length) fail('没有挖空句的词：' + noCloze.join('、'));
// 同一个口语形式不要指向两个不同的词（复习时会判对）
const seen = {};
Object.values(WORDS).forEach(w => w.colloquial.forEach(c => { const k = c.toLowerCase(); if (seen[k] && seen[k] !== w.id) fail('口语形式重复：' + c + '（' + seen[k] + '、' + w.id + '）'); seen[k] = w.id; }));
const n = k => Object.values(LEXICON).filter(x => x[k] != null).length;
console.log('词条', Object.keys(WORDS).length, '个；写了词根', n('rootWord'), '个，口语形式', n('colloquial'), '个，覆盖挖空句', n('clozeSentence'), '个');
if (outside.length) console.log('词根不在课程词表里（' + outside.length + '，只提示，请核对）：' + (V ? outside.join('；') : outside.slice(0, 12).join('；') + (outside.length > 12 ? '……（-v 看全部）' : '')));
console.log(bad ? '有 ' + bad + ' 处问题' : '全部通过');
process.exit(bad ? 1 : 0);
