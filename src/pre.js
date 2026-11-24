/* ===== 内容登记：课程文件调用 TOPIC() / DECK() ===== */
const TOPICS = [], WORDS = {}, DECKS = {};

function TOPIC(t) {
  const words = [];
  t.words.trim().split('\n').forEach(line => {
    line = line.trim();
    if (!line) return;
    const parts = line.split('|');
    const [w, pos, zh] = parts.map(s => s.trim());
    const ex = [], notes = [];
    parts.slice(3).forEach(seg => {
      seg = seg.trim();
      if (!seg) return;
      if (seg.startsWith('!')) { notes.push(seg.slice(1).trim()); return; }
      const i = seg.indexOf('=');
      if (i > 0) ex.push({ id: seg.slice(0, i).trim(), zh: seg.slice(i + 1).trim() });
    });
    let id = w;
    if (WORDS[id]) id = w + '@' + t.id;
    const o = { id, w, pos, zh, ex, note: notes.join('；'), topic: t.id, idx: words.length };
    WORDS[id] = o;
    words.push(o);
  });
  const anchors = {};
  Object.entries(t.decks || {}).forEach(([k, d]) => {
    let idx = /^\d+$/.test(k) ? (+k - 1) : words.findIndex(x => x.w === k);
    if (idx < 0 || idx >= words.length) { console.warn('语法卡片锚点没找到：', t.id, k); idx = words.length - 1; }
    anchors[idx] = d;
  });
  TOPICS.push(Object.assign({}, t, { words, anchors, tips: t.tips || [] }));
}

function DECK(id, zh, idn, cards, quiz) {
  DECKS[id] = { id, zh, idn, cards, quiz: quiz || [] };
}

/* ===== 词条的扩展字段：词根、口语形式、挖空短句（数据在 lexicon.js） =====
   LEX(词的键, { rootWord, colloquial, clozeSentence })，只写需要补充或覆盖的部分。
   applyLexicon() 在所有内容加载完后调用一次，给每个词条补齐三个字段：
     rootWord       词根；没写的就是词本身
     colloquial     口语里的缩写或变体（数组），没有就是 []
     clozeSentence  { id: 带 [挖空] 标记的短句, zh: 中文, hint: 中文语境提示 }；
                    没写的取第一句把这个词本身标出来的例句，提示用这个词的中文释义 */
const LEXICON = {};
function LEX(id, o) { LEXICON[id] = Object.assign(LEXICON[id] || {}, o); }
function applyLexicon() {
  Object.keys(WORDS).forEach(id => {
    const w = WORDS[id], x = LEXICON[id] || {};
    w.rootWord = x.rootWord || w.w;
    w.colloquial = Array.isArray(x.colloquial) ? x.colloquial.slice() : [];
    let cz = x.clozeSentence || null;
    if (!cz) {
      const same = e => { const m = e.id.match(/\[([^\]]+)\]/); return m && m[1].toLowerCase() === w.w.toLowerCase(); };
      const e = w.ex.find(same) || w.ex.find(e => /\[[^\]]+\]/.test(e.id)) || null;
      if (e) cz = { id: e.id, zh: e.zh };
    }
    w.clozeSentence = cz ? { id: cz.id, zh: cz.zh, hint: cz.hint || w.zh } : null;
  });
}

/* ===== 短对话：每课按词序每 8 个词一段，每段一篇 A/B 对话（dialogue-*.js）=====
   DLG(课的 id, 第几段, 中文标题, [[说话人, 印尼语, 中文], ...])。今日学习最后一步挑含今天新词最多的一段盲听。 */
const DIALOGS = [];
function DLG(topic, n, zh, s) { DIALOGS.push({ id: topic + '-' + n, topic, n, zh, s }); }
// 一课的词按顺序每 8 个分一段，最后一段不足 4 个就并进前一段（对话也按这个分段写）
function dlgChunks(t) {
  const ch = [];
  for (let i = 0; i < t.words.length; i += 8) ch.push(t.words.slice(i, i + 8));
  if (ch.length > 1 && ch[ch.length - 1].length < 4) { const last = ch.pop(); ch[ch.length - 1] = ch[ch.length - 1].concat(last); }
  return ch;
}
// 这段对话里有没有用到这个词：原形、词组、口语形式，或者加了词缀的形式（靠 lookup.js 的 stemCandidates 去词缀）
const DLG_TOK = {};
function dlgCovers(d, id) {
  const w = WORDS[id];
  if (!w) return false;
  const toks = DLG_TOK[d.id] || (DLG_TOK[d.id] = d.s.map(x => lexTokens(x[1]).map(t => t.toLowerCase())));
  const forms = [w.w].concat(w.colloquial || []).map(f => lexTokens(f).map(t => t.toLowerCase()));
  const same = (t, x) => t === x || t.replace(/-?nya$/, '') === x;   // tempat tidurnya 也算 tempat tidur
  const has = (line, f) => { for (let i = 0; i + f.length <= line.length; i++) if (f.every((x, j) => same(line[i + j], x))) return true; return false; };
  if (toks.some(line => forms.some(f => has(line, f)))) return true;
  if (forms[0].length !== 1) return false;
  const base = forms[0][0];
  return toks.some(line => line.some(t => { const tl = t.replace(/-?(nya|lah|kah|ku|mu)$/, ''); return tl === base || stemCandidates(t).includes(base); }));
}
