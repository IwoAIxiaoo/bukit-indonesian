# 音频管线和测试

这个目录里是生成 `audio/` 用的脚本，以及页面的测试脚本。**只想用或者改课程内容，不需要运行这里的任何东西**：`audio/` 里已经有打包好的音频，`node build.mjs` 直接就能构建。

下面的内容是给想重新生成音频、或者给新词补音频的人看的。这些脚本是边做边写的，按当时的工作目录组织，不是通用工具，用之前请先读一遍。

## 需要另外准备的东西（仓库里没有）

- **MMS-TTS 印尼语模型的 ONNX 版本**：`model/model.onnx` 和 `model/tokens.txt`（sherpa-onnx 导出的 `mms-tts-ind`）。
- **Python 环境**：`onnxruntime`、`numpy`、`faster-whisper`；系统里要有 `ffmpeg`。
- **Whisper large-v3-turbo**（faster-whisper 会自动下载 `deepdml/faster-whisper-large-v3-turbo-ct2`）：用来给候选音频打分。
- **MSWC 印尼语数据**（只有重新挑真人录音时才需要）：Hugging Face 上 `MLCommons/ml_spoken_words` 的 `data/splits/id/splits.tar.gz` 和 `data/opus/id/{train,dev,test}/audio/0.tar.gz`，放进 `mswc_raw/`。
- **Playwright**（只有跑测试时才需要）。

脚本默认把自己所在的目录当工作目录（中间文件 `texts.json`、`out3/`、`out_human/` 都写在这里），把上一级目录当项目根目录。如果把脚本复制到别处运行，用环境变量 `BUKIT_ROOT` 指定项目根目录。

## 基本流程

1. `node collect.js`：从 `src/` 收集所有要发音的文本，写成 `texts.json`（每条的 `id` 就是页面里的 `hash(audioKey(text))`）。
2. `MMS_NOISE=0.3,0.4 MMS_OUT=out2 python gen.py`：用 MMS-TTS 生成例句等整句的合成语音。参数来自 Whisper 识别率对比（`asr_eval.py`）：0.667/0.8 时词错误率 12.4%，0.4/0.5 时 11.0%，0.3/0.4 时 9.9%。
3. `python gen_words.py`：单词和字母，见下一节。给已有内容补新词时用 `gen_new.py`（只处理还没有音频的条目）和 `gen_fix.py`。
4. `python mswc.py select | asr | render | alts`：挑真人录音，见后面的章节。
5. `MMS_OUT=out3 python pack.py`：按课打包成 `audio/<课>.mp3` 和 `audio/<课>.json`，有真人录音的词用真人版；`audio/index.json` 里记录每条音频在哪个包、哪些是真人录音。
6. 回到项目根目录 `node build.mjs`。

## 测试

- `node tools/test-offline.js`：断网打开离线版，走一遍主要流程（不需要启动服务器）。
- `node tools/test-recall.js`、`test-ref.js`、`test-variants.js`：默认测离线版；加参数可以测在线版，例如 `node tools/test-recall.js http://127.0.0.1:8765/bukit.html`。
- `test-ui.js`、`test-audio.js`、`test-audio-human.js`：测在线版，需要先运行 `python3 tools/serve.py`。

下面各节是按时间顺序记下来的做法和数据，其中有些尝试后来放弃了（比如从维基共享资源下载录音）。

## 单词和字母（2026-11-09 更新）
MMS 直接读单个词很不准（Whisper 识别错误率 66.5%），放进句尾（“kata ini dibaca …”）合成再按模型输出的字符时长剪出来，降到 30.3%（见 `wordtest.py`）。
`gen_words.py` 对每个单词、点读词和字母名生成 3 个候选（字母用 “huruf …”），用 Whisper 挑识别最准的一个，慢速版同法生成；结果在 `out3/`，例句沿用 `out2/`。
打包时用 `MMS_OUT=out3 python pack.py`。音标由 `src/ipa.js` 在页面里按规则生成，e 读 /e/ 的词在其中的 TALING 词表里。

