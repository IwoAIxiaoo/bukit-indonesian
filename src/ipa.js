/* ===== 印尼语音标（IPA）：规则拼读 + e 的读音词表 =====
   印尼语拼写很规则，唯一的难点是字母 e：默认读弱元音 /ə/，下面词表里标了 é 的读 /e/。
   输出带音节点，如 selamat pagi → /sə.la.mat pa.gi/。 */
const IPA = (function () {
  // 读 /e/（taling）的词，é 标出读 /e/ 的位置；其余的 e 都读 /ə/（pepet）
  const TALING = ('alérgi antré apoték béa bélok béngkél bésok boléh capék cék daérah diréktur divéstasi dokumén ékskavator éksplorasi ékspor '
    + 'énak és évakuasi féronikel ganténg génsét geréja goréng hélm hotél ilégal imlék indonésia internét invéstasi jelék jendéla kakék keréta '
    + 'klénténg klién konséntrat kristén léréng léwat macét média méja mékanik ménit ménu mérah meréka mésin nénék ojék oléh pakét péndék '
    + 'pénsiun péta pilék produsén proyék réalisasi rékan rékening réklamasi rém réstoran séhat sékrétaris séndok sérvis sétor séwa smélter '
    + 'soré survéyor tanté targét téh télépon tikét trén vidéo kafé saté témpé kué karét bébék sénén').split(' ');
  const MARK = {};
  TALING.forEach(w => { MARK[w.replace(/é/g, 'e')] = w; });
  // 整词直接给出读音（外来词、缩写的习惯读法）
  const WHOLE = {
    email: 'i.mel', stockpile: 'stok.pail', wifi: 'wai.fai', whatsapp: 'wot.sap', qris: 'kris', ac: 'a.se', hp: 'ha.pe', hm: 'ha.em',
    apar: 'a.par', amdal: 'am.dal', p3k: 'pe.ti.ga.ka', k3: 'ka.ti.ga', b3: 'be.ti.ga', p2h: 'pe.du.a.ha', buddha: 'bu.da', saudara: 'sau̯.da.ra',
    minerba: 'mi.nər.ba'
  };
  const LETTER = { a: 'a', b: 'be', c: 'tʃe', d: 'de', e: 'e', f: 'ef', g: 'ge', h: 'ha', i: 'i', j: 'dʒe', k: 'ka', l: 'el', m: 'em', n: 'en', o: 'o',
    p: 'pe', q: 'ki', r: 'er', s: 'es', t: 'te', u: 'u', v: 'fe', w: 'we', x: 'eks', y: 'je', z: 'zet' };
  const ONSET2 = /^(p|b|t|d|k|g|f)(r|l)$/;

  // 拼写 → 音素序列（每个元素 [音, 是否元音]）
  function phones(w) {
    const out = [];
    for (let i = 0; i < w.length; i++) {
      const c = w[i], n = w[i + 1];
      if (c === 'n' && n === 'g') { out.push(['ŋ', false]); i++; continue; }
      if (c === 'n' && n === 'y') { out.push(['ɲ', false]); i++; continue; }
      if (c === 's' && n === 'y') { out.push(['ʃ', false]); i++; continue; }
      if (c === 'k' && n === 'h') { out.push(['x', false]); i++; continue; }
      if (/[aiuoeé]/.test(c)) {
        const v = c === 'é' ? 'e' : c === 'e' ? 'ə' : c;
        // 词尾的 ai / au / oi / ei 读双元音
        if (i === w.length - 2 && /[aoe]/.test(c) && /[iu]/.test(n) && !(c === 'o' && n === 'u')) { out.push([v + n + '̯', true]); i++; continue; }
        out.push([v, true]); continue;
      }
      const m = { c: 'tʃ', j: 'dʒ', y: 'j', v: 'f', q: 'k' }[c];
      if (c === 'x') { out.push(['k', false], ['s', false]); continue; }
      out.push([m || c, false]);
    }
    // 词尾 k 读喉塞音
    const last = out[out.length - 1];
    if (last && last[0] === 'k' && out.length > 1 && out[out.length - 2][1]) last[0] = 'ʔ';
    return out;
  }
  // 音素 → 音节
  function syllables(ph) {
    const nuc = ph.map((p, i) => p[1] ? i : -1).filter(i => i >= 0);
    if (!nuc.length) return ph.map(p => p[0]).join('');
    const cut = [];
    for (let k = 0; k < nuc.length - 1; k++) {
      const a = nuc[k], b = nuc[k + 1], cons = b - a - 1;
      if (cons <= 1) { cut.push(a + 1); continue; }
      const two = ph[b - 2][0] + ph[b - 1][0];
      cut.push(ONSET2.test(two) && cons >= 2 ? b - 2 : b - 1);
    }
    const parts = []; let s = 0;
    cut.forEach(c => { parts.push(ph.slice(s, c).map(p => p[0]).join('')); s = c; });
    parts.push(ph.slice(s).map(p => p[0]).join(''));
    return parts.join('.');
  }
  function word(tok) {
    if (!tok) return '';
    const low = tok.toLowerCase();
    if (WHOLE[low]) return WHOLE[low];
    if (/^[A-Z0-9]{2,}$/.test(tok) && /[A-Z]/.test(tok)) return tok.toLowerCase().split('').map(ch => LETTER[ch] || '').filter(Boolean).join('.');
    const clean = low.replace(/[^a-zé]/g, '');
    if (!clean) return '';
    return syllables(phones(MARK[clean] || clean));
  }
  function of(text) {
    const t = String(text || '').replace(/[\[\]«»“”"…→]/g, ' ').replace(/\s+/g, ' ').trim();
    if (!t || /\d/.test(t.replace(/^(p3k|k3|b3|p2h)$/i, ''))) return '';
    const words = t.split(/[\s\/]+/).map(w => w.split('-').map(word).filter(Boolean).join('-')).filter(Boolean);
    return words.length ? '/' + words.join(' ') + '/' : '';
  }
  return { of, word, LETTER };
})();
