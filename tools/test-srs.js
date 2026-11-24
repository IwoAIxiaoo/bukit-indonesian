// FSRS 排程和客观自动判分的单元测试（不需要浏览器）：node tools/test-srs.js
const fs = require('fs'), vm = require('vm'), path = require('path');
const ROOT = path.join(__dirname, '..');
const ctx = { console }; ctx.globalThis = ctx; vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(ROOT, 'vendor/ts-fsrs.js'), 'utf8'), ctx);
vm.runInContext(fs.readFileSync(path.join(ROOT, 'src/srs.js'), 'utf8') + '\n;globalThis.__srs = { evaluateAttempt, EVAL, cardFromRecord, recordWithCard, srsReview, srsNewRecord, srsPack, srsUnpack, srsLevel, srsDay, srsDayStart, srsDaysUntil, SRS_PARAMS };', ctx);
const S = ctx.__srs;
const fail = [];
const check = (name, ok, extra) => { console.log((ok ? 'ok   ' : 'FAIL ') + name + (extra !== undefined ? '  ' + extra : '')); if (!ok) fail.push(name); };
const ev = o => S.evaluateAttempt(o);

// ---- evaluateAttempt
check('ts-fsrs loaded; short-term steps off, fuzz on, retention 0.9', !!ctx.FSRS && S.SRS_PARAMS.enable_short_term === false && S.SRS_PARAMS.enable_fuzz === true && S.SRS_PARAMS.request_retention === 0.9);
check('skipped → 1 and requeue', ev({ attempts: 1, skipped: true, reactionTimeMs: 2000, target: 'makan' }).rating === 1 && ev({ skipped: true }).requeue === true);
check('wrong twice (3rd attempt) → 1', ev({ attempts: 3, reactionTimeMs: 3000, target: 'makan' }).rating === 1);
check('never answered right (2 wrong, answer shown) → 1, requeue', ev({ attempts: 2, correct: false, reactionTimeMs: 3000, target: 'makan' }).rating === 1 && ev({ attempts: 2, correct: false }).requeue && /拼错了 2 次/.test(ev({ attempts: 2, correct: false }).reason));
check('right on the 2nd try → 2, no requeue', ev({ attempts: 2, reactionTimeMs: 3000, target: 'makan' }).rating === 2 && !ev({ attempts: 2 }).requeue);
check('hint used → 2 even when fast', ev({ attempts: 1, hintsUsed: 1, reactionTimeMs: 1000, target: 'makan' }).rating === 2 && ev({ attempts: 1, hintsUsed: true, reactionTimeMs: 1000, target: 'makan' }).rating === 2);
check('hint and wrong twice → still 1', ev({ attempts: 3, hintsUsed: true, reactionTimeMs: 1000, target: 'makan' }).rating === 1);
// kembalikan：10 个字母，补偿 3 秒
const k = t => ev({ attempts: 1, reactionTimeMs: t, target: 'kembalikan' });
check('typing allowance: kembalikan 13.5 s → 10.5 s → 2', k(13500).rating === 2 && k(13500).thinkMs === 10500, JSON.stringify(k(13500)));
check('typing allowance: kembalikan 12.9 s → 9.9 s → 3', k(12900).rating === 3 && k(12900).thinkMs === 9900);
check('typing allowance: kembalikan 13.0 s → exactly 10 s → 3 (only "over 10 s" is slow)', k(13000).rating === 3);
check('typing allowance: kembalikan 6.9 s → 3.9 s → 4', k(6900).rating === 4 && k(6900).thinkMs === 3900);
check('typing allowance: kembalikan 7.0 s → 4.0 s → 4; 7.1 s → 3', k(7000).rating === 4 && k(7100).rating === 3);
check('spaces and hyphens are not letters: jalan-jalan = 10 letters, selamat pagi = 11', ev({ attempts: 1, reactionTimeMs: 7000, target: 'jalan-jalan' }).thinkMs === 4000 && ev({ attempts: 1, reactionTimeMs: 7300, target: 'selamat pagi' }).thinkMs === 4000);
check('choice question (no target): no allowance', ev({ attempts: 1, reactionTimeMs: 4500, target: '' }).thinkMs === 4500 && ev({ attempts: 1, reactionTimeMs: 4500, target: '' }).rating === 3);
check('reaction time shorter than the allowance → 0, rated 4', ev({ attempts: 1, reactionTimeMs: 500, target: 'kembalikan' }).thinkMs === 0 && ev({ attempts: 1, reactionTimeMs: 500, target: 'kembalikan' }).rating === 4);
check('missing fields default safely (1 attempt, 0 ms) → 4', ev({}).rating === 4 && ev().rating === 4);

