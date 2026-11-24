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
