/* ===== 语法速查表：随时能翻的总表，不用等学到某一课 =====
   REF({ id, g 分组, zh 标题, sub 一句话说明, rel 相关的语法卡片, cards })
   cards 和语法卡片同一种写法：h 小标题，p 说明（«印尼语» 可点读，**粗体**），t 表格（第一行是表头），n 表格后面的补充，ex 例句 */
const REFS = [];
const REF_GROUPS = [['affix', '词缀与构词'], ['words', '常用词总表'], ['num', '数字与时间']];
function REF(o) { REFS.push(o); }

/* ---------- 词缀与构词 ---------- */
REF({ id: 'me', g: 'affix', zh: 'me- 的变化总表', sub: '词根第一个字母决定前缀的形状，以及这个字母留不留', rel: ['g_me', 'g_me2'], cards: [
  { h: '常用的几种', t: [['词根开头', '前缀', '是否脱落', '例子'],
    ['p', 'mem-', 'p 脱落', '«pakai → memakai»、«pilih → memilih»'],
    ['b、f、v', 'mem-', '不脱落', '«beli → membeli»、«foto → memfoto»'],
    ['t', 'men-', 't 脱落', '«tulis → menulis»、«tunggu → menunggu»'],
    ['d、c、j、z', 'men-', '不脱落', '«dengar → mendengar»、«cari → mencari»、«jual → menjual»'],
    ['s', 'meny-', 's 脱落', '«sapu → menyapu»、«sewa → menyewa»'],
    ['k', 'meng-', 'k 脱落', '«kirim → mengirim»、«kenal → mengenal»'],
    ['g、h、元音', 'meng-', '不脱落', '«ganti → mengganti»、«hitung → menghitung»、«ajak → mengajak»、«isi → mengisi»'],
    ['l、m、n、r、w、y', 'me-', '不脱落', '«lihat → melihat»、«masak → memasak»、«rasa → merasa»'],
    ['单音节词根', 'menge-', '不脱落', '«cek → mengecek»、«cat → mengecat»、«las → mengelas»、«bor → mengebor»']],
    n: '规律很好记：**p、t、s、k 这四个清辅音会脱落**，其他辅音都保留。' },
  { h: '不脱落的例外', p: '① 外来词和以两个辅音开头的词，p、t、k、s 通常保留：«proses → memproses»、«transfer → mentransfer»、«kritik → mengkritik»、«stabil → menstabilkan»。② «punya → mempunyai» 是固定写法。③ 前缀 per- 的 p 不脱落：«memperbaiki»（修理）、«memperpanjang»（延长）。' },
  { h: '反过来：看到 me- 形式，怎么找词根', p: '查词典要按词根查。把鼻音去掉后，先试着补回脱落的字母：', t: [['看到', '先试', '例子', '注意'],
    ['mem + 元音', '补 p', '«memakai» ← «pakai»', '也可能词根本来就是 m 开头：«memasak» ← «masak»、«meminta» ← «minta»'],
    ['men + 元音', '补 t', '«menulis» ← «tulis»', '或 n 开头：«menikah» ← «nikah»、«menilai» ← «nilai»'],
    ['meny + 元音', '补 s', '«menyewa» ← «sewa»', '或 ny 开头：«menyanyi» ← «nyanyi»'],
    ['meng + 元音', '补 k', '«mengirim» ← «kirim»', '或元音开头：«mengambil» ← «ambil»、«mengisi» ← «isi»'],
    ['mem / men / meng + 辅音', '直接去掉前缀', '«membeli» ← «beli»、«mendengar» ← «dengar»、«mengganti» ← «ganti»', '']] },
  { h: '口语里的简化', p: '说话时常常直接用词根，或者只留下鼻音：«menulis → nulis»、«mengirim → ngirim»、«menyewa → nyewa»、«membeli → beli»。听到 n-、ng-、ny- 开头的动词，多半就是 me- 动词的口语形式。' }
] });

REF({ id: 'pe', g: 'affix', zh: 'pe- 名词的变化总表', sub: '“做这件事的人或工具”，鼻音变化和 me- 完全一样', rel: ['g_pean', 'g_profesi'], cards: [
  { h: '对应 me- 动词：有鼻音变化', t: [['词根开头', '前缀', '例子'],
    ['p（脱落）', 'pem-', '«pakai → pemakai»（使用者）、«pimpin → pemimpin»（领导）'],
    ['b、f', 'pem-', '«beli → pembeli»（买家）、«bantu → pembantu»（帮手、佣人）'],
    ['t（脱落）', 'pen-', '«tulis → penulis»（作者）、«tonton → penonton»（观众）'],
    ['d、c、j', 'pen-', '«dengar → pendengar»（听众）、«cari → pencari»（寻找者）、«jual → penjual»（卖家）'],
    ['s（脱落）', 'peny-', '«sewa → penyewa»（租客）、«sakit → penyakit»（疾病）'],
    ['k（脱落）', 'peng-', '«kirim → pengirim»（寄件人）、«kemudi → pengemudi»（司机）'],
    ['g、h、元音', 'peng-', '«ganti → pengganti»（替代者）、«hapus → penghapus»（橡皮擦）、«ajar → pengajar»（教师）、«awas → pengawas»（监工）'],
    ['l、m、n、r、w、y', 'pe-', '«latih → pelatih»（教练）、«minum → peminum»（爱喝酒的人）、«rokok → perokok»（吸烟者）、«warna → pewarna»（染料）'],
    ['单音节词根', 'penge-', '«las → pengelas»（焊工）、«bor → pengebor»（钻工）、«cat → pengecat»（油漆工）']] },
  { h: '对应 ber- 动词：没有鼻音变化', p: '如果动词是 ber- 形式，名词直接用 pe-，不加鼻音：', t: [['动词', '名词', '意思'],
    ['«bekerja»', '«pekerja»', '工人'], ['«belajar»', '«pelajar»', '学生'], ['«bertani»', '«petani»', '农民'], ['«berdagang»', '«pedagang»', '商贩'], ['«berjalan kaki»', '«pejalan kaki»', '行人']] }
] });

