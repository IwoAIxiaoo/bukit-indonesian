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
