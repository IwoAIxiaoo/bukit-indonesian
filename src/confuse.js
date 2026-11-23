/* 易混词：拼写相近的、同一类的、意思相近但用法不同的词放在一起对比。
   内容由 AI 编写，没有经过印尼语母语者审校。
   CF({ id, k, t, tip, w })：k 类型（s 拼写相近 / c 同一类 / u 用法不同）；t 标题；tip 一句总的区分方法；
   w 组里的词：[课程里的词（WORDS 的键）, 怎么区分]。词的中文释义直接用课程里的。 */
const CONFUSE = [];
const CONFUSE_KINDS = [['s', '拼写相近', '只差一两个字母，看的时候盯住不同的那个字母。'], ['c', '同一类', '一组词放在一起按顺序或对比着记。'], ['u', '用法不同', '中文常常是同一个词，印尼语要分开说。']];
function CF(o) { CONFUSE.push(o); }

/* ===== 拼写相近 ===== */
CF({ id: 'kakak', k: 's', t: 'kakak / kakek', tip: '两个 a 是同辈的哥哥姐姐；带 e 的是祖辈，和 nenek（奶奶）一样有 e。',
  w: [['kakak', '比你大的同辈，不分男女'], ['kakek', '祖父辈：爷爷、外公；也用来称呼老大爷']] });
CF({ id: 'tahun', k: 's', t: 'tahu / tahun', tip: '多一个 n 就从“知道”变成“年”。',
  w: [['tahu', '知道（某件事）；另外也是“豆腐”'], ['tahun', '年；岁：umur 30 tahun']] });
CF({ id: 'baru', k: 's', t: 'baru / biru / baju', tip: '三个词都是 b 开头 u 结尾：a-r 新，i-r 蓝，a-j 衣服。',
  w: [['baru', '新的；刚刚'], ['biru', '蓝色'], ['baju', '衣服']] });
CF({ id: 'sapi', k: 's', t: 'sapi / sapu / sepi', tip: '结尾是 i 的是牛，结尾是 u 的是扫帚；sepi 第一个元音是 e。',
  w: [['sapi', '牛：daging sapi 牛肉'], ['sapu', '扫帚；扫'], ['sepi', '冷清、人少，反义词是 ramai']] });
CF({ id: 'dua', k: 's', t: 'dua / dia', tip: 'u 是数字二，i 是“他 / 她”。',
  w: [['dua', '二'], ['dia', '他；她（不分男女）']] });
CF({ id: 'lima', k: 's', t: 'lima / lama / nama', tip: 'i 是数字五；两个 a 的 lama 是“久、旧”；n 开头的是名字。',
  w: [['lima', '五'], ['lama', '久；旧的'], ['nama', '名字']] });
CF({ id: 'pagi', k: 's', t: 'pagi / lagi / pergi', tip: 'p-a 是早上，l-a 是“再”，per- 是“去”。',
  w: [['pagi', '早上'], ['lagi', '再；又；口语里也表示“正在”'], ['pergi', '去；离开']] });
CF({ id: 'mau', k: 's', t: 'mau / malu / mal', tip: 'mau 想要；中间多个 l 的 malu 是害羞；mal 是商场（来自英语 mall）。',
  w: [['mau', '想要；要'], ['malu', '害羞；丢脸'], ['mal', '商场']] });
CF({ id: 'kiri', k: 's', t: 'kiri / kirim', tip: '多一个 m，从“左”变成“发送”。',
  w: [['kiri', '左'], ['kirim', '寄；发送']] });
CF({ id: 'masak', k: 's', t: 'masuk / masak', tip: 'u 是进，a 是做饭：masuk 读“马苏”，masak 读“马萨”。',
  w: [['masuk', '进；进入；上班'], ['masak', '做饭；煮']] });
CF({ id: 'kasih', k: 's', t: 'kasih / kasir / kasur', tip: '都是 kas- 开头：-ih 给，-ir 收银，-ur 床垫。',
  w: [['kasih', '给（口语）；terima kasih 里的 kasih'], ['kasir', '收银台；收银员'], ['kasur', '床垫；床']] });
CF({ id: 'minggu', k: 's', t: 'minggu / Minggu', tip: '同一个词：小写是“星期、周”，大写是“星期日”。',
  w: [['minggu', '星期；周：minggu depan 下周'], ['Minggu', '星期日：hari Minggu']] });