REF({ id: 'noun', g: 'affix', zh: '名词是怎么造出来的', sub: '-an、pe-、pe-an、per-an、ke-an 五种形式对照', rel: ['g_pean', 'g_kean', 'g_family'], cards: [
  { t: [['形式', '表示', '例子'],
    ['词根 + -an', '结果、东西', '«makan → makanan»（食物）、«lapor → laporan»（报告）、«bangun → bangunan»（建筑物）、«pilih → pilihan»（选择）'],
    ['pe- + 词根', '做事的人、工具', '«penjual»（卖家）、«penulis»（作者）、«penghapus»（橡皮擦）'],
    ['pe-…-an（对应 me- 动词，有鼻音变化）', '过程、行为', '«membeli → pembelian»（采购）、«mengirim → pengiriman»（发货）、«mengolah → pengolahan»（加工）'],
    ['per-…-an（对应 ber- 动词或名词）', '事务、行业、场所', '«berjalan → perjalanan»（旅程）、«bertemu → pertemuan»（会议）、«berubah → perubahan»（变化）、«usaha → perusahaan»（公司）'],
    ['ke-…-an', '抽象名词、状态', '«sehat → kesehatan»（健康）、«aman → keamanan»（安全、安保）、«selamat → keselamatan»（安全）、«butuh → kebutuhan»（需求）']] },
  { h: '一个容易混的例子', p: '«penambangan» 是“开采”这项作业（对应动词 «menambang»）；«pertambangan» 是“采矿业、矿业”这个行业（对应名词 «tambang»）。新闻和法规里两个词都很常见。', ex: [['[Penambangan] dimulai tahun depan.', '开采明年开始。'], ['Dia bekerja di sektor [pertambangan].', '他在矿业部门工作。']] }
] });

REF({ id: 'ber', g: 'affix', zh: 'ber- 的形状和意思', sub: 'ber-、be-、bel- 三种写法，六种常见用法', rel: ['g_ber'], cards: [
  { h: '写法', t: [['情况', '前缀', '例子'],
    ['一般情况', 'ber-', '«jalan → berjalan»、«main → bermain»、«bicara → berbicara»'],
    ['词根以 r 开头', 'be-', '«renang → berenang»（游泳）、«racun → beracun»（有毒）'],
    ['词根第一个音节以 er 结尾', 'be-', '«kerja → bekerja»、«ternak → beternak»（养殖）、«serta → beserta»（连同）'],
    ['只有这一个词', 'bel-', '«ajar → belajar»']] },
  { h: '意思', t: [['用法', '例子'],
    ['做某个活动（不带宾语）', '«berjalan»（走）、«berenang»（游泳）、«bekerja»（工作）、«berbicara»（说话）'],
    ['有、带着', '«beristri»（有妻子）、«berkeluarga»（有家室）、«berizin»（持有许可）、«beracun»（有毒）'],
    ['穿、用、乘', '«berbaju merah»（穿红衣服）、«bersepatu»（穿鞋）、«bersepeda»（骑自行车）'],
    ['ber- + 数字：几个人一起', '«berdua»（两个人一起）、«bertiga»（三个人一起）'],
    ['ber-…-an：互相、彼此', '«bersalaman»（握手）、«berdekatan»（挨得很近）、«berhadapan»（面对面）'],
    ['ber- + 叠词：成……的', '«berjam-jam»（好几个小时）、«bertahun-tahun»（很多年）、«beribu-ribu»（成千上万）']] }
] });

REF({ id: 'ter', g: 'affix', zh: 'ter- 的四种意思', sub: '最……、状态、不小心、无法……', rel: ['g_ter', 'g_compare'], cards: [
  { t: [['形式', '意思', '例子'],
    ['ter- + 形容词', '最……', '«terbesar»（最大）、«terbaik»（最好）、«termurah»（最便宜）、«terdekat»（最近的）'],
    ['ter- + 动词', '已经处于某种状态', '«terbuka»（开着）、«tertutup»（关着）、«terkunci»（锁着）、«tertulis»（书面的）、«terdaftar»（已注册）'],
    ['ter- + 动词', '不小心、无意中', '«tertidur»（睡着了）、«terjatuh»（摔倒）、«tertinggal»（落下了）、«terlambat»（迟到）、«tersesat»（迷路）'],
    ['tidak ter-', '无法……', '«tidak terlihat»（看不见）、«tidak terduga»（意想不到）、«tidak terhitung»（数不清）']] },
  { h: '写法', p: '词根以 r 开头时写成 te-：«rasa → terasa»（感觉得到）。«percaya» 的规范写法是 «tepercaya»（可信赖的），但生活中更常见 «terpercaya»。' },
  { h: '公文和新闻里的固定词', p: '这些词已经当成普通词用，整体记住：', t: [['词', '意思'], ['«termasuk»', '包括'], ['«terutama»', '尤其、主要是'], ['«tersebut»', '上述的、该'], ['«terhadap»', '对于'], ['«terjadi»', '发生'], ['«terdiri dari»', '由……组成'], ['«terkait»', '相关的'], ['«terbatas»', '有限的（公司名里 PT 的 T）']] }
] });

REF({ id: 'voice', g: 'affix', zh: '主动 me- 和被动 di- 对照', sub: '同一个词根的两种形式，以及“谁做的”怎么说', rel: ['g_di', 'g_me2'], cards: [
  { h: 'di- 直接加在词根上，脱落的字母会回来', t: [['词根', '主动', '被动', '意思'],
    ['«beli»', '«membeli»', '«dibeli»', '买'], ['«pakai»', '«memakai»', '«dipakai»', '用'], ['«tulis»', '«menulis»', '«ditulis»', '写'], ['«kirim»', '«mengirim»', '«dikirim»', '发送'],
    ['«sewa»', '«menyewa»', '«disewa»', '租'], ['«ambil»', '«mengambil»', '«diambil»', '拿'], ['«periksa»', '«memeriksa»', '«diperiksa»', '检查'], ['«tanda tangan»', '«menandatangani»', '«ditandatangani»', '签署']] },
  { h: '被动句怎么选', t: [['谁做的', '句型', '例子'],
    ['别人，或者不说是谁', '东西 + di-动词（+ oleh + 人）', '«Surat itu ditulis oleh direktur.» 那封信是总监写的。'],
    ['我、我们', '东西 + saya / kami / kita + 词根', '«Surat itu saya tulis.» 那封信是我写的。'],
    ['你、您', '东西 + kamu / Anda + 词根', '«Surat itu sudah Anda baca?» 那封信您看过了吗？'],
    ['他、她', '东西 + dia + 词根，或 di-…-nya', '«Surat itu dia tulis.»、«Surat itu ditulisnya.»'],
    ['没人故意做：状态或意外', 'ter-', '«Pintunya terkunci.» 门锁着。'],
    ['遭受不好的事', 'ke-…-an 或 kena', '«Saya kehujanan.» 我被雨淋了。«Dia kena denda.» 他被罚款了。']] }
] });

