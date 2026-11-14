/* ===== Bukit 印尼语 · 应用逻辑 ===== */
(function () {
'use strict';

const $ = (s, el) => (el || document).querySelector(s);
const $$ = (s, el) => Array.from((el || document).querySelectorAll(s));

/* ---------- 课程整理 ---------- */
const ORDER = ['greet', 'people', 'number', 'time', 'connect', 'verbs', 'freq', 'family', 'food', 'resto', 'shop', 'desc', 'daily', 'place', 'trip', 'home', 'health', 'weather', 'feel', 'religion', 'phone', 'bank', 'jobs', 'work', 'site', 'equip', 'safety', 'coal', 'metal', 'policy', 'news'];
const GROUPS = [
  { zh: '入门基础', ids: ['greet', 'people', 'number', 'time', 'connect', 'verbs', 'freq'] },
  { zh: '生活与出行', ids: ['family', 'food', 'resto', 'shop', 'desc', 'daily', 'place', 'trip', 'home', 'health', 'weather', 'feel', 'religion', 'phone', 'bank', 'jobs'] },
  { zh: '职场与矿业', ids: ['work', 'site', 'equip', 'safety', 'coal', 'metal', 'policy', 'news'] }
];
TOPICS.sort((a, b) => ORDER.indexOf(a.id) - ORDER.indexOf(b.id));
TOPICS.forEach((t, i) => { t.n = i + 1; });
const TOPIC_BY = {};
TOPICS.forEach(t => { TOPIC_BY[t.id] = t; });
const WLIST = [];
TOPICS.forEach(t => t.words.forEach(w => { w.k = WLIST.length; WLIST.push(w); }));
TOPICS.forEach(t => Object.values(t.anchors).forEach(d => { if (DECKS[d]) DECKS[d].topic = t.id; }));
const DECK_LIST = [];
TOPICS.forEach(t => Object.keys(t.anchors).map(Number).sort((a, b) => a - b).forEach(i => { const d = DECKS[t.anchors[i]]; if (d && !DECK_LIST.includes(d)) DECK_LIST.push(d); }));

const SCENES = { daily: '日常', travel: '旅行', biz: '商务', site: '矿业' };
const SCENE_DESC = {
  daily: '日常生活：家人朋友、购物、吃饭、居家、出行',
  travel: '旅行：机场、酒店、交通、景点、点餐、问路',
  biz: '商务办公：会议、邮件、客户、合同、谈判、同事之间',
  site: '矿业：煤矿和金属矿（镍、金、铜、锡、铝土）的现场作业、安全、设备、运输装船、冶炼厂，以及矿业政策、许可、合规和行业新闻'
};
const POSN = { n: '名词', v: '动词', adj: '形容词', adv: '副词', pron: '代词', num: '数词', cl: '量词', prep: '介词', conj: '连词', q: '疑问词', intj: '叹词', phr: '短语', part: '语气词', neg: '否定词', aux: '助动词' };

/* ---------- 日期 ---------- */
const DAY = 864e5;
const dayIdx = d => Math.floor((d.getTime() - d.getTimezoneOffset() * 6e4) / DAY);
const today = () => dayIdx(new Date());
const dkey = i => new Date(i * DAY).toISOString().slice(0, 10);
const kidx = k => Math.round(Date.parse(k + 'T00:00:00Z') / DAY);
const MON_ID = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
const DOW_ZH = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
function fmtDay(i, short) {
  const d = new Date(i * DAY);
  return short ? (d.getUTCMonth() + 1) + '/' + d.getUTCDate() : (d.getUTCMonth() + 1) + '月' + d.getUTCDate() + '日 ' + DOW_ZH[d.getUTCDay()];
}

/* ---------- 文本 ---------- */
const ESC = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ESC[c]);
const plain = s => String(s).replace(/[\[\]«»]/g, '');
const hl = s => esc(s).replace(/\[([^\]]+)\]/g, '<mark class="hl">$1</mark>');
function rich(s) {
  return esc(s)
    .replace(/\*\*(.+?)\*\*/g, '<b>$1</b>')
    .replace(/«(.+?)»/g, (m, x) => '<button class="say-inline" data-say="' + x + '" lang="id">' + x + '</button>');
}
function hash(s) { let h = 5381; s = String(s); for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0; return (h >>> 0).toString(36); }
const rnd = n => Math.floor(Math.random() * n);
function shuffle(a) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = rnd(i + 1); [a[i], a[j]] = [a[j], a[i]]; } return a; }
const f1 = v => Math.round(v * 10) / 10;

/* ---------- 图标 ---------- */
const IC = {
  today: '<path d="M3 19h18"/><path d="M6.5 19a5.5 5.5 0 0 1 11 0"/><path d="M12 7.5V4.5"/><path d="M5.3 10.3 3.6 8.6"/><path d="M18.7 10.3l1.7-1.7"/>',
  learn: '<path d="M2.5 5h6A3.5 3.5 0 0 1 12 8.5V20a2.5 2.5 0 0 0-2.5-2.5h-7z"/><path d="M21.5 5h-6A3.5 3.5 0 0 0 12 8.5V20a2.5 2.5 0 0 1 2.5-2.5h7z"/>',
  review: '<rect x="3" y="7.5" width="13.5" height="13.5" rx="2.5"/><path d="M7.5 3.5h11a2 2 0 0 1 2 2v11"/>',
  pron: '<path d="M4 9.5v5h3.5L12 18.5v-13L7.5 9.5z"/><path d="M15.5 9a4 4 0 0 1 0 6"/><path d="M18.2 6.5a7.5 7.5 0 0 1 0 11"/>',
  stats: '<path d="M3.5 20.5h17"/><path d="M6.5 16.5v-4"/><path d="M11 16.5v-8"/><path d="M15.5 16.5v-5.5"/><path d="M20 16.5V5.5"/>',
  me: '<path d="M4 7h9"/><path d="M17 7h3"/><circle cx="15" cy="7" r="2"/><path d="M4 17h3"/><path d="M11 17h9"/><circle cx="9" cy="17" r="2"/>',
  play: '<path d="M4 9.5v5h3.5L12 18.5v-13L7.5 9.5z"/><path d="M15.5 9a4 4 0 0 1 0 6"/>',
  loop: '<path d="M17 3l3 3-3 3"/><path d="M4 11V9.5A3.5 3.5 0 0 1 7.5 6H20"/><path d="M7 21l-3-3 3-3"/><path d="M20 13v1.5a3.5 3.5 0 0 1-3.5 3.5H4"/>',
  slow: '<circle cx="12" cy="13.5" r="7.5"/><path d="M12 9.5v4l2.5 2"/><path d="M10 2.5h4"/>',
  spark: '<path d="M12 3.5l1.7 4.6 4.6 1.7-4.6 1.7L12 16.1l-1.7-4.6L5.7 9.8l4.6-1.7z"/><path d="M18.5 15l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8z"/>',
  back: '<path d="m15 18-6-6 6-6"/>',
  next: '<path d="m9 18 6-6-6-6"/>',
  close: '<path d="M6 6l12 12M18 6 6 18"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
  check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
  flame: '<path d="M12 21.5c3.9 0 6.8-2.6 6.8-6.4 0-3.1-1.9-5.4-3.5-7-.3 1.9-1.3 3.2-2.5 3.7.4-3.3-.9-6.3-3.7-8.8.2 3.1-1.6 5.4-3.2 7.4-1.1 1.4-1.7 2.8-1.7 4.7 0 3.8 2.9 6.4 7.8 6.4z"/>'
};
const ico = (n, cls) => '<svg class="ico ' + (cls || '') + '" viewBox="0 0 24 24" aria-hidden="true">' + IC[n] + '</svg>';
const BRAND = '<svg viewBox="0 0 28 28" aria-hidden="true"><path d="M1.5 24C5.5 16.5 9.5 12 14 12s8.5 4.5 12.5 12z" fill="var(--accent)"/><path d="M14 12.5V3" stroke="var(--ink)" stroke-width="1.6" stroke-linecap="round"/><path d="M14.6 3.3h7.6v3h-7.6z" fill="var(--flag-red)"/><path d="M14.6 6.3h7.6v3h-7.6z" fill="var(--flag-white)" stroke="var(--line)" stroke-width=".6"/></svg>';

/* ---------- 本地存储与状态 ---------- */
const LS = 'bukit.v1', LSD = 'bukit.dev.v1';
function lsGet(k) { try { return JSON.parse(localStorage.getItem(k) || 'null'); } catch (e) { return null; } }
function lsSet(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* 存储不可用时忽略 */ } }
// 浏览器是否真的能保存数据（无痕模式、某些打开本地文件的方式下不行）
const LS_OK = (function () { try { localStorage.setItem('bukit.t', '1'); const ok = localStorage.getItem('bukit.t') === '1'; localStorage.removeItem('bukit.t'); return ok; } catch (e) { return false; } })();
const DEF_PREFS = { goal: 10, batch: 8, interests: [], decks: {}, tips: {}, last: '', t: 0 };
const S = (function () {
  const raw = lsGet(LS) || {};
  const o = { words: {}, log: {}, prefs: {}, saved: {}, flags: {} };
  ['words', 'log', 'saved', 'flags'].forEach(k => { if (raw[k] && typeof raw[k] === 'object') o[k] = raw[k]; });
  o.prefs = Object.assign({}, DEF_PREFS, raw.prefs && typeof raw.prefs === 'object' ? raw.prefs : {});
  if (!o.prefs.decks || typeof o.prefs.decks !== 'object') o.prefs.decks = {};
  if (!o.prefs.tips || typeof o.prefs.tips !== 'object') o.prefs.tips = {};
  if (!Array.isArray(o.prefs.interests)) o.prefs.interests = [];
  return o;
})();
const DEV = Object.assign({ slow: false, loop: false, voice: '', rate: 1, slowRate: 0.65, autoplay: true }, lsGet(LSD) || {});
const saveDev = () => lsSet(LSD, DEV);
const persist = () => lsSet(LS, S);

const UI = { route: { name: 'home' }, sess: null, rev: null, q: '', lf: 'all', range: 30, ai: {}, gloss: {}, dlg: {}, dq: {}, letter: 0, pair: null, sheetWord: null, confirmReset: false, restoreOpen: false, onbSkip: false };

/* ---------- 学习记录与间隔复习 ---------- */
// 每个词：[等级, 到期日, 修改时间, 复习次数, 不认识次数, 首次学会日, 上次反馈（0 不认识 / 1 模糊 / 2 认识）, 再考时间（毫秒，0 = 没有）]
// 等级对应的复习间隔（天）：认识升一级，模糊保持原间隔，不认识回到第 1 级并在 10 分钟后再考
const IV = [0, 1, 3, 7, 14, 30, 60, 120, 240];
const AGAIN_MS = 10 * 60 * 1000;
const isWeak = s => s[6] === 0 || s[6] === 1;
const isLearned = id => !!(S.words[id] && S.words[id][0] > 0);
const learnedIds = () => Object.keys(S.words).filter(id => WORDS[id] && S.words[id][0] > 0);
// 今日复习的顺序：上次选了“不认识”的最先，其次是“模糊”的，然后按到期早晚、等级低的在前
const weakRank = s => (s[6] === 0 ? 0 : s[6] === 1 ? 1 : 2);
const byNeed = (a, b) => { const x = S.words[a], y = S.words[b]; return weakRank(x) - weakRank(y) || x[1] - y[1] || x[0] - y[0]; };
function dueIds() {
  const t = today(), now = Date.now();
  return learnedIds().filter(id => { const s = S.words[id]; return s[1] <= t && !(s[7] > now); }).sort(byNeed);
}
// 选了“不认识”、还在等 10 分钟的词
function waitingIds() { const now = Date.now(); return learnedIds().filter(id => S.words[id][7] > now); }
// 可以提前复习的词：还没到期，但 3 天内到期，或者上次没记牢（今天刚复习过的不算）
function soonIds() {
  const t = today();
  return learnedIds().filter(id => { const s = S.words[id]; return s[1] > t && (s[1] - t <= 3 || isWeak(s)) && dayIdx(new Date(s[2] || 0)) < t; }).sort(byNeed);
}
function topicStats(t) {
  let l = 0, m = 0;
  t.words.forEach(w => { const s = S.words[w.id]; if (s && s[0] > 0) { l++; if (s[0] >= 5) m++; } });
  return { l, m, n: t.words.length };
}
function bump(f) {
  const k = dkey(today());
  const L = S.log[k] || (S.log[k] = { n: 0, r: 0, s: 0 });
  L[f] = (L[f] || 0) + 1;
  Sync.mark('log');
}
function learn(id) {
  if (isLearned(id)) return false;
  const t = today(), p = S.words[id];
  S.words[id] = [1, t + 1, Date.now(), p ? p[3] : 0, p ? p[4] : 0, t];
  bump('n');
  Sync.mark('progress');
  return true;
}
// g：0 不认识 / 1 模糊 / 2 认识
function gradeCalc(s, g) {
  let lv = Math.min(8, Math.max(1, s[0])), due, again = 0, last = g;
  const reps = s[3] || 0, t = today(), relearn = s[7] > 0;   // relearn：上次选了“不认识”，这次是之后的再考
  let lapses = s[4] || 0;
  if (g === 0) { lv = 1; due = t; again = Date.now() + AGAIN_MS; if (!relearn) lapses++; }   // 重置间隔，10 分钟后再考
  else if (relearn) { lv = 1; due = t + 1; last = Math.min(g, 1); }                           // 再考想起来了：明天再考，仍算没记牢
  else if (g === 1) { due = t + IV[lv]; }                                                     // 模糊：保持原间隔
  else { lv = Math.min(8, lv + 1); due = t + IV[lv]; }                                        // 认识：间隔拉长一级
  return [lv, due, Date.now(), reps + 1, lapses, s[5] == null ? t : s[5], last, again];
}
function ivLabel(s, g) {
  const n = gradeCalc(s, g);
  if (n[7]) return '10 分钟后';
  const d = n[1] - today();
  return d <= 0 ? '今天再考' : d === 1 ? '明天' : d < 60 ? d + ' 天后' : Math.round(d / 30) + ' 个月后';
}
function srsText(s) {
  const d = s[1] - today();
  const when = s[7] > Date.now() ? '10 分钟内再考' : d <= 0 ? '今天该复习' : d === 1 ? '明天复习' : d + ' 天后复习';
  return '熟练度 ' + s[0] + '/8 · ' + when + (isWeak(s) ? ' · 上次没记牢' : '');
}
function activeDays() {
  return Object.keys(S.log).filter(k => { const L = S.log[k] || {}; return (L.n || 0) + (L.r || 0) > 0; }).map(kidx).sort((a, b) => a - b);
}
function streakInfo() {
  const days = activeDays(), set = new Set(days), t = today();
  let cur = 0, d = set.has(t) ? t : t - 1;
  while (set.has(d)) { cur++; d--; }
  let best = 0, run = 0, prev = null;
  days.forEach(x => { run = prev !== null && x === prev + 1 ? run + 1 : 1; best = Math.max(best, run); prev = x; });
  return { cur, best, total: days.length, todayDone: set.has(t) };
}
function nextTopic() {
  const has = t => t && t.words.some(w => !isLearned(w.id));
  const last = TOPIC_BY[S.prefs.last];
  if (has(last)) return last;
  return TOPICS.find(has) || null;
}
function defaultScene() { return S.prefs.interests[0] || 'daily'; }
function setPrefs(patch) { Object.assign(S.prefs, patch, { t: Date.now() }); Sync.mark('prefs'); }

/* ---------- 跨设备同步（claude.ai 私有数据） ---------- */
const DOCS = ['prefs', 'progress', 'log', 'saved', 'flags'];
const Sync = {
  db: null, uid: null, state: 'local', timers: {}, inflight: {}, again: {}, dirty: new Set(), lastPull: 0, retried: {},
  async init() {
    if (!window.claude || typeof window.claude.use !== 'function') { this.set('local'); return; }
    this.set('connecting');
    try {
      const both = await Promise.all([window.claude.use('db'), window.claude.use('user')]);
      const db = both[0], user = both[1];
      const uid = user ? await user.id() : null;
      if (!db || !uid) { this.set('local'); return; }
      this.db = db; this.uid = uid;
      await this.pull();
      this.dirty.forEach(n => this.schedule(n, 200));
    } catch (e) { console.warn('同步初始化失败', e); this.set(this.db ? 'err' : 'local'); }
  },
  ref(n) { return this.db.doc('data/users/' + this.uid + '/' + n); },
  async pull() {
    if (!this.db) return;
    this.lastPull = Date.now();
    const snaps = await Promise.all(DOCS.map(n => this.ref(n).get()));
    let changed = false;
    snaps.forEach((snap, i) => {
      const r = mergeDoc(DOCS[i], snap.exists ? snap.data() : null);
      if (r.local) changed = true;
      if (r.remote) this.mark(DOCS[i], 400);
    });
    if (!this.dirty.size) this.set('ok');
    if (changed) { persist(); render(); }
  },
  mark(n, delay) {
    persist();
    this.dirty.add(n);
    if (!this.db) return;
    this.schedule(n, delay == null ? 1500 : delay);
  },
  schedule(n, delay) {
    clearTimeout(this.timers[n]);
    this.timers[n] = setTimeout(() => this.flush(n), delay);
    this.set('busy');
  },
  async flush(n) {
    if (!this.db || !this.dirty.has(n)) return;
    if (this.inflight[n]) { this.again[n] = true; return; }
    this.inflight[n] = true;
    this.dirty.delete(n);
    try {
      await this.ref(n).set(docBody(n));
      this.retried[n] = false;
    } catch (e) {
      console.warn('同步失败', n, e);
      this.dirty.add(n);
      if (e && e.code === 'unavailable' && !this.retried[n]) { this.retried[n] = true; this.timers[n] = setTimeout(() => this.flush(n), 2500 + rnd(2000)); }
      else this.set('err', e && e.code === 'quota_exceeded' ? '云端存储已满' : '');
    } finally {
      this.inflight[n] = false;
      if (this.again[n]) { this.again[n] = false; this.flush(n); }
      else if (!this.dirty.size) this.set('ok');
    }
  },
  flushAll() { DOCS.forEach(n => { if (this.dirty.has(n)) { clearTimeout(this.timers[n]); this.flush(n); } }); },
  set(st, msg) {
    this.state = st; this.msg = msg || '';
    const dot = $('#sync-dot');
    if (dot) {
      dot.className = 'sync-dot ' + ({ ok: 'ok', busy: 'busy', connecting: 'busy', err: 'err' }[st] || '');
      dot.parentElement.title = syncText();
    }
    const el = $('#sync-text');
    if (el) el.textContent = syncText();
  }
};
function syncText() {
  return {
    local: OFFLINE ? (LS_OK ? '离线版：进度只保存在这台设备的这个浏览器里，不会自动同步到在线版。' : '这个浏览器不允许本地网页保存数据，关掉页面后进度会丢失。请换用 Chrome 或 Edge 打开这个文件。') : '进度保存在这台设备的浏览器里。在 claude.ai 登录状态下打开，就能在手机和电脑之间同步。',
    connecting: '正在连接你的 claude.ai 账户…',
    busy: '正在同步…',
    ok: '已同步到你的 claude.ai 账户，手机和电脑打开同一个链接即可继续。',
    err: '同步暂时失败' + (Sync.msg ? '（' + Sync.msg + '）' : '') + '，进度已先保存在本机，稍后会自动重试。'
  }[Sync.state] || '';
}
function docBody(n) {
  if (n === 'progress') return { w: S.words };
  if (n === 'log') return { d: S.log };
  if (n === 'prefs') return { p: S.prefs };
  if (n === 'flags') return { f: S.flags };
  let s = S.saved;
  if (JSON.stringify(s).length > 230000) {
    Object.keys(s).forEach(id => { s[id] = s[id].filter(x => !x.x).slice(-3); });
  }
  return { s };
}
function mergeDoc(n, R) {
  let local = false, remote = false;
  if (n === 'progress') {
    const rw = (R && R.w) || {}, ra = S.prefs.resetAt || 0;
    Object.keys(S.words).forEach(id => { if ((S.words[id][2] || 0) < ra) { delete S.words[id]; local = true; } });
    Object.keys(rw).forEach(id => {
      const rs = rw[id], ls = S.words[id];
      if (!Array.isArray(rs) || (rs[2] || 0) < ra) return;
      if (!ls || (rs[2] || 0) > (ls[2] || 0)) { S.words[id] = rs; local = true; }
    });
    Object.keys(S.words).forEach(id => { const rs = rw[id], ls = S.words[id]; if (!rs || (ls[2] || 0) > (rs[2] || 0)) remote = true; });
  } else if (n === 'log') {
    const rd = (R && R.d) || {}, rday = S.prefs.resetAt ? dayIdx(new Date(S.prefs.resetAt)) : -1;
    Object.keys(S.log).forEach(k => { if (kidx(k) < rday) { delete S.log[k]; local = true; } });
    Object.keys(rd).forEach(k => {
      if (kidx(k) < rday) return;
      const r = rd[k] || {}, l = S.log[k] || (S.log[k] = {});
      ['n', 'r', 's'].forEach(f => { if ((+r[f] || 0) > (+l[f] || 0)) { l[f] = +r[f]; local = true; } });
    });
    Object.keys(S.log).forEach(k => { const r = rd[k] || {}, l = S.log[k]; ['n', 'r', 's'].forEach(f => { if ((+l[f] || 0) > (+r[f] || 0)) remote = true; }); });
  } else if (n === 'prefs') {
    const rp = R && R.p;
    if (rp && typeof rp === 'object') {
      const decks = Object.assign({}, rp.decks, S.prefs.decks), tips = Object.assign({}, rp.tips, S.prefs.tips);
      if ((rp.t || 0) > (S.prefs.t || 0)) { S.prefs = Object.assign({}, DEF_PREFS, rp); if (!Array.isArray(S.prefs.interests)) S.prefs.interests = []; local = true; }
      else if ((S.prefs.t || 0) > (rp.t || 0)) remote = true;
      const cnt = o => Object.keys(o || {}).length;
      if (cnt(decks) !== cnt(S.prefs.decks) || cnt(tips) !== cnt(S.prefs.tips)) local = true;
      if (cnt(decks) !== cnt(rp.decks) || cnt(tips) !== cnt(rp.tips)) remote = true;
      S.prefs.decks = decks; S.prefs.tips = tips;
    } else if (S.prefs.t || Object.keys(S.prefs.decks).length || Object.keys(S.prefs.tips).length) remote = true;
  } else if (n === 'flags') {
    // 值是时间戳：正数=已标记，负数=已取消；取绝对值大的那次
    const rf = (R && R.f) || {};
    Object.keys(rf).forEach(id => { const r = +rf[id] || 0, l = +S.flags[id] || 0; if (Math.abs(r) > Math.abs(l)) { S.flags[id] = r; local = true; } });
    Object.keys(S.flags).forEach(id => { const r = +rf[id] || 0, l = +S.flags[id] || 0; if (Math.abs(l) > Math.abs(r)) remote = true; });
  } else if (n === 'saved') {
    const rs = (R && R.s) || {};
    Object.keys(rs).forEach(id => {
      const l = S.saved[id] || [], arr = Array.isArray(rs[id]) ? rs[id] : [];
      arr.forEach(x => {
        if (!x || typeof x.id !== 'string' || (x.t || 0) < (S.prefs.resetAt || 0)) return;
        const m = l.find(y => y.id === x.id);
        if (!m) { l.push(x); local = true; } else if (x.x && !m.x) { m.x = 1; local = true; }
      });
      if (l.length) S.saved[id] = l;
    });
    Object.keys(S.saved).forEach(id => {
      const r = Array.isArray(rs[id]) ? rs[id] : [];
      S.saved[id].forEach(x => { const m = r.find(y => y && y.id === x.id); if (!m || (x.x && !m.x)) remote = true; });
    });
  }
  return { local, remote };
}

