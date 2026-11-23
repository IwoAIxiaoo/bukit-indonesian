// 把 src/ 里的样式、内容和逻辑拼成可以直接用的页面：
//   bukit.html          在线版，发布到 claude.ai；音频按课从 audio/ 下载
//   bukit-offline.html  离线版，完整的独立网页；音频和字体都装在文件里，不联网也能用
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
const at = f => new URL(f, import.meta.url);
const src = f => readFileSync(at('./src/' + f), 'utf8');
const audio = existsSync(at('./audio/index.json')) ? JSON.parse(readFileSync(at('./audio/index.json'), 'utf8')) : { packs: [], idx: {} };
const BUILD = new Date().toISOString().slice(0, 10);
const flags = offline => 'const OFFLINE = ' + offline + ';\nconst BUILD = ' + JSON.stringify(BUILD) + ';\n';
const audioJs = 'const AUDIO_PACKS = ' + JSON.stringify(audio.packs) + ';\nconst AUDIO_IDX = ' + JSON.stringify(audio.idx) + ';\nconst AUDIO_HUMAN = ' + JSON.stringify(audio.human || {}) + ';\nconst AUDIO_VAR = ' + JSON.stringify(audio.var || {}) + ';\nconst AUDIO_CREDIT = ' + JSON.stringify(audio.credit || { speakers: [], licenses: [] }) + ';\n';
const code = ['pre.js', 'content-1.js', 'content-2.js', 'content-3.js', 'content-4.js', 'content-5.js', 'content-6.js', 'grammar.js', 'ref.js', 'confuse.js', 'reading.js', 'pron.js', 'ipa.js', 'lookup.js', 'app.js'].map(src).join('\n');
const body = `<div class="app">
  <nav class="nav" id="nav" aria-label="主导航"></nav>
  <div class="shell">
    <header class="topbar" id="topbar"></header>
    <main id="main" tabindex="-1"><p class="muted" style="padding:48px 0;text-align:center">正在加载课程…</p></main>
  </div>
</div>
<div class="sheet" id="sheet" hidden></div>
<div class="toast" id="toast" role="status" aria-live="polite" hidden></div>
<div class="tt" id="tt" hidden></div>`;

/* ---------- 在线版：claude.ai 发布时会自动套上文档外壳 ---------- */
const online = `<title>Bukit 印尼语</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400..800&family=Charis+SIL&display=swap">
<style>
${src('style.css')}
</style>
${body}
<script>
${flags(false)}${audioJs}${code}
</script>
`;
writeFileSync(at('./bukit.html'), online);
console.log('bukit.html', (online.length / 1024).toFixed(1) + ' KB', 'audio packs:', audio.packs.length, 'clips:', Object.keys(audio.idx).length, 'human:', Object.keys(audio.human || {}).length);

/* ---------- 离线版：不引用任何外部地址 ---------- */
const b64 = f => readFileSync(at(f)).toString('base64');
// 和 claude.ai 外壳相同的基础样式，保证两个版本排版一致
const BASE_CSS = ':root{color-scheme:light;box-sizing:border-box;padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}html{scroll-padding-top:env(safe-area-inset-top,0px)}body{margin:0;padding:0;font:14px -apple-system,BlinkMacSystemFont,sans-serif;background:#fff;color:#000}img{max-width:100%}[hidden]:not([hidden=until-found i]){display:none!important}';
// 字体（SIL Open Font License 1.1，许可全文见 fonts/），只带拉丁字母和音标用到的两个子集
const LATIN = 'U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD';
const LATIN_EXT = 'U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,U+0304,U+0308,U+0329,U+1D00-1DBF,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C0,U+2113,U+2C60-2C7F,U+A720-A7FF';
const face = (family, weight, file, range) => existsSync(at('./fonts/' + file))
  ? `@font-face{font-family:"${family}";font-style:normal;font-weight:${weight};font-display:swap;src:url(data:font/woff2;base64,${b64('./fonts/' + file)}) format("woff2");unicode-range:${range}}` : '';
const FONT_CSS = [
  face('Plus Jakarta Sans', '200 800', 'plus-jakarta-sans-latin-wght-normal.woff2', LATIN),
  face('Plus Jakarta Sans', '200 800', 'plus-jakarta-sans-latin-ext-wght-normal.woff2', LATIN_EXT),
  face('Charis SIL', '400', 'charis-sil-latin-400-normal.woff2', LATIN),
  face('Charis SIL', '400', 'charis-sil-latin-ext-400-normal.woff2', LATIN_EXT)
].filter(Boolean).join('\n');
const ICON = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28"><path d="M1.5 24C5.5 16.5 9.5 12 14 12s8.5 4.5 12.5 12z" fill="#1f7a4f"/><path d="M14 12.5V3" stroke="#16201a" stroke-width="1.6" stroke-linecap="round"/><path d="M14.6 3.3h7.6v3h-7.6z" fill="#d6342b"/><path d="M14.6 6.3h7.6v3h-7.6z" fill="#fff" stroke="#d9dfd6" stroke-width=".6"/></svg>');
// 每课的偏移表放进脚本，音频本身作为不执行的文本块放在页面末尾，用到哪一课才解码哪一课
const off = {};
let audioBytes = 0;
const packs = audio.packs.map(n => {
  off[n] = JSON.parse(readFileSync(at('./audio/' + n + '.json'), 'utf8'));
  const buf = readFileSync(at('./audio/' + n + '.mp3'));
  audioBytes += buf.length;
  return '<script type="application/octet-stream" id="pk-' + n + '">' + buf.toString('base64') + '</script>';
}).join('\n');
const offline = `<!doctype html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>Bukit 印尼语（离线版）</title>
<meta name="theme-color" content="#f2f4ef" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#0c1310" media="(prefers-color-scheme: dark)">
<link rel="icon" href="${ICON}">
<style>${BASE_CSS}</style>
<style>
${FONT_CSS}
</style>
<style>
${src('style.css')}
</style>
</head>
<body>
${body}
<script>
${flags(true)}${audioJs}const AUDIO_OFF = ${JSON.stringify(off)};
${code}
</script>
${packs}
</body>
</html>
`;
if (/https?:\/\/fonts\.g/.test(offline)) throw new Error('离线版里不应该引用在线字体');
writeFileSync(at('./bukit-offline.html'), offline);
console.log('bukit-offline.html', (Buffer.byteLength(offline) / 1048576).toFixed(1) + ' MB', '（音频 ' + (audioBytes / 1048576).toFixed(1) + ' MB，字体 ' + (FONT_CSS.length / 1024).toFixed(0) + ' KB）', 'build', BUILD);