REF({ id: 'di', g: 'affix', zh: 'di 的用法总表', sub: '介词 di（在）分开写，前缀 di-（被）连着写', rel: ['g_di', 'g_prep', 'g_sign'], cards: [
  { h: '两个 di，写法不同', t: [['', '介词 di', '前缀 di-'],
    ['意思', '在（某个地方）', '被……'],
    ['后面跟', '地点、方位词', '动词词根'],
    ['写法', '和后面的词**分开**', '和后面的词**连写**'],
    ['例子', '«di rumah»（在家）、«di sini»（在这里）、«di atas»（在上面）', '«dibeli»（被买）、«ditulis»（被写）、«dikirim»（被发出）']],
    n: '判断办法：后面是地方就分开写，后面是动作就连写。di jual 是错的，应该写 «dijual»；dirumah 也是错的，应该写 «di rumah»。印尼人自己也常写错，看到不规范的写法不用奇怪。' },
  { h: 'me- 动词怎么变成 di- 被动', p: '去掉 me- 和鼻音，补回脱落的字母，前面加 di-；后缀 -kan、-i 和前缀 per- 都保留。', t: [['主动', '被动', '意思'],
    ['«membeli»', '«dibeli»', '买 → 被买'],
    ['«menulis»', '«ditulis»', '写 → 被写'],
    ['«membuat»', '«dibuat»', '做 → 被制造'],
    ['«mengisi»', '«diisi»', '填 → 被填写'],
    ['«menggunakan»', '«digunakan»', '使用 → 被使用'],
    ['«mengirimkan»', '«dikirimkan»', '寄出 → 被寄出'],
    ['«menandatangani»', '«ditandatangani»', '签署 → 被签署'],
    ['«memperbaiki»', '«diperbaiki»', '修理 → 被修好'],
    ['«mempelajari»', '«dipelajari»', '研究 → 被研究']] },
  { h: '前面加时间词和情态词', t: [['说法', '意思', '例子'],
    ['sudah di-', '已经……了', '«Sudah dibayar.» 已经付过了。'],
    ['belum di-', '还没……', '«Belum dikirim.» 还没发出。'],
    ['sedang di-', '正在……', '«Sedang diperbaiki.» 正在维修。'],
    ['akan di-', '将要……', '«Akan diperiksa besok.» 明天检查。'],
    ['harus di-', '必须……', '«Formulir ini harus diisi.» 这张表必须填。'],
    ['bisa di-', '可以……', '«Bisa dibayar dengan kartu.» 可以刷卡支付。'],
    ['tidak boleh di-', '不准……', '«Tidak boleh dibawa masuk.» 不准带进去。']] },
  { h: '告示牌和广告上的 di-', t: [['词', '意思', '词', '意思'],
    ['«Dilarang merokok»', '禁止吸烟', '«Dilarang masuk»', '禁止入内'],
    ['«Dijual»', '出售', '«Disewakan»', '出租'],
    ['«Dicari»', '招聘、寻找', '«Dibutuhkan»', '急需（招聘）'],
    ['«Ditutup»', '关闭', '«Dibuat di Indonesia»', '印尼制造']], keep: true },
  { p: '被动句怎么选人称（我写的、你写的、他写的），见“主动 me- 和被动 di- 对照”。' }
] });

REF({ id: 'kani', g: 'affix', zh: '-kan 和 -i 对照', sub: '-kan 的宾语是被移动的东西，-i 的宾语是地点或对象', rel: ['g_kan_i'], cards: [
  { h: '同一个词根，两种后缀', t: [['词根', '-kan', '-i'],
    ['«datang»（来）', '«mendatangkan»（请来、引进）', '«mendatangi»（上门去找）'],
    ['«masuk»（进）', '«memasukkan»（把东西放进去）', '«memasuki»（进入某处）'],
    ['«naik»（上）', '«menaikkan»（提高、抬上去）', '«menaiki»（登上、乘坐）'],
    ['«kirim»（寄）', '«mengirimkan»（寄出某物）', '«mengirimi»（寄给某人）'],
    ['«tanam»（种）', '«menanamkan»（把……种下、投入）', '«menanami»（在某处种上）'],
    ['«dekat»（近）', '«mendekatkan»（使靠近）', '«mendekati»（靠近某人、某处）']] },
  { h: '各自的常见意思', t: [['后缀', '意思', '例子'],
    ['-kan', '使……', '«mematikan»（关掉）、«membersihkan»（弄干净）、«menaikkan»（提高）'],
    ['-kan', '为别人做', '«membelikan»（给……买）、«mengambilkan»（帮……拿）'],
    ['-kan', '用、拿……来做', '«menggunakan»（使用）'],
    ['-i', '动作指向地点或人', '«mendatangi»、«memasuki»、«menemani»（陪伴）'],
    ['-i', '给……加上', '«menandatangani»（签字）、«mewarnai»（上色）、«menggarami»（加盐）'],
    ['-i', '反复做', '«memukuli»（一下一下地打）']] },
  { h: 'memper-：使更……', p: '«memperbaiki»（修理）、«memperpanjang»（延长，比如签证）、«memperbarui»（更新）、«mempercepat»（加快）、«memperkenalkan»（介绍）。' }
] });

REF({ id: 'affix', g: 'affix', zh: '常见词缀一览', sub: '看到一个长词，先在这里找它的零件', rel: ['g_family', 'g_me', 'g_ber', 'g_ter', 'g_di'], cards: [
  { t: [['词缀', '作用', '例子'],
    ['me-', '主动动词（多带宾语）', '«membeli»、«menulis»'],
    ['ber-', '不带宾语的动作；有、穿、用', '«berjalan»、«berbaju»'],
    ['di-', '被动', '«dibeli»、«ditulis»'],
    ['ter-', '最……；状态；不小心', '«terbesar»、«terbuka»、«tertidur»'],
    ['pe-', '做事的人或工具', '«penjual»、«penghapus»'],
    ['-an', '结果、东西', '«makanan»、«laporan»'],
    ['-kan', '使……；为别人做', '«matikan»、«belikan»'],
    ['-i', '动作指向某处、某人', '«datangi»、«tandatangani»'],
    ['memper-', '使更……', '«memperbaiki»、«memperpanjang»'],
    ['pe-…-an', '过程、行为', '«pengiriman»、«penambangan»'],
    ['per-…-an', '事务、行业、场所', '«pertemuan»、«pertambangan»'],
    ['ke-…-an', '抽象名词；遭受；太……', '«kesehatan»、«kehujanan»、«kebesaran»'],
    ['se-', '一；同样；全', '«sebuah»（一个）、«setinggi»（一样高）、«seluruh»（全部）'],
    ['ke- + 数字', '第几', '«kedua»（第二）、«ketiga»（第三）'],
    ['-nya', '他的；那个（特指）', '«namanya»、«harganya»'],
    ['-ku、-mu', '我的、你的', '«rumahku»、«rumahmu»'],
    ['叠词', '复数；随意、放松', '«anak-anak»、«jalan-jalan»']] }
] });