// ---- FSRS 排程
const T0 = Date.UTC(2026, 10, 24, 1, 0, 0);   // 2026-11-24 某个时刻
const day = S.srsDay(T0);
const nr = S.srsNewRecord(null, T0, 3 * 3600e3);
check('new word: New card due in 3 hours, old fields keep the same-day revisit', nr[0] === 1 && nr[1] === day && nr[6] === 3 && nr[7] === T0 + 3 * 3600e3 && nr[10][0] === T0 + 3 * 3600e3 && nr[10][3] === 0, JSON.stringify(nr));
const r1 = S.srsReview(nr, 1, T0 + 3 * 3600e3);
const r3 = S.srsReview(nr, 3, T0 + 3 * 3600e3);
const r4 = S.srsReview(nr, 4, T0 + 3 * 3600e3);
check('first review rated 1 → due tomorrow, marked 不认识', r1[1] === day + 1 && r1[6] === 0 && r1[7] === 0, JSON.stringify(r1));
check('first review rated 3 → at least 1 day, marked 认识', r3[1] >= day + 1 && r3[6] === 2, 'due in ' + (r3[1] - day) + ' days');
check('rating 4 schedules further than 3', r4[1] > r3[1], (r4[1] - day) + ' vs ' + (r3[1] - day));
let rec = r3, t = T0 + 3 * 3600e3, gaps = [];
for (let n = 0; n < 4; n++) { const at = S.srsDayStart(rec[1]) + 9 * 3600e3; const nx = S.srsReview(rec, 3, at); gaps.push(nx[1] - rec[1]); rec = nx; }
check('repeated 3s: intervals keep growing', gaps.every((g, i) => i === 0 || g > gaps[i - 1]) && gaps[0] >= 2, gaps.join(' → '));
const lapse = S.srsReview(rec, 1, S.srsDayStart(rec[1]) + 9 * 3600e3);
check('a lapse after long intervals → due the next day, lapses +1, level drops', lapse[1] === rec[1] + 1 && lapse[4] === rec[4] + 1 && lapse[0] < rec[0], JSON.stringify([rec.slice(0, 7), lapse.slice(0, 7)]));
check('reps counted', lapse[3] === rec[3] + 1 && rec[3] === 5);

// ---- 旧记录换算
const legacy = [5, day + 4, T0 - 864e5, 6, 1, day - 60, 2, 0];
const c = S.cardFromRecord(legacy, T0);
check('old reviewed record → Review card, stability = old interval (30 d), due date unchanged', c.state === 2 && c.stability === 30 && S.srsDay(+c.due) === day + 4 && c.difficulty === 5.5 && c.reps === 6 && c.lapses === 1, JSON.stringify(c));
const lr = S.srsReview(legacy, 3, S.srsDayStart(day + 4) + 10 * 3600e3);
check('reviewing an old record works and adds the FSRS card as item 10', Array.isArray(lr[10]) && lr[10].length === 9 && lr[1] > day + 4 && lr[5] === day - 60, JSON.stringify(lr));
const oldNew = [1, day, T0, 0, 0, day, 3, T0 + 3 * 3600e3];
const cn = S.cardFromRecord(oldNew, T0);
check('old "new today" record (no card yet) → New card due at its revisit time', cn.state === 0 && +cn.due === T0 + 3 * 3600e3);
const oldSix = [1, day + 1, T0, 0, 0, day];
check('very old 6-item record (never reviewed) → New card due that day', S.cardFromRecord(oldSix, T0).state === 0 && S.srsDay(+S.cardFromRecord(oldSix, T0).due) === day + 1);
check('unlearned record → null', S.cardFromRecord([0, 0, T0, 0, 0], T0) === null && S.cardFromRecord(undefined, T0) === null);
const skew = S.recordWithCard(r3, Object.assign(S.srsUnpack(r3[10]), { last_review: new Date(T0 + 5 * 864e5) }), 3, T0);
check('a last-review time in the future (clock skew) does not crash', (() => { try { return Array.isArray(S.srsReview(skew, 3, T0 + 3 * 3600e3)[10]); } catch (e) { return false; } })());
const known = [8, day + 36500, T0, 3, 0, day - 9, 2, 0, 1, 4];
const kr = S.srsReview(known, 3, T0);
check('items 8 and 9 (mastered flag, previous level) survive a review', kr[8] === 1 && kr[9] === 4);

// ---- 紧凑数组来回转换
const packed = r3[10], back = S.srsPack(S.srsUnpack(packed));
check('pack → unpack → pack keeps every field', JSON.stringify(packed) === JSON.stringify(back), JSON.stringify(packed));
check('record stays JSON-safe (sync stores plain arrays)', JSON.stringify(JSON.parse(JSON.stringify(lr))) === JSON.stringify(lr));
check('levels from stability', S.srsLevel(0.3) === 1 && S.srsLevel(2) === 2 && S.srsLevel(10) === 4 && S.srsLevel(500) === 8);
check('srsDaysUntil', S.srsDaysUntil(r3, T0 + 3 * 3600e3) === r3[1] - day && S.srsDaysUntil([0], T0) === null);

console.log(fail.length ? 'FAILED: ' + fail.join('; ') : 'ALL SRS CHECKS PASSED');
process.exit(fail.length ? 1 : 0);