CF({ id: 'tadi', k: 's', t: 'tadi / tapi / jadi', tip: '-di 两个：t 开头是“刚才”，j 开头是“所以”；-pi 是“但是”。',
  w: [['tadi', '刚才（今天早些时候）'], ['tapi', '但是'], ['jadi', '所以；成为']] });
CF({ id: 'murah', k: 's', t: 'murah / merah / marah / mudah', tip: '只差中间的元音和一个辅音：u-r 便宜，e-r 红，a-r 生气，u-d 容易。',
  w: [['murah', '便宜，反义词 mahal'], ['merah', '红色'], ['marah', '生气'], ['mudah', '容易，反义词 susah']] });
CF({ id: 'sudah', k: 's', t: 'sudah / susah / mudah', tip: 'sudah 是已经；susah 是难；mudah 是容易，和 susah 正好相反。',
  w: [['sudah', '已经'], ['susah', '难；难过'], ['mudah', '容易']] });
CF({ id: 'ingin', k: 's', t: 'dingin / ingin / angin', tip: '前面多个 d 是冷；i 开头是想要；a 开头是风。',
  w: [['dingin', '冷；凉'], ['ingin', '想要（比 mau 正式）'], ['angin', '风']] });
CF({ id: 'harus', k: 's', t: 'haus / harus', tip: '多一个 r，从“渴”变成“必须”。',
  w: [['haus', '渴'], ['harus', '必须']] });
CF({ id: 'kami', k: 's', t: 'kami / kamu / Kamis', tip: 'i 结尾是“我们”，u 结尾是“你”，大写加 s 是星期四。',
  w: [['kami', '我们（不包括听话的人）'], ['kamu', '你（熟人之间）'], ['Kamis', '星期四']] });
CF({ id: 'ayah', k: 's', t: 'ayah / ayam', tip: 'h 结尾是爸爸，m 结尾是鸡。',
  w: [['ayah', '父亲；爸爸'], ['ayam', '鸡；鸡肉']] });
CF({ id: 'beli', k: 's', t: 'beli / beri', tip: 'l 是买，r 是给。',
  w: [['beli', '买'], ['beri', '给（比 kasih 正式）']] });
CF({ id: 'tanya', k: 's', t: 'hanya / tanya / tanpa', tip: 'h 开头是“只”，t 开头的 tanya 是问，tanpa 是“不加、没有”。',
  w: [['hanya', '只；仅仅'], ['tanya', '问'], ['tanpa', '没有；不加：tanpa gula 不加糖']] });
CF({ id: 'dengar', k: 's', t: 'dengan / dengar', tip: 'n 结尾是“和、用”，r 结尾是“听”。',
  w: [['dengan', '和；跟；用'], ['dengar', '听；听见']] });
CF({ id: 'besar', k: 's', t: 'besar / benar', tip: 's 是大，n 是对。',
  w: [['besar', '大'], ['benar', '对；正确；真的']] });
CF({ id: 'tepat', k: 's', t: 'cepat / tepat', tip: 'c 开头是快；t 开头是准时、正好：tepat waktu 准时。',
  w: [['cepat', '快'], ['tepat', '准确；正好']] });
CF({ id: 'lantai', k: 's', t: 'pantai / lantai', tip: 'p 是海滩，l 是地板、楼层：lantai dua 二楼。',
  w: [['pantai', '海滩'], ['lantai', '地板；楼层']] });
CF({ id: 'tanggal', k: 's', t: 'tinggal / tanggal', tip: 'i 是住，a 是日期。',
  w: [['tinggal', '住；剩下'], ['tanggal', '日期；号：tanggal 5 五号']] });
CF({ id: 'bulan', k: 's', t: 'bukan / bulan / buka', tip: 'buka 是开；加 n 的 bukan 是“不是”；l 的 bulan 是月份、月亮。',
  w: [['bukan', '不是（否定名词）'], ['bulan', '月；月亮'], ['buka', '开；营业']] });
CF({ id: 'juta', k: 's', t: 'juta / juga', tip: 't 是百万，g 是“也”。',
  w: [['juta', '百万'], ['juga', '也']] });
CF({ id: 'sabtu', k: 's', t: 'satu / Sabtu / situ', tip: 'satu 是一；中间多个 b 的大写 Sabtu 是星期六；situ 是“那里”。',
  w: [['satu', '一'], ['Sabtu', '星期六'], ['situ', '那里（不远处）']] });