REF({ id: 'family', g: 'affix', zh: '词族：一个词根的全家', sub: '用四个词根看词缀怎么搭配', rel: ['g_family'], cards: [
  { h: 'tambang（矿）', t: [['词', '意思'], ['«tambang»', '矿、矿场'], ['«menambang»', '采矿'], ['«ditambang»', '被开采'], ['«penambang»', '采矿者、矿工'], ['«penambangan»', '开采（作业）'], ['«pertambangan»', '采矿业、矿业']] },
  { h: 'kerja（工作）', t: [['词', '意思'], ['«kerja»', '工作（词根，口语里直接当动词）'], ['«bekerja»', '工作（动词）'], ['«mengerjakan»', '做（某项工作）'], ['«dikerjakan»', '被做、在处理中'], ['«pekerja»', '工人'], ['«pekerjaan»', '工作、职业'], ['«bekerja sama»', '合作']] },
  { h: 'ajar（教、学）', t: [['词', '意思'], ['«belajar»', '学习'], ['«mengajar»', '教书'], ['«mengajari»', '教（某人）'], ['«mempelajari»', '研究、钻研（某事）'], ['«pelajar»', '学生'], ['«pengajar»', '教师'], ['«pelajaran»', '课、功课']] },
  { h: 'jual（卖）', t: [['词', '意思'], ['«jual»', '卖（词根）'], ['«menjual»', '卖'], ['«dijual»', '出售、被卖'], ['«penjual»', '卖家'], ['«penjualan»', '销售'], ['«jualan»', '卖的货；做买卖（口语）']] }
] });

REF({ id: 'nya', g: 'affix', zh: '-nya 的用法总表', sub: '不只是“他的”：特指、宾语、名词化、感叹、固定副词', rel: ['g_possessive', 'g_di'], cards: [
  { t: [['用法', '意思', '例子'],
    ['名词 + -nya', '他的、她的、它的', '«namanya»（他的名字）、«rumahnya»（她的房子）、«harganya»（它的价格）'],
    ['名词 + -nya', '特指：那个、这个（双方都知道）', '«Harganya berapa?» 这个多少钱？«Makanannya enak.» 这饭菜好吃。«Kamarnya bersih.» 房间很干净。'],
    ['动词 + -nya', '宾语：他、她、它', '«Saya sudah meneleponnya.» 我已经给他打过电话了。«Saya belum membacanya.» 我还没读它。'],
    ['di-动词 + -nya', '被他、被她', '«Surat itu ditulisnya.» 那封信是他写的。«Mobilnya sudah dijualnya.» 车已经被他卖了。'],
    ['介词 + -nya', '给他、和他、为他', '«kepadanya»（给他）、«dengannya»（和他）、«untuknya»（为他）'],
    ['形容词 + -nya', '变成名词：……的程度', '«tingginya»（高度）、«panjangnya»（长度）、«beratnya»（重量）、«lamanya»（时长）'],
    ['动词 + -nya + 名词', '……这件事', '«naiknya harga»（价格上涨这件事）、«turunnya produksi»（产量下降）'],
    ['形容词 + -nya！', '感叹：真……啊', '«Mahalnya!» 真贵啊！«Panasnya hari ini!» 今天真热！']] },
  { h: '量尺寸、报数据时很常用', p: '说长宽高、重量、时长时，印尼语习惯用“形容词 + -nya”开头。', ex: [['[Tingginya] dua meter.', '高度是两米。'], ['[Beratnya] lima puluh ton.', '重量是五十吨。'], ['[Lamanya] tiga jam.', '时长是三个小时。']] },
  { h: '对人说话时用 -nya 更客气', p: '问对方的事情时，直接说“你的”有点冲，印尼人常用 -nya 代替：«Namanya siapa?»（您叫什么名字？）比 «Nama kamu siapa?» 更柔和；«Rumahnya di mana?»（您家在哪儿？）也是同样的道理。' },
  { keep: true, h: '已经变成固定词的 -nya', p: '这些词整体记，不用拆开理解：', t: [['词', '意思', '词', '意思'],
    ['«biasanya»', '通常', '«sebenarnya»', '其实'],
    ['«akhirnya»', '终于、最后', '«sepertinya»', '好像、看起来'],
    ['«misalnya»', '比如', '«katanya»', '据说、听说'],
    ['«sebaiknya»', '最好', '«seharusnya»', '本应该'],
    ['«umumnya»', '一般来说', '«khususnya»', '尤其是'],
    ['«selanjutnya»', '接下来', '«sebelumnya»', '之前'],
    ['«artinya»', '意思是', '«maksudnya»', '意思是说'],
    ['«rupanya»', '原来、看来', '«secepatnya»', '尽快']] }
] });