/* ---------- 朗读（设备自带的印尼语语音） ---------- */
function isIdVoice(v) {
  const l = String(v.lang || '').toLowerCase().replace('_', '-');
  return l === 'id' || l.indexOf('id-') === 0 || l === 'in' || l.indexOf('in-') === 0 || /indonesia/i.test(v.name || '');
}
function vscore(v) {
  const n = v.name || '';
  let s = 0;
  if (/natural|neural|online|premium|enhanced|siri/i.test(n)) s += 4;
  if (/google/i.test(n)) s += 3;
  if (v.localService === false) s += 1;
  if (/compact|eloquence/i.test(n)) s -= 3;
  return s;
}
const cleanTTS = t => String(t).replace(/[\[\]«»“”"]/g, '').replace(/\s*[–—]\s*/g, ', ').replace(/\s+/g, ' ').trim();
function sayKey(b) { return b.dataset.key || ((b.dataset.say || '') + (b.dataset.rate === 'slow' ? '#s' : '')); }
function markPlaying(key, on) {
  $$('[data-say],[data-key]').forEach(b => { if (sayKey(b) === key) b.classList.toggle('is-playing', on); });
}
/* 预生成音频：AUDIO_PACKS / AUDIO_IDX 由构建脚本写入；按课分包，用到时才下载 */
const audioKey = t => String(t).toLowerCase().replace(/[\[\]«»“”"]/g, '').replace(/\s+/g, ' ').trim();
// 一个词的几种读法：AUDIO_VAR[id] 形如 "mfs"（m 男声 / f 女声 / h 真人、性别未标注 / s 合成语音），第 0 个是默认读法，
// 其余的音频在同一个包里，键是 "<id>~<序号>"。用户给某个词选的读法存在 prefs.var 里，跟着账号同步。
const varsOf = id => AUDIO_VAR[id] || '';
function varPick(id) { const k = +((S.prefs.var || {})[id]) || 0; return k > 0 && k < varsOf(id).length ? k : 0; }
const varKey = (id, k) => (k ? id + '~' + k : id);
// 真人录音条目：[说话人序号, 许可序号, 文件名尾部, 来源]；来源 0 = Lingua Libre（维基共享资源），1 = MSWC（Common Voice 句子里切出的单词）
const MSWC_URL = 'https://huggingface.co/datasets/MLCommons/ml_spoken_words';
function humanOf(t) {
  const h = AUDIO_HUMAN[hash(audioKey(t))];
  if (!h) return null;
  const sp = AUDIO_CREDIT.speakers[h[0]], lic = AUDIO_CREDIT.licenses[h[1]] || ['', ''];
  if (h[3] === 1) return { speaker: sp, license: lic[0], licenseUrl: lic[1], src: 'mswc', url: MSWC_URL };
  const title = 'LL-Q9240 (ind)-' + sp + '-' + h[2];
  return { speaker: sp, license: lic[0], licenseUrl: lic[1], src: 'll', title, url: fileUrl(title) };
}
const fileUrl = title => 'https://commons.wikimedia.org/wiki/File:' + encodeURIComponent(title.replace(/ /g, '_'));
const SILENT = 'data:audio/mpeg;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjYwLjE2LjEwMAAAAAAAAAAAAAAA//NYwAAAAAAAAAAAAEluZm8AAAAPAAAABwAABKQARUVFRUVFRUVFRUVFRUVkZGRkZGRkZGRkZGRkZIODg4ODg4ODg4ODg4ODoqKioqKioqKioqKioqKiwcHBwcHBwcHBwcHBwcHg4ODg4ODg4ODg4ODg4P//////////////////AAAAAExhdmM2MC4zMQAAAAAAAAAAAAAAACQEIAAAAAAAAASkP7MqcwAAAAAAAAAAAAAA//NIxAAAAANIAAAAAExBTUVVVVVMQU1FMy4xMDBVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//NIxHwAAANIAAAAAFVVVVVVVVVMQU1FMy4xMDBVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//NIxHwAAANIAAAAAFVVVVVVVVVMQU1FMy4xMDBVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//NIxHwAAANIAAAAAFVVVVVVVVVMQU1FMy4xMDBVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//NIxHwAAANIAAAAAFVVVVVVVVVMQU1FMy4xMDBVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//NIxHwAAANIAAAAAFVVVVVVVVVMQU1FMy4xMDBVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//NIxHwAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV';
/* 离线版：每课的音频包以 base64 文本块放在页面末尾（id 为 pk-课名、不会被执行的数据块），用到时才解码 */
function embeddedPack(name) {
  return new Promise((resolve, reject) => {
    const go = () => {
      const el = document.getElementById('pk-' + name);
      if (!el || !AUDIO_OFF[name]) { reject(new Error('没有音频包 ' + name)); return; }
      try {
        const bin = atob(el.textContent.trim()), u8 = new Uint8Array(bin.length);
        for (let j = 0; j < bin.length; j++) u8[j] = bin.charCodeAt(j);
        el.textContent = '';
        resolve({ off: AUDIO_OFF[name], buf: u8.buffer });
      } catch (e) { reject(e); }
    };
    // 页面还没读完时，末尾的音频块可能不完整，等读完再解码
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', go, { once: true }); else go();
  });
}
function b64(u8) { let r = ''; for (let i = 0; i < u8.length; i += 0x8000) r += String.fromCharCode.apply(null, u8.subarray(i, i + 0x8000)); return btoa(r); }
const Clips = {
  packs: {}, loading: {}, cache: new Map(),
  idOf(t) { return hash(audioKey(t)); },
  has(t) { return AUDIO_IDX[this.idOf(t)] != null; },
  load(i) {
    if (this.packs[i]) return Promise.resolve(this.packs[i]);
    if (!this.loading[i]) {
      const name = AUDIO_PACKS[i];
      const get = (f, how) => fetch('audio/' + name + f).then(r => { if (!r.ok) throw new Error('HTTP ' + r.status); return r[how](); });
      this.loading[i] = (OFFLINE ? embeddedPack(name) : Promise.all([get('.json', 'json'), get('.mp3', 'arrayBuffer')]).then(x => ({ off: x[0], buf: x[1] })))
        .then(pk => (this.packs[i] = pk))
        .catch(e => { delete this.loading[i]; throw e; });
    }
    return this.loading[i];
  },
  find(id) { for (const k in this.packs) { if (this.packs[k].off[id]) return this.packs[k]; } return null; },
  pack(name) { const i = AUDIO_PACKS.indexOf(name); if (i >= 0) this.load(i).catch(() => {}); },
  prefetch(texts) {
    const want = new Set();
    texts.forEach(t => { const id = this.idOf(t), i = AUDIO_IDX[id]; if (i != null && !this.find(id)) want.add(i); });
    want.forEach(i => this.load(i).catch(() => {}));
  },
  src(p, id, slow) {
    const e = p.off[id], nat = slow && e.length > 2;
    const k = id + (nat ? '~s' : '');
    let src = this.cache.get(k);
    if (!src) {
      src = 'data:audio/mpeg;base64,' + b64(new Uint8Array(p.buf, nat ? e[2] : e[0], nat ? e[3] : e[1]));
      this.cache.set(k, src);
      if (this.cache.size > 400) this.cache.delete(this.cache.keys().next().value);
    }
    return { src, nat };
  }
};
const Player = {
  el: null, unlocked: false,
  get() { if (!this.el) { this.el = new Audio(); this.el.preload = 'auto'; } return this.el; },
  unlock() {
    if (this.unlocked) return;
    this.unlocked = true;
    const a = this.get();
    if (a.src) return;
    a.src = SILENT;
    const pr = a.play();
    if (pr && pr.then) pr.then(() => { if (a.src === SILENT) a.pause(); }, () => {});
  }
};
const canSpeak = () => AUDIO_PACKS.length > 0 || TTS.ok;
let warnedVoice = false;
const TTS = {
  ok: false, synth: null, voices: [], idv: [], cur: null, timer: 0, u: null, seq: 0,
  init() {
    this.synth = 'speechSynthesis' in window ? window.speechSynthesis : null;
    this.ok = !!(this.synth && window.SpeechSynthesisUtterance);
    if (!this.ok) return;
    const load = () => {
      let all = [];
      try { all = this.synth.getVoices() || []; } catch (e) { all = []; }
      const before = this.voices.length + ':' + this.idv.length;
      this.voices = all;
      this.idv = all.filter(isIdVoice).sort((a, b) => vscore(b) - vscore(a));
      if (before !== this.voices.length + ':' + this.idv.length) onVoices();
    };
    load();
    try { this.synth.addEventListener('voiceschanged', load); } catch (e) { this.synth.onvoiceschanged = load; }
    setTimeout(load, 700); setTimeout(load, 2500);
  },
  status() { if (!this.ok) return 'none'; if (this.idv.length) return 'ok'; if (!this.voices.length) return 'unknown'; return 'novoice'; },
  voice() { return this.idv.find(v => v.voiceURI === DEV.voice || v.name === DEV.voice) || this.idv[0] || null; },
  stop() {
    clearTimeout(this.timer);
    const c = this.cur;
    this.cur = null;
    if (c) { clearInterval(c.watch); markPlaying(c.key, false); }
    if (Player.el) { Player.el.onended = null; Player.el.onerror = null; try { Player.el.pause(); } catch (e) { /* 忽略 */ } }
    if (this.ok) { try { if (this.synth.speaking || this.synth.pending) this.synth.cancel(); } catch (e) { /* 忽略 */ } }
  },
  play(text, key, o) {
    o = o || {};
    this.run([{ text: text, voice: o.voice, tts: o.tts, v: o.v }], key, o);
  },
  run(items, key, o) {
    o = o || {};
    if (this.cur && this.cur.key === key) { this.stop(); return; }
    let busy = false;
    if (this.ok) { try { busy = this.synth.speaking || this.synth.pending; } catch (e) { busy = false; } }
    this.stop();
    const tok = { key, items: items.map(it => ({ text: it.text, voice: it.voice, tts: !!(it.tts || o.tts), v: it.v })), i: 0, slow: !!(o.slow || DEV.slow), loop: !o.noLoop, uid: 0, at: Date.now(), mode: '' };
    this.cur = tok;
    markPlaying(key, true);
    tok.watch = setInterval(() => {
      if (this.cur !== tok || !tok.uid) { if (this.cur !== tok) clearInterval(tok.watch); return; }
      if (tok.mode === 'clip') { const a = Player.el; if (a && (a.ended || (a.paused && Date.now() - tok.at > 2500))) this._done(tok, tok.uid); return; }
      let speaking = true;
      try { speaking = this.synth.speaking || this.synth.pending; } catch (e) { speaking = false; }
      if (!speaking && Date.now() - tok.at > 1800) this._done(tok, tok.uid);
    }, 900);
    if (busy) this.timer = setTimeout(() => this._next(tok), 90); else this._next(tok);
  },
  _done(tok, uid) {
    if (this.cur !== tok || tok.uid !== uid) return;
    tok.uid = 0;
    this.timer = setTimeout(() => this._next(tok), tok.items.length > 1 ? 380 : 0);
  },
  _end(tok) { if (this.cur !== tok) return; this.cur = null; clearInterval(tok.watch); markPlaying(tok.key, false); },
  _next(tok) {
    if (this.cur !== tok) return;
    if (tok.i >= tok.items.length) {
      if (tok.loop && DEV.loop) { tok.i = 0; this.timer = setTimeout(() => this._next(tok), 650); return; }
      return this._end(tok);
    }
    const it = tok.items[tok.i++];
    const id = Clips.idOf(it.text), pi = AUDIO_IDX[id];
    if (pi == null || it.tts) return this._tts(tok, it);
    const p = Clips.find(id);
    if (p) return this._clip(tok, it, p, id);
    Clips.load(pi).then(pk => { if (this.cur === tok) this._clip(tok, it, pk, id); }, () => { if (this.cur === tok) this._tts(tok, it); });
  },
  _clip(tok, it, p, id) {
    const vid = varKey(id, it.v != null ? it.v : varPick(id));   // 指定的读法，否则用这个词选中的读法
    const a = Player.get(), c = Clips.src(p, p.off[vid] ? vid : id, tok.slow);
    const rate = tok.slow ? (c.nat ? 1 : DEV.slowRate) : DEV.rate;
    const uid = ++this.seq;
    tok.uid = uid; tok.at = Date.now(); tok.mode = 'clip';
    a.onended = () => this._done(tok, uid);
    a.onerror = () => { if (this.cur === tok && tok.uid === uid) { tok.uid = 0; this._tts(tok, it); } };
    a.defaultPlaybackRate = rate;
    a.src = c.src;
    a.playbackRate = rate;
    a.preservesPitch = true; a.mozPreservesPitch = true; a.webkitPreservesPitch = true;
    const pr = a.play();
    if (pr && pr.catch) pr.catch(err => {
      if (this.cur !== tok || tok.uid !== uid) return;
      if (err && err.name === 'NotAllowedError') { this._end(tok); toast('浏览器拦截了自动播放，点一下播放按钮就好'); }
      else if (!err || err.name !== 'AbortError') { tok.uid = 0; this._tts(tok, it); }
    });
  },
  _tts(tok, it) {
    if (!this.ok) { this._end(tok); toast('这个浏览器不能朗读这一句'); return; }
    const st = this.status();
    if ((st === 'novoice' || st === 'unknown') && !warnedVoice) { warnedVoice = true; toast('这句只能用设备语音朗读，你的设备没有印尼语语音，读音可能不准'); }
    const u = new SpeechSynthesisUtterance(cleanTTS(it.text));
    const v = it.voice || this.voice();
    if (v) { u.voice = v; u.lang = v.lang; } else u.lang = 'id-ID';
    u.rate = tok.slow ? DEV.slowRate : DEV.rate;
    const uid = ++this.seq;
    tok.uid = uid; tok.at = Date.now(); tok.mode = 'tts';
    u.onend = () => this._done(tok, uid);
    u.onerror = e => {
      if (this.cur !== tok || tok.uid !== uid) return;
      const err = e && e.error;
      if (err === 'interrupted' || err === 'canceled') return;
      this._end(tok);
      toast(err === 'not-allowed' ? '浏览器拦截了自动朗读，点一下播放按钮就好' : '设备语音朗读没有成功' + (err ? '（' + err + '）' : ''));
    };
    this.u = u;
    try { this.synth.resume(); } catch (e) { /* 忽略 */ }
    this.synth.speak(u);
  }
};
function onVoices() {
  if (UI.route.name === 'pron' || UI.route.name === 'me') render();
}
function autoSay(text) { if (DEV.autoplay && text && canSpeak()) TTS.play(text, text, { noLoop: false }); }

/* ---------- Claude（页面内 AI） ---------- */
const AI = {
  s: undefined, denied: false,
  async init() {
    try { this.s = window.claude && typeof window.claude.use === 'function' ? await window.claude.use('sample') : null; }
    catch (e) { this.s = null; }
    refreshAIBits();
  },
  ok() { return !!this.s && !this.denied; },
  async json(prompt) {
    try { return await this.s.json(prompt, { modelTier: 'quick', cache: false }); }
    catch (e) {
      if (e && ['not_granted', 'sampling_disabled', 'not_declared', 'capability_disabled', 'capability_removed'].includes(e.code)) { this.denied = true; refreshAIBits(); }
      throw e;
    }
  }
};
function aiErr(e) {
  const c = e && e.code;
  return {
    rate_limited: '请求有点频繁，等一会儿再试。',
    not_granted: '你没有允许本页面使用 Claude，AI 功能已停用。',
    sampling_disabled: '当前账号无法在页面里使用 Claude。',
    session_expired: '登录已过期，刷新页面重新登录后再试。',
    invalid_json: '这次返回的格式不对，点“重试”再来一次。',
    refused: '这一句没有生成出来，换个场景试试。',
    empty_completion: '没有生成内容，再试一次。'
  }[c] || '生成失败了，请稍后重试。';
}
function levelDesc() {
  const n = learnedIds().length;
  if (n < 80) return '入门（已学 ' + n + ' 个词）：句子 4–7 个词，只用最常见的词，少用复杂词缀';
  if (n < 250) return '初级（已学 ' + n + ' 个词）：句子 5–9 个词，可以用常见的 me-、ber-、di- 形式';
  return '初中级（已学 ' + n + ' 个词）：句子 6–12 个词，可以有简单从句';
}
function knownWords() { const ids = learnedIds(); return ids.length ? ids.slice(-80).map(id => WORDS[id].w).join(', ') : '（还没有，先用最基础的词）'; }
function ensureMark(s, word) {
  if (/\[[^\]]+\]/.test(s)) return s;
  const first = String(word).split(' ')[0].replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const re = new RegExp('([A-Za-z\\-]*' + first + '[A-Za-z\\-]*)', 'i');
  return s.replace(re, '[$1]');
}
const strv = (v, max) => String(v == null ? '' : v).slice(0, max || 400);
function refreshAIBits() {
  $$('.aibox[data-w]').forEach(el => { const w = WLIST[+el.dataset.w]; if (w) el.innerHTML = aiInner(w); });
  const d = $('#dlg-box');
  if (d && UI.route.name === 'topic') d.innerHTML = dlgPanel(UI.route.arg);
  $$('.ex-tools').forEach(el => { el.querySelectorAll('[data-act="gloss"]').forEach(b => { b.hidden = !AI.ok(); }); });
}
async function aiSentence(wid) {
  const w = WORDS[wid];
  if (!w || !AI.ok()) return;
  const st = UI.ai[wid] || (UI.ai[wid] = {});
  st.scene = st.scene || defaultScene();
  st.status = 'loading';
  refreshAI(w);
  const existing = w.ex.map(e => '- ' + plain(e.id)).concat((S.saved[wid] || []).filter(x => !x.x).map(e => '- ' + plain(e.id))).concat(st.data ? ['- ' + plain(st.data.id)] : []).join('\n');
  const prompt = '你是一位经验丰富的印尼语老师，学生的母语是中文。请为下面这个词写 1 个全新的印尼语例句。\n\n'
    + '目标词：' + w.w + '（' + (POSN[w.pos] || w.pos) + '，中文：' + w.zh + '）\n'
    + '场景：' + SCENE_DESC[st.scene] + '\n'
    + '学生水平：' + levelDesc() + '\n'
    + '学生已经认识的词（尽量用这些词，其余用常见词）：' + knownWords() + '\n'
    + '已有例句（不要重复，也不要只换一两个词）：\n' + existing + '\n\n'
    + '要求：\n1. 句子自然、地道，是这个场景里真的会说或会写的话；用标准印尼语，口语场景可以稍微口语化。\n'
    + '2. 用方括号把目标词在句中的形式括起来（可以是加了词缀的形式），只括一处，例如：Saya [membeli] kopi.\n'
    + '3. 中文翻译准确自然。\n'
    + '4. gloss 列出句中学生可能不认识的词（不含目标词，最多 4 个），每项是 [印尼语, 中文]。\n'
    + '5. tip 用一句中文（不超过 40 字）说明这个句子里值得注意的用法，没有就写空字符串。\n\n'
    + '只输出 JSON，不要其他文字：\n{"id": "印尼语例句", "zh": "中文翻译", "gloss": [["kata", "词"]], "tip": ""}';
  try {
    const r = await AI.json(prompt);
    if (!r || typeof r.id !== 'string' || typeof r.zh !== 'string' || !r.id.trim()) throw { code: 'invalid_json' };
    st.data = {
      id: ensureMark(strv(r.id, 300).trim(), w.w),
      zh: strv(r.zh, 300).trim(),
      gloss: (Array.isArray(r.gloss) ? r.gloss : []).filter(g => Array.isArray(g) && g.length >= 2).slice(0, 5).map(g => [strv(g[0], 40), strv(g[1], 40)]),
      tip: strv(r.tip, 120),
      scene: st.scene
    };
    st.status = 'done';
  } catch (e) { st.status = 'error'; st.err = aiErr(e); }
  if (UI.ai[wid] === st) refreshAI(w);
}
function refreshAI(w) { $$('.aibox[data-w="' + w.k + '"]').forEach(el => { el.innerHTML = aiInner(w); }); }
async function aiGloss(s, z) {
  const k = hash(s);
  const st = UI.gloss[k] || (UI.gloss[k] = {});
  if (st.status === 'done' || st.status === 'loading') { st.open = !st.open; refreshGloss(s); return; }
  if (!AI.ok()) return;
  st.status = 'loading'; st.open = true;
  refreshGloss(s);
  const prompt = '把下面这个印尼语句子逐词拆解给中文母语的初学者看。\n句子：' + plain(s) + '\n参考译文：' + plain(z || '') + '\n\n'
    + '要求：按句子顺序列出每个词（标点不用列，专有名词也列出），给出它在本句中的中文意思；如果这个词带词缀或是缩略形式（如 me-、ber-、di-、ter-、ke-…-an、-kan、-i、-nya、-ku、-mu），在 note 里用很短的中文说明，例如 "me- + beli（买）"，没有就留空。最后用一句中文（不超过 50 字）点出这个句子最值得学的语法点。\n\n'
    + '只输出 JSON：{"tokens": [{"w": "词", "zh": "中文", "note": ""}], "point": ""}';
  try {
    const r = await AI.json(prompt);
    if (!r || !Array.isArray(r.tokens) || !r.tokens.length) throw { code: 'invalid_json' };
    st.data = { tokens: r.tokens.slice(0, 40).map(t => ({ w: strv(t && t.w, 40), zh: strv(t && t.zh, 40), note: strv(t && t.note, 60) })), point: strv(r.point, 160) };
    st.status = 'done';
  } catch (e) { st.status = 'error'; st.err = aiErr(e); }
  refreshGloss(s);
}
function glossHTML(s) {
  const st = UI.gloss[hash(s)];
  if (!st || !st.open) return '';
  if (st.status === 'loading') return '<div class="ai-wait" style="margin-top:8px"><span class="dots3"><i></i><i></i><i></i></span>正在拆解…</div>';
  if (st.status === 'error') return '<p class="ai-err" style="margin-top:8px">' + esc(st.err) + '</p>';
  if (st.status !== 'done') return '';
  return '<div class="gloss">' + st.data.tokens.map(t => '<span><b lang="id">' + esc(t.w) + '</b><i>' + esc(t.zh) + '</i>' + (t.note ? '<em>' + esc(t.note) + '</em>' : '') + '</span>').join('')
    + (st.data.point ? '<p class="gloss-point">' + esc(st.data.point) + '</p>' : '') + '</div>';
}
function refreshGloss(s) { $$('#gl-' + hash(s)).forEach(el => { el.innerHTML = glossHTML(s); }); }
async function aiDialog(tid) {
  const t = TOPIC_BY[tid];
  if (!t || !AI.ok()) return;
  const st = UI.dlg[tid] || (UI.dlg[tid] = {});
  st.scene = st.scene || (t.sc.find(c => S.prefs.interests.includes(c)) || t.sc[0]);
  st.status = 'loading';
  refreshDlg(tid);
  const prompt = '为中文母语的印尼语学习者写一段情景对话。\n主题：' + t.zh + '（' + t.idn + '）\n场景偏好：' + SCENE_DESC[st.scene] + '\n学生水平：' + levelDesc() + '\n'
    + '尽量自然地用上这些本课词汇：' + t.words.map(w => w.w).join(', ') + '\n\n'
    + '要求：A、B 两人轮流说话，共 6–8 句；每句不超过 14 个词；内容真实、有用，像在印尼真的会发生的对话；用标准而自然的印尼语。\n\n'
    + '只输出 JSON：{"title": "中文小标题", "setting": "一句中文场景说明", "lines": [{"who": "A", "id": "印尼语", "zh": "中文"}], "words": [["对话里值得记的词", "中文"]]}';
  try {
    const r = await AI.json(prompt);
    if (!r || !Array.isArray(r.lines) || !r.lines.length) throw { code: 'invalid_json' };
    st.data = {
      title: strv(r.title, 60), setting: strv(r.setting, 160),
      lines: r.lines.slice(0, 12).filter(l => l && typeof l.id === 'string').map(l => ({ who: String(l.who || 'A').toUpperCase().indexOf('B') === 0 ? 'B' : 'A', id: strv(l.id, 300), zh: strv(l.zh, 300) })),
      words: (Array.isArray(r.words) ? r.words : []).filter(g => Array.isArray(g) && g.length >= 2).slice(0, 8).map(g => [strv(g[0], 40), strv(g[1], 40)])
    };
    st.status = 'done';
  } catch (e) { st.status = 'error'; st.err = aiErr(e); }
  refreshDlg(tid);
}
function refreshDlg(tid) { const el = $('#dlg-box'); if (el && UI.route.name === 'topic' && UI.route.arg === tid) el.innerHTML = dlgPanel(tid); }

/* ---------- 小组件 ---------- */
function sayBtn(text, cls, label) {
  const p = plain(text);
  return '<button class="say ' + (cls || '') + '" data-say="' + esc(p) + '" aria-label="' + esc((label || '朗读') + '：' + p) + '">' + ico('play') + '</button>';
}
function exItem(e, o) {
  o = o || {};
  const p = plain(e.id);
  return '<li class="ex ' + (o.ai ? 'ai' : '') + '">' + sayBtn(e.id, 'sm') + '<div class="ex-body"><p class="ex-id" lang="id">' + hl(e.id) + '</p><p class="ex-zh">' + esc(e.zh) + '</p>'
    + (o.bare ? '' : '<div class="ex-tools">' + (o.ai ? '<span class="tag">AI</span>' : '') + '<button data-say="' + esc(p) + '" data-rate="slow">慢速</button>'
      + '<button data-act="gloss" data-s="' + esc(e.id) + '" data-z="' + esc(e.zh) + '"' + (AI.ok() ? '' : ' hidden') + '>逐词拆解</button>'
      + (o.wid ? '<button data-act="unsave" data-id="' + esc(o.wid) + '" data-s="' + esc(e.id) + '">删除</button>' : '') + '</div>')
    + '<div id="gl-' + hash(e.id) + '">' + glossHTML(e.id) + '</div></div></li>';
}
function tipCard(x) { return '<article class="tipcard"><p class="eyebrow"><span class="flag-mini" aria-hidden="true"></span>文化小贴士 · Budaya</p><h3>' + esc(x.t) + '</h3><p>' + rich(x.b) + '</p></article>'; }
// stack：窄屏上把每一行排成一块，表头变成各项前面的小标签（速查表里三列以上的表用）
function tableHTML(t, stack) {
  const head = t[0], rows = t.slice(1);
  return '<div class="gtable' + (stack ? ' stack' : '') + '"><table><thead><tr>' + head.map(c => '<th>' + rich(c) + '</th>').join('') + '</tr></thead><tbody>'
    + rows.map(r => '<tr>' + r.map((c, i) => '<td' + (stack ? ' data-label="' + esc(head[i] || '') + '"' : '') + '>' + rich(c) + '</td>').join('') + '</tr>').join('') + '</tbody></table></div>';
}
function quizBlock(d, q, qi) {
  const ans = UI.dq[d.id + ':' + qi];
  const done = ans != null;
  return '<div class="stack" id="dq-' + d.id + '-' + qi + '"><p><b>' + rich(q.q) + '</b></p><div class="qopts">'
    + q.o.map((o, oi) => '<button class="qopt ' + (done ? (oi === q.a ? 'right' : (oi === ans ? 'wrong' : '')) : '') + '" data-act="dq" data-d="' + d.id + '" data-q="' + qi + '" data-o="' + oi + '"' + (done ? ' disabled' : '') + '>' + esc(o) + '</button>').join('')
    + '</div>' + (done ? '<p class="why">' + (ans === q.a ? '答对了！' : '再看一眼：') + rich(q.why) + '</p>' : '') + '</div>';
}
function deckHTML(d) {
  const n = d.cards.length + (d.quiz.length ? 1 : 0);
  const cards = d.cards.map((c, i) => '<section class="gcard" aria-label="第 ' + (i + 1) + ' 张，共 ' + n + ' 张"><p class="eyebrow">语法卡片 · ' + (i + 1) + '/' + n + '</p><h4>' + esc(c.h) + '</h4>'
    + (c.p ? '<p>' + rich(c.p) + '</p>' : '') + (c.t ? tableHTML(c.t) : '')
    + (c.ex ? '<ol class="exs">' + c.ex.map(e => exItem({ id: e[0], zh: e[1] }, { bare: true })).join('') + '</ol>' : '') + '</section>').join('');
  const quiz = d.quiz.length ? '<section class="gcard" aria-label="小测"><p class="eyebrow">小测 · ' + n + '/' + n + '</p>' + d.quiz.map((q, qi) => quizBlock(d, q, qi)).join('') + '</section>' : '';
  return '<div class="deck" data-deck="' + d.id + '"><div class="deck-head"><h3>' + esc(d.zh) + '</h3><small lang="id">' + esc(d.idn) + '</small></div>'
    + '<div class="deck-track" tabindex="0" aria-label="语法卡片，左右滑动查看">' + cards + quiz + '</div>'
    + '<div class="deck-nav"><button class="nb" data-act="dprev" aria-label="上一张">' + ico('back') + '</button><div class="ddots">'
    + Array.from({ length: n }, (_, i) => '<i class="' + (i === 0 ? 'on' : '') + '"></i>').join('') + '</div><button class="nb" data-act="dnext" aria-label="下一张">' + ico('next') + '</button></div>'
    + refLinks(d.id) + '</div>';
}
/* ---------- 语法速查表 ---------- */
function refLinks(deckId) {
  const rs = REFS.filter(r => (r.rel || []).includes(deckId));
  return rs.length ? '<p class="deck-ref">速查表：' + rs.map(r => '<a href="#ref-' + r.id + '">' + esc(r.zh) + '</a>').join('、') + '</p>' : '';
}
function refCard(c) {
  return '<div class="refc">' + (c.h ? '<h4>' + esc(c.h) + '</h4>' : '') + (c.p ? '<p>' + rich(c.p) + '</p>' : '') + (c.t ? tableHTML(c.t, c.t[0].length >= 3 && !c.keep) : '') + (c.n ? '<p>' + rich(c.n) + '</p>' : '')
    + (c.ex ? '<ol class="exs">' + c.ex.map(e => exItem({ id: e[0], zh: e[1] }, { bare: true })).join('') + '</ol>' : '') + '</div>';
}
function vRef(open) {
  Clips.pack('ref');
  let h = '<div class="page wrap"><a class="back" href="#learn">' + ico('back') + '课程</a><div><h1 class="h-page">语法速查表</h1><p class="sub">变化规则和常用词的总表，共 ' + REFS.length + ' 张，随时可以翻。点标题展开，点表格里的印尼语可以听发音。想按顺序学的话不用管这里，语法卡片会在课程里自动出现。</p></div>';
  REF_GROUPS.forEach(g => {
    const rs = REFS.filter(r => r.g === g[0]);
    h += '<section class="stack"><h2 class="h-sec">' + g[1] + ' <small>' + rs.length + ' 张</small></h2>'
      + rs.map(r => '<details class="card refd" id="ref-' + r.id + '"' + (open === r.id ? ' open' : '') + '><summary><span class="grow"><b>' + esc(r.zh) + '</b><small>' + esc(r.sub) + '</small></span>' + ico('next') + '</summary><div class="refb">' + r.cards.map(refCard).join('') + '</div></details>').join('')
      + '</section>';
  });
  return h + '</div>';
}
function deckRow(d) {
  const seen = !!S.prefs.decks[d.id];
  return '<button class="deckrow ' + (seen ? 'seen' : '') + '" data-act="deck" data-d="' + d.id + '"><span class="gi">' + (seen ? ico('check') : '语') + '</span><span class="grow"><b>' + esc(d.zh) + '</b><small lang="id">' + esc(d.idn) + '</small></span><span class="tag ' + (seen ? 'pos' : '') + '">' + (seen ? '已读' : d.cards.length + ' 张') + '</span></button>';
}
function wordRow(w) {
  const s = S.words[w.id], lv = s && s[0] > 0 ? s[0] : 0;
  return '<div class="wrow"><span class="lv l' + lv + '" title="' + (lv ? '熟练度 ' + lv + '/8' : '未学') + '"></span><button class="wrow-main" data-act="word" data-id="' + esc(w.id) + '"><span class="w" lang="id">' + esc(w.w) + '</span><span class="ipa-s">' + esc(IPA.of(w.w)) + '</span><span class="p">' + (POSN[w.pos] || '') + '</span>' + (AUDIO_HUMAN[hash(audioKey(w.w))] ? '<span class="hum" title="真人录音">真人</span>' : '') + '<span class="z">' + esc(w.zh) + '</span></button>' + sayBtn(w.w, 'sm') + '</div>';
}
function ringSVG(p) {
  const r = 26, c = 2 * Math.PI * r, v = Math.max(0, Math.min(1, p));
  return '<svg viewBox="0 0 64 64" aria-hidden="true"><circle class="trk" cx="32" cy="32" r="' + r + '" fill="none" stroke-width="7"/><circle class="val" cx="32" cy="32" r="' + r + '" fill="none" stroke-width="7" stroke-dasharray="' + f1(c * v) + ' ' + f1(c) + '"/></svg>';
}
function sceneSeg(act, id, cur) {
  return '<div class="seg" role="group" aria-label="场景">' + Object.keys(SCENES).map(k => '<button data-act="' + act + '" data-id="' + esc(id) + '" data-v="' + k + '" aria-pressed="' + (cur === k) + '">' + SCENES[k] + '</button>').join('') + '</div>';
}
function aiInner(w) {
  const st = UI.ai[w.id] || {};
  const sc = st.scene || defaultScene();
  const head = '<div class="ai-head"><b>' + ico('spark') + 'AI 场景例句</b></div>' + sceneSeg('aiScene', w.id, sc);
  if (AI.s === null || AI.denied) return head + '<p class="ai-note">' + (AI.denied ? '你没有允许本页面使用 Claude，AI 例句已停用。可以在页面的权限设置里重新开启。' : 'AI 例句需要在 claude.ai 里打开本页面才能使用。') + '</p>';
  if (AI.s === undefined) return head + '<p class="ai-note">正在连接 Claude…</p>';
  const id = esc(w.id);
  if (st.status === 'loading') return head + '<div class="ai-wait"><span class="dots3"><i></i><i></i><i></i></span>Claude 正在按“' + SCENES[sc] + '”场景写例句…</div>';
  if (st.status === 'error') return head + '<p class="ai-err">' + esc(st.err) + '</p><div class="row"><button class="btn sm" data-act="aiGen" data-id="' + id + '">重试</button></div>';
  if (st.status === 'done') {
    const d = st.data;
    const saved = (S.saved[w.id] || []).some(x => !x.x && x.id === d.id);
    return head + '<ol class="exs">' + exItem({ id: d.id, zh: d.zh }, { ai: true }) + '</ol>'
      + (d.gloss.length ? '<div class="wchips">' + d.gloss.map(g => '<span class="wchip">' + sayBtn(g[0], '') + '<b lang="id">' + esc(g[0]) + '</b><span>' + esc(g[1]) + '</span></span>').join('') + '</div>' : '')
      + (d.tip ? '<p class="ai-tip">' + esc(d.tip) + '</p>' : '')
      + (TTS.status() === 'ok' ? '' : '<p class="ai-note">AI 句子要用设备的印尼语语音朗读，你的设备上没找到，读音可能不准，见“设置 → AI 句子用的设备语音”。</p>')
      + '<div class="row wrap-ok"><button class="btn sm" data-act="aiGen" data-id="' + id + '">换一句</button><button class="btn sm soft" data-act="aiSave" data-id="' + id + '"' + (saved ? ' disabled' : '') + '>' + (saved ? '已收藏' : '收藏到例句') + '</button></div>'
      + '<p class="ai-note">AI 生成的句子偶尔会有不自然的地方，拿不准时以课程例句为准。</p>';
  }
  return head + '<div class="row wrap-ok"><button class="btn soft sm" data-act="aiGen" data-id="' + id + '">' + ico('spark') + '生成一个新例句</button></div><p class="ai-note">Claude 会参考你已学的 ' + learnedIds().length + ' 个词和所选场景，现写一句并附中文翻译。</p>';
}
function varRow(w) {
  const id = hash(audioKey(w.w)), vs = varsOf(id);
  if (vs.length < 2) return '';
  const cur = varPick(id);
  let n = 0;
  const lab = c => c === 's' ? '合成语音' : '真人 ' + (++n) + (c === 'm' ? ' · 男声' : c === 'f' ? ' · 女声' : '');
  return '<div class="w-vars"><p class="lbl">换个读法对比</p><div class="chips">'
    + vs.split('').map((c, k) => '<button class="chip vchip" data-act="pickVar" data-id="' + esc(w.id) + '" data-v="' + k + '" data-key="var:' + id + ':' + k + '" aria-pressed="' + (k === cur) + '">' + ico('play') + lab(c) + '</button>').join('')
    + '</div><p class="hint">点一个听一下。选中的那个以后就是这个词的读音，“播放”和“慢速”也用它。</p></div>';
}
function srcLine(w) {
  const id = hash(audioKey(w.w)), fl = (+S.flags[w.id] || 0) > 0;
  const h = varsOf(id)[varPick(id)] === 's' ? null : humanOf(w.w);
  const src = h
    ? '<span class="tag hum-tag">真人录音</span><span class="w-src-who">' + esc(h.speaker) + ' · <a href="' + esc(h.url) + '" target="_blank" rel="noopener">' + esc(h.license || '查看许可') + '</a></span>'
    : '<span class="tag">合成语音</span>';
  return '<div class="w-src">' + src + '<button class="linkbtn' + (fl ? ' flagged' : '') + '" data-act="flag" data-id="' + esc(w.id) + '">' + (fl ? '已标记读音问题 · 取消' : '读音不对？标记一下') + '</button></div>';
}
function wordCard(w) {
  const s = S.words[w.id], t = TOPIC_BY[w.topic];
  const saved = (S.saved[w.id] || []).filter(x => !x.x);
  const p = esc(w.w);
  return '<article class="wcard">'
    + '<div class="w-top"><span class="tag pos">' + (POSN[w.pos] || esc(w.pos)) + '</span><a class="tag" href="#t-' + t.id + '">第 ' + t.n + ' 课 · ' + esc(t.zh) + '</a>' + (s && s[0] > 0 ? '<span class="w-srs">' + srsText(s) + '</span>' : '') + '</div>'
    + '<h2 class="w-word" lang="id">' + p + '</h2>'
    + '<p class="w-ipa">' + esc(IPA.of(w.w)) + '</p>'
    + '<div class="w-audio"><button class="say text" data-say="' + p + '">' + ico('play') + '播放</button><button class="say text ghost" data-say="' + p + '" data-rate="slow">' + ico('slow') + '慢速</button></div>'
    + varRow(w)
    + srcLine(w)
    + '<p class="w-zh">' + esc(w.zh) + '</p>'
    + (w.note ? '<p class="w-note">' + esc(w.note) + '</p>' : '')
    + '<ol class="exs">' + w.ex.map(e => exItem(e)).join('') + saved.map(e => exItem(e, { ai: true, wid: w.id })).join('') + '</ol>'
    + (OFFLINE ? '' : '<div class="aibox" data-w="' + w.k + '">' + aiInner(w) + '</div>')
    + '</article>';
}
function dlgPanel(tid) {
  if (AI.s === null || AI.denied) return '';
  const t = TOPIC_BY[tid], st = UI.dlg[tid] || {};
  const sc = st.scene || (t.sc.find(c => S.prefs.interests.includes(c)) || t.sc[0]);
  const head = '<div class="ai-head"><b>' + ico('spark') + 'AI 情景对话</b></div>' + sceneSeg('dlgScene', tid, sc);
  if (AI.s === undefined) return '<div class="aibox">' + head + '<p class="ai-note">正在连接 Claude…</p></div>';
  if (st.status === 'loading') return '<div class="aibox">' + head + '<div class="ai-wait"><span class="dots3"><i></i><i></i><i></i></span>Claude 正在用本课的词写对话…</div></div>';
  if (st.status === 'error') return '<div class="aibox">' + head + '<p class="ai-err">' + esc(st.err) + '</p><div class="row"><button class="btn sm" data-act="dlgGen" data-id="' + tid + '">重试</button></div></div>';
  if (st.status === 'done') {
    const d = st.data;
    return '<div class="aibox">' + head + '<div><h3 style="font-size:16px;font-weight:750">' + esc(d.title) + '</h3><p class="sub">' + esc(d.setting) + '</p></div>'
      + '<div class="stack" style="gap:8px">' + d.lines.map(l => '<div class="dlg-line ' + (l.who === 'B' ? 'b' : '') + '"><span class="who">' + l.who + '</span><ol class="exs" style="flex:1;min-width:0">' + exItem({ id: l.id, zh: l.zh }, { ai: true }) + '</ol></div>').join('') + '</div>'
      + (d.words.length ? '<div class="wchips">' + d.words.map(g => '<span class="wchip">' + sayBtn(g[0], '') + '<b lang="id">' + esc(g[0]) + '</b><span>' + esc(g[1]) + '</span></span>').join('') + '</div>' : '')
      + '<div class="row wrap-ok"><button class="btn sm primary" data-act="dlgPlay" data-id="' + tid + '" data-key="dlg:' + tid + '">' + ico('play') + '连续播放</button><button class="btn sm" data-act="dlgGen" data-id="' + tid + '">再写一段</button></div></div>';
  }
  return '<div class="aibox">' + head + '<p class="ai-note">用本课的词现写一段 6–8 句的对话，可以逐句听，也可以连续播放。</p><div class="row"><button class="btn soft sm" data-act="dlgGen" data-id="' + tid + '">' + ico('spark') + '生成对话</button></div></div>';
}
function voiceCard(force) {
  const st = TTS.status();
  if (st === 'ok' && !force) return '';
  if (st === 'ok') { const v = TTS.voice(); return '<p class="hint">当前语音：' + esc(v ? v.name : '') + '（共找到 ' + TTS.idv.length + ' 个印尼语语音）</p>'; }
  const msg = st === 'none' ? '这个浏览器不支持网页朗读，AI 现写的句子没法朗读（课程音频不受影响）。' : st === 'unknown' ? '还没读到设备的语音列表。AI 句子朗读不准的话，可以按下面的方法安装印尼语语音。' : '这台设备上没有印尼语语音，AI 现写的句子会用其他语言的语音读，读音不准（课程音频不受影响）。';
  return '<section class="card voicewarn"><h3>想让 AI 句子也读得准</h3><p>' + msg + '</p><ul>'
    + '<li>iPhone / iPad：设置 → 辅助功能 → 朗读内容 → 声音 → 印度尼西亚语，下载 Damayanti（选“增强版”音质更好）。</li>'
    + '<li>安卓手机：设置 → 文字转语音输出 → 首选引擎选 Google → 安装语音数据 → 印度尼西亚语；用 Chrome 打开本页。</li>'
    + '<li>电脑：推荐用 Edge（自带自然音质的 Gadis / Ardi 语音）或 Chrome 打开。</li>'
    + '</ul></section>';
}

/* ---------- 页面：今天 ---------- */
function greeting() {
  const h = new Date().getHours();
  if (h < 10) return { id: 'Selamat pagi', zh: '早上好' };
  if (h < 15) return { id: 'Selamat siang', zh: '中午好' };
  if (h < 18) return { id: 'Selamat sore', zh: '下午好' };
  return { id: 'Selamat malam', zh: '晚上好' };
}
function todaySentence() {
  const ids = learnedIds();
  const words = ids.length ? ids.map(id => WORDS[id]) : TOPICS[0].words;
  const pool = [];
  words.forEach(w => w.ex.forEach(e => pool.push([w, e])));
  if (!pool.length) return null;
  return pool[Math.abs(today() * 7919) % pool.length];
}
function onboardCard() {
  // 场景只影响 AI 例句，离线版没有 AI，所以只问每天的词数
  return '<section class="card stack">' + (OFFLINE
    ? '<div><p class="eyebrow">开始之前</p><h2 class="h-sec" style="margin-top:4px">每天学几个新词？</h2><p class="sub">之后可以在设置里改。</p></div><div class="set"><div class="seg">'
    : '<div><p class="eyebrow">先做两个选择</p><h2 class="h-sec" style="margin-top:4px">学印尼语主要用在哪？</h2><p class="sub">AI 例句和对话会优先写这些场景，之后可以在设置里改。</p></div>'
    + '<div class="chips">' + Object.keys(SCENES).map(k => '<button class="chip" data-act="interest" data-v="' + k + '" aria-pressed="' + S.prefs.interests.includes(k) + '">' + SCENES[k] + '</button>').join('') + '</div>'
    + '<div class="set"><span class="lbl">每天学几个新词？</span><div class="seg">')
    + [5, 10, 15, 20].map(n => '<button data-act="pref" data-k="goal" data-v="' + n + '" aria-pressed="' + (S.prefs.goal === n) + '">' + n + ' 个</button>').join('') + '</div></div>'
    + '<div class="row wrap-ok"><button class="btn primary" data-act="onbDone">好了</button><span class="hint muted">为工作学的话，可以直接从“职场与矿业”的课开始。</span></div></section>';
}
function vHome() {
  const t = today(), L = S.log[dkey(t)] || {}, nNew = L.n || 0, nRev = L.r || 0;
  const s = streakInfo(), learned = learnedIds().length, due = dueIds(), goal = S.prefs.goal, g = greeting(), next = nextTopic();
  let h = '<div class="page wrap">';
  if (OFFLINE && !LS_OK) h += '<section class="card voicewarn"><h3>进度存不下来</h3><p>这个浏览器不允许本地网页保存数据，关掉页面后学习进度会丢失。请换用 Chrome 或 Edge 打开这个文件；暂时换不了的话，学完后到“设置”里点“复制备份”，把内容存好。</p></section>';
  if (!S.prefs.t && !UI.onbSkip && !learned) h += onboardCard();
  h += '<section class="card hero"><p class="eyebrow">' + fmtDay(t) + '</p>'
    + '<h1 class="hero-greet"><button class="say-inline" data-say="' + g.id + '" lang="id" style="border:0">' + g.id + '</button></h1>'
    + '<p>' + g.zh + '！' + (s.todayDone ? '今天已经学过了，再巩固几个词吧。' : s.cur ? '已经连续学习 ' + s.cur + ' 天，今天别断。' : '今天学几个词，开始堆你的小山。') + '</p>'
    + '<div class="hero-stats"><div class="hstat"><b>' + ico('flame', 'flame') + s.cur + '</b><span>连续天数</span></div><div class="hstat"><b>' + learned + '</b><span>已学词汇</span></div><div class="hstat"><b>' + due.length + '</b><span>待复习</span></div>' + (s.best > 1 ? '<div class="hstat"><b>' + s.best + '</b><span>最长连续</span></div>' : '') + '</div>'
    + '<div data-chart="hill" role="img" aria-label="词汇小山：已学 ' + learned + ' 个词"></div></section>';
  if (UI.sess && !UI.sess.finished) {
    const ss = UI.sess, tt = TOPIC_BY[ss.tid];
    h += '<section class="card action"><div class="grow"><p class="eyebrow">学到一半</p><h3>' + esc(tt.zh) + '</h3><p class="sub">还有 ' + Math.max(0, ss.steps.length - ss.i) + ' 步没完成</p></div><a class="btn primary" href="#study">继续</a></section>';
  }
  h += '<section class="card action"><div class="goal-ring">' + ringSVG(nNew / goal) + '<span class="num">' + nNew + '</span></div><div class="grow"><p class="eyebrow">今日新词 ' + nNew + ' / ' + goal + '</p>'
    + (next ? '<h3>' + esc(next.zh) + '</h3><p class="sub">第 ' + next.n + ' 课 · 还有 ' + next.words.filter(w => !isLearned(w.id)).length + ' 个新词</p></div><button class="btn primary" data-act="study" data-t="' + next.id + '">学习</button>' : '<h3>课程里的词都学完了</h3><p class="sub">' + (OFFLINE ? '用复习继续巩固' : '用复习和 AI 例句继续巩固') + '</p></div>')
    + '</section>';
  // 今日复习：到期的词，上次选了“模糊 / 不认识”的排最前
  const weakDue = due.filter(id => isWeak(S.words[id])).length, wait = waitingIds().length, soon = due.length ? 0 : soonIds().length;
  if (due.length) {
    h += '<section class="card action"><div class="goal-ring">' + ringSVG(nRev / (nRev + due.length)) + '<span class="num">' + due.length + '</span></div><div class="grow"><p class="eyebrow">今日复习</p><h3>' + due.length + ' 个词到期</h3><p class="sub">' + (weakDue ? weakDue + ' 个上次选了“模糊”或“不认识”，会先考。' : '看中文回想印尼语，再核对答案。') + (wait ? ' 另有 ' + wait + ' 个不认识的词在等 10 分钟后再考。' : '') + '</p></div><a class="btn primary" href="#review">复习</a></section>';
  } else if (learned) {
    const nd = learnedIds().map(id => S.words[id][1]).sort((a, b) => a - b)[0];
    h += '<section class="card action"><div class="goal-ring">' + ringSVG(wait ? 0 : 1) + '<span>' + (wait ? '<span class="num">' + wait + '</span>' : ico('check')) + '</span></div><div class="grow"><p class="eyebrow">今日复习</p><h3>' + (wait ? wait + ' 个词等 10 分钟后再考' : '现在没有到期的词') + '</h3><p class="sub">' + (wait ? '刚才选了“不认识”的词，过一会儿回来再考一次。' : '下一批在' + (nd - t <= 1 ? '明天' : ' ' + fmtDay(nd)) + '。') + (soon ? ' 有 ' + soon + ' 个快到期或没记牢的词可以提前复习。' : '') + '</p></div>' + (soon || wait ? '<a class="btn" href="#review">去看看</a>' : '') + '</section>';
  }
  const ts = todaySentence();
  if (next) Clips.pack(next.id);
  if (ts) {
    Clips.pack(ts[0].topic);
    h += '<section class="card stack today-sent"><p class="eyebrow">今日一句 · ' + esc(ts[0].w) + '</p><ol class="exs">' + exItem(ts[1]) + '</ol></section>';
  }
  h += '<section class="card stack"><div class="row"><h2 class="h-sec grow">坚持记录 <small>本周在中间</small></h2><a class="linkbtn" href="#stats">查看进度</a></div><div class="chart-scroll">' + heatSVG(16, 7) + '</div>' + heatLegend() + '</section>';
  h += '<p class="proverb"><i lang="id">Sedikit demi sedikit, lama-lama menjadi bukit.</i><br>一点一点积累，终会堆成一座山。</p></div>';
  return h;
}

/* ---------- 页面：课程 ---------- */
function topicCard(t) {
  const s = topicStats(t);
  return '<a class="tcard ' + (s.l === s.n ? 'done' : '') + '" href="#t-' + t.id + '"><span class="tnum">第 ' + t.n + ' 课</span><h3>' + esc(t.zh) + '</h3><span class="idn" lang="id">' + esc(t.idn) + '</span>'
    + '<span class="tmeta"><span class="bar"><i style="width:' + f1(s.l / s.n * 100) + '%"></i></span><span class="num">' + s.l + '/' + s.n + '</span></span>'
    + '<span class="row wrap-ok">' + t.sc.map(c => '<span class="tag">' + SCENES[c] + '</span>').join('') + '</span></a>';
}
function searchResults(q) {
  q = q.trim().toLowerCase();
  if (!q) return '';
  const res = WLIST.filter(w => w.w.toLowerCase().indexOf(q) >= 0 || w.zh.indexOf(q) >= 0).slice(0, 40);
  if (!res.length) return '<p class="muted" style="padding:6px 2px">没有找到“' + esc(q) + '”。试试别的写法' + (OFFLINE ? '' : '，或者打开某个单词用 AI 造句') + '。</p>';
  return '<div class="card"><div class="wlist">' + res.map(wordRow).join('') + '</div></div>';
}
function vLearn() {
  const f = UI.lf;
  let h = '<div class="page wrap"><div><h1 class="h-page">课程</h1><p class="sub">' + TOPICS.length + ' 个主题 · ' + WLIST.length + ' 个词 · 每个词至少 2 个例句</p></div>'
    + '<label class="search">' + ico('search') + '<span class="sr">搜索单词</span><input id="q" type="search" placeholder="搜印尼语或中文，比如 makan / 吃" value="' + esc(UI.q) + '" autocomplete="off" spellcheck="false"></label>'
    + '<div id="search-res">' + searchResults(UI.q) + '</div>'
    + '<a class="deckrow reflink" href="#ref"><span class="gi">表</span><span class="grow"><b>语法速查表</b><small>me- 变化、-nya 用法、词缀一览、代词、疑问词、数字……共 ' + REFS.length + ' 张，随时可查</small></span>' + ico('next') + '</a>'
    + '<div class="chips" role="group" aria-label="按场景筛选">' + [['all', '全部']].concat(Object.keys(SCENES).map(k => [k, SCENES[k]])).map(x => '<button class="chip" data-act="lfilter" data-v="' + x[0] + '" aria-pressed="' + (f === x[0]) + '">' + x[1] + '</button>').join('') + '</div>';
  GROUPS.forEach(g => {
    const ts = g.ids.map(id => TOPIC_BY[id]).filter(t => t && (f === 'all' || t.sc.includes(f)));
    if (!ts.length) return;
    h += '<section class="stack"><h2 class="h-sec">' + g.zh + ' <small>' + ts.length + ' 课</small></h2><div class="topics">' + ts.map(topicCard).join('') + '</div></section>';
  });
  return h + '</div>';
}
function vTopic(id) {
  const t = TOPIC_BY[id];
  if (!t) return vLearn();
  Clips.pack(t.id);
  const s = topicStats(t), unl = t.words.filter(w => !isLearned(w.id)).length;
  const decks = Object.keys(t.anchors).map(Number).sort((a, b) => a - b).map(i => DECKS[t.anchors[i]]).filter(Boolean);
  return '<div class="page wrap"><a class="back" href="#learn">' + ico('back') + '全部课程</a>'
    + '<header class="thead stack"><p class="eyebrow">第 ' + t.n + ' 课 · ' + t.sc.map(c => SCENES[c]).join(' / ') + '</p><div><h1>' + esc(t.zh) + '</h1><p class="idn" lang="id">' + esc(t.idn) + '</p></div>'
    + '<div class="tmeta"><span class="bar"><i style="width:' + f1(s.l / s.n * 100) + '%"></i></span><span>已学 ' + s.l + '/' + s.n + ' · 掌握 ' + s.m + '</span></div>'
    + '<div class="row wrap-ok">' + (unl ? '<button class="btn primary" data-act="study" data-t="' + t.id + '">学习新词（' + Math.min(unl, S.prefs.batch) + ' 个）</button>' : '<span class="tag pos">' + ico('check') + ' 本课词汇已学完</span>')
    + (s.l ? '<button class="btn" data-act="practice" data-t="' + t.id + '">练习本课（' + s.l + ' 词）</button>' : '') + '</div></header>'
    + '<div id="dlg-box">' + dlgPanel(t.id) + '</div>'
    + '<section class="stack"><h2 class="h-sec">文化小贴士</h2>' + t.tips.map(tipCard).join('') + '</section>'
    + '<section class="stack"><h2 class="h-sec">语法卡片 <small>学到相关单词时会自动出现</small></h2>' + decks.map(deckRow).join('') + '</section>'
    + '<section class="card"><h2 class="h-sec">词汇 <small>' + s.n + ' 个 · 点词条看例句</small></h2><div class="wlist">' + t.words.map(wordRow).join('') + '</div></section></div>';
}

/* ---------- 学习会话 ---------- */
function makeQuiz(words) {
  const kinds0 = ['id2zh', 'zh2id'];
  if (canSpeak()) kinds0.push('listen');
  return shuffle(words.map((w, i) => {
    const kinds = kinds0.slice();
    if (/^[a-z]+(-[a-z]+)?$/i.test(w.w) && w.w.length <= 10) kinds.push('spell');
    const kind = kinds[(i + rnd(kinds.length)) % kinds.length];
    return { w: w.id, kind, opts: kind === 'spell' ? null : makeOpts(w, kind) };
  }));
}
function makeOpts(w, kind) {
  const key = kind === 'id2zh' ? 'zh' : 'w';
  const seen = new Set([w[key]]);
  const pool = shuffle(TOPIC_BY[w.topic].words.filter(x => x.id !== w.id)).concat(shuffle(WLIST).slice(0, 30));
  const out = [];
  for (const x of pool) { if (out.length >= 3) break; if (x.id === w.id || seen.has(x[key])) continue; seen.add(x[key]); out.push(x.id); }
  return shuffle([w.id].concat(out));
}
function startStudy(tid) {
  const t = TOPIC_BY[tid];
  const words = t.words.filter(w => !isLearned(w.id)).slice(0, S.prefs.batch);
  if (!words.length) { toast('这一课的新词已经学完了'); return; }
  const steps = [];
  const ti = t.tips.findIndex((_, i) => !S.prefs.tips[t.id + ':' + i]);
  if (ti >= 0) steps.push({ type: 'tip', i: ti });
  words.forEach(w => {
    steps.push({ type: 'word', id: w.id });
    const d = t.anchors[w.idx];
    if (d && DECKS[d] && !S.prefs.decks[d]) steps.push({ type: 'deck', d });
  });
  steps.push({ type: 'quiz' });
  UI.sess = { tid, steps, i: 0, words: words.map(w => w.id), quiz: makeQuiz(words), qi: 0, qAns: null, right: 0, wrong: 0, finished: false };
  setPrefs({ last: tid });
  go('study');
  const first = steps[0];
  if (first.type === 'word') autoSay(WORDS[first.id].w);
}
function vStudy() {
  const ss = UI.sess;
  if (!ss) return vHome();
  const t = TOPIC_BY[ss.tid];
  Clips.pack(t.id);
  if (ss.finished) return studyDone(ss, t);
  const step = ss.steps[ss.i];
  const prog = (ss.i + (step.type === 'quiz' ? ss.qi / Math.max(1, ss.quiz.length) : 0)) / ss.steps.length;
  let h = '<div class="session wrap"><div class="s-head"><button class="icon-btn" data-act="quit" aria-label="暂停学习">' + ico('close') + '</button><div class="bar" role="progressbar" aria-valuenow="' + Math.round(prog * 100) + '" aria-valuemin="0" aria-valuemax="100"><i style="width:' + f1(prog * 100) + '%"></i></div><span class="s-count num">' + esc(t.zh) + '</span></div>';
  if (step.type === 'tip') {
    h += tipCard(t.tips[step.i]) + '<div class="s-foot"><button class="btn primary" data-act="next">知道了，开始学单词</button></div>';
  } else if (step.type === 'word') {
    const n = ss.words.indexOf(step.id) + 1;
    h += '<p class="eyebrow">新词 ' + n + ' / ' + ss.words.length + '</p><div class="card">' + wordCard(WORDS[step.id]) + '</div><div class="s-foot"><button class="btn primary" data-act="next">记住了，下一个</button></div>';
  } else if (step.type === 'deck') {
    h += '<p class="eyebrow">插播一张语法卡片 · 左右滑动</p>' + deckHTML(DECKS[step.d]) + '<div class="s-foot"><button class="btn primary" data-act="next">看完了，继续</button></div>';
  } else if (step.type === 'quiz') {
    h += quizView(ss);
  }
  return h + '</div>';
}
function quizView(ss) {
  const q = ss.quiz[ss.qi], w = WORDS[q.w], a = ss.qAns;
  const kindTxt = { id2zh: '选出中文意思', zh2id: '选出对应的印尼语', listen: '听一听，选出你听到的词', spell: '听音和看中文，拼出这个词' }[q.kind];
  let h = '<p class="eyebrow">小测 ' + (ss.qi + 1) + ' / ' + ss.quiz.length + ' · ' + kindTxt + '</p><section class="card qprompt">';
  if (q.kind === 'id2zh') h += '<div class="w-word" lang="id">' + esc(w.w) + '</div>' + sayBtn(w.w);
  else if (q.kind === 'zh2id') h += '<div class="zh-big">' + esc(w.zh) + '</div><span class="tag pos">' + (POSN[w.pos] || '') + '</span>';
  else if (q.kind === 'listen') h += '<button class="say bigplay" data-say="' + esc(w.w) + '" aria-label="再听一遍">' + ico('play') + '</button><p class="qkind">没听清就再点一下</p>';
  else h += '<div class="zh-big">' + esc(w.zh) + '</div><button class="say" data-say="' + esc(w.w) + '" aria-label="听发音">' + ico('play') + '</button>';
  h += '</section>';
  if (q.kind === 'spell') {
    const cls = a ? (a.ok ? 'right' : 'wrong') : '';
    h += '<form class="spell" data-act-form="spell"><input id="spell-in" class="' + cls + '" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="输入印尼语" lang="id" value="' + (a ? esc(a.v) : '') + '"' + (a ? ' disabled' : '') + '><button class="btn primary" type="submit"' + (a ? ' disabled' : '') + '>确定</button></form>';
    if (a && !a.ok) h += '<p class="why">正确拼写：<b lang="id">' + esc(w.w) + '</b></p>';
  } else {
    h += '<div class="qopts">' + q.opts.map(id => {
      const x = WORDS[id];
      const cls = a ? (id === q.w ? 'right' : (id === a.v ? 'wrong' : '')) : '';
      return '<button class="qopt ' + cls + '" data-act="qans" data-v="' + esc(id) + '"' + (a ? ' disabled' : '') + (q.kind === 'id2zh' ? '' : ' lang="id"') + '>' + esc(q.kind === 'id2zh' ? x.zh : x.w) + '</button>';
    }).join('') + '</div>';
  }
  if (a && !a.ok) h += '<div class="card"><p class="w-zh" style="font-size:17px"><span lang="id">' + esc(w.w) + '</span> · ' + esc(w.zh) + '</p><ol class="exs" style="margin-top:10px">' + exItem(w.ex[0], { bare: true }) + '</ol></div><div class="s-foot"><button class="btn primary" data-act="qnext">继续</button></div>';
  return h;
}
function studyDone(ss, t) {
  const total = ss.right + ss.wrong, pct = total ? Math.round(ss.right / total * 100) : 100;
  const more = t.words.some(w => !isLearned(w.id)), due = dueIds().length;
  return '<div class="session wrap"><section class="card"><div class="done-big"><p class="eyebrow">这一组完成了</p><b>+' + ss.words.length + '</b><p>个新词进入你的词库 · 小测正确率 ' + pct + '%</p></div>'
    + '<div class="done-list">' + ss.words.map(id => '<span class="wchip">' + sayBtn(WORDS[id].w) + '<b lang="id">' + esc(WORDS[id].w) + '</b><span>' + esc(WORDS[id].zh) + '</span></span>').join('') + '</div>'
    + '<p class="muted" style="text-align:center;margin-top:14px;font-size:13px">这些词明天会出现在复习里，记得回来。</p></section>'
    + '<div class="stack">' + (more ? '<button class="btn primary block" data-act="study" data-t="' + t.id + '">再学一组</button>' : '<p class="tag pos" style="align-self:center">本课词汇全部学完！</p>')
    + (due ? '<a class="btn block" href="#review">去复习（' + due + '）</a>' : '') + '<a class="btn block" href="#t-' + t.id + '">回到课程页</a></div></div>';
}
function sessNext() {
  const ss = UI.sess;
  if (!ss) return;
  const step = ss.steps[ss.i];
  if (step.type === 'word') learn(step.id);
  else if (step.type === 'tip') { S.prefs.tips[ss.tid + ':' + step.i] = 1; Sync.mark('prefs'); }
  else if (step.type === 'deck') { S.prefs.decks[step.d] = 1; Sync.mark('prefs'); }
  ss.i++;
  render();
  window.scrollTo(0, 0);
  const nx = ss.steps[ss.i];
  if (nx && nx.type === 'word') autoSay(WORDS[nx.id].w);
  else if (nx && nx.type === 'quiz') quizAutoSay(ss);
}
function quizAutoSay(ss) {
  const q = ss.quiz[ss.qi];
  if (!q) return;
  if (q.kind === 'listen' || q.kind === 'spell') TTS.play(WORDS[q.w].w, WORDS[q.w].w, { noLoop: true });
  else if (q.kind === 'id2zh') autoSay(WORDS[q.w].w);
}
function qAnswer(v) {
  const ss = UI.sess;
  if (!ss || ss.qAns) return;
  const q = ss.quiz[ss.qi], w = WORDS[q.w];
  let ok;
  if (q.kind === 'spell') {
    const norm = s => String(s).toLowerCase().replace(/[-\s]+/g, ' ').replace(/[^a-z ]/g, '').trim();
    ok = norm(v) === norm(w.w);
  } else ok = v === q.w;
  ss.qAns = { v, ok };
  if (ok) ss.right++;
  else { ss.wrong++; if (!q.re) ss.quiz.push({ w: q.w, kind: q.kind, re: true, opts: q.opts ? shuffle(q.opts) : null }); }
  render();
  TTS.play(w.w, w.w, { noLoop: true });
  if (!ok) { const box = $('.qopts') || $('.spell'); if (box) box.classList.add('shake'); }
  else { const cur = ss.qi; setTimeout(() => { if (UI.sess === ss && ss.qi === cur && ss.qAns && ss.qAns.ok && UI.route.name === 'study') qNext(); }, 950); }
}
function qNext() {
  const ss = UI.sess;
  if (!ss) return;
  ss.qi++; ss.qAns = null;
  if (ss.qi >= ss.quiz.length) { ss.finished = true; ss.i = ss.steps.length; }
  render();
  window.scrollTo(0, 0);
  if (!ss.finished) {
    quizAutoSay(ss);
    const sp = $('#spell-in');
    if (sp && matchMedia('(pointer:fine)').matches) sp.focus();
  }
}

/* ---------- 复习：主动回忆 ---------- */
// 一轮复习 = 一串回忆卡（只给中文，或者挖掉目标词的例句），每答 10 张插一道选择题。
const QUIZ_EVERY = 10, ROUND_MAX = 30;
const blankOut = s => esc(s).replace(/\[[^\]]+\]/g, '<span class="blank" aria-label="空格"></span>');
const hasMark = e => /\[[^\]]+\]/.test(e.id);
function startReview(ids, practice, title) {
  ids = ids.filter(id => WORDS[id]);
  if (!ids.length) { toast('没有可以复习的词'); return; }
  Clips.prefetch(ids.slice(0, 8).map(id => WORDS[id].w));
  UI.rev = { queue: ids.slice(0, practice ? 20 : ROUND_MAX), i: 0, shown: false, practice: !!practice, title: title || '', n: 0, g: [0, 0, 0], missed: [], recent: [], quiz: null, quizN: 0, card: null };
  go('review');
  window.scrollTo(0, 0);
}
// 这张卡怎么出题：同一个词轮流用“看中文释义”和“例句挖空”，例句也轮着换
function revCard(rv) {
  const id = rv.queue[rv.i];
  if (rv.card && rv.card.id === id && rv.card.at === rv.i) return rv.card;
  const w = WORDS[id], reps = rv.practice ? rnd(4) : ((S.words[id] || [])[3] || 0);
  const exs = w.ex.map((e, k) => k).filter(k => hasMark(w.ex[k]));
  const cloze = exs.length > 0 && reps % 2 === 1;
  rv.card = { id, at: rv.i, kind: cloze ? 'cloze' : 'zh', ex: exs.length ? exs[(reps >> 1) % exs.length] : 0 };
  return rv.card;
}
// 选择题：从刚复习的词里出，优先出刚才选了“模糊 / 不认识”的；题型在“听音选中文”和“看句子选词填空”之间轮换
function makeRevQuiz(rv) {
  const weak = rv.recent.filter(x => x.g < 2), pool = weak.length ? weak : rv.recent;
  const w = WORDS[pool[rnd(pool.length)].id];
  const exs = w.ex.filter(hasMark);
  let kind = rv.quizN % 2 === 0 ? 'listen' : 'fill';
  if (kind === 'listen' && !canSpeak()) kind = 'fill';
  if (kind === 'fill' && !exs.length) kind = canSpeak() ? 'listen' : 'zh';
  return { kind, w: w.id, ex: exs.length ? w.ex.indexOf(exs[rnd(exs.length)]) : 0, opts: makeOpts(w, kind === 'fill' ? 'zh2id' : 'id2zh'), ans: null };
}
function revQuizSay() {
  const rv = UI.rev;
  if (rv && rv.quiz && rv.quiz.kind === 'listen' && !rv.quiz.ans) TTS.play(WORDS[rv.quiz.w].w, WORDS[rv.quiz.w].w, { noLoop: true });
}
function whenText(ms) { const m = Math.max(1, Math.ceil((ms - Date.now()) / 60000)); return '约 ' + m + ' 分钟后'; }
function revLanding() {
  const due = dueIds(), learned = learnedIds(), wait = waitingIds(), soon = soonIds();
  const weak = due.filter(id => isWeak(S.words[id])).length;
  let h = '<div class="page wrap"><div><h1 class="h-page">复习</h1><p class="sub">先只看中文，在脑子里回想印尼语怎么说，再点“显示答案”核对，然后如实选“认识 / 模糊 / 不认识”。认识的词间隔会拉长（1、3、7、14、30 天……），模糊的保持原间隔，不认识的 10 分钟后再考。</p></div>';
  if (due.length) {
    h += '<section class="card stack" style="align-items:flex-start"><p class="eyebrow">今日复习</p><h2 class="h-sec">' + due.length + ' 个词到期</h2>'
      + '<p class="sub">' + (weak ? '其中 ' + weak + ' 个上次选了“模糊”或“不认识”，会排在最前面。' : '按到期先后排序。') + (due.length > ROUND_MAX ? '一轮最多 ' + ROUND_MAX + ' 个，做完可以接着下一轮。' : '') + '</p>'
      + '<button class="btn primary" data-act="revStart">开始复习</button></section>';
  } else {
    h += '<section class="card stack" style="align-items:flex-start"><p class="eyebrow">今日复习</p><h2 class="h-sec">' + (learned.length ? '现在没有到期的词' : '还没有可以复习的词') + '</h2>'
      + '<p class="sub">' + (learned.length ? '到期的词都复习过了。' : '先去课程里学几个新词，第二天它们就会出现在这里。') + '</p>'
      + (learned.length ? '' : '<a class="btn primary" href="#learn">去学新词</a>') + '</section>';
  }
  if (wait.length) {
    const first = Math.min.apply(null, wait.map(id => S.words[id][7]));
    h += '<section class="card stack" style="align-items:flex-start"><p class="eyebrow">等待再考</p><p class="sub">' + wait.length + ' 个刚才选了“不认识”的词，最早' + whenText(first) + '回到复习里：' + wait.slice(0, 8).map(id => '<span lang="id">' + esc(WORDS[id].w) + '</span>').join('、') + (wait.length > 8 ? '……' : '') + '</p></section>';
  }
  if (soon.length) {
    h += '<section class="card stack" style="align-items:flex-start"><p class="eyebrow">提前复习</p><p class="sub">' + soon.length + ' 个词还没到期，但 3 天内就要到期，或者上次没记牢。想多练可以提前考，结果同样计入复习计划。</p>'
      + '<button class="btn" data-act="revSoon">提前复习 ' + Math.min(ROUND_MAX, soon.length) + ' 个</button></section>';
  }
  if (learned.length) {
    const lv = [0, 0, 0];
    learned.forEach(id => { const x = S.words[id][0]; lv[x >= 5 ? 2 : x >= 3 ? 1 : 0]++; });
    h += '<section class="card stack"><h2 class="h-sec">词库熟练度</h2><div class="tiles" style="grid-template-columns:repeat(3,1fr)"><div class="tile"><span>刚学会</span><b>' + lv[0] + '</b><small>间隔 1–3 天</small></div><div class="tile"><span>正在巩固</span><b>' + lv[1] + '</b><small>间隔 7–14 天</small></div><div class="tile"><span>已掌握</span><b>' + lv[2] + '</b><small>间隔 30 天以上</small></div></div>'
      + '<div class="row"><button class="linkbtn" data-act="revFree">随机练习 ' + Math.min(10, learned.length) + ' 个（不影响复习计划）</button></div></section>';
  }
  return h + '</div>';
}
function revDone(rv) {
  const left = dueIds().length, missed = rv.missed.filter((id, k, a) => a.indexOf(id) === k);
  let h = '<div class="page wrap"><section class="card stack"><p class="eyebrow">' + (rv.practice ? '练习结束' : '这一轮结束') + '</p>'
    + '<h2 class="h-sec">' + (rv.practice ? '练习' : '复习') + '了 ' + rv.n + ' 个词</h2>'
    + '<p class="sub">认识 ' + rv.g[2] + ' · 模糊 ' + rv.g[1] + ' · 不认识 ' + rv.g[0] + '</p>';
  if (missed.length) {
    h += '<p class="sub">' + (rv.practice ? '这些词没想起来：' : '这些词选了“不认识”，10 分钟后会回到复习里：') + '</p><div class="wlist">' + missed.map(id => wordRow(WORDS[id])).join('') + '</div>';
  }
  h += '</section><div class="stack">'
    + (left ? '<button class="btn primary block" data-act="revStart">继续复习剩下的 ' + left + ' 个</button>' : '')
    + (missed.length ? '<button class="btn block" data-act="revMissed" data-ids="' + esc(missed.join('|')) + '">现在再过一遍不认识的（不影响计划）</button>' : '')
    + '<button class="btn block" data-act="revExit">完成</button></div></div>';
  return h;
}
function revQuizView(rv) {
  const q = rv.quiz, w = WORDS[q.w], a = q.ans, e = w.ex[q.ex];
  const kindTxt = { listen: '听发音，选出中文意思', fill: '选出填进空格的词', zh: '选出中文意思' }[q.kind];
  let h = '<p class="eyebrow">穿插一道选择题 · ' + kindTxt + '</p><section class="card qprompt">';
  if (q.kind === 'listen') h += '<button class="say bigplay" data-say="' + esc(w.w) + '" aria-label="再听一遍">' + ico('play') + '</button><p class="qkind">没听清就再点一下</p>';
  else if (q.kind === 'fill') h += '<p class="cloze" lang="id">' + (a ? hl(e.id) : blankOut(e.id)) + '</p><p class="ex-zh">' + esc(e.zh) + '</p>';
  else h += '<div class="w-word" lang="id">' + esc(w.w) + '</div>';
  h += '</section><div class="qopts">' + q.opts.map(id => {
    const x = WORDS[id], cls = a ? (id === q.w ? 'right' : (id === a.v ? 'wrong' : '')) : '';
    return '<button class="qopt ' + cls + '" data-act="rqans" data-v="' + esc(id) + '"' + (a ? ' disabled' : '') + (q.kind === 'fill' ? ' lang="id"' : '') + '>' + esc(q.kind === 'fill' ? x.w : x.zh) + '</button>';
  }).join('') + '</div>';
  if (a) {
    h += '<section class="card stack"><p class="why">' + (a.ok ? '答对了。' : '答错了' + (rv.practice ? '。' : '，这个词下次会优先复习。')) + '</p>'
      + '<div class="row">' + sayBtn(w.w) + '<b lang="id" style="font-size:20px">' + esc(w.w) + '</b><span class="ipa-s">' + esc(IPA.of(w.w)) + '</span></div><p class="w-zh" style="font-size:17px">' + esc(w.zh) + '</p>'
      + '<ol class="exs">' + exItem(e, { bare: true }) + '</ol></section>'
      + '<div class="s-foot"><button class="btn primary" data-act="rqnext">继续</button></div>';
  }
  return h;
}
function vReview() {
  const rv = UI.rev;
  if (!rv) return revLanding();
  if (!rv.quiz && rv.i >= rv.queue.length) return revDone(rv);
  rv.queue.slice(rv.i, rv.i + 6).forEach(x => Clips.pack(WORDS[x].topic));
  const prog = rv.i / rv.queue.length;
  let h = '<div class="session wrap"><div class="s-head"><button class="icon-btn" data-act="revExit" aria-label="结束复习">' + ico('close') + '</button><div class="bar"><i style="width:' + f1(prog * 100) + '%"></i></div><span class="s-count num">' + Math.min(rv.i + 1, rv.queue.length) + '/' + rv.queue.length + '</span></div>';
  if (rv.title) h += '<p class="eyebrow">' + esc(rv.title) + '</p>';
  if (rv.quiz) return h + revQuizView(rv) + '</div>';
  const id = rv.queue[rv.i], w = WORDS[id], s = S.words[id] || [1, today(), 0, 0, 0, today()], c = revCard(rv), ce = w.ex[c.ex];
  h += '<section class="card flash">';
  if (!rv.shown) {
    if (c.kind === 'cloze') h += '<p class="zh-big">' + esc(ce.zh) + '</p><p class="cloze" lang="id">' + blankOut(ce.id) + '</p><p class="qkind">空格里的印尼语是什么？先在心里说出来</p>';
    else h += '<p class="zh-big">' + esc(w.zh) + '</p><span class="tag pos">' + (POSN[w.pos] || '') + '</span><p class="qkind">印尼语怎么说？先在心里说出来</p>';
    h += '</section><div class="s-foot"><button class="btn primary" data-act="reveal">显示答案</button></div>';
  } else {
    const exs = c.kind === 'cloze' ? [ce].concat(w.ex.filter(e => e !== ce)) : w.ex;
    h += '<div class="w-word" lang="id">' + esc(w.w) + '</div><p class="w-ipa">' + esc(IPA.of(w.w)) + '</p><div class="row">' + sayBtn(w.w) + '<span class="tag pos">' + (POSN[w.pos] || '') + '</span></div><p class="w-zh">' + esc(w.zh) + '</p>'
      + '<ol class="exs" style="width:100%;text-align:left">' + exs.map(e => exItem(e, { bare: true })).join('') + '</ol>'
      + '<button class="linkbtn" data-act="word" data-id="' + esc(w.id) + '">打开单词卡</button></section>'
      + '<p class="eyebrow">' + (rv.practice ? '练习：不影响复习计划' : '刚才想起来了吗？') + '</p>'
      + '<div class="grades">' + [['不认识', 0], ['模糊', 1], ['认识', 2]].map(x => '<button class="grade g' + x[1] + '" data-act="grade" data-v="' + x[1] + '">' + x[0] + '<small>' + (rv.practice ? '按键 ' + (x[1] + 1) : ivLabel(s, x[1])) + '</small></button>').join('') + '</div>';
  }
  return h + '</div>';
}
function doGrade(g) {
  const rv = UI.rev;
  if (!rv || !rv.shown || rv.quiz || !(g >= 0 && g <= 2)) return;
  const id = rv.queue[rv.i];
  if (!rv.practice && S.words[id]) { S.words[id] = gradeCalc(S.words[id], g); Sync.mark('progress'); }
  bump('r');
  rv.n++; rv.g[g]++;
  if (g === 0) rv.missed.push(id);
  rv.recent.push({ id, g });
  rv.i++; rv.shown = false;
  TTS.stop();
  // 每答完 10 张插一道选择题；一轮结束时剩下不少于 5 张没考过，也补一道
  if (rv.recent.length >= QUIZ_EVERY || (rv.i >= rv.queue.length && rv.recent.length >= 5)) { rv.quiz = makeRevQuiz(rv); rv.recent = []; }
  render();
  window.scrollTo(0, 0);
  revQuizSay();
}
function revQuizAnswer(v) {
  const rv = UI.rev;
  if (!rv || !rv.quiz || rv.quiz.ans) return;
  const q = rv.quiz, ok = v === q.w, s = S.words[q.w];
  q.ans = { v, ok };
  // 答错不改间隔，只把这个词标成“没记牢”，下次复习排前面
  if (!ok && !rv.practice && s && s[6] !== 0 && s[6] !== 1) { s[6] = 1; s[2] = Date.now(); Sync.mark('progress'); }
  render();
  if (!ok) { const box = $('.qopts'); if (box) box.classList.add('shake'); }
  autoSay(WORDS[q.w].w);
}
function revQuizNext() {
  const rv = UI.rev;
  if (!rv || !rv.quiz || !rv.quiz.ans) return;
  rv.quiz = null; rv.quizN++;
  TTS.stop();
  render();
  window.scrollTo(0, 0);
}

/* ---------- 发音 ---------- */
function letterDetail() {
  const L = ALPHABET[UI.letter];
  return '<div class="ldetail"><div class="big" lang="id">' + L[0] + L[0].toLowerCase() + '</div><div class="grow stack" style="gap:6px"><div class="row wrap-ok"><span class="tag">字母读作 <b lang="id" style="margin:0 4px">' + esc(L[1]) + '</b><span class="ipa">/' + esc(IPA.LETTER[L[0].toLowerCase()]) + '/</span></span><span class="tag">在词里发 <span class="ipa" style="margin-left:4px">/' + esc(L[2]) + '/</span></span></div><p>' + esc(L[3]) + '</p>'
    + '<div class="row wrap-ok"><button class="say text" data-say="' + esc(L[1]) + '">' + ico('play') + '字母名</button><button class="say text ghost" data-say="' + esc(L[4]) + '">' + ico('play') + '<span lang="id">' + esc(L[4]) + '</span>&nbsp;<span class="ipa-s">' + esc(IPA.of(L[4])) + '</span>&nbsp;· ' + esc(L[5]) + '</button></div></div></div>';
}
function pairView() {
  const p = UI.pair;
  if (!p || p.cur == null) return '<p class="sub">点“播放”，听一个词，再选出你听到的是哪一个。专门练中国人容易混的音：b/p、d/t、g/k、c/j、r/l、n/ng。</p><div class="row"><button class="btn primary" data-act="pairNew">' + ico('play') + '播放第一题</button>' + (p && p.n ? '<span class="muted">' + p.ok + '/' + p.n + ' 正确</span>' : '') + '</div>';
  const P = PAIRS[p.cur];
  const opt = (side) => {
    const w = P[side * 2], z = P[side * 2 + 1];
    const cls = p.pick == null ? '' : (side === p.side ? 'right' : (side === p.pick ? 'wrong' : ''));
    return '<button class="qopt ' + cls + '" data-act="pairPick" data-v="' + side + '"' + (p.pick != null ? ' disabled' : '') + '><b lang="id">' + esc(w) + '</b> ' + '<span class="ipa-s">' + esc(IPA.of(w)) + '</span>' + ' · ' + esc(z) + '</button>';
  };
  return '<div class="row wrap-ok"><span class="tag">' + esc(P[4]) + '</span><button class="say text" data-say="' + esc(P[p.side * 2]) + '" data-key="pair">' + ico('play') + '再听一遍</button><span class="muted num">' + p.ok + '/' + p.n + ' 正确</span></div>'
    + '<div class="pair-opts">' + opt(0) + opt(1) + '</div>'
    + (p.pick != null ? '<div class="row wrap-ok"><span class="' + (p.pick === p.side ? 'tag pos' : 'tag') + '">' + (p.pick === p.side ? '听对了' : '是 ' + esc(P[p.side * 2])) + '</span>' + sayBtn(P[0], 'sm') + '<span lang="id">' + esc(P[0]) + '</span>' + sayBtn(P[2], 'sm') + '<span lang="id">' + esc(P[2]) + '</span><span class="grow"></span><button class="btn sm primary" data-act="pairNew">下一题</button></div>' : '');
}
function vPron() {
  Clips.pack('core');
  let h = '<div class="page wrap"><div><h1 class="h-page">字母与发音</h1><p class="sub">印尼语用拉丁字母书写，怎么写就怎么读。点字母听读音；打开顶部的“慢速”“循环”可以反复跟读。能找到真人录音的单词播放印尼人的真人录音（来源见“设置”页），其余是预先生成的合成语音，手机和电脑上听到的一样。</p></div>';
  h += '<section class="card stack"><div id="ldetail">' + letterDetail() + '</div><div class="abc">'
    + ALPHABET.map((a, i) => '<button class="ltile" data-act="letter" data-i="' + i + '" data-say="' + esc(a[1]) + '" aria-pressed="' + (i === UI.letter) + '" aria-label="字母 ' + a[0] + '，读作 ' + esc(a[1]) + '"><b>' + a[0] + '<span>' + a[0].toLowerCase() + '</span></b><small lang="id">' + esc(a[1]) + '</small><small class="ipa-s">/' + esc(IPA.LETTER[a[0].toLowerCase()]) + '/</small></button>').join('') + '</div></section>';
  h += '<section class="stack"><h2 class="h-sec">拼读规则 <small>' + RULES.length + ' 条，点词听发音</small></h2>'
    + RULES.map((r, i) => '<article class="card rule"><h3>' + (i + 1) + '. ' + esc(r.h) + '</h3><p>' + esc(r.p) + '</p><div class="wchips">' + r.w.map(x => '<span class="wchip">' + sayBtn(x[0]) + '<b lang="id">' + esc(x[0]) + '</b>' + '<span class="ipa-s">' + esc(IPA.of(x[0])) + '</span>' + '<span>' + esc(x[1]) + '</span></span>').join('') + '</div></article>').join('') + '</section>';
  h += '<section class="card stack"><h2 class="h-sec">听音辨词</h2><div id="pairbox" class="stack">' + pairView() + '</div></section>';
  return h + '</div>';
}

/* ---------- 进度与图表 ---------- */
function act(d) { const L = S.log[dkey(d)]; return L ? (L.n || 0) + (L.r || 0) : 0; }
const lvl = v => v <= 0 ? 0 : v < 5 ? 1 : v < 15 ? 2 : v < 30 ? 3 : 4;
// weeks：一共几列（每列一周）；ahead：其中有几列是今天之后的周（画成空框），用来让本周落在中间
function heatSVG(weeks, ahead) {
  ahead = ahead || 0;
  const t = today(), dow = (new Date().getDay() + 6) % 7, start = t - dow - (weeks - 1 - ahead) * 7;
  const c = 12, g = 3, L = 30, T = 16, W = L + weeks * (c + g) + 14, H = T + 7 * (c + g);
  let s = '<svg class="heat" viewBox="0 0 ' + W + ' ' + H + '" width="' + W + '" height="' + H + '" role="img" aria-label="' + (ahead ? '前 ' + (weeks - 1 - ahead) + ' 周到后 ' + ahead + ' 周' : '最近 ' + weeks + ' 周') + '的学习热力图">';
  [['周一', 0], ['周三', 2], ['周五', 4]].forEach(x => { s += '<text class="axis-t" x="0" y="' + (T + x[1] * (c + g) + 10) + '">' + x[0] + '</text>'; });
  // 月份标在每月 1 号所在的那一列；第一列的月份只有离下一个月份标签够远时才标
  const mon = d => new Date(d * DAY).getUTCMonth(), marks = [];
  for (let w = 1; w < weeks; w++) { const d0 = start + w * 7; if (mon(d0) !== mon(d0 + 6) || new Date(d0 * DAY).getUTCDate() === 1) marks.push([w, mon(d0 + 6)]); }
  if (!marks.length || marks[0][0] >= 3) marks.unshift([0, mon(start + 6)]);
  marks.forEach(m => { const d0 = start + m[0] * 7; s += '<text class="axis-t' + (d0 > t ? ' fut-t' : '') + '" x="' + (L + m[0] * (c + g)) + '" y="10">' + (m[1] + 1) + '月</text>'; });
  for (let w = 0; w < weeks; w++) {
    const d0 = start + w * 7, x = L + w * (c + g);
    for (let r = 0; r < 7; r++) {
      const d = d0 + r;
      if (d > t) { if (ahead) s += '<rect x="' + (x + .5) + '" y="' + (T + r * (c + g) + .5) + '" width="' + (c - 1) + '" height="' + (c - 1) + '" rx="3" class="fut"/>'; continue; }
      s += '<rect x="' + x + '" y="' + (T + r * (c + g)) + '" width="' + c + '" height="' + c + '" rx="3" class="h' + lvl(act(d)) + (d === t ? ' today' : '') + '" data-d="' + d + '"/>';
    }
  }
  return s + '</svg>';
}
function heatLegend() {
  return '<div class="heat-legend"><span>少</span>' + [0, 1, 2, 3, 4].map(i => '<i style="background:var(--heat' + i + ')"></i>').join('') + '<span>多</span><span style="margin-left:8px">每格 = 当天新学 + 复习次数</span></div>';
}
function learnedDays() { return learnedIds().map(id => S.words[id][5]).filter(x => typeof x === 'number').sort((a, b) => a - b); }
function monoPath(P) {
  const n = P.length;
  if (n === 1) return 'M' + f1(P[0][0]) + ',' + f1(P[0][1]);
  const dx = [], m = [], tg = [];
  for (let i = 0; i < n - 1; i++) { dx[i] = P[i + 1][0] - P[i][0]; m[i] = (P[i + 1][1] - P[i][1]) / dx[i]; }
  tg[0] = m[0]; tg[n - 1] = m[n - 2];
  for (let i = 1; i < n - 1; i++) tg[i] = m[i - 1] * m[i] <= 0 ? 0 : (m[i - 1] + m[i]) / 2;
  for (let i = 0; i < n - 1; i++) {
    if (m[i] === 0) { tg[i] = 0; tg[i + 1] = 0; continue; }
    const a = tg[i] / m[i], b = tg[i + 1] / m[i], q = a * a + b * b;
    if (q > 9) { const k = 3 / Math.sqrt(q); tg[i] = k * a * m[i]; tg[i + 1] = k * b * m[i]; }
  }
  let d = 'M' + f1(P[0][0]) + ',' + f1(P[0][1]);
  for (let i = 0; i < n - 1; i++) {
    const h3 = dx[i] / 3;
    d += 'C' + f1(P[i][0] + h3) + ',' + f1(P[i][1] + tg[i] * h3) + ' ' + f1(P[i + 1][0] - h3) + ',' + f1(P[i + 1][1] - tg[i + 1] * h3) + ' ' + f1(P[i + 1][0]) + ',' + f1(P[i + 1][1]);
  }
  return d;
}
function cumulative(start, end) {
  const lds = learnedDays(), out = [];
  let j = 0;
  for (let d = start; d <= end; d++) { while (j < lds.length && lds[j] <= d) j++; out.push(j); }
  return out;
}
function hillSVG(W) {
  const t = today(), N = 30;
  const vals = cumulative(t - N + 1, t), total = vals[N - 1];
  const H = total ? Math.round(Math.max(96, Math.min(150, W * 0.24))) : 70;
  const max = Math.max(total, 12), base = H - 2, top = 34, right = W - 64;
  const x = i => 4 + i * (right - 4) / (N - 1);
  const y = v => base - 12 - (v / max) * (base - 12 - top);
  const P = vals.map((v, i) => [x(i), y(v)]);
  const xl = P[N - 1][0], yl = P[N - 1][1];
  const ridge = monoPath(P);
  const area = 'M0,' + base + 'L' + f1(P[0][0]) + ',' + f1(P[0][1]) + ridge.replace(/^M[^C]*/, '') + 'C' + f1(xl + 22) + ',' + f1(yl) + ' ' + f1(W - 18) + ',' + f1(base - 6) + ' ' + W + ',' + base + 'Z';
  const py = yl - 28;
  return '<svg class="hill" viewBox="0 0 ' + W + ' ' + H + '" width="' + W + '" height="' + H + '" aria-hidden="true"><path class="ground" d="' + area + '"/><path class="ridge" d="' + ridge + '"/>'
    + '<line class="pole" x1="' + f1(xl) + '" y1="' + f1(yl) + '" x2="' + f1(xl) + '" y2="' + f1(py) + '"/><rect class="fr" x="' + f1(xl + 0.8) + '" y="' + f1(py) + '" width="15" height="5.5"/><rect class="fw" x="' + f1(xl + 0.8) + '" y="' + f1(py + 5.5) + '" width="15" height="5.5"/>'
    + '<text x="' + f1(xl + 20) + '" y="' + f1(py + 9) + '">' + total + ' 词</text>'
    + (total === 0 ? '<text x="4" y="' + f1(base - 22) + '" style="font-weight:600;fill:var(--ink-3)">学会第一个词，小山就开始长高</text>' : '') + '</svg>';
}
function niceScale(v) {
  v = Math.max(4, v);
  const raw = v / 4, p = Math.pow(10, Math.floor(Math.log10(raw)));
  const step = [1, 2, 5, 10].map(k => k * p).find(x => x >= raw) || raw;
  return { max: Math.ceil(v / step) * step, step };
}
let GMETA = null, CMETA = null;
function growthSVG(W, range) {
  const t = today(), lds = learnedDays(), first = lds.length ? lds[0] : t;
  const start = range === 'all' ? Math.min(first, t - 13) : t - range + 1;
  const vals = cumulative(start, t), N = vals.length;
  const H = 230, ml = 40, mr = 54, mt = 14, mb = 30, iw = W - ml - mr, ih = H - mt - mb;
  const sc = niceScale(Math.max(10, vals[N - 1])), max = sc.max;
  const x = i => ml + (N === 1 ? iw : i * iw / (N - 1));
  const y = v => mt + ih - v / max * ih;
  let s = '<svg class="chart" viewBox="0 0 ' + W + ' ' + H + '" width="' + W + '" height="' + H + '" role="img" aria-label="词汇增长曲线：目前 ' + vals[N - 1] + ' 个词">';
  for (let k = 0; k <= max / sc.step; k++) {
    const v = sc.step * k, yy = f1(y(v));
    s += '<line class="' + (k ? 'grid' : 'base') + '" x1="' + ml + '" x2="' + (ml + iw) + '" y1="' + yy + '" y2="' + yy + '"/><text class="axis-t num" x="' + (ml - 8) + '" y="' + f1(y(v) + 3.5) + '" text-anchor="end">' + Math.round(v) + '</text>';
  }
  [0, Math.floor((N - 1) / 2), N - 1].filter((v, i, a) => a.indexOf(v) === i).forEach(i => {
    s += '<text class="axis-t" x="' + f1(x(i)) + '" y="' + (H - 8) + '" text-anchor="' + (i === 0 ? 'start' : i === N - 1 ? 'end' : 'middle') + '">' + (i === N - 1 ? '今天' : fmtDay(start + i, true)) + '</text>';
  });
  const P = vals.map((v, i) => [x(i), y(v)]);
  const line = monoPath(P);
  s += '<path class="area" d="' + line + 'L' + f1(x(N - 1)) + ',' + f1(y(0)) + 'L' + f1(x(0)) + ',' + f1(y(0)) + 'Z"/><path class="line" d="' + line + '"/>';
  s += '<circle class="endpt" cx="' + f1(x(N - 1)) + '" cy="' + f1(y(vals[N - 1])) + '" r="5"/><text class="endlbl" x="' + f1(x(N - 1) + 9) + '" y="' + f1(y(vals[N - 1]) + 4) + '">' + vals[N - 1] + '</text>';
  s += '<line id="g-x" class="xh" x1="0" x2="0" y1="' + mt + '" y2="' + (mt + ih) + '" visibility="hidden"/><circle id="g-d" class="endpt" r="4.5" cx="0" cy="0" visibility="hidden"/>';
  s += '<rect data-growth="1" x="' + ml + '" y="' + mt + '" width="' + iw + '" height="' + ih + '" fill="transparent"/></svg>';
  GMETA = { start, vals, x, y, N };
  return s;
}
function colsSVG(W) {
  const t = today(), N = 14, H = 190, ml = 34, mr = 6, mt = 12, mb = 28, iw = W - ml - mr, ih = H - mt - mb;
  const days = Array.from({ length: N }, (_, i) => t - N + 1 + i);
  const data = days.map(d => { const L = S.log[dkey(d)] || {}; return [L.n || 0, L.r || 0]; });
  const sc = niceScale(Math.max(10, ...data.map(v => v[0] + v[1]))), max = sc.max;
  const slot = iw / N, bw = Math.min(24, slot * 0.62), y = v => mt + ih - v / max * ih;
  let s = '<svg class="chart" viewBox="0 0 ' + W + ' ' + H + '" width="' + W + '" height="' + H + '" role="img" aria-label="最近 14 天每天的新学和复习数量">';
  for (let k = 0; k <= max / sc.step; k++) {
    const v = sc.step * k, yy = f1(y(v));
    s += '<line class="' + (k ? 'grid' : 'base') + '" x1="' + ml + '" x2="' + (ml + iw) + '" y1="' + yy + '" y2="' + yy + '"/><text class="axis-t num" x="' + (ml - 7) + '" y="' + f1(y(v) + 3.5) + '" text-anchor="end">' + Math.round(v) + '</text>';
  }
  const topR = (x0, y0, w, h, r) => { r = Math.min(r, h, w / 2); return 'M' + f1(x0) + ',' + f1(y0 + h) + 'V' + f1(y0 + r) + 'Q' + f1(x0) + ',' + f1(y0) + ' ' + f1(x0 + r) + ',' + f1(y0) + 'H' + f1(x0 + w - r) + 'Q' + f1(x0 + w) + ',' + f1(y0) + ' ' + f1(x0 + w) + ',' + f1(y0 + r) + 'V' + f1(y0 + h) + 'Z'; };
  data.forEach((v, i) => {
    const x0 = ml + i * slot + (slot - bw) / 2, hn = v[0] / max * ih, hr = v[1] / max * ih, b = mt + ih;
    if (hn > 0) s += v[1] > 0 ? '<rect class="c-new" x="' + f1(x0) + '" y="' + f1(b - hn) + '" width="' + f1(bw) + '" height="' + f1(hn) + '"/>' : '<path class="c-new" d="' + topR(x0, b - hn, bw, hn, 4) + '"/>';
    if (hr > 0) { const gap = hn > 0 ? 2 : 0, top = b - hn - gap - hr; s += '<path class="c-rev" d="' + topR(x0, top, bw, hr, 4) + '"/>'; }
    if (i % 2 === (N - 1) % 2) s += '<text class="axis-t" x="' + f1(ml + i * slot + slot / 2) + '" y="' + (H - 8) + '" text-anchor="middle">' + (i === N - 1 ? '今天' : new Date(days[i] * DAY).getUTCDate()) + '</text>';
    s += '<rect data-col="' + i + '" x="' + f1(ml + i * slot) + '" y="' + mt + '" width="' + f1(slot) + '" height="' + ih + '" fill="transparent"/>';
  });
  CMETA = { days, data };
  return s + '</svg>';
}
function vStats() {
  const s = streakInfo(), learned = learnedIds(), mastered = learned.filter(id => S.words[id][0] >= 5).length;
  const L = S.log[dkey(today())] || {};
  const mins = Math.round(Object.keys(S.log).reduce((a, k) => a + (+S.log[k].s || 0), 0) / 60);
  let h = '<div class="page wrap"><div><h1 class="h-page">学习进度</h1><p class="sub">每天学一点，热力图会越来越绿。</p></div>'
    + '<div class="tiles"><div class="tile"><span>已学词汇</span><b class="num">' + learned.length + '</b><small>共 ' + WLIST.length + ' 个</small></div>'
    + '<div class="tile"><span>已掌握</span><b class="num">' + mastered + '</b><small>复习间隔 30 天以上</small></div>'
    + '<div class="tile"><span>连续天数</span><b class="num">' + s.cur + '</b><small>最长 ' + s.best + ' 天</small></div>'
    + '<div class="tile"><span>今天</span><b class="num">' + ((L.n || 0) + (L.r || 0)) + '</b><small>新学 ' + (L.n || 0) + ' · 复习 ' + (L.r || 0) + '</small></div></div>';
  h += '<section class="card stack"><div class="row"><h2 class="h-sec grow">坚持热力图 <small>最近一年 · 学习 ' + s.total + ' 天' + (mins ? ' · 约 ' + mins + ' 分钟' : '') + '</small></h2></div><div class="chart-scroll">' + heatSVG(53) + '</div>' + heatLegend() + '</section>';
  h += '<section class="card stack"><div class="row wrap-ok"><h2 class="h-sec grow">词汇增长曲线</h2><div class="seg" role="group" aria-label="时间范围">' + [[30, '30 天'], [90, '90 天'], ['all', '全部']].map(r => '<button data-act="range" data-v="' + r[0] + '" aria-pressed="' + (String(UI.range) === String(r[0])) + '">' + r[1] + '</button>').join('') + '</div></div><div data-chart="growth"></div></section>';
  h += '<section class="card stack"><h2 class="h-sec">每日学习量 <small>最近 14 天</small></h2><div class="legend"><span><i style="background:var(--s-new)"></i>新学</span><span><i style="background:var(--s-rev)"></i>复习</span></div><div data-chart="cols"></div></section>';
  h += '<section class="card stack"><h2 class="h-sec">各课进度</h2><div class="tprog">' + TOPICS.map(t => { const x = topicStats(t); return '<a href="#t-' + t.id + '" style="color:inherit;text-decoration:none">' + esc(t.zh) + '</a><span class="bar"><i style="width:' + f1(x.l / x.n * 100) + '%"></i></span><span class="num">' + x.l + '/' + x.n + '</span>'; }).join('') + '</div></section>';
  const rows = Object.keys(S.log).filter(k => { const x = S.log[k]; return (x.n || 0) + (x.r || 0) > 0; }).sort().reverse().slice(0, 60);
  h += '<section class="card"><details class="more"><summary>每日明细（表格）</summary>' + (rows.length ? '<div style="overflow-x:auto;margin-top:8px"><table class="dtable num"><thead><tr><th>日期</th><th>新学</th><th>复习</th><th>分钟</th></tr></thead><tbody>' + rows.map(k => { const x = S.log[k]; return '<tr><td>' + fmtDay(kidx(k)) + '</td><td>' + (x.n || 0) + '</td><td>' + (x.r || 0) + '</td><td>' + Math.round((x.s || 0) / 60) + '</td></tr>'; }).join('') + '</tbody></table></div>' : '<p class="muted" style="margin-top:8px">还没有记录。</p>') + '</details></section>';
  return h + '</div>';
}

/* ---------- 设置 ---------- */
function vMe() {
  const P = S.prefs;
  Clips.pack('core');
  let h = '<div class="page wrap"><h1 class="h-page">设置</h1>';
  h += '<section class="card stack"><h2 class="h-sec">学习偏好</h2>'
    + (OFFLINE ? '' : '<div class="set"><span class="lbl">主要用在</span><div class="chips">' + Object.keys(SCENES).map(k => '<button class="chip" data-act="interest" data-v="' + k + '" aria-pressed="' + P.interests.includes(k) + '">' + SCENES[k] + '</button>').join('') + '</div><p class="hint">AI 例句默认用第一个选中的场景' + (P.interests.length ? '（现在是“' + SCENES[P.interests[0]] + '”）' : '') + '。</p></div>')
    + '<div class="set"><span class="lbl">每日新词目标</span><div class="seg">' + [5, 10, 15, 20].map(n => '<button data-act="pref" data-k="goal" data-v="' + n + '" aria-pressed="' + (P.goal === n) + '">' + n + '</button>').join('') + '</div></div>'
    + '<div class="set"><span class="lbl">每组学几个新词</span><div class="seg">' + [5, 8, 12].map(n => '<button data-act="pref" data-k="batch" data-v="' + n + '" aria-pressed="' + (P.batch === n) + '">' + n + '</button>').join('') + '</div></div></section>';
  h += '<section class="card stack"><h2 class="h-sec">发音 <small>只对这台设备生效</small></h2>'
    + '<p class="sub">课程里的字母、单词、例句和卡片都配好了印尼语音频：有真人录音的词播放真人录音，其余是预先生成的合成语音。真人录音听不清的词，可以在单词卡的“换个读法对比”里换一位说话人或换成合成语音。' + (OFFLINE ? '离线版把全部音频都装在这个文件里，不联网也能播放。' : '只有 AI 现写的句子和对话需要用设备自带的印尼语语音来读。') + '</p>'
    + '<div class="set"><label for="rate">正常语速 <span id="rate-v" class="muted num">' + DEV.rate.toFixed(2) + '×</span></label><input id="rate" type="range" min="0.7" max="1.2" step="0.05" value="' + DEV.rate + '"></div>'
    + '<div class="set"><label for="slowRate">句子慢放 <span id="slowRate-v" class="muted num">' + DEV.slowRate.toFixed(2) + '×</span></label><input id="slowRate" type="range" min="0.4" max="0.85" step="0.05" value="' + DEV.slowRate + '"><p class="hint">用于例句和真人录音单词的慢速播放；合成语音的单词另有专门生成的慢读音频。</p></div>'
    + '<label class="switch"><span><b>出现新词时自动朗读</b><br><span class="hint">学习和复习时自动读一遍</span></span><input id="autoplay" type="checkbox"' + (DEV.autoplay ? ' checked' : '') + '></label>'
    + '<div class="row"><button class="btn sm" data-say="Selamat datang di Indonesia. Senang bertemu dengan Anda.">' + ico('play') + '试听课程发音</button></div></section>';
  // 离线版没有 AI；只有从备份里带来了收藏的 AI 例句时才需要设备语音
  if (!OFFLINE || Object.keys(S.saved).some(id => (S.saved[id] || []).some(x => !x.x))) h += '<section class="card stack"><h2 class="h-sec">AI 句子用的设备语音</h2>' + voiceCard(false)
    + (TTS.idv.length ? '<div class="set"><label for="voice">印尼语语音</label><select id="voice">' + TTS.idv.map(v => '<option value="' + esc(v.voiceURI || v.name) + '"' + (TTS.voice() === v ? ' selected' : '') + '>' + esc(v.name) + '</option>').join('') + '</select>' + voiceCard(true) + '</div>' : '')
    + '<div class="row"><button class="btn sm" data-say="Halo, apa kabar? Saya sedang belajar bahasa Indonesia." data-tts="1">' + ico('play') + '试听设备语音</button></div></section>';
  h += '<section class="card stack"><h2 class="h-sec">' + (OFFLINE ? '学习记录' : '数据与同步') + '</h2><div class="row"><span class="sync-dot ' + ({ ok: 'ok', busy: 'busy', connecting: 'busy', err: 'err' }[Sync.state] || '') + '"></span><p class="sub grow" id="sync-text">' + esc(syncText()) + '</p></div>'
    + '<div class="row wrap-ok"><button class="btn sm" data-act="backup">复制备份</button><button class="btn sm" data-act="restoreOpen">从备份恢复</button>' + (Sync.db ? '<button class="btn sm" data-act="syncNow">立即同步</button>' : '') + '</div>'
    + (UI.restoreOpen ? '<div class="set"><label for="restore-text">把备份内容粘贴到这里</label><textarea id="restore-text" spellcheck="false" placeholder="{&quot;words&quot;: …}"></textarea><div class="row"><button class="btn sm primary" data-act="restore">恢复</button><button class="btn sm" data-act="restoreOpen">取消</button></div></div>' : '')
    + '<div id="backup-box"></div>'
    + '<p class="hint">' + (OFFLINE ? '想和在线版互相搬进度' : '另有不联网也能用的离线版（单独的文件），进度不会自动同步。想互相搬进度') + '：在一边点“复制备份”，到另一边用“从备份恢复”粘贴。恢复会覆盖那一边原有的记录。</p>'
    + (UI.confirmReset ? '<div class="confirm"><span>确定要清除全部学习记录吗？这一步无法撤销。</span><button class="btn sm" data-act="resetGo" style="color:var(--cabai)">确定清除</button><button class="btn sm" data-act="resetAsk">取消</button></div>' : '<div class="row"><button class="linkbtn danger" data-act="resetAsk">清除全部学习记录…</button></div>')
    + '</section>';
  const seen = DECK_LIST.filter(d => S.prefs.decks[d.id]);
  h += '<section class="card stack"><h2 class="h-sec">语法卡片夹 <small>已解锁 ' + seen.length + '/' + DECK_LIST.length + '</small></h2><p class="hint">语法卡片会在学到相关单词时出现，看过的都收在这里，随时翻。变化规则的总表不用解锁，在<a href="#ref">语法速查表</a>里。</p>'
    + DECK_LIST.map(d => S.prefs.decks[d.id] ? deckRow(d) : '<div class="deckrow locked"><span class="gi">语</span><span class="grow"><b>' + esc(d.zh) + '</b><small>在第 ' + TOPIC_BY[d.topic].n + ' 课“' + esc(TOPIC_BY[d.topic].zh) + '”中解锁</small></span></div>').join('') + '</section>';
  const flagged = Object.keys(S.flags).filter(id => (+S.flags[id] || 0) > 0 && WORDS[id]);
  if (flagged.length) h += '<section class="card stack"><h2 class="h-sec">读音问题清单 <small>' + flagged.length + ' 个</small></h2><p class="hint">' + (OFFLINE ? '离线版的标记只存在这台设备上。点上面的“复制备份”，把内容发给 Claude，就能按这个清单逐个修。' : '告诉 Claude“读音有问题的词我标记了”，就能按这个清单逐个修。') + '</p><div class="wlist">' + flagged.map(id => wordRow(WORDS[id])).join('') + '</div></section>';
  h += humanCredits();
  h += '<section class="card stack"><h2 class="h-sec">关于</h2><p class="sub">单词发音优先使用印尼语母语者的真人录音（Mozilla Common Voice 的志愿者），经过裁剪和音量统一处理，按原许可署名，见上方“真人录音来源”。没有真人录音的词、全部例句和卡片里的短语由 Meta 开源的印尼语语音合成模型 MMS-TTS（facebook/mms-tts-ind，CC BY-NC 4.0）预先生成，仅供个人学习使用。' + (OFFLINE ? 'AI 例句、对话和逐词拆解需要联网，离线版里没有，在线版里可以用。' : 'AI 例句、对话和逐词拆解由 Claude 现场生成，偶尔会有不够地道的地方，以课程例句为准；它们的朗读用设备自带的语音。') + '</p><p class="hint">' + (OFFLINE ? '离线版 · ' + BUILD + ' 生成 · ' : '') + '课程：' + TOPICS.length + ' 课 · ' + WLIST.length + ' 个词 · ' + WLIST.reduce((a, w) => a + w.ex.length, 0) + ' 个例句 · ' + DECK_LIST.length + ' 组语法卡片 · ' + TOPICS.reduce((a, t) => a + t.tips.length, 0) + ' 条文化贴士</p></section>';
  return h + '</div>';
}

function humanCredits() {
  const ids = Object.keys(AUDIO_HUMAN);
  if (!ids.length) return '';
  const by = {};
  ids.forEach(id => { const h = AUDIO_HUMAN[id]; const k = h[0] + ':' + h[1]; by[k] = (by[k] || 0) + 1; });
  const rows = Object.keys(by).sort((a, b) => by[b] - by[a]).map(k => {
    const [si, li] = k.split(':').map(Number), lic = AUDIO_CREDIT.licenses[li] || ['', ''];
    return '<li><b>' + esc(AUDIO_CREDIT.speakers[si]) + '</b> · ' + by[k] + ' 个词 · ' + (lic[1] ? '<a href="' + esc(lic[1]) + '" target="_blank" rel="noopener">' + esc(lic[0]) + '</a>' : esc(lic[0])) + '</li>';
  }).join('');
  const list = WLIST.filter(w => humanOf(w.w)).map(w => { const h = humanOf(w.w); return '<li><span lang="id">' + esc(w.w) + '</span> — ' + esc(h.speaker) + ' · <a href="' + esc(h.url) + '" target="_blank" rel="noopener">' + esc(h.license || '来源') + '</a></li>'; }).join('');
  return '<section class="card stack"><h2 class="h-sec">真人录音来源 <small>' + ids.length + ' 条</small></h2>'
    + '<p class="hint">单词真人录音来自 MLCommons 的<a href="' + MSWC_URL + '" target="_blank" rel="noopener">多语种口语词语料库（MSWC）</a>，从 Mozilla Common Voice 印尼语志愿者朗读的句子中自动切出单词，CC BY 4.0。多数词另有第二、第三位志愿者的读法，可以在单词卡里对比。页面里的版本做了裁剪、淡入淡出和音量统一，按原许可提供。</p>'
    + '<ul class="credits">' + rows + '</ul>'
    + '<details class="more"><summary>逐词查看来源</summary><ul class="credits small">' + list + '</ul></details></section>';
}

/* ---------- 弹层、提示、路由、渲染 ---------- */
let toastT = 0;
function toast(msg) {
  const el = $('#toast');
  el.textContent = msg; el.hidden = false;
  clearTimeout(toastT);
  toastT = setTimeout(() => { el.hidden = true; }, 2800);
}
function openSheet(html, word) {
  UI.sheetWord = word || null;
  const el = $('#sheet');
  el.innerHTML = '<div class="sheet-back" data-act="closeSheet"></div><div class="sheet-panel" role="dialog" aria-modal="true" aria-label="详情" tabindex="-1"><div class="sheet-bar"><span class="grab" aria-hidden="true"></span><button class="icon-btn" data-act="closeSheet" aria-label="关闭">' + ico('close') + '</button></div>' + html + '</div>';
  el.hidden = false;
  document.body.classList.add('noscroll');
  const p = $('.sheet-panel', el);
  if (p) p.focus({ preventScroll: true });
}
function closeSheet() {
  const el = $('#sheet');
  if (el.hidden) return;
  el.hidden = true; el.innerHTML = '';
  UI.sheetWord = null;
  document.body.classList.remove('noscroll');
  TTS.stop();
  if (['topic', 'learn', 'home', 'stats', 'me'].includes(UI.route.name)) render();
}
function openWord(id) { const w = WORDS[id]; if (w) { Clips.pack(w.topic); openSheet(wordCard(w), id); } }
function refreshWordViews(id) {
  if (UI.sheetWord === id) { const p = $('.sheet-panel'); const top = p ? p.scrollTop : 0; openWord(id); const p2 = $('.sheet-panel'); if (p2) p2.scrollTop = top; }
  else if (UI.route.name === 'study') { const y = window.scrollY; render(); window.scrollTo(0, y); }
}
const VIEWS = { home: vHome, learn: vLearn, review: vReview, pron: vPron, stats: vStats, me: vMe, topic: vTopic, study: vStudy, ref: vRef };
function parseHash() {
  let h = location.hash.slice(1);
  try { h = decodeURIComponent(h); } catch (e) { /* 忽略 */ }
  if (h.indexOf('t-') === 0 && TOPIC_BY[h.slice(2)]) return { name: 'topic', arg: h.slice(2) };
  if (h === 'study') return UI.sess ? { name: 'study' } : { name: 'home' };
  if (h.indexOf('ref-') === 0) return { name: 'ref', arg: h.slice(4) };
  if (h && VIEWS[h] && h !== 'topic') return { name: h };
  return { name: 'home' };
}
function go(h) {
  if (location.hash.slice(1) !== h) { UI.silentHash = h; location.hash = h; }
  route();
}
function onHash() {
  if (UI.silentHash && location.hash.slice(1) === UI.silentHash) { UI.silentHash = null; return; }
  UI.silentHash = null;
  route();
}
function route() {
  const prev = UI.route.name;
  UI.route = parseHash();
  closeSheetSilently();
  if (prev !== UI.route.name || UI.route.name === 'topic') TTS.stop();
  render();
  window.scrollTo(0, 0);
  const m = $('#main');
  if (m && prev !== UI.route.name) m.focus({ preventScroll: true });
  if (UI.route.name === 'ref' && UI.route.arg) { const el = document.getElementById('ref-' + UI.route.arg); if (el) el.scrollIntoView(); }
}
function closeSheetSilently() { const el = $('#sheet'); if (el && !el.hidden) { el.hidden = true; el.innerHTML = ''; UI.sheetWord = null; document.body.classList.remove('noscroll'); } }
function render() {
  const r = UI.route;
  $('#main').innerHTML = (VIEWS[r.name] || vHome)(r.arg);
  updateNav();
  drawCharts();
  if (TTS.cur) markPlaying(TTS.cur.key, true);
}
function updateNav() {
  const cur = ['topic', 'study', 'ref'].includes(UI.route.name) ? 'learn' : UI.route.name;
  $$('#nav a[data-nav]').forEach(a => { if (a.dataset.nav === cur) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current'); });
  const b = $('#due-badge'), n = dueIds().length;
  if (b) { b.hidden = !n; b.textContent = n > 99 ? '99+' : String(n); }
}
function drawCharts() {
  $$('[data-chart]').forEach(el => {
    const W = Math.max(260, Math.floor(el.clientWidth || el.parentElement.clientWidth || 320));
    const k = el.dataset.chart;
    if (k === 'hill') el.innerHTML = hillSVG(W);
    else if (k === 'growth') el.innerHTML = growthSVG(W, UI.range);
    else if (k === 'cols') el.innerHTML = colsSVG(W);
  });
  $$('.chart-scroll').forEach(el => { el.scrollLeft = el.scrollWidth; });
}

/* ---------- 图表悬停提示 ---------- */
const tt = () => $('#tt');
let ttOn = false;
function showTT(html, e) {
  const el = tt();
  el.innerHTML = html; el.hidden = false; ttOn = true;
  const r = el.getBoundingClientRect(), vw = window.innerWidth;
  let x = e.clientX + 14, y = e.clientY - r.height - 12;
  if (x + r.width > vw - 8) x = e.clientX - r.width - 14;
  if (y < 8) y = e.clientY + 18;
  el.style.left = Math.max(8, x) + 'px'; el.style.top = y + 'px';
}
function hideTT() {
  if (!ttOn) return;
  tt().hidden = true; ttOn = false;
  const gx = $('#g-x'), gd = $('#g-d');
  if (gx) gx.setAttribute('visibility', 'hidden');
  if (gd) gd.setAttribute('visibility', 'hidden');
}
function onChartPointer(e) {
  const el = e.target;
  if (!(el instanceof Element)) return hideTT();
  if (el.tagName === 'rect' && el.dataset.d) {
    const d = +el.dataset.d, L = S.log[dkey(d)] || {};
    return showTT('<b>' + ((L.n || 0) + (L.r || 0)) + ' 次学习</b>' + fmtDay(d) + '<br>新学 ' + (L.n || 0) + ' · 复习 ' + (L.r || 0), e);
  }
  if (el.dataset.col != null && CMETA) {
    const i = +el.dataset.col, v = CMETA.data[i];
    return showTT('<b>' + (v[0] + v[1]) + ' 次</b>' + fmtDay(CMETA.days[i]) + '<br><span class="k" style="background:var(--s-new)"></span>新学 ' + v[0] + '<br><span class="k" style="background:var(--s-rev)"></span>复习 ' + v[1], e);
  }
  if (el.dataset.growth && GMETA) {
    const r = el.getBoundingClientRect(), G = GMETA;
    const i = Math.max(0, Math.min(G.N - 1, Math.round((e.clientX - r.left) / r.width * (G.N - 1))));
    const gx = $('#g-x'), gd = $('#g-d');
    if (gx) { gx.setAttribute('x1', G.x(i)); gx.setAttribute('x2', G.x(i)); gx.setAttribute('visibility', 'visible'); }
    if (gd) { gd.setAttribute('cx', G.x(i)); gd.setAttribute('cy', G.y(G.vals[i])); gd.setAttribute('visibility', 'visible'); }
    return showTT('<b>' + G.vals[i] + ' 个词</b>' + fmtDay(G.start + i), e);
  }
  hideTT();
}

/* ---------- 事件 ---------- */
const ACT = {
  study: b => startStudy(b.dataset.t),
  practice: b => { const t = TOPIC_BY[b.dataset.t]; startReview(shuffle(t.words.filter(w => isLearned(w.id)).map(w => w.id)), true, '练习：' + t.zh); },
  next: () => sessNext(),
  quit: () => { TTS.stop(); go('home'); toast('进度已保存，可以在首页继续'); },
  qans: b => qAnswer(b.dataset.v),
  qnext: () => qNext(),
  word: b => openWord(b.dataset.id),
  closeSheet: () => closeSheet(),
  deck: b => { const d = DECKS[b.dataset.d]; if (d) { openSheet(deckHTML(d)); S.prefs.decks[d.id] = 1; Sync.mark('prefs'); } },
  dprev: b => deckMove(b, -1),
  dnext: b => deckMove(b, 1),
  dq: b => {
    const d = DECKS[b.dataset.d], qi = +b.dataset.q, oi = +b.dataset.o;
    UI.dq[d.id + ':' + qi] = oi;
    const el = document.getElementById('dq-' + d.id + '-' + qi);
    if (el) el.outerHTML = quizBlock(d, d.quiz[qi], qi);
    if (!S.prefs.decks[d.id]) { S.prefs.decks[d.id] = 1; Sync.mark('prefs'); }
  },
  lfilter: b => { UI.lf = b.dataset.v; render(); },
  aiGen: b => aiSentence(b.dataset.id),
  aiScene: b => { const st = UI.ai[b.dataset.id] || (UI.ai[b.dataset.id] = {}); st.scene = b.dataset.v; if (st.status !== 'loading') { if (st.status === 'done') st.status = ''; refreshAI(WORDS[b.dataset.id]); } },
  aiSave: b => {
    const id = b.dataset.id, st = UI.ai[id];
    if (!st || !st.data) return;
    const arr = S.saved[id] || (S.saved[id] = []);
    const m = arr.find(x => x.id === st.data.id);
    if (m) delete m.x; else arr.push({ id: st.data.id, zh: st.data.zh, t: Date.now() });
    Sync.mark('saved');
    toast('已收藏到这个词的例句里');
    st.status = ''; st.data = null;
    refreshWordViews(id);
  },
  unsave: b => { const arr = S.saved[b.dataset.id] || []; const m = arr.find(x => x.id === b.dataset.s); if (m) { m.x = 1; Sync.mark('saved'); refreshWordViews(b.dataset.id); } },
  gloss: b => aiGloss(b.dataset.s, b.dataset.z),
  pickVar: b => {
    const w = WORDS[b.dataset.id];
    if (!w) return;
    const id = hash(audioKey(w.w)), k = +b.dataset.v || 0;
    const v = {};
    Object.keys(S.prefs.var || {}).forEach(x => { if (x !== id) v[x] = S.prefs.var[x]; });
    if (k) v[id] = k;
    setPrefs({ var: v });
    const box = b.closest('.w-vars'), card = b.closest('.wcard');
    if (box) $$('[data-act="pickVar"]', box).forEach(x => x.setAttribute('aria-pressed', String(x === b)));
    const src = card && $('.w-src', card);
    if (src) src.outerHTML = srcLine(w);
    TTS.play(w.w, b.dataset.key, { v: k });
  },
  flag: b => {
    const id = b.dataset.id, on = (+S.flags[id] || 0) > 0;
    S.flags[id] = on ? -Date.now() : Date.now();
    Sync.mark('flags');
    toast(on ? '已取消标记' : OFFLINE ? '已记下，清单在“设置”页' : '已记下。之后告诉 Claude“读音有问题的词我标记了”，就能按清单逐个修');
    refreshWordViews(id);
  },
  dlgGen: b => aiDialog(b.dataset.id),
  dlgScene: b => { const st = UI.dlg[b.dataset.id] || (UI.dlg[b.dataset.id] = {}); st.scene = b.dataset.v; if (st.status !== 'loading') refreshDlg(b.dataset.id); },
  dlgPlay: b => {
    const st = UI.dlg[b.dataset.id];
    if (!st || !st.data) return;
    const vs = TTS.idv;
    TTS.run(st.data.lines.map(l => ({ text: l.id, voice: l.who === 'B' && vs.length > 1 ? vs[1] : null })), 'dlg:' + b.dataset.id, { noLoop: false });
  },
  tgSlow: b => { DEV.slow = !DEV.slow; saveDev(); b.setAttribute('aria-pressed', DEV.slow); toast(DEV.slow ? '慢速朗读已打开' : '恢复正常语速'); },
  tgLoop: b => { DEV.loop = !DEV.loop; saveDev(); b.setAttribute('aria-pressed', DEV.loop); toast(DEV.loop ? '循环朗读已打开，再点一次播放按钮可停止' : '循环朗读已关闭'); },
  letter: b => {
    UI.letter = +b.dataset.i;
    const box = $('#ldetail');
    if (box) box.innerHTML = letterDetail();
    $$('.ltile').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
  },
  pairNew: () => {
    const p = UI.pair || (UI.pair = { n: 0, ok: 0 });
    let i = rnd(PAIRS.length);
    if (PAIRS.length > 1 && i === p.cur) i = (i + 1) % PAIRS.length;
    p.cur = i; p.side = rnd(2); p.pick = null;
    $('#pairbox').innerHTML = pairView();
    TTS.play(PAIRS[i][p.side * 2], 'pair', { noLoop: true });
  },
  pairPick: b => {
    const p = UI.pair;
    if (!p || p.pick != null) return;
    p.pick = +b.dataset.v; p.n++;
    if (p.pick === p.side) p.ok++;
    $('#pairbox').innerHTML = pairView();
  },
  revStart: () => { UI.rev = null; startReview(dueIds(), false); },
  revSoon: () => { UI.rev = null; startReview(soonIds(), false, '提前复习'); },
  revMissed: b => { UI.rev = null; startReview(String(b.dataset.ids || '').split('|'), true, '再过一遍不认识的'); },
  rqans: b => revQuizAnswer(b.dataset.v),
  rqnext: () => revQuizNext(),
  revFree: () => startReview(shuffle(learnedIds()).slice(0, 10), true, '随机练习'),
  revExit: () => { UI.rev = null; TTS.stop(); render(); window.scrollTo(0, 0); },
  reveal: () => { const rv = UI.rev; if (rv && !rv.quiz && !rv.shown && rv.i < rv.queue.length) { rv.shown = true; render(); autoSay(WORDS[rv.queue[rv.i]].w); } },   // 揭示答案时自动朗读
  grade: b => doGrade(+b.dataset.v),
  range: b => { UI.range = b.dataset.v === 'all' ? 'all' : +b.dataset.v; render(); },
  interest: b => {
    const k = b.dataset.v, arr = S.prefs.interests.slice(), i = arr.indexOf(k);
    if (i >= 0) arr.splice(i, 1); else arr.push(k);
    setPrefs({ interests: arr });
    b.setAttribute('aria-pressed', String(i < 0));
    if (UI.route.name === 'me') render();
  },
  pref: b => { const p = {}; p[b.dataset.k] = +b.dataset.v; setPrefs(p); $$('[data-act="pref"][data-k="' + b.dataset.k + '"]').forEach(x => x.setAttribute('aria-pressed', String(x === b))); },
  onbDone: () => { UI.onbSkip = true; if (!S.prefs.t) setPrefs({}); render(); },
  backup: () => {
    const txt = JSON.stringify({ app: 'bukit', v: 1, at: new Date().toISOString(), words: S.words, log: S.log, prefs: S.prefs, saved: S.saved, flags: S.flags });
    const box = $('#backup-box');
    const fallback = () => { if (box) { box.innerHTML = '<div class="set"><label for="backup-text">复制下面的全部内容，保存到备忘录或文件里</label><textarea id="backup-text" readonly spellcheck="false"></textarea></div>'; const ta = $('#backup-text'); ta.value = txt; ta.focus(); ta.select(); } };
    try { navigator.clipboard.writeText(txt).then(() => toast('备份已复制，可以粘贴到备忘录保存'), fallback); } catch (e) { fallback(); }
  },
  restoreOpen: () => { UI.restoreOpen = !UI.restoreOpen; render(); },
  restore: () => {
    const ta = $('#restore-text');
    let o = null;
    try { o = JSON.parse(ta.value); } catch (e) { o = null; }
    if (!o || typeof o.words !== 'object' || typeof o.log !== 'object') { toast('备份内容不对，请完整粘贴“复制备份”得到的文字'); return; }
    S.words = o.words || {}; S.log = o.log || {}; S.saved = o.saved || {};
    if (o.flags && typeof o.flags === 'object') S.flags = o.flags;
    S.prefs = Object.assign({}, DEF_PREFS, o.prefs || {}, { t: Date.now() });
    DOCS.forEach(n => Sync.mark(n, 300));
    UI.restoreOpen = false;
    render(); toast('已从备份恢复');
  },
  syncNow: () => { Sync.flushAll(); Sync.pull().then(() => toast('已同步'), () => toast('同步失败，稍后再试')); },
  resetAsk: () => { UI.confirmReset = !UI.confirmReset; render(); },
  resetGo: () => {
    S.words = {}; S.log = {}; S.saved = {};
    const now = Date.now();
    S.prefs = Object.assign({}, DEF_PREFS, { interests: S.prefs.interests, goal: S.prefs.goal, batch: S.prefs.batch, t: now, resetAt: now });
    UI.sess = null; UI.rev = null; UI.confirmReset = false;
    DOCS.forEach(n => Sync.mark(n, 300));
    render(); toast('学习记录已清除');
  }
};
function deckMove(b, dir) {
  const deck = b.closest('.deck'), tr = deck && $('.deck-track', deck);
  if (!tr || !tr.children.length) return;
  const w = tr.children[0].offsetWidth + 12;
  tr.scrollBy({ left: dir * w, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
}
function onClick(e) {
  const t = e.target;
  if (!(t instanceof Element)) return;
  const a = t.closest('[data-act]');
  const s = t.closest('[data-say]');
  if (a && a.matches('[disabled]')) return;
  if (s && !s.disabled) {
    TTS.play(s.dataset.say, sayKey(s), { slow: s.dataset.rate === 'slow', tts: s.dataset.tts === '1' });
  }
  if (a && ACT[a.dataset.act]) { e.preventDefault(); ACT[a.dataset.act](a, e); }
}
function onSubmit(e) {
  const f = e.target;
  if (f && f.dataset && f.dataset.actForm === 'spell') { e.preventDefault(); const i = $('#spell-in'); if (i && i.value.trim()) qAnswer(i.value); }
}
function onInput(e) {
  const t = e.target;
  if (t.id === 'q') { UI.q = t.value; const r = $('#search-res'); if (r) r.innerHTML = searchResults(UI.q); }
  else if (t.id === 'rate' || t.id === 'slowRate') { DEV[t.id] = +t.value; saveDev(); const l = $('#' + t.id + '-v'); if (l) l.textContent = (+t.value).toFixed(2) + '×'; }
}
function onChange(e) {
  const t = e.target;
  if (t.id === 'voice') { DEV.voice = t.value; saveDev(); const v = TTS.voice(); TTS.play('Halo, apa kabar?', 'voice-test', { noLoop: true, voice: v, tts: true }); }
  else if (t.id === 'autoplay') { DEV.autoplay = t.checked; saveDev(); }
}
function onKey(e) {
  if (e.key === 'Escape') { closeSheet(); return; }
  const tag = (e.target && e.target.tagName) || '';
  if (/INPUT|TEXTAREA|SELECT/.test(tag) || e.metaKey || e.ctrlKey || e.altKey) return;
  if (UI.route.name === 'review' && UI.rev && UI.rev.quiz && $('#sheet').hidden) {
    const q = UI.rev.quiz;
    if (q.ans && e.key === 'Enter') { e.preventDefault(); revQuizNext(); }
    else if (!q.ans && /^[1-4]$/.test(e.key)) { const ob = $$('.qopt')[+e.key - 1]; if (ob) { e.preventDefault(); revQuizAnswer(ob.dataset.v); } }
  } else if (UI.route.name === 'review' && UI.rev && UI.rev.i < UI.rev.queue.length && $('#sheet').hidden) {
    if (!UI.rev.shown && (e.key === ' ' || e.key === 'Enter')) { e.preventDefault(); ACT.reveal(); }
    else if (UI.rev.shown && /^[1-3]$/.test(e.key)) { e.preventDefault(); doGrade(+e.key - 1); }
  } else if (UI.route.name === 'study' && UI.sess && !UI.sess.finished && $('#sheet').hidden) {
    const st = UI.sess.steps[UI.sess.i];
    if (st && st.type === 'quiz') {
      const q = UI.sess.quiz[UI.sess.qi];
      if (UI.sess.qAns && !UI.sess.qAns.ok && e.key === 'Enter') { e.preventDefault(); qNext(); }
      else if (!UI.sess.qAns && q && q.opts && /^[1-4]$/.test(e.key)) { const ob = $$('.qopt')[+e.key - 1]; if (ob) { e.preventDefault(); qAnswer(ob.dataset.v); } }
    } else if (e.key === 'Enter' && !(e.target.closest && e.target.closest('button,a'))) { e.preventDefault(); sessNext(); }
  }
}
function onScrollCapture(e) {
  const tr = e.target;
  if (!(tr instanceof Element) || !tr.classList.contains('deck-track')) return;
  if (tr._raf) return;
  tr._raf = requestAnimationFrame(() => {
    tr._raf = 0;
    if (!tr.children.length) return;
    const w = tr.children[0].offsetWidth + 12;
    const max = tr.scrollWidth - tr.clientWidth;
    let i = Math.round(tr.scrollLeft / w);
    if (tr.scrollLeft >= max - 4) i = tr.children.length - 1;
    const dots = $$('.ddots i', tr.parentElement);
    dots.forEach((d, j) => d.classList.toggle('on', j === i));
    const deck = tr.closest('.deck');
    if (deck && i === tr.children.length - 1 && !S.prefs.decks[deck.dataset.deck]) { S.prefs.decks[deck.dataset.deck] = 1; Sync.mark('prefs'); }
  });
}

/* ---------- 启动 ---------- */
function navHTML() {
  const items = [['home', '今天', 'today'], ['learn', '课程', 'learn'], ['review', '复习', 'review'], ['pron', '发音', 'pron'], ['stats', '进度', 'stats']];
  return '<a class="brand" href="#home">' + BRAND + 'Bukit<small>' + (OFFLINE ? '印尼语 · 离线版' : '印尼语') + '</small></a>'
    + items.map(x => '<a href="#' + x[0] + '" data-nav="' + x[0] + '">' + ico(x[2]) + '<span>' + x[1] + '</span>' + (x[0] === 'review' ? '<b class="badge" id="due-badge" hidden></b>' : '') + '</a>').join('')
    + '<a href="#me" data-nav="me" class="nav-me">' + ico('me') + '<span>设置</span></a>'
    + '<p class="nav-extra"><i lang="id">Sedikit demi sedikit, lama-lama menjadi bukit.</i><br>积少成多，聚沙成山。</p>';
}
function topbarHTML() {
  return '<div class="wrap"><a class="brand" href="#home">' + BRAND + 'Bukit<small>' + (OFFLINE ? '离线版' : '印尼语') + '</small></a><div class="top-tools">'
    + '<button class="pill" data-act="tgSlow" aria-pressed="' + DEV.slow + '" title="所有朗读都放慢">' + ico('slow') + '慢速</button>'
    + '<button class="pill" data-act="tgLoop" aria-pressed="' + DEV.loop + '" title="朗读结束后自动重复">' + ico('loop') + '循环</button>'
    + '<a class="gear" href="#me" aria-label="设置与同步" title="">' + ico('me') + '<span class="sync-dot" id="sync-dot"></span></a></div></div>';
}
let lastAct = 0, timeDirty = false;
function trackTime() {
  const now = Date.now(), gap = now - lastAct;
  if (lastAct && gap < 45000 && gap > 0 && ['study', 'review', 'pron', 'topic'].includes(UI.route.name)) {
    const k = dkey(today()); const L = S.log[k] || (S.log[k] = { n: 0, r: 0, s: 0 });
    L.s = Math.round(((L.s || 0) + gap / 1000) * 10) / 10; timeDirty = true;
  }
  lastAct = now;
}
function init() {
  $('#nav').innerHTML = navHTML();
  $('#topbar').innerHTML = topbarHTML();
  TTS.init();
  window.addEventListener('hashchange', onHash);
  document.addEventListener('click', onClick);
  document.addEventListener('submit', onSubmit);
  document.addEventListener('input', onInput);
  document.addEventListener('change', onChange);
  document.addEventListener('keydown', onKey);
  document.addEventListener('scroll', onScrollCapture, true);
  document.addEventListener('pointermove', onChartPointer, { passive: true });
  document.addEventListener('pointerdown', e => { Player.unlock(); trackTime(); onChartPointer(e); }, { passive: true });
  window.addEventListener('scroll', hideTT, { passive: true });
  let rt = 0;
  window.addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(drawCharts, 180); });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { if (timeDirty) { timeDirty = false; Sync.mark('log', 0); } Sync.flushAll(); persist(); }
    else if (Sync.db && Date.now() - Sync.lastPull > 20000) Sync.pull().catch(() => {});
  });
  window.addEventListener('pagehide', persist);
  Sync.set('local');
  route();
  Sync.init();
  AI.init();
}
init();
})();