CF({ id: 'ribu', k: 's', t: 'ribu / Rabu', tip: 'i 是千，大写 a 是星期三。',
  w: [['ribu', '千'], ['Rabu', '星期三']] });

/* ===== 同一类 ===== */
CF({ id: 'freq', k: 'c', t: '频率：总是 → 从不', tip: '按从多到少的顺序记。都放在动词前面：Saya sering makan di sini.',
  w: [['selalu', '总是，每次都'], ['biasanya', '通常，一般情况下（常放句首）'], ['sering', '经常'], ['kadang-kadang', '有时候'], ['sekali-sekali', '偶尔'], ['jarang', '很少'], ['tidak pernah', '从来没有']] });
CF({ id: 'aspect', k: 'c', t: '已经、正在、将要、还、还没', tip: '印尼语动词不变形，时间靠这几个词表示，放在动词前面。',
  w: [['sudah', '已经（做了）'], ['sedang', '正在（做）'], ['akan', '将要（做）'], ['masih', '还、仍然（在做）'], ['belum', '还没（做）；回答“还没”也用它']] });
CF({ id: 'when', k: 'c', t: '昨天、刚才、现在、待会儿、明天', tip: '按时间顺序记；tadi 和 nanti 都指今天之内，一个过去、一个将来。',
  w: [['kemarin', '昨天'], ['tadi', '刚才（今天已经过去的时候）'], ['sekarang', '现在'], ['nanti', '待会儿；以后'], ['besok', '明天']] });
CF({ id: 'day', k: 'c', t: '早上、中午、下午、晚上', tip: '前面加 selamat 就是四个问候语。大致：pagi 到上午 10 点，siang 到下午 3 点，sore 到天黑，malam 天黑以后。',
  w: [['pagi', '早上'], ['siang', '中午；白天'], ['sore', '下午到傍晚'], ['malam', '晚上；夜里']] });
CF({ id: 'here', k: 'c', t: '这里、那里，这个、那个', tip: 'sini 这里；situ 那里，离听话人近；sana 那里，离两个人都远。ini、itu 是“这个、那个”。',
  w: [['sini', '这里'], ['situ', '那里（不远，在听话人那边）'], ['sana', '那里（较远）'], ['ini', '这；这个'], ['itu', '那；那个']] });
CF({ id: 'degree', k: 'c', t: '有点、很、非常、太、最', tip: '大多放在形容词前面；只有 sekali 放在后面：enak sekali。',
  w: [['agak', '有点、稍微：agak mahal'], ['sangat', '很、非常：sangat enak'], ['sekali', '非常（放形容词后面）；另一个意思是“一次”'], ['terlalu', '太、过头了（有不满的意思）：terlalu pedas'], ['paling', '最：paling murah']] });
CF({ id: 'front', k: 'c', t: '前、后、旁边', tip: '前面加 di 表示“在……”：di depan 在前面。',
  w: [['depan', '前面；下一个：minggu depan 下周'], ['belakang', '后面'], ['samping', '旁边']] });
CF({ id: 'above', k: 'c', t: '上、下、里、外', tip: '同样前面加 di：di atas 在上面，di dalam 在里面。',
  w: [['atas', '上面；楼上'], ['bawah', '下面；楼下'], ['dalam', '里面'], ['luar', '外面']] });
CF({ id: 'address', k: 'c', t: '先生、女士、小哥、小姐', tip: '对年长或有身份的人用 Bapak / Ibu，对年轻人用 Mas / Mbak。',
  w: [['Bapak', '先生（年长、有身份的男性），简称 Pak'], ['Ibu', '女士（年长、有身份的女性），简称 Bu'], ['Mas', '小哥（年轻男性，爪哇用法）'], ['Mbak', '小姐、大姐（年轻女性）']] });
CF({ id: 'family', k: 'c', t: '哥姐、弟妹、爷爷、奶奶', tip: '印尼语不分男女，只分大小：比你大的是 kakak，比你小的是 adik。',
  w: [['kakak', '哥哥；姐姐'], ['adik', '弟弟；妹妹'], ['kakek', '爷爷；外公'], ['nenek', '奶奶；外婆']] });