REF({ id: 'se', g: 'affix', zh: 'se- 的用法总表', sub: '一、同样、全、一……就、尽量', rel: ['g_number', 'g_classifier', 'g_compare'], cards: [
  { t: [['用法', '意思', '例子'],
    ['se- + 量词、单位', '一（= satu）', '«sebuah»（一个）、«seorang»（一位）、«seratus»（一百）、«seribu»（一千）、«sejam»（一小时）'],
    ['se- + 形容词', '和……一样', '«setinggi»（一样高）、«sebesar»（一样大；也表示“金额达”）、«semahal»（一样贵）'],
    ['se- + 名词', '同一个、全、整个', '«sekantor»（同一个办公室）、«sekeluarga»（全家）、«seluruh»（全部）、«sedunia»（全世界）'],
    ['se- + 动词', '一……就；在……的时候', '«sesampai»（一到）、«setelah»（在……之后）、«sebelum»（在……之前）、«selama»（在……期间）'],
    ['se- + 形容词 + -nya', '尽量……', '«secepatnya»（尽快）、«sebaiknya»（最好）、«seharusnya»（本应该）'],
    ['se- + 叠词 + -nya', '最多、最迟、尽可能', '«selambat-lambatnya»（最迟）、«sebanyak-banyaknya»（尽可能多）、«sekurang-kurangnya»（至少）']] },
  { h: '读新闻时常见的 sebesar、sebanyak、sejumlah', p: '报数字时前面常带一个 se- 词：«sebesar»（金额、比例达）、«sebanyak»（数量达）、«sejumlah»（若干）、«sekitar»（大约）、«setiap»（每）。', ex: [['Produksi naik [sebesar] sepuluh persen.', '产量增长了百分之十。'], ['[Sebanyak] dua ratus pekerja hadir.', '有两百名工人到场。'], ['[Sekitar] lima juta ton.', '大约五百万吨。']] }
] });

/* ---------- 常用词总表 ---------- */
REF({ id: 'pron', g: 'words', zh: '人称代词总表', sub: '印尼语代词不分主格宾格，也不分男女', rel: ['g_pronoun', 'g_possessive'], cards: [
  { t: [['', '正式、礼貌', '随便、亲密', '所有格后缀'],
    ['我', '«saya»', '«aku»；雅加达口语 «gue»', '-ku：«rumahku»'],
    ['你', '«Anda»；最自然的“您”是 «Bapak»、«Ibu»', '«kamu»；雅加达口语 «lo»', '-mu：«rumahmu»'],
    ['他、她', '«beliau»（敬称）', '«dia»；书面作主语也用 «ia»', '-nya：«rumahnya»'],
    ['我们（不含对方）', '«kami»', '«kami»', '«rumah kami»'],
    ['咱们（含对方）', '«kita»', '«kita»', '«rumah kita»'],
    ['你们', '«Bapak-Ibu sekalian»、«Anda sekalian»', '«kalian»', '«rumah kalian»'],
    ['他们', '«mereka»', '«mereka»', '«rumah mereka»']] },
  { h: '称呼词也当代词用', p: '对人说话时，常用称呼代替“你”：«Pak»（先生）、«Bu»（女士）、«Mas»（年轻男性）、«Mbak»（年轻女性）、«Kak»（哥、姐）、«Dik»（弟、妹）。', ex: [['[Bapak] mau minum apa?', '您想喝点什么？（对年长男性）'], ['Ini punya [Mbak]?', '这是你的吗？（对年轻女性）']] }
] });

REF({ id: 'ask', g: 'words', zh: '疑问词总表', sub: '什么、谁、哪儿、什么时候、多少、怎么、为什么', rel: ['g_question'], cards: [
  { t: [['疑问词', '意思', '例子'],
    ['«apa»', '什么', '«Ini apa?» 这是什么？'],
    ['«siapa»', '谁（问名字也用它）', '«Siapa nama Anda?» 您叫什么名字？'],
    ['«di mana»', '在哪儿', '«Toiletnya di mana?» 洗手间在哪儿？'],
    ['«ke mana»', '去哪儿', '«Mau ke mana?» 要去哪儿？'],
    ['«dari mana»', '从哪儿', '«Anda dari mana?» 您从哪儿来？'],
    ['«kapan»', '什么时候', '«Kapan berangkat?» 什么时候出发？'],
    ['«berapa»', '多少、几', '«Harganya berapa?» 多少钱？'],
    ['«jam berapa»', '几点', '«Jam berapa sekarang?» 现在几点？'],
    ['«berapa lama»', '多久', '«Berapa lama di sini?» 在这儿待多久？'],
    ['«bagaimana»', '怎么样、怎么（口语 «gimana»）', '«Bagaimana caranya?» 怎么做？'],
    ['«mengapa»、«kenapa»', '为什么（后者口语）', '«Kenapa terlambat?» 为什么迟到？'],
    ['«yang mana»', '哪一个', '«Mau yang mana?» 要哪一个？'],
    ['«apakah»', '是否（正式的是非问句）', '«Apakah Anda setuju?» 您同意吗？']] }
] });

REF({ id: 'neg', g: 'words', zh: '否定词总表', sub: '不、不是、还没、别、没有', rel: ['g_tidakbukan', 'g_imperative', 'g_aspect'], cards: [
  { t: [['词', '用在哪儿', '例子'],
    ['«tidak»', '否定动词、形容词', '«Saya tidak tahu.» 我不知道。'],
    ['«bukan»', '否定名词、代词', '«Ini bukan punya saya.» 这不是我的。'],
    ['«belum»', '还没（以后可能会）', '«Saya belum makan.» 我还没吃。'],
    ['«jangan»', '别、不要（命令）', '«Jangan lupa!» 别忘了！'],
    ['«tanpa»', '没有、不带', '«Kopi tanpa gula.» 不加糖的咖啡。'],
    ['«kurang»', '不太、不够', '«Kurang jelas.» 不太清楚。'],
    ['«tidak ada»', '没有（不存在）', '«Tidak ada masalah.» 没问题。'],
    ['«tidak usah»、«tidak perlu»', '不用、不必', '«Tidak usah repot-repot.» 不用麻烦了。'],
    ['«dilarang»', '禁止（告示牌）', '«Dilarang merokok.» 禁止吸烟。'],
    ['«nggak»、«gak»', '口语里的 tidak', '«Nggak apa-apa.» 没关系。']] }
] });

REF({ id: 'aspect', g: 'words', zh: '时间和状态标记总表', sub: '印尼语没有时态，靠这些词交代“什么时候、做到哪一步”', rel: ['g_aspect', 'g_noconj'], cards: [
  { t: [['词', '意思', '例子'],
    ['«sudah»（书面 «telah»）', '已经', '«Saya sudah makan.» 我吃过了。'],
    ['«belum»', '还没', '«Dia belum datang.» 他还没来。'],
    ['«sedang»（口语 «lagi»）', '正在', '«Saya sedang rapat.» 我正在开会。'],
    ['«akan»', '将要', '«Kami akan berangkat besok.» 我们明天出发。'],
    ['«masih»', '还、仍然', '«Dia masih tidur.» 他还在睡。'],
    ['«baru»', '刚刚', '«Saya baru sampai.» 我刚到。'],
    ['«pernah»', '曾经', '«Saya pernah ke Bali.» 我去过巴厘岛。'],
    ['«belum pernah»', '从来没有', '«Saya belum pernah ke sana.» 我从没去过那儿。'],
    ['«tidak … lagi»', '不再', '«Dia tidak bekerja di sini lagi.» 他不在这儿工作了。'],
    ['«tadi»', '刚才（今天早些时候）', '«Tadi pagi hujan.» 今天早上下雨了。'],
    ['«nanti»', '等会儿、稍后', '«Nanti saya telepon.» 我等会儿打电话。'],
    ['«dulu»', '以前；先', '«Saya makan dulu.» 我先吃饭。'],
    ['«segera»', '马上', '«Segera datang.» 马上就来。']] }
] });

