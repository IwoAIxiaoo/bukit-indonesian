/* ===== 复习排程：FSRS（ts-fsrs，见 vendor/ts-fsrs.js）+ 客观自动判分 =====
   这里只放和页面无关的函数，tools/test-srs.js 在 Node 里直接加载测试。

   学习记录（S.words[id]）还是原来的数组，前 10 项含义不变：
     0 等级(1–8)  1 到期日(天序号)  2 修改时间(毫秒)  3 复习次数  4 不认识次数  5 首次学会日
     6 上次反馈(0 不认识 / 1 模糊 / 2 认识 / 3 新学、当天还要再见一次)  7 再考时间(毫秒，0 = 没有)
     8 已掌握(1)  9 标记已掌握前的等级
   新增第 10 项：FSRS 卡片，紧凑数组
     [到期(毫秒), stability, difficulty, state, reps, lapses, 上次复习(毫秒，0 = 没有), scheduled_days, learning_steps]
   每次按 FSRS 排程后，前面几项也跟着更新（到期日、等级、上次反馈……），首页、错词本、同步、备份都照旧能用。
   没有第 10 项的旧记录在第一次复习时按原来的间隔换算成 FSRS 卡片。 */
const SRS_LIB = globalThis.FSRS;
// 评 1 分直接排到明天（不用 FSRS 的分钟级学习步）；当天的重来交给复习页的本轮错题队列
const SRS_PARAMS = { request_retention: 0.9, maximum_interval: 36500, enable_fuzz: true, enable_short_term: false };
const SRS_F = SRS_LIB.fsrs(SRS_PARAMS);
const SRS_DAY = 864e5;
const SRS_NEW_SEE = 3;                         // 学习记录第 6 项：新学的词，当天还要再见一次
const SRS_OLD_IV = [0, 1, 3, 7, 14, 30, 60, 120, 240];   // 旧版按等级的复习间隔（天），只用来换算旧记录
const RATING_NAME = { 1: '不认识', 2: '模糊', 3: '认识', 4: '极熟练' };

/* ---------- 客观自动判分 ---------- */
// 阈值：打字补偿每个字母 0.3 秒；扣掉补偿后超过 10 秒算“想了比较久”，4 秒以内算“反应很快”
const EVAL = { msPerLetter: 300, slowMs: 10000, fastMs: 4000 };
// 一次作答 → FSRS 的 1–4 分
//   attempts        提交了几次（答对的那次也算；看了答案时是看答案之前提交的次数）
//   hintsUsed       用没用过提示（次数或 true / false）
//   skipped         有没有点“看答案”
//   correct         最后答对没有（默认答对；错满次数直接给答案时传 false）
//   reactionTimeMs  从出题到答对（或看答案）的毫秒数
//   target          目标词，用来算打字补偿；选择题传空字符串
function evaluateAttempt(a) {
  a = a || {};
  const attempts = Math.max(1, Math.floor(+a.attempts || 1));
  const letters = (String(a.target || '').match(/\p{L}/gu) || []).length;   // 空格、连字符、标点不算
  const reactionTimeMs = Math.max(0, +a.reactionTimeMs || 0);
  const thinkMs = Math.max(0, reactionTimeMs - EVAL.msPerLetter * letters);
  let rating, reason;
  if (a.skipped) { rating = 1; reason = '看了答案'; }
  else if (a.correct === false) { rating = 1; reason = '拼错了 ' + attempts + ' 次'; }
  else if (attempts >= 3) { rating = 1; reason = '拼错了 ' + (attempts - 1) + ' 次'; }
  else if (attempts === 2) { rating = 2; reason = '第 2 次才答对'; }
  else if (a.hintsUsed) { rating = 2; reason = '用了提示'; }
  else if (thinkMs > EVAL.slowMs) { rating = 2; reason = '想了比较久'; }
  else if (thinkMs <= EVAL.fastMs) { rating = 4; reason = '一次答对，反应很快'; }
  else { rating = 3; reason = '一次答对'; }
  return { rating, requeue: rating === 1, thinkMs, reason };
}

/* ---------- 日期换算（按本地时间算“哪一天”，和页面里的 dayIdx 一致） ---------- */
const srsDay = ms => { const d = new Date(ms); return Math.floor((ms - d.getTimezoneOffset() * 6e4) / SRS_DAY); };
const srsDayStart = day => { const g = day * SRS_DAY; return g + new Date(g).getTimezoneOffset() * 6e4; };