CF({ id: 'units', k: 'c', t: '十几、几十、百、千、百万', tip: '11–19 用 belas，几十用 puluh；“一”的时候换成 se-：sebelas、sepuluh、seratus、seribu。',
  w: [['belas', '十几：dua belas 十二'], ['puluh', '几十：dua puluh 二十'], ['ratus', '百：dua ratus 二百'], ['ribu', '千：dua ribu 二千'], ['juta', '百万：dua juta 二百万']] });
CF({ id: 'where', k: 'c', t: '在哪、去哪、从哪', tip: 'di 在，ke 去，dari 从，后面加 mana 就是问地点。',
  w: [['di mana', '在哪里'], ['ke mana', '去哪里'], ['dari mana', '从哪里来']] });
CF({ id: 'andor', k: 'c', t: '和、或者、但是', tip: '和中文一一对应，注意 atau 也用在选择疑问句：Kopi atau teh?',
  w: [['dan', '和'], ['atau', '或者；还是'], ['tapi', '但是']] });
CF({ id: 'ifbecause', k: 'c', t: '如果、因为、所以', tip: '一个条件、一个原因、一个结果。',
  w: [['kalau', '如果；至于'], ['karena', '因为'], ['jadi', '所以']] });
CF({ id: 'beforeafter', k: 'c', t: '之前、之后', tip: 'se- 开头的一对：sebelum 之前（belum 是“还没”），setelah 之后。',
  w: [['sebelum', '……之前'], ['setelah', '……之后']] });
CF({ id: 'go', k: 'c', t: '去、回家、来、回来', tip: '从说话人的位置看：离开是 pergi，回家是 pulang，过来是 datang，回到原处是 kembali。',
  w: [['pergi', '去；出门'], ['pulang', '回家；回住处'], ['datang', '来'], ['kembali', '回来；回到原处']] });
CF({ id: 'sick', k: 'c', t: '病痛和症状', tip: '看病时最常用的几个词。',
  w: [['sakit', '疼；生病：sakit kepala 头疼'], ['demam', '发烧'], ['pusing', '头晕'], ['mual', '恶心想吐'], ['batuk', '咳嗽'], ['pilek', '流鼻涕、感冒']] });
CF({ id: 'taste', k: 'c', t: '烫、辣、冷、甜、咸', tip: '中文“热”和“辣”分得清，但要注意 panas 是温度，pedas 才是辣。',
  w: [['panas', '热；烫（温度）'], ['pedas', '辣'], ['dingin', '冷；凉'], ['manis', '甜'], ['asin', '咸']] });

/* ===== 用法不同 ===== */
CF({ id: 'know', k: 'u', t: 'tahu / kenal / mengerti', tip: '中文都可以说“知道、认识、懂”，印尼语要分：事情用 tahu，人和地方用 kenal，听懂、理解用 mengerti。',
  w: [['tahu', '知道一件事：Saya tidak tahu.'], ['kenal', '认识一个人：Kamu kenal Pak Hasan?'], ['mengerti', '明白、听懂：Saya tidak mengerti.']] });
CF({ id: 'can', k: 'u', t: 'bisa / boleh', tip: '“能、会”用 bisa；“可以、允许”用 boleh。问别人能不能帮忙用 bisa，问自己能不能做某事用 boleh。',
  w: [['bisa', '能力、可能：Saya bisa bahasa Indonesia.'], ['boleh', '允许：Boleh saya masuk?']] });
CF({ id: 'not', k: 'u', t: 'tidak / bukan / belum / jangan', tip: '动词和形容词用 tidak，名词用 bukan，“还没”用 belum，叫别人别做用 jangan。',
  w: [['tidak', '不：tidak tahu、tidak mahal'], ['bukan', '不是：bukan orang Jepang'], ['belum', '还没：belum makan'], ['jangan', '别、不要：jangan pedas']] });
CF({ id: 'want', k: 'u', t: 'mau / ingin / perlu / harus', tip: '想要：mau 口语、ingin 正式；需要用 perlu；必须用 harus。',
  w: [['mau', '想要（口语最常用）'], ['ingin', '想要（比较正式、书面）'], ['perlu', '需要'], ['harus', '必须']] });
CF({ id: 'we', k: 'u', t: 'kami / kita', tip: '都是“我们”。包括听话的人用 kita（咱们），不包括用 kami。',
  w: [['kami', '我们（不包括你）：Kami dari Shanghai.'], ['kita', '咱们（包括你）：Ayo kita makan!']] });