REF({ id: 'prep', g: 'words', zh: '介词和方位词总表', sub: '在、去、从、给、用、关于……', rel: ['g_prep'], cards: [
  { h: '介词', t: [['词', '意思', '例子'],
    ['«di»', '在（地点）', '«di kantor» 在办公室'],
    ['«ke»', '去、往', '«ke bandara» 去机场'],
    ['«dari»', '从、来自', '«dari Tiongkok» 来自中国'],
    ['«pada»', '在（时间、人、抽象事物）', '«pada hari Senin» 在星期一'],
    ['«kepada»', '给、向（人）', '«kepada Bapak direktur» 致总监先生'],
    ['«untuk»', '为了、给', '«untuk Anda» 给您的'],
    ['«dengan»', '和、用', '«dengan teman» 和朋友；«dengan sendok» 用勺子'],
    ['«tanpa»', '没有、不带', '«tanpa izin» 未经许可'],
    ['«tentang»', '关于', '«tentang harga» 关于价格'],
    ['«oleh»', '被、由', '«oleh pemerintah» 由政府'],
    ['«sejak»', '自从', '«sejak kemarin» 从昨天起'],
    ['«sampai»', '到、直到', '«sampai besok» 到明天'],
    ['«selama»', '在……期间', '«selama dua jam» 两个小时里'],
    ['«antara»', '在……之间', '«antara Jakarta dan Bandung» 雅加达和万隆之间'],
    ['«seperti»', '像', '«seperti ini» 像这样'],
    ['«menurut»', '根据、按照', '«menurut saya» 依我看'],
    ['«terhadap»', '对于', '«terhadap lingkungan» 对环境'],
    ['«melalui»、«lewat»', '通过、经过', '«lewat jalan tol» 走高速公路']] },
  { h: '方位词：前面加 di、ke、dari', t: [['词', '意思', '例子'],
    ['«atas»', '上', '«di atas meja» 在桌子上'], ['«bawah»', '下', '«di bawah meja» 在桌子下'], ['«depan»', '前', '«di depan hotel» 在酒店前面'], ['«belakang»', '后', '«di belakang rumah» 在房子后面'],
    ['«dalam»', '里', '«di dalam tas» 在包里'], ['«luar»', '外', '«di luar kota» 在城外'], ['«samping»、«sebelah»', '旁边', '«di samping bank» 在银行旁边'], ['«tengah»', '中间', '«di tengah kota» 在市中心'],
    ['«seberang»', '对面', '«di seberang jalan» 在马路对面'], ['«kiri»', '左', '«belok kiri» 左转'], ['«kanan»', '右', '«belok kanan» 右转']] }
] });

REF({ id: 'conj', g: 'words', zh: '连接词总表', sub: '把两句话连起来', rel: ['g_serial', 'g_formal'], cards: [
  { t: [['词', '意思', '例子'],
    ['«dan»', '和', '«kopi dan teh» 咖啡和茶'],
    ['«atau»', '或者', '«kopi atau teh» 咖啡还是茶'],
    ['«tetapi»、«tapi»', '但是（后者口语）', '«Enak, tapi mahal.» 好吃，但是贵。'],
    ['«karena»', '因为', '«Saya terlambat karena macet.» 我因为堵车迟到了。'],
    ['«jadi»', '所以', '«Hujan, jadi saya naik taksi.» 下雨了，所以我打车。'],
    ['«sehingga»', '以至于、因此', '«Harga naik sehingga permintaan turun.» 价格上涨，需求因此下降。'],
    ['«kalau»、«jika»', '如果（后者书面）', '«Kalau hujan, saya tidak pergi.» 如果下雨，我就不去。'],
    ['«supaya»、«agar»', '为了、以便', '«Bicara pelan-pelan supaya saya mengerti.» 说慢一点，好让我听懂。'],
    ['«meskipun»、«walaupun»', '虽然、尽管', '«Meskipun hujan, dia datang.» 虽然下雨，他还是来了。'],
    ['«sebelum»', '在……之前', '«sebelum makan» 饭前'],
    ['«sesudah»、«setelah»', '在……之后', '«setelah rapat» 会后'],
    ['«sambil»', '一边……一边', '«makan sambil bekerja» 边吃边工作'],
    ['«ketika»、«waktu»', '当……的时候', '«waktu saya kecil» 我小的时候'],
    ['«bahwa»', '引出“说、认为”的内容', '«Dia bilang bahwa harganya naik.» 他说价格涨了。'],
    ['«sedangkan»', '而（对比）', '«Saya minum kopi, sedangkan dia minum teh.» 我喝咖啡，而他喝茶。'],
    ['«lalu»、«kemudian»', '然后', '«Belok kiri, lalu lurus.» 左转，然后直走。'],
    ['«selain itu»', '此外', '«Selain itu, ada biaya kirim.» 此外还有运费。'],
    ['«oleh karena itu»', '因此（正式）', '«Oleh karena itu, proyek ditunda.» 因此项目推迟了。'],
    ['«padahal»', '可实际上', '«Dia pergi, padahal sedang sakit.» 他去了，可他其实正病着。']] }
] });

