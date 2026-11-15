/* 短文里点一个词查释义：先查整词和词组，查不到再试着去掉词缀找词根。
   纯函数，不依赖页面，tools/ 里的检查脚本也直接用它。 */

// 按空格拆词，去掉词两头的标点（和“连词成句”的拆法一致）
function lexTokens(s) {
  return String(s).replace(/[\[\]«»]/g, '').split(/\s+/).map(t => t.replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}%]+$/gu, '')).filter(Boolean);
}
const lexKey = s => lexTokens(s).join(' ').toLowerCase();

// 去掉 -nya / -lah / -kah / -ku / -mu 这类附着在词尾的成分
function lexTail(t) {
  const m = t.match(/^(.{2,}?)-?(nya|lah|kah)$/) || t.match(/^(.{3,}?)(ku|mu)$/);
  return m ? m[1] : '';
}

// 一个词可能的词根，按可能性从高到低。只是按拼写规则猜，结果要到词表里查到才算数。
function stemCandidates(t) {
  t = String(t).toLowerCase();
  const out = [], seen = new Set([t]);
  const push = x => { if (x && x.length >= 2 && !seen.has(x)) { seen.add(x); out.push(x); } };
  const pres = s => {
    const r = [];
    let m;
    if ((m = s.match(/^(?:memper|diper)(.{2,})$/))) r.push(m[1]);                               // memperpanjang → panjang
    if ((m = s.match(/^(?:me|pe)nge(.{2,})$/))) r.push(m[1]);                                   // mengecek → cek
    if ((m = s.match(/^(?:me|pe)ng(.{2,})$/))) { r.push(m[1]); r.push('k' + m[1]); }            // mengambil → ambil，mengirim → kirim
    if ((m = s.match(/^(?:me|pe)ny(.{2,})$/))) r.push('s' + m[1]);                              // menyimpan → simpan
    if ((m = s.match(/^(?:me|pe)m(.{2,})$/))) { r.push(m[1]); r.push('p' + m[1]); }             // membeli → beli，memakai → pakai
    if ((m = s.match(/^(?:me|pe)n(.{2,})$/))) { r.push(m[1]); r.push('t' + m[1]); }             // mendengar → dengar，menulis → tulis
    if ((m = s.match(/^(?:me|pe)([lrmnwy].{2,})$/))) r.push(m[1]);                              // melihat → lihat
    if ((m = s.match(/^(?:ber|ter|per)(.{2,})$/))) r.push(m[1]);                                // bertambah → tambah
    if ((m = s.match(/^(?:be|te)(.{3,})$/))) r.push(m[1]);                                      // bekerja → kerja
    if ((m = s.match(/^(?:di|ke|se)(.{3,})$/))) r.push(m[1]);                                   // dijual → jual，seratus → ratus
    return r;
  };
  const sufs = s => ['kan', 'an', 'i'].filter(x => s.length > x.length + 2 && s.endsWith(x)).map(x => s.slice(0, -x.length));
  const redup = t.match(/^(.+)-\1$/);
  if (redup) push(redup[1]);                                                                    // teman-teman → teman
  const bases = [t];
  const tail = lexTail(t);
  if (tail) { push(tail); bases.push(tail); }
  bases.forEach(b => sufs(b).forEach(push));
  bases.forEach(b => pres(b).forEach(p => { push(p); sufs(p).forEach(push); }));
  return out;
}

/* 查 tokens[i]。dict：
     gloss(key) → [原文, 释义] 或 null    —— 生词表（调用方决定先查本篇还是全部）
     word(key)  → 课程里的词条或 null     —— 键是小写的词或词组
     name(text) → 说明或 null             —— 专有名词，区分大小写
   返回 { kind: 'gloss' | 'word' | 'name' | 'root' | 'none', text, zh, word, root } */
function lookupToken(tokens, i, dict) {
  const hit = (key, text) => {
    const g = dict.gloss(key);
    if (g) return { kind: 'gloss', text: g[0], zh: g[1] };
    const w = dict.word(key);
    if (w) return { kind: 'word', text: w.w, zh: w.zh, word: w };
    return null;
  };
  // 词组优先：包含这个词的四词、三词、两词组合；最后一个词带 -nya 之类的也试一下
  for (let n = 4; n >= 2; n--) {
    for (let a = i - n + 1; a <= i; a++) {
      if (a < 0 || a + n > tokens.length) continue;
      const part = tokens.slice(a, a + n), raw = part.join(' ');
      const nm = dict.name(raw);
      if (nm) return { kind: 'name', text: raw, zh: nm };
      const r = hit(raw.toLowerCase(), raw);
      if (r) return r;
      const tl = lexTail(part[n - 1].toLowerCase());
      if (tl) { const r2 = hit(part.slice(0, n - 1).concat(tl).join(' ').toLowerCase(), raw); if (r2) return r2; }
    }
  }
  const raw = tokens[i], low = raw.toLowerCase();
  const r = hit(low, raw);
  if (r) return r;
  const nm = dict.name(raw);
  if (nm) return { kind: 'name', text: raw, zh: nm };
  for (const c of stemCandidates(low)) {
    const g = dict.gloss(c);
    if (g) return { kind: 'root', text: raw, root: g[0], zh: g[1] };
    const w = dict.word(c);
    if (w) return { kind: 'root', text: raw, root: w.w, zh: w.zh, word: w };
  }
  return { kind: 'none', text: raw, zh: '' };
}