CF({ id: 'iyou', k: 'u', t: 'saya / aku，kamu / Anda', tip: '对陌生人、长辈、工作场合用 saya 和 Anda（或 Bapak / Ibu）；对朋友、家人才用 aku 和 kamu。',
  w: [['saya', '我（通用、礼貌）'], ['aku', '我（亲密、口语）'], ['Anda', '您（正式，书面多用）'], ['kamu', '你（平辈、熟人）']] });
CF({ id: 'bye', k: 'u', t: 'selamat jalan / selamat tinggal', tip: '看谁走：对要离开的人说 selamat jalan；自己要走，对留下的人说 selamat tinggal。',
  w: [['selamat jalan', '一路平安（对要走的人说）'], ['selamat tinggal', '再见（自己走，对留下的人说）']] });
CF({ id: 'please', k: 'u', t: 'tolong / silakan / mohon / permisi / maaf', tip: '中文都可能说“请”或“不好意思”：请别人帮忙 tolong，请别人随意 silakan，正式请求 mohon，借过、打扰 permisi，道歉 maaf。',
  w: [['tolong', '请（帮我做）：Tolong bantu saya.'], ['silakan', '请（您先、您随意）：Silakan duduk.'], ['mohon', '恳请、敬请（正式场合和告示里用）'], ['permisi', '劳驾、借过、打扰一下'], ['maaf', '对不起、不好意思']] });
CF({ id: 'thanks', k: 'u', t: 'terima kasih / sama-sama / kembali', tip: '别人说 terima kasih，回答 sama-sama（不客气）；比较正式时也可以回答 kembali。',
  w: [['terima kasih', '谢谢'], ['sama-sama', '不客气（最常用）'], ['kembali', '回答感谢时的“也谢谢你”；本义是“回来”']] });
CF({ id: 'only', k: 'u', t: 'hanya / cuma / saja', tip: 'hanya 和 cuma 放在前面（cuma 更口语）；saja 放在后面。',
  w: [['hanya', '只（放前面）：hanya satu'], ['cuma', '只（口语）：cuma dua ribu'], ['saja', '只、就（放后面）：satu saja']] });
CF({ id: 'again', k: 'u', t: 'lagi / masih', tip: '“还”有两个意思：再来一次用 lagi，仍然、还在用 masih。',
  w: [['lagi', '再、又：satu lagi 再来一个'], ['masih', '还、仍然：masih hujan 还在下雨']] });
CF({ id: 'give', k: 'u', t: 'beri / kasih / bawa / ambil', tip: '给：beri 正式、kasih 口语；带着走是 bawa；拿取是 ambil。',
  w: [['beri', '给（正式）'], ['kasih', '给（口语）'], ['bawa', '带；拿着走'], ['ambil', '拿；取']] });
CF({ id: 'borrow', k: 'u', t: 'pinjam / kembalikan / sewa', tip: '借入、借出都可以用 pinjam；还是 kembalikan；付钱租用是 sewa。',
  w: [['pinjam', '借'], ['kembalikan', '归还'], ['sewa', '租']] });
CF({ id: 'ask', k: 'u', t: 'minta / pesan / tanya', tip: '中文都可能说“要”或“问”：要东西用 minta，点菜、预订用 pesan，提问用 tanya。',
  w: [['minta', '要、请给我：Minta air.'], ['pesan', '点菜；预订'], ['tanya', '问（问题）']] });
CF({ id: 'walk', k: 'u', t: 'jalan / jalan-jalan', tip: '叠起来意思变了：jalan 是路、走路；jalan-jalan 是出去逛逛、玩。',
  w: [['jalan', '路；走'], ['jalan-jalan', '逛逛；出去玩']] });

/* 速查表里的“易混词”总表：按类型各一张，从上面的数据生成 */
REF_GROUPS.push(['confuse', '易混词']);
CONFUSE_KINDS.forEach(k => REF({ id: 'cf-' + k[0], g: 'confuse', zh: '易混词：' + k[1], sub: k[2] + '（' + CONFUSE.filter(g => g.k === k[0]).length + ' 组）',
  cards: CONFUSE.filter(g => g.k === k[0]).map(g => ({ h: g.t, p: g.tip, keep: true,
    t: [['词', '意思', '怎么区分']].concat(g.w.filter(x => WORDS[x[0]]).map(x => ['«' + x[0] + '»', WORDS[x[0]].zh, x[1]])) })) }));