REF({ id: 'cls', g: 'words', zh: '量词总表', sub: '数字 + 量词 + 名词；“一”常缩成 se-', rel: ['g_classifier'], cards: [
  { t: [['量词', '用于', '例子'],
    ['«orang»', '人', '«dua orang tamu» 两位客人'],
    ['«ekor»', '动物', '«tiga ekor ayam» 三只鸡'],
    ['«buah»', '物品（最通用）', '«sebuah rumah» 一座房子'],
    ['«butir»', '圆形小东西（蛋、药片）', '«sepuluh butir telur» 十个鸡蛋'],
    ['«lembar»', '薄片（纸、布、钞票）', '«dua lembar kertas» 两张纸'],
    ['«batang»', '长条（烟、树、笔）', '«sebatang rokok» 一支烟'],
    ['«potong»', '切下来的一块', '«sepotong kue» 一块蛋糕'],
    ['«botol»', '瓶', '«dua botol air» 两瓶水'],
    ['«gelas»', '杯（玻璃杯）', '«segelas teh» 一杯茶'],
    ['«cangkir»', '杯（带把的）', '«secangkir kopi» 一杯咖啡'],
    ['«piring»', '盘', '«sepiring nasi» 一盘米饭'],
    ['«mangkuk»', '碗', '«semangkuk bakso» 一碗肉丸汤'],
    ['«bungkus»', '包', '«dua bungkus nasi» 两包饭'],
    ['«pasang»', '双、对', '«sepasang sepatu» 一双鞋'],
    ['«unit»', '台（设备、车辆）', '«tiga unit ekskavator» 三台挖掘机']] },
  { p: '日常说话时量词经常省略：«dua kopi»（两杯咖啡）完全没问题。' }
] });

REF({ id: 'degree', g: 'words', zh: '程度和比较总表', sub: '很、太、有点、更、最、一样', rel: ['g_compare'], cards: [
  { t: [['词', '意思', '放在形容词', '例子'],
    ['«sangat»', '非常（偏书面）', '前', '«sangat mahal»'],
    ['«sekali»', '非常（偏口语）', '后', '«mahal sekali»'],
    ['«banget»', '超（很口语）', '后', '«mahal banget»'],
    ['«terlalu»', '太', '前', '«terlalu mahal»'],
    ['«agak»', '有点', '前', '«agak mahal»'],
    ['«cukup»', '相当、足够', '前', '«cukup mahal»'],
    ['«kurang»', '不太', '前', '«kurang enak»'],
    ['«lebih»', '更', '前', '«lebih murah»'],
    ['«paling»', '最', '前', '«paling murah»'],
    ['«semakin»、«makin»', '越来越', '前', '«semakin mahal»']] },
  { h: '比较句', t: [['句型', '例子'],
    ['A lebih … daripada B', '«Bali lebih ramai daripada Lombok.» 巴厘岛比龙目岛热闹。'],
    ['A se… B', '«Dia setinggi saya.» 他和我一样高。'],
    ['A sama …nya dengan B', '«Harganya sama mahalnya dengan kemarin.» 价钱和昨天一样贵。'],
    ['yang paling …', '«Ini yang paling enak.» 这个最好吃。']] }
] });

REF({ id: 'demo', g: 'words', zh: '这、那、这里、那里', sub: '指示词分近、中、远三档', rel: ['g_prep', 'g_order'], cards: [
  { t: [['', '近（靠近我）', '中（靠近你）', '远'],
    ['这、那', '«ini»', '«itu»', '«itu»'],
    ['在这里、那里', '«di sini»', '«di situ»', '«di sana»'],
    ['到这里、那里', '«ke sini»', '«ke situ»', '«ke sana»'],
    ['从这里、那里', '«dari sini»', '«dari situ»', '«dari sana»'],
    ['这样、那样', '«begini»', '«begitu»', '«begitu»']] },
  { p: '指示词放在名词**后面**：«rumah ini»（这座房子）、«orang itu»（那个人）。单说“这个、那个”用 «yang ini»、«yang itu»。书面语里“上述的、该”用 «tersebut»：«perusahaan tersebut»（该公司）。' }
] });

REF({ id: 'slang', g: 'words', zh: '正式说法和口语对照', sub: '书上学的是左边，街上听到的多是右边', rel: ['g_slang'], cards: [
  { t: [['正式', '口语', '意思'],
    ['«tidak»', '«nggak»、«gak»', '不'],
    ['«sudah»', '«udah»', '已经'],
    ['«saja»', '«aja»', '就、只'],
    ['«hanya»', '«cuma»', '只'],
    ['«bagaimana»', '«gimana»', '怎么样'],
    ['«mengapa»', '«kenapa»', '为什么'],
    ['«begitu»、«begini»', '«gitu»、«gini»', '那样、这样'],
    ['«sangat»、«sekali»', '«banget»', '非常'],
    ['«sedang»', '«lagi»', '正在'],
    ['«akan»', '«bakal»', '将要'],
    ['«ingin»', '«mau»、«pengin»', '想要'],
    ['«dengan»', '«sama»', '和、跟'],
    ['«memberi»', '«kasih»', '给'],
    ['«berkata»', '«bilang»', '说'],
    ['«membuat»', '«bikin»', '做、弄'],
    ['«tetapi»', '«tapi»', '但是'],
    ['«benar»', '«bener»', '对、真的'],
    ['«terima kasih»', '«makasih»', '谢谢']] },
  { h: '动词的口语形式', p: 'me- 缩成鼻音：«menulis → nulis»、«mengirim → ngirim»。后缀 -kan 说成 -in：«ambilkan → ambilin»、«matikan → matiin»。这些只用于熟人之间，对长辈、客户和在书面里还是用正式说法。' }
] });

REF({ id: 'particle', g: 'words', zh: '句尾小词和语气词', sub: '-lah、-kah、pun、kan、ya、dong、sih、kok、deh、lho', rel: ['g_slang', 'g_imperative', 'g_question'], cards: [
  { h: '书面也用的三个', t: [['小词', '作用', '例子'],
    ['-lah', '缓和命令；强调前面的词', '«Duduklah.» 请坐吧。«Itulah masalahnya.» 问题就在这儿。'],
    ['-kah', '构成疑问（偏书面）', '«Benarkah?» 是真的吗？«Bisakah Anda membantu?» 您能帮忙吗？'],
    ['pun', '也；连……都', '«Saya pun tidak tahu.» 我也不知道。«Sekali pun belum pernah.» 连一次都没有过。']] },
  { h: '口语里天天听到的', t: [['小词', '语气', '例子'],
    ['«kan»', '对吧（求认同）', '«Enak, kan?» 好吃吧？'],
    ['«ya»', '好吗、哦（缓和请求或提醒）', '«Tunggu sebentar, ya.» 稍等一下哦。'],
    ['«dong»', '嘛（催促、撒娇）', '«Ayo dong!» 快点嘛！'],
    ['«sih»', '呢、倒是（缓和或追问）', '«Kenapa sih?» 到底为什么呢？'],
    ['«kok»', '怎么会（意外）；并没有（辩解）', '«Kok mahal?» 怎么这么贵？«Nggak apa-apa, kok.» 真的没事。'],
    ['«deh»', '吧（让步、决定）', '«Ya sudah, saya ikut deh.» 好吧，那我也去。'],
    ['«lho»', '哦（提醒、惊讶）', '«Sudah jam sembilan, lho.» 已经九点了哦。'],
    ['«yuk»', '走吧、来吧（邀请）', '«Makan, yuk!» 吃饭去吧！'],
    ['«nih»、«tuh»', '这儿呢、那儿呢', '«Ini nih.» 就是这个。«Itu tuh.» 就那个。']] },
  { p: '这些语气词只用在熟人之间。对长辈、客户和在邮件里，用 «ya» 就够了，其余的不要用。' }
] });