/* ---------- FSRS 卡片和学习记录互相转换 ---------- */
const srsRound = (x, n) => Math.round(x * n) / n;
function srsPack(c) {
  return [+c.due, srsRound(c.stability, 1e4), srsRound(c.difficulty, 1e4), c.state, c.reps, c.lapses, c.last_review ? +c.last_review : 0, c.scheduled_days || 0, c.learning_steps || 0];
}
function srsUnpack(a) {
  const last = a[6] ? new Date(a[6]) : undefined;
  return { due: new Date(a[0]), stability: +a[1] || 0, difficulty: +a[2] || 0, elapsed_days: 0, scheduled_days: +a[7] || 0, learning_steps: +a[8] || 0, reps: +a[4] || 0, lapses: +a[5] || 0, state: +a[3] || 0, last_review: last };
}
// 等级（熟练度 1–8）按 stability 分档，和旧版间隔表大致对应
function srsLevel(stability) {
  const cut = [1.5, 4, 8, 15, 31, 61, 121];
  let lv = 1;
  while (lv <= cut.length && stability >= cut[lv - 1]) lv++;
  return Math.min(8, lv);
}
// 学习记录 → FSRS 卡片。没学过的词返回 null
function cardFromRecord(s, now) {
  if (!Array.isArray(s) || !(s[0] > 0)) return null;
  if (Array.isArray(s[10])) return srsUnpack(s[10]);
  now = now || Date.now();
  // 学过但一次都没复习过（包括“今天新学、当天还要再见一次”的）：New 卡，到期时间沿用原来的
  if (!(s[3] > 0) || s[6] === SRS_NEW_SEE) {
    const due = s[7] > 0 ? s[7] : srsDayStart(s[1] || srsDay(now));
    const c = SRS_LIB.createEmptyCard(new Date(due));
    c.due = new Date(due);
    return c;
  }
  // 旧版复习过的词：Review 卡，stability 取原来的间隔，到期日不变
  const lv = Math.max(1, Math.min(8, s[0] | 0)), iv = Math.max(1, SRS_OLD_IV[lv]);
  const dueDay = s[1] || srsDay(now), due = s[7] > 0 ? s[7] : srsDayStart(dueDay);
  return {
    due: new Date(due), stability: iv, difficulty: Math.min(10, 5 + 0.5 * (s[4] || 0)), elapsed_days: 0, scheduled_days: iv, learning_steps: 0,
    reps: s[3] || 0, lapses: s[4] || 0, state: SRS_LIB.State.Review, last_review: new Date(Math.min(now, srsDayStart(dueDay) - iv * SRS_DAY))
  };
}
// 按新的 FSRS 卡片更新学习记录（返回新数组，不改原数组）
function recordWithCard(s, card, rating, now) {
  now = now || Date.now();
  const r = Array.isArray(s) ? s.slice() : [];
  while (r.length < 10) r.push(r.length === 8 || r.length === 9 ? null : 0);
  r[0] = srsLevel(card.stability);
  r[1] = srsDay(+card.due);
  r[2] = now;
  r[3] = card.reps;
  r[4] = card.lapses;
  if (r[5] == null || r[5] === 0) r[5] = srsDay(now);
  r[6] = rating === 1 ? 0 : rating === 2 ? 1 : 2;
  r[7] = 0;
  r[10] = srsPack(card);
  return r;
}
// 评分并排下次复习：返回新的学习记录
function srsReview(s, rating, now) {
  now = now || Date.now();
  const card = cardFromRecord(s, now) || SRS_LIB.createEmptyCard(new Date(now));
  // 上次复习时间不能晚于现在（另一台设备的时钟偏快、或者标过“已掌握”的词），否则 ts-fsrs 会报错
  if (card.last_review && +card.last_review > now) card.last_review = new Date(now);
  const next = SRS_F.next(card, new Date(now), rating).card;
  // 评 1 分：不管 FSRS 算出多少天，都在明天再考（stability、difficulty 仍按 FSRS 的结果更新）
  if (rating === 1) { next.due = new Date(now + SRS_DAY); next.scheduled_days = 1; }
  return recordWithCard(s, next, rating, now);
}
// 新学一个词：建一张 New 卡，delayMs 之后第一次复习（当天再见一次）
function srsNewRecord(prev, now, delayMs) {
  now = now || Date.now();
  const due = now + (delayMs || 0), t = srsDay(now), c = SRS_LIB.createEmptyCard(new Date(due));
  c.due = new Date(due);
  return [1, t, now, prev ? prev[3] || 0 : 0, prev ? prev[4] || 0 : 0, t, SRS_NEW_SEE, due, null, null, srsPack(c)];
}
// 下次复习还有几天（给界面显示用）
function srsDaysUntil(s, now) {
  const c = cardFromRecord(s, now);
  return c ? Math.max(0, srsDay(+c.due) - srsDay(now || Date.now())) : null;
}