## 单词真人录音改用 MSWC（2026-11-09，版本 5）
最初想用维基共享资源（Lingua Libre）的逐词录音，但下载一直被限流，只拿到 1 条，而且没能核实它的许可，所以这条路放弃了，那 1 条录音在开源前也已拿掉。
改用 MLCommons 的多语种口语词语料库 MSWC（Hugging Face `MLCommons/ml_spoken_words`，CC BY 4.0）：从 Mozilla Common Voice 印尼语志愿者朗读的句子里按强制对齐切出的单词，每段 1 秒、两边补数字静音。
数据放 `mswc_raw/`（`data/splits/id/splits.tar.gz` 和 opus 的 train/dev/test 包，共约 214 MB），然后 `venv/bin/python -I mswc.py select`、`asr`、`render`：
1. select：texts.json 的 993 个单词条目里有 440 个在 MSWC 中。每词最多解出 60 段（按说话人轮流挑），算削波、单词主体时长、频带宽度、同词内的动态范围（近似底噪）。过滤截断、时长异常、削波、窄带、偏吵的段，说话人按质量中位数和录音数排序。
2. asr：Whisper large-v3-turbo 初筛，每词先试 4 段，没通过的再试 4 段，412 个词有段通过。同一个词的几段连着识别会互相“提示”，词级时间戳也会漂移，所以这一步只用来给候选排序。
3. render：每词最多 6 段候选，先裁出单词主体，加 8 ms 淡入、25 ms 淡出，高通 70 Hz，响度统一到 -15 dBFS，转成 MP3 24 kHz 48 kbps。再把 20 个不同的词连成一条识别，按词序做编辑距离对齐（不用时间戳），随机分组做 3 次，至少 2 次原样识别出来才算通过。结果：397 个词通过（3/3 的 338 个，2/3 的 59 个），写进 `human_mswc.json`，音频在 `out_human/`。
4. `MMS_OUT=out3 python pack.py`：Lingua Libre 优先，其次 MSWC（索引条目第 4 项为 1），其余用合成。页面里显示为“Common Voice 志愿者 · CC BY 4.0”，链接到数据集页。
没覆盖到的：口语词（ya、mbak、sih…）、叠词、所有短语、字母名，以及大部分矿业词（coal 0/28、metal 0/22、policy 2/31、equip 1/22）。

## 离线版（2026-11-10）
`node build.mjs` 现在同时生成两个文件：
- `bukit.html`：在线版，发布到 claude.ai，音频按课从 `audio/` 下载。
- `bukit-offline.html`：离线版，一个完整的独立网页（约 38 MB）。32 个音频包以 base64 文本块放在页面末尾（`<script type="application/octet-stream" id="pk-课名">`），每课的偏移表在 `AUDIO_OFF` 里，用到哪一课才解码哪一课；字体（`fonts/` 里的 Plus Jakarta Sans 和 Charis SIL 子集，OFL 许可）也内嵌，不引用任何外部地址。

两个版本共用 `src/`，由构建时写入的 `OFFLINE` 常量区分。离线版里：
- `Clips.load` 走 `embeddedPack()`，不发网络请求。
- 没有 AI 例句、对话、逐词拆解，也没有账号同步；进度只存在浏览器的 localStorage 里。
- 浏览器不让保存数据时（`LS_OK` 为假），首页和设置页会提示。
- “复制备份 / 从备份恢复”是和在线版互相搬进度的办法；备份里现在带上了读音标记（flags）。

测试：`node tools/test-offline.js`（Playwright，断网 + file:// 打开）。检查音频包与 `audio/` 逐字节一致、没有任何网络请求、单词 / 慢速 / 例句 / 字母都能播放、学习和复习流程、重新打开后进度还在、备份恢复、手机宽度不横向滚动、CPU 降到 1/6 时页面没读完就点播放也能播出来。
只在 Chromium（Chrome / Edge 的内核）里测过，没有在真机手机、Safari、Firefox 上测。

## 换个读法对比（2026-11-10，版本 6）
有的真人录音听不清，所以每个有真人录音的词现在带几种读法，在单词卡里点着对比，选中的那个成为这个词以后的读音。
- `venv/bin/python -I mswc.py alts`：从最终复核里 3 次至少通过 2 次的候选中，再挑最多 2 段别的说话人的录音（优先 3/3、优先和主录音不同性别），写进 `human_mswc.json` 的 `alts`，音频是 `out_human/<id>~h1.mp3`、`~h2.mp3`。结果：293 个词有 3 个真人读法，68 个有 2 个，36 个只有 1 个。
- `pack.py`：这些读法和原来的合成语音（含慢读）放进同一个包，键是 `<id>~<序号>`；`index.json` 的 `var` 记录各读法的类型（m 男声 / f 女声 / h 未标注 / s 合成），第一个是默认读法。音频合计 35.4 MB。
- 页面：`varRow()` 画对比按钮，`pickVar` 把选择存进 `prefs.var`（随账号同步、随备份带走），`TTS._clip` 按选择取音频。
- 测试：`node tools/test-variants.js <地址> [offline]`，在线版和离线版各跑一遍。

## 主动回忆式复习（2026-11-13，版本 7）
复习改成“看中文回想印尼语 → 显示答案 → 认识 / 模糊 / 不认识”，不新增任何游戏化元素；原有的连续天数和动画按用户要求保留。
- 出题：同一个词轮流用“只给中文释义”和“例句挖空”（`revCard`，按复习次数的奇偶切换）；揭示答案时自动朗读，下面列出全部例句（高亮、可点读）。
- 间隔（`gradeCalc`）：等级对应 1、3、7、14、30、60、120、240 天。认识升一级；模糊保持原间隔；不认识回到第 1 级，10 分钟后再考（词条第 8 项记再考时间），再考想起来了就改到明天。词条第 7 项记上次反馈。旧的 6 项记录照常可用。
- 顺序（`dueIds`）：上次不认识的最先，其次模糊的，然后按过期天数。没到期但 3 天内到期或没记牢的词可以“提前复习”（`soonIds`）。一轮最多 30 个。
- 选择题：每答完 10 张插一道，一轮结束时剩 5 张以上没考过也补一道；题型在“听音选中文”和“句子填空选词”之间轮换，优先考刚才选了模糊 / 不认识的词。答错只把词标成没记牢，不改间隔。
- 测试：`node tools/test-recall.js <地址> [offline]`。