/* ---------- 数字与时间 ---------- */
REF({ id: 'num', g: 'num', zh: '数字总表', sub: '基本数字、大数字，以及中文“万、亿”怎么换算', rel: ['g_number', 'g_classifier', 'g_spec'], cards: [
  { keep: true, h: '0 到 21', t: [['数字', '读法', '数字', '读法'],
    ['0', '«nol»', '11', '«sebelas»'], ['1', '«satu»', '12', '«dua belas»'], ['2', '«dua»', '13', '«tiga belas»'], ['3', '«tiga»', '14', '«empat belas»'],
    ['4', '«empat»', '15', '«lima belas»'], ['5', '«lima»', '16', '«enam belas»'], ['6', '«enam»', '17', '«tujuh belas»'], ['7', '«tujuh»', '18', '«delapan belas»'],
    ['8', '«delapan»', '19', '«sembilan belas»'], ['9', '«sembilan»', '20', '«dua puluh»'], ['10', '«sepuluh»', '21', '«dua puluh satu»']] },
  { h: '大数字，和中文单位对照', p: '印尼语三位一进（千、百万、十亿），没有“万”和“亿”，换算时最容易错。', t: [['数字', '中文', '印尼语'],
    ['100', '一百', '«seratus»'],
    ['1.000', '一千', '«seribu»'],
    ['10.000', '一万', '«sepuluh ribu»'],
    ['100.000', '十万', '«seratus ribu»'],
    ['1.000.000', '一百万', '«satu juta»'],
    ['10.000.000', '一千万', '«sepuluh juta»'],
    ['100.000.000', '一亿', '«seratus juta»'],
    ['1.000.000.000', '十亿', '«satu miliar»'],
    ['1.000.000.000.000', '一万亿', '«satu triliun»']] },
  { h: '序数、分数、倍数', t: [['说法', '印尼语'],
    ['第一、第二、第三', '«pertama»、«kedua»、«ketiga»'],
    ['一半', '«setengah»'],
    ['四分之一', '«seperempat»'],
    ['三分之二', '«dua pertiga»'],
    ['1,5（一点五）', '«satu koma lima»'],
    ['50%', '«lima puluh persen»'],
    ['两次', '«dua kali»'],
    ['两倍', '«dua kali lipat»']],
    n: '印尼的写法：点号分千位，逗号是小数点，和中文习惯正好相反。' }
] });

REF({ id: 'cal', g: 'num', zh: '星期、月份和时间词', sub: '星期和月份首字母要大写', rel: ['g_date', 'g_clock'], cards: [
  { keep: true, h: '星期', t: [['中文', '印尼语', '中文', '印尼语'], ['星期一', '«Senin»', '星期五', '«Jumat»'], ['星期二', '«Selasa»', '星期六', '«Sabtu»'], ['星期三', '«Rabu»', '星期日', '«Minggu»'], ['星期四', '«Kamis»', '', '']] },
  { keep: true, h: '月份', t: [['中文', '印尼语', '中文', '印尼语'], ['一月', '«Januari»', '七月', '«Juli»'], ['二月', '«Februari»', '八月', '«Agustus»'], ['三月', '«Maret»', '九月', '«September»'], ['四月', '«April»', '十月', '«Oktober»'], ['五月', '«Mei»', '十一月', '«November»'], ['六月', '«Juni»', '十二月', '«Desember»']] },
  { h: '一天里的时段', t: [['时段', '大约', '问候'], ['«pagi»', '天亮到 10 点', '«Selamat pagi»'], ['«siang»', '10 点到 15 点', '«Selamat siang»'], ['«sore»', '15 点到天黑', '«Selamat sore»'], ['«malam»', '天黑以后', '«Selamat malam»']] },
  { keep: true, h: '相对的日子', t: [['中文', '印尼语', '中文', '印尼语'], ['前天', '«kemarin dulu»', '明天', '«besok»'], ['昨天', '«kemarin»', '后天', '«lusa»'], ['今天', '«hari ini»', '昨晚', '«tadi malam»'], ['现在', '«sekarang»', '今晚', '«nanti malam»'], ['上周', '«minggu lalu»', '下周', '«minggu depan»'], ['上个月', '«bulan lalu»', '明年', '«tahun depan»']] }
] });

REF({ id: 'clock', g: 'num', zh: '钟点怎么说', sub: '小心“半”：setengah dua 是一点半', rel: ['g_clock'], cards: [
  { t: [['时间', '说法', '字面意思'],
    ['1:00', '«jam satu»', '一点'],
    ['1:10', '«jam satu lewat sepuluh»', '一点过十分'],
    ['1:15', '«jam satu lewat seperempat»', '一点过一刻'],
    ['1:30', '«jam setengah dua»', '两点的一半'],
    ['1:45', '«jam dua kurang seperempat»', '两点差一刻'],
    ['1:55', '«jam dua kurang lima»', '两点差五分'],
    ['13:00', '«jam tiga belas»', '十三点（时刻表、通知里用）']] },
  { h: '钟点和时长别弄反', p: '«jam satu» 是“一点钟”，«satu jam» 是“一个小时”。同样：«jam dua» 两点，«dua jam» 两个小时；«setengah jam» 半小时；«dua jam setengah» 两个半小时。正式场合 «jam» 可以换成 «pukul»：«pukul sembilan pagi»（上午九点）。', ex: [['Rapatnya [jam setengah sepuluh].', '会议九点半开。'], ['Rapatnya [dua jam].', '会议开两个小时。']] }
] });