## 语法速查表（2026-11-14，版本 9）
`src/ref.js`：26 张随时可翻的总表（me- 变化、pe-、名词构成、ber-、ter-、me-/di- 对照、di、-kan/-i、词缀一览、词族、-nya、se-、代词、疑问词、否定词、时间标记、介词、连接词、量词、程度比较、指示词、语气词、口语对照、数字、星期月份、钟点）。写法和语法卡片相同，多一个 `n`（表格后的补充）和 `keep`（窄屏上不拆行）。
- 页面：`#ref`，`#ref-<id>` 直接展开某一张；入口在课程页顶部和设置页，相关的语法卡片底部有“速查表”链接。三列以上的表在窄屏上一行排成一块（`tableHTML(t, stack)`）。
- 音频：`collect.js` 把速查表里课程没有的词归到 `ref` 包（497 条）；课程里已有的词点到时加载它所在那一课的包。`gen_new.py` 只给没有音频的条目生成（句尾合成 + 三选一），`gen_fix.py` 对识别不准的片段多合成 5 个候选、按词序对齐重新打分。第一批 522 段里 29 段不准，重做后只剩口语词 lo。`pack.py` 里 ref 包不带慢读版（2.6 MB），慢速由页面放慢。
- 测试：`node tools/test-ref.js <地址> [offline]`。

## 开源前的整理（2026-11-14）
- 拿掉了唯一一条来自 Lingua Libre 的录音（许可没能核实），真人录音现在全部来自 MSWC，共 397 个词。
- 删掉了下载维基共享资源的两个脚本；脚本里写死的本机路径改成相对路径。

## 自由练习（2026-11-14）
复习页新增七种训练模式（`src/app.js` 里的“自由练习”模块，`PMODES`、`startPractice()`、`vPractice()`）：单词卡、看词选义、看义选词、听音选义、拼写挑战（点字母块）、句子填空、模拟挑战（15 题限时 10 分钟）。范围可选已学的词、某一课或全部。不改复习间隔，答错的已学词只标成“没记牢”；答题数计入当天的“复习和练习”。不计分、不设等级。
测试：`node tools/test-practice.js`。

## 错词本、收藏、已掌握、今日学习、跟打、听写（2026-11-15）
- 词条记录加了第 9 项（`1` = 已掌握，不再复习）和第 10 项（标记前的等级，取消时恢复）；`dueIds()`、`soonIds()`、`weakIds()` 都排除已掌握的词。收藏存在 `prefs.fav`。
- 错词本就是 `weakIds()`：已学过、上次反馈是“模糊 / 不认识”或练习里答错的词，复习时选“认识”才移出。复习页的 `listsCard()` 列出错词本和收藏，练习范围里可以选它们。
- 今日学习：`UI.flow` 记录进度，`flowStart()` / `flowNext()` 依次调用 `startReview()`、`startStudy()`、`startPractice('spell', 今天学的词)`；各结束页用 `flowBar(step)` 显示“下一步”。只存在内存里，刷新页面后从头按当天实际情况重新排。
- 自由练习加了跟打（`copy`）和听写（`dict`），共九种模式；用文本框输入，空格和连字符算同一种分隔。
- 功能思路参考了 TypeWords（GPL-3.0），没有看或使用它的代码。
测试：`node tools/test-flow.js`。

## 句子与语感（2026-11-15）
- `src/app.js` 里的“句子与语感”模块：`startSense(mode, items, label, o)`，四种模式 `play`（连续播放）、`shadow`（影子跟读）、`order`（连词成句）、`hear`（听音组句）。默认用练习范围里那些词的例句，也可以直接传一组句子（`{id, zh}`）。
- 连播和跟读不改 `TTS` 内部：用 `TTS.play()` 播一句，`senTick()` 每 120 毫秒看 `TTS.cur` 判断这一句播完没有，再留空档、排下一句。跟读的空档是这一句时长的 1.15 倍（不少于 1.8 秒）。离开页面或用户点了别的发音就暂停。每句重复遍数、是否显示印尼语和中文存在本机设置里（`DEV.senReps` / `senId` / `senZh`）。
- 组句的词块按空格拆、去掉两头标点；句首的词如果平时是小写就用小写，免得大写泄露顺序。判定只和例句原文比对（忽略大小写）。听音组句混入 2 个别的句子里的词。
- 组句每答一题、跟读每跟完一句，计入当天的“复习和练习”；连续播放不计。都不影响复习间隔。
测试：`node tools/test-sense.js`。`tools/test-offline.js` 紧跟在别的测试后面跑时偶尔会在等待页面时超时，单独重跑通过，原因还没查明。
