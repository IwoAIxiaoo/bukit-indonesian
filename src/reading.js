/* 短文阅读：24 篇分级短文。内容由 AI 编写，没有经过印尼语母语者审校。
   每篇：id、lv（难度 a 入门 / b 生活 / c 职场与矿业）、kind（体裁）、t（印尼语标题）、zh（中文标题）、
   s（句子：[说话人, 印尼语, 中文]，不是对话时说话人留空）、g（这一篇的生词：[印尼语, 中文]）、n（可选的说明）。 */
const READS = [];
const READ_BY = {};
const READ_LEVELS = [
  ['a', '入门', '问候、介绍、数字和时间。句子短，几乎都是前几课的词。'],
  ['b', '生活', '吃饭、购物、出行、看病、办事。对话为主。'],
  ['c', '职场与矿业', '会议、班前讲话、设备报修、装船、通知和行业短新闻。']
];
function READ(o) { READS.push(o); READ_BY[o.id] = o; }

/* 各篇都可能遇到的常见词（课程里没有单独列出的） */
const READ_GLOSS = [
  ['Pak', '先生（Bapak 的简称，称呼成年男性）'],
  ['Bu', '女士（Ibu 的简称，称呼成年女性）'],
  ['lalu', '然后；过去的'],
  ['tidak apa-apa', '没关系；没事'],
  ['oh ya', '对了（想起一件事时说）'],
  ['dulu', '先……；以前'],
  ['sebaiknya', '最好……'],
  ['supaya', '为了；好让……'],
  ['selama', '在……期间；长达'],
  ['sejak', '自从'],
  ['kepada', '向；对（某人）'],
  ['pada', '在（某个时间）'],
  ['bagian', '部门；部分'],
  ['beberapa', '几个；一些'],
  ['menjadi', '变成；成为'],
  ['paling lambat', '最晚；最迟'],
  ['deras', '（雨、水流）大、急'],
  ['waktu', '时间；……的时候']
];
/* 专有名词：人名、地名、语言名，点到时只显示说明 */
const READ_NAMES = {
  'Li Wei': '人名：李伟', 'Li': '姓：李', 'Wei': '人名：伟', 'Zhang Lei': '人名：张磊', 'Zhang': '姓：张', 'Lei': '人名：磊',
  'Budi': '人名：布迪', 'Sari': '人名：莎丽', 'Rina': '人名：丽娜', 'Andi': '人名：安迪', 'Hendra': '人名：亨德拉', 'Dewi': '人名：黛薇', 'Agus': '人名：阿古斯',
  'Jakarta': '雅加达（印尼首都）', 'Surabaya': '泗水（东爪哇省首府）', 'Bandung': '万隆（西爪哇省首府）', 'Makassar': '望加锡（南苏拉威西省首府）',
  'Sulawesi': '苏拉威西岛（印尼镍矿最集中的地方）', 'Asia': '亚洲', 'Indonesia': '印度尼西亚', 'Tiongkok': '中国',
  'Inggris': '英国；bahasa Inggris 是英语', 'Mandarin': '中文普通话（bahasa Mandarin）'
};

/* ================= 入门 ================= */
READ({ id: 'kenal', lv: 'a', kind: '对话', t: 'Kenalan di kantor', zh: '在办公室认识新同事',
  s: [
    ['A', 'Selamat pagi, Pak. Nama saya Li Wei.', '早上好，先生。我叫李伟。'],
    ['B', 'Selamat pagi, Pak Li. Saya Budi. Senang bertemu dengan Anda.', '早上好，李先生。我是布迪。很高兴认识您。'],
    ['A', 'Saya juga senang. Bapak dari mana?', '我也很高兴。您是哪里人？'],
    ['B', 'Saya dari Surabaya, tapi sekarang tinggal di Jakarta.', '我来自泗水，不过现在住在雅加达。'],
    ['A', 'Saya dari Tiongkok. Saya baru dua bulan di Indonesia.', '我来自中国。我到印尼才两个月。'],
    ['B', 'Wah, bahasa Indonesia Bapak sudah bagus!', '哇，您的印尼语已经很好了！'],
    ['A', 'Terima kasih. Saya masih belajar, baru bisa sedikit.', '谢谢。我还在学，只会一点。'],
    ['B', 'Tidak apa-apa. Kalau belum mengerti, tanya saya saja.', '没关系。要是没听懂，尽管问我。']
  ],
  g: [['kenalan', '认识一下；相识的人'], ['bertemu', '见面；遇见'], ['wah', '哇（表示惊讶、赞叹）'], ['di', '在'], ['baru', '才；刚刚（另一个意思是“新”）']]
});
READ({ id: 'keluarga', lv: 'a', kind: '短文', t: 'Keluarga saya', zh: '我的家人',
  s: [
    ['', 'Nama saya Sari. Saya tinggal di Bandung bersama keluarga saya.', '我叫莎丽。我和家人住在万隆。'],
    ['', 'Ayah saya guru, dan ibu saya bekerja di bank.', '我爸爸是老师，妈妈在银行工作。'],
    ['', 'Saya punya satu kakak laki-laki dan satu adik perempuan.', '我有一个哥哥和一个妹妹。'],
    ['', 'Kakak saya sudah menikah dan punya dua anak.', '我哥哥已经结婚了，有两个孩子。'],
    ['', 'Adik saya masih mahasiswa.', '我妹妹还是大学生。'],
    ['', 'Kakek dan nenek saya tinggal di desa, tidak jauh dari sini.', '我爷爷奶奶住在乡下，离这儿不远。'],
    ['', 'Setiap hari Minggu kami makan bersama di rumah mereka.', '每个星期天我们都在他们家一起吃饭。'],
    ['', 'Saya sangat sayang keluarga saya.', '我很爱我的家人。']
  ],
  g: [['desa', '村子；乡下'], ['bekerja', '工作（动词，词根 kerja）']]
});
READ({ id: 'sehari', lv: 'a', kind: '短文', t: 'Hari-hari saya', zh: '我的一天',
  s: [
    ['', 'Setiap hari saya bangun jam enam pagi.', '我每天早上六点起床。'],
    ['', 'Saya mandi, lalu makan roti dan minum kopi.', '我洗澡，然后吃面包、喝咖啡。'],
    ['', 'Jam tujuh saya berangkat ke kantor naik motor.', '七点我骑摩托车去办公室。'],
    ['', 'Saya mulai kerja jam delapan dan istirahat jam dua belas.', '我八点开始工作，十二点休息。'],
    ['', 'Siang hari saya biasanya makan di warung dekat kantor.', '中午我一般在办公室附近的小饭馆吃饭。'],
    ['', 'Saya pulang jam lima sore, kalau tidak ada lembur.', '如果不加班，我下午五点回家。'],
    ['', 'Malam hari saya belajar bahasa Indonesia selama setengah jam.', '晚上我学半个小时印尼语。'],
    ['', 'Saya tidur jam sepuluh malam.', '我晚上十点睡觉。']
  ],
  g: [['hari-hari', '日子；每一天'], ['ke', '去；到（方向）'], ['siang hari', '中午；白天'], ['malam hari', '晚上']]
});
READ({ id: 'buah', lv: 'a', kind: '对话', t: 'Beli buah', zh: '买水果',
  s: [
    ['A', 'Permisi, Bu. Ini berapa?', '劳驾，大姐。这个多少钱？'],
    ['B', 'Mangga ini dua puluh ribu satu kilo.', '这种芒果两万一公斤。'],
    ['A', 'Kalau pisang itu berapa?', '那个香蕉呢，多少钱？'],
    ['B', 'Pisang lima belas ribu. Mau berapa kilo?', '香蕉一万五。要几公斤？'],
    ['A', 'Saya mau mangga dua kilo dan pisang satu kilo.', '我要两公斤芒果和一公斤香蕉。'],
    ['B', 'Semuanya lima puluh lima ribu rupiah.', '一共五万五千卢比。'],
    ['A', 'Ini uangnya, seratus ribu.', '给您钱，十万。'],
    ['B', 'Kembaliannya empat puluh lima ribu. Terima kasih!', '找您四万五。谢谢！']
  ],
  g: [['mangga', '芒果'], ['pisang', '香蕉'], ['kilo', '公斤'], ['semuanya', '一共；全部'], ['seratus', '一百（se- + ratus）']]
});
READ({ id: 'janji', lv: 'a', kind: '对话', t: 'Membuat janji', zh: '约个时间',
  s: [
    ['A', 'Halo, Mbak Rina. Besok ada waktu?', '喂，丽娜。明天有时间吗？'],
    ['B', 'Besok hari apa, ya?', '明天星期几来着？'],
    ['A', 'Besok hari Kamis, tanggal dua belas.', '明天星期四，十二号。'],
    ['B', 'Kamis pagi saya ada rapat. Siang bisa.', '星期四上午我有会。下午可以。'],
    ['A', 'Bagaimana kalau jam dua siang di kantor saya?', '下午两点在我办公室怎么样？'],
    ['B', 'Boleh. Nomor HP Bapak berapa?', '可以。您的手机号是多少？'],
    ['A', 'Nol delapan satu dua, tiga empat lima, enam tujuh delapan.', '零八一二，三四五，六七八。'],
    ['B', 'Baik, sudah saya simpan. Sampai jumpa besok!', '好的，我存好了。明天见！']
  ],
  g: [['membuat', '做；制作；membuat janji 是“约时间”'], ['hari apa', '星期几']]
});
READ({ id: 'kos', lv: 'a', kind: '短文', t: 'Kos saya', zh: '我住的地方',
  s: [
    ['', 'Saya tinggal di kos dekat kantor.', '我住在办公室附近的出租屋。'],
    ['', 'Kamar saya kecil, tapi bersih dan terang.', '我的房间很小，但是干净、明亮。'],
    ['', 'Di dalam kamar ada kasur, lemari, meja, dan kursi.', '房间里有床垫、柜子、桌子和椅子。'],
    ['', 'Kamar mandinya di dalam, jadi tidak perlu antre.', '卫生间在屋里，所以不用排队。'],
    ['', 'Di kos ini ada dapur bersama dan WiFi gratis.', '这个出租屋有公用厨房和免费 WiFi。'],
    ['', 'Sewanya satu juta lima ratus ribu rupiah per bulan, sudah termasuk listrik.', '房租每月一百五十万卢比，已经包含电费。'],
    ['', 'Ibu kosnya baik dan sering memberi saya buah.', '房东太太人很好，常常给我水果。'],
    ['', 'Saya senang tinggal di sini.', '我喜欢住在这里。']
  ],
  g: [['per', '每（per bulan 每月）'], ['termasuk', '包括；包含在内'], ['ibu kos', '（出租屋的）房东太太'], ['di sini', '在这里']]
});
READ({ id: 'andi', lv: 'a', kind: '短文', t: 'Teman saya, Andi', zh: '我的朋友安迪',
  s: [
    ['', 'Ini teman saya. Namanya Andi.', '这是我的朋友。他叫安迪。'],
    ['', 'Dia orang Makassar dan umurnya tiga puluh tahun.', '他是望加锡人，今年三十岁。'],
    ['', 'Andi bekerja sebagai insinyur di perusahaan tambang.', '安迪在一家矿业公司当工程师。'],
    ['', 'Orangnya tinggi, dan dia selalu pakai baju biru.', '他个子很高，总是穿蓝色的衣服。'],
    ['', 'Dia bisa bahasa Inggris dan sedikit bahasa Mandarin.', '他会英语，还会一点中文。'],
    ['', 'Andi suka makan ikan, tapi tidak suka makanan manis.', '安迪喜欢吃鱼，但不喜欢甜食。'],
    ['', 'Kalau saya tidak mengerti, dia selalu membantu saya.', '我不懂的时候，他总是帮我。'],
    ['', 'Kami sering minum kopi bersama setelah kerja.', '我们常常下班后一起喝咖啡。']
  ],
  g: [['sebagai', '作为；担任'], ['makanan', '食物（makan + -an）']]
});
READ({ id: 'sabtu', lv: 'a', kind: '对话', t: 'Rencana akhir pekan', zh: '周末的打算',
  s: [
    ['A', 'Hari Sabtu ini kamu mau ke mana?', '这个星期六你要去哪儿？'],
    ['B', 'Saya belum tahu. Mungkin di rumah saja.', '我还不知道。可能就待在家里。'],
    ['A', 'Saya dan teman-teman mau ke pantai. Mau ikut?', '我和朋友们要去海边。想一起去吗？'],
    ['B', 'Mau! Berangkat jam berapa?', '想！几点出发？'],
    ['A', 'Jam tujuh pagi. Kita naik mobil saya.', '早上七点。我们坐我的车。'],
    ['B', 'Pantainya jauh, tidak?', '海边远不远？'],
    ['A', 'Tidak terlalu jauh, kira-kira dua jam dari sini.', '不太远，离这儿大约两个小时。'],
    ['B', 'Baik. Saya bawa makanan dan minuman, ya.', '好。那我带吃的和喝的。']
  ],
  g: [['rencana', '计划；打算'], ['akhir pekan', '周末'], ['teman-teman', '朋友们（重复表示复数）'], ['minuman', '饮料（minum + -an）'], ['makanan', '食物（makan + -an）']]
});

/* ================= 生活 ================= */
READ({ id: 'warung', lv: 'b', kind: '对话', t: 'Makan di warung', zh: '在小饭馆点菜',
  s: [
    ['A', 'Selamat siang. Mau pesan apa, Pak?', '中午好。先生要点什么？'],
    ['B', 'Saya mau nasi goreng ayam satu.', '我要一份鸡肉炒饭。'],
    ['A', 'Pedas atau tidak pedas?', '要辣的还是不辣的？'],
    ['B', 'Jangan terlalu pedas, ya. Sambalnya sedikit saja.', '别太辣。辣椒酱少放一点。'],
    ['A', 'Baik. Minumnya apa?', '好的。喝什么？'],
    ['B', 'Es teh manis satu. Gulanya sedikit saja.', '一杯甜冰茶。少放点糖。'],
    ['A', 'Makan di sini atau dibungkus?', '在这儿吃还是打包？'],
    ['B', 'Makan di sini. Oh ya, bisa bayar pakai kartu?', '在这儿吃。对了，可以刷卡吗？'],
    ['A', 'Maaf, Pak, di sini hanya bisa tunai.', '不好意思，先生，这里只收现金。']
  ],
  g: [['nasi goreng', '炒饭'], ['es teh manis', '甜冰茶'], ['dibungkus', '打包（被动，词根 bungkus）'], ['di sini', '在这里']]
});
READ({ id: 'batik', lv: 'b', kind: '对话', t: 'Tawar-menawar di pasar', zh: '在市场砍价',
  s: [
    ['A', 'Bu, baju batik ini harganya berapa?', '大姐，这件蜡染衫多少钱？'],
    ['B', 'Yang itu dua ratus ribu, Mas. Bahannya bagus.', '那件二十万，小哥。料子很好。'],
    ['A', 'Wah, mahal sekali. Boleh kurang?', '哇，太贵了。能便宜点吗？'],
    ['B', 'Mas mau berapa?', '你想出多少？'],
    ['A', 'Seratus dua puluh ribu, bagaimana?', '十二万，怎么样？'],
    ['B', 'Belum bisa, Mas. Seratus tujuh puluh, ya.', '还不行，小哥。十七万吧。'],
    ['A', 'Kalau saya beli dua, seratus lima puluh satu?', '要是我买两件，一件十五万行吗？'],
    ['B', 'Ya sudah, boleh. Mau warna apa?', '行吧，可以。要什么颜色？'],
    ['A', 'Satu biru dan satu cokelat. Ada ukuran besar?', '一件蓝的，一件棕的。有大号吗？'],
    ['B', 'Ada. Tunggu sebentar, saya ambilkan.', '有。稍等，我给你拿。']
  ],
  g: [['tawar-menawar', '讨价还价'], ['batik', '蜡染布；蜡染衫（印尼传统服饰）'], ['bahan', '材料；料子'], ['wah', '哇（表示惊讶）'], ['seratus', '一百（se- + ratus）'], ['ya sudah', '那好吧；行吧'], ['ambilkan', '替（别人）拿（ambil + -kan）']]
});
READ({ id: 'bandara', lv: 'b', kind: '对话', t: 'Naik taksi ke bandara', zh: '打车去机场',
  s: [
    ['A', 'Selamat pagi, Pak. Mau ke mana?', '早上好，先生。去哪儿？'],
    ['B', 'Ke bandara, Pak. Kira-kira berapa lama?', '去机场，师傅。大概要多久？'],
    ['A', 'Kalau tidak macet, empat puluh menit.', '不堵车的话，四十分钟。'],
    ['B', 'Pesawat saya jam sepuluh. Masih sempat?', '我的飞机是十点。还来得及吗？'],
    ['A', 'Masih, Pak. Kita lewat jalan tol saja supaya lebih cepat.', '来得及，先生。我们走高速吧，快一些。'],
    ['B', 'Boleh. Tolong AC-nya agak dingin, ya.', '行。麻烦把空调开凉一点。'],
    ['A', 'Baik. Bapak turun di terminal berapa?', '好的。您在几号航站楼下车？'],
    ['B', 'Terminal tiga. Berhenti di depan pintu keberangkatan saja.', '三号航站楼。停在出发大厅门口就行。'],
    ['A', 'Sudah sampai, Pak. Semuanya seratus delapan puluh ribu, sudah termasuk tol.', '到了，先生。一共十八万，已经含过路费。']
  ],
  g: [['berapa lama', '多久'], ['sempat', '来得及；有空'], ['jalan tol', '收费高速公路'], ['tol', '过路费；高速公路'], ['lebih', '更；比较'], ['AC', '空调（读作 a-se）'], ['terminal', '航站楼；车站'], ['keberangkatan', '出发（berangkat 的名词）'], ['semuanya', '一共；全部'], ['seratus', '一百'], ['termasuk', '包括']]
});
READ({ id: 'dokter', lv: 'b', kind: '对话', t: 'Periksa ke dokter', zh: '看医生',
  s: [
    ['A', 'Selamat sore. Apa keluhannya, Pak?', '下午好。先生哪里不舒服？'],
    ['B', 'Saya demam dan batuk sejak dua hari yang lalu, Dok.', '医生，我从两天前开始发烧、咳嗽。'],
    ['A', 'Kepalanya pusing? Perutnya mual?', '头晕吗？恶心吗？'],
    ['B', 'Kepala saya pusing, tapi perut tidak apa-apa.', '我头晕，不过肚子没事。'],
    ['A', 'Saya periksa dulu, ya. Ada alergi obat?', '我先检查一下。有药物过敏吗？'],
    ['B', 'Tidak ada, Dok.', '没有，医生。'],
    ['A', 'Ini hanya flu biasa. Obatnya diminum tiga kali sehari setelah makan.', '这只是普通感冒。药一天吃三次，饭后吃。'],
    ['B', 'Apakah saya boleh masuk kerja besok?', '我明天可以上班吗？'],
    ['A', 'Sebaiknya istirahat dulu dua hari dan banyak minum air.', '最好先休息两天，多喝水。'],
    ['B', 'Baik, Dok. Terima kasih.', '好的，医生。谢谢。']
  ],
  g: [['keluhan', '（身体的）不适；抱怨'], ['Dok', '医生（当面称呼，dokter 的简称）'], ['yang lalu', '……以前（dua hari yang lalu 两天前）'], ['flu', '流感；感冒'], ['biasa', '普通的；平常'], ['diminum', '（药）服用；被喝（词根 minum）'], ['kali', '次'], ['sehari', '一天（se- + hari）'], ['masuk kerja', '上班']]
});
READ({ id: 'hotel', lv: 'b', kind: '对话', t: 'Check-in di hotel', zh: '酒店入住',
  s: [
    ['A', 'Selamat malam. Ada yang bisa saya bantu?', '晚上好。有什么可以帮您？'],
    ['B', 'Saya sudah pesan kamar atas nama Zhang Lei.', '我订了房间，名字是张磊。'],
    ['A', 'Baik, Pak Zhang. Boleh saya lihat paspornya?', '好的，张先生。可以看一下您的护照吗？'],
    ['B', 'Ini. Kamarnya untuk dua malam, ya?', '给。房间是住两晚，对吧？'],
    ['A', 'Betul. Kamar Bapak nomor lima nol tiga, di lantai lima.', '对。您的房间是五零三，在五楼。'],
    ['B', 'Sarapannya jam berapa?', '早餐是几点？'],
    ['A', 'Sarapan dari jam enam sampai jam sepuluh di restoran lantai satu.', '早餐从六点到十点，在一楼餐厅。'],
    ['B', 'Oh ya, kata sandi WiFi-nya apa?', '对了，WiFi 密码是什么？'],
    ['A', 'Ada di kartu kunci ini. Selamat beristirahat, Pak.', '在这张房卡上。祝您休息好，先生。']
  ],
  g: [['check-in', '办理入住'], ['atas nama', '以……的名字'], ['betul', '对；没错'], ['sarapan', '早餐；吃早餐'], ['kartu kunci', '房卡'], ['beristirahat', '休息（动词，词根 istirahat）']]
});
READ({ id: 'hujan', lv: 'b', kind: '短文', t: 'Musim hujan', zh: '雨季',
  s: [
    ['', 'Sekarang sudah masuk musim hujan.', '现在已经进入雨季了。'],
    ['', 'Hampir setiap sore hujan turun, kadang-kadang dengan petir.', '几乎每天下午都下雨，有时候还打雷。'],
    ['', 'Kalau hujan deras, jalan di depan kantor sering banjir.', '雨下得大的时候，办公室前面的路常常积水。'],
    ['', 'Jalan menjadi macet dan banyak orang terlambat pulang.', '路上堵车，很多人回家晚了。'],
    ['', 'Karena itu saya selalu membawa payung dan jas hujan di dalam tas.', '所以我总是在包里带着雨伞和雨衣。'],
    ['', 'Kemarin saya lupa membawa payung dan kehujanan di jalan.', '昨天我忘了带伞，在路上被雨淋了。'],
    ['', 'Baju saya basah semua, dan malamnya saya masuk angin.', '我的衣服全湿了，晚上就着凉了。'],
    ['', 'Tapi setelah hujan, udara menjadi sejuk dan enak.', '不过下过雨以后，空气变得凉爽舒服。']
  ],
  g: [['karena itu', '因此；所以'], ['jas hujan', '雨衣'], ['malamnya', '当天晚上']]
});
READ({ id: 'imigrasi', lv: 'b', kind: '对话', t: 'Di kantor imigrasi', zh: '在移民局延期',
  s: [
    ['A', 'Selamat pagi. Saya mau memperpanjang izin tinggal.', '早上好。我想延期居留许可。'],
    ['B', 'Silakan ambil nomor antrean dulu, lalu isi formulir ini.', '请先取排队号，然后填这张表。'],
    ['A', 'Syaratnya apa saja, Bu?', '需要哪些材料，女士？'],
    ['B', 'Paspor asli, fotokopi paspor, dan surat dari perusahaan.', '护照原件、护照复印件，还有公司出具的信函。'],
    ['A', 'Semua sudah saya bawa. Biayanya berapa?', '我都带来了。费用是多少？'],
    ['B', 'Biayanya dibayar di bank, bukan di sini. Ini tagihannya.', '费用在银行交，不在这里。这是缴费单。'],
    ['A', 'Prosesnya berapa lama?', '办理要多长时间？'],
    ['B', 'Kira-kira lima hari kerja. Nanti kami kirim pesan ke HP Bapak.', '大约五个工作日。到时候我们给您手机发信息。'],
    ['A', 'Baik. Terima kasih atas bantuannya.', '好的。谢谢您的帮助。']
  ],
  g: [['memperpanjang', '延长；延期（词根 panjang）'], ['antrean', '排队；队伍（nomor antrean 排队号）'], ['apa saja', '有哪些；任何'], ['dibayar', '被支付（词根 bayar）'], ['proses', '过程；办理'], ['berapa lama', '多久'], ['hari kerja', '工作日'], ['pesan', '信息；留言（另一个意思是“点、订”）'], ['atas', '对于（terima kasih atas… 感谢……）；上面'], ['bantuan', '帮助（名词，词根 bantu）'], ['di sini', '在这里']],
  n: '各地移民局的具体手续和费用不一样，这里只是练习用的对话，办事请以当地要求为准。'
});
READ({ id: 'lebaran', lv: 'b', kind: '短文', t: 'Lebaran di Indonesia', zh: '印尼的开斋节',
  s: [
    ['', 'Lebaran adalah hari raya paling besar bagi umat Islam di Indonesia.', '开斋节是印尼穆斯林最盛大的节日。'],
    ['', 'Sebelum Lebaran, umat Islam berpuasa selama satu bulan.', '开斋节之前，穆斯林要斋戒一个月。'],
    ['', 'Menjelang Lebaran, banyak orang mudik ke kampung halaman.', '开斋节前夕，很多人回老家。'],
    ['', 'Jalan, stasiun, dan bandara menjadi sangat ramai.', '公路、火车站和机场都变得非常拥挤。'],
    ['', 'Karyawan biasanya menerima THR dari perusahaan.', '员工一般会收到公司发的节日津贴。'],
    ['', 'Pada hari Lebaran, orang saling berkunjung dan meminta maaf.', '开斋节当天，人们互相走访、请求原谅。'],
    ['', 'Mereka berkata, "Mohon maaf lahir dan batin."', '他们说：“请原谅我身心的过错。”'],
    ['', 'Kantor dan banyak toko libur beberapa hari.', '办公室和很多商店放假几天。'],
    ['', 'Kalau ada urusan penting, sebaiknya diselesaikan sebelum libur.', '如果有重要的事，最好在放假前办完。']
  ],
  g: [['adalah', '是（书面语里连接主语和名词）'], ['hari raya', '节日'], ['bagi', '对于'], ['umat', '信徒；教众'], ['berpuasa', '斋戒（动词，词根 puasa）'], ['menjelang', '临近；……前夕'], ['kampung halaman', '老家；故乡'], ['saling', '互相'], ['berkunjung', '拜访；走访'], ['meminta', '请求；要（词根 minta）'], ['berkata', '说'], ['batin', '内心（lahir dan batin 指“身与心”）'], ['urusan', '事情；事务'], ['penting', '重要'], ['diselesaikan', '被完成；办完（词根 selesai）']]
});

/* ================= 职场与矿业 ================= */
READ({ id: 'rapat', lv: 'c', kind: '对话', t: 'Menyiapkan rapat', zh: '准备开会',
  s: [
    ['A', 'Pak Hendra, rapat dengan klien jadi hari apa?', '亨德拉先生，和客户的会定在哪天？'],
    ['B', 'Hari Rabu jam sepuluh pagi, di ruang rapat lantai tiga.', '星期三上午十点，在三楼会议室。'],
    ['A', 'Siapa saja yang ikut?', '都有谁参加？'],
    ['B', 'Saya, Bu Dewi dari bagian keuangan, dan dua orang dari pihak klien.', '我、财务部的黛薇女士，还有客户方的两个人。'],
    ['A', 'Laporan bulan lalu sudah selesai?', '上个月的报告做完了吗？'],
    ['B', 'Hampir selesai. Tinggal data produksi minggu terakhir.', '快做完了。只差最后一周的生产数据。'],
    ['A', 'Tolong kirim ke email saya paling lambat besok sore.', '请最晚明天下午发到我邮箱。'],
    ['B', 'Baik, Pak. Kontraknya juga perlu saya siapkan?', '好的，先生。合同也需要我准备吗？'],
    ['A', 'Ya, bawa dua rangkap. Kalau semua setuju, langsung kita tanda tangan.', '要，带两份。如果大家都同意，我们当场就签。']
  ],
  g: [['menyiapkan', '准备（词根 siap）'], ['jadi', '定下来；成（另一个意思是“所以”）'], ['hari apa', '星期几；哪天'], ['ruang rapat', '会议室'], ['siapa saja', '有哪些人'], ['keuangan', '财务（词根 uang）'], ['bulan lalu', '上个月'], ['tinggal', '只剩；只差（另一个意思是“住”）'], ['data', '数据'], ['terakhir', '最后的'], ['rangkap', '（文件的）份']]
});
READ({ id: 'briefing', lv: 'c', kind: '讲话', t: 'Pengarahan keselamatan pagi', zh: '班前安全讲话',
  s: [
    ['', 'Selamat pagi semuanya. Sebelum mulai kerja, mohon perhatiannya sebentar.', '大家早上好。开工之前，请大家注意听一下。'],
    ['', 'Hari ini kita bekerja di area pengupasan sebelah utara.', '今天我们在北侧的剥离区作业。'],
    ['', 'Semua pekerja wajib memakai APD lengkap: helm, rompi, kacamata, dan sepatu keselamatan.', '所有工人必须穿戴齐全的劳保用品：安全帽、反光背心、护目镜和安全鞋。'],
    ['', 'Tadi malam hujan deras, jadi jalan hauling masih licin.', '昨晚下了大雨，所以运输道路还很滑。'],
    ['', 'Sopir truk harap mengurangi kecepatan dan menjaga jarak.', '请卡车司机减速并保持车距。'],
    ['', 'Dilarang berdiri di dekat alat berat yang sedang bekerja.', '禁止站在正在作业的重型设备附近。'],
    ['', 'Kalau melihat bahaya, segera lapor kepada pengawas.', '如果发现危险，立刻向安全员报告。'],
    ['', 'Titik kumpul darurat ada di depan kantor lapangan.', '紧急集合点在现场办公室前面。'],
    ['', 'Ada pertanyaan? Kalau tidak ada, selamat bekerja dan utamakan keselamatan.', '有问题吗？没有的话，祝大家工作顺利，安全第一。']
  ],
  g: [['pengarahan', '交底；指示说明（现场也常直接说 briefing）'], ['semuanya', '大家；全部'], ['perhatian', '注意；关注'], ['area', '区域'], ['sebelah', '……一侧；旁边'], ['utara', '北'], ['memakai', '穿戴；使用（词根 pakai）'], ['lengkap', '齐全；完整'], ['tadi malam', '昨晚'], ['licin', '滑'], ['mengurangi', '减少；降低（词根 kurang）'], ['kecepatan', '速度（词根 cepat）'], ['menjaga', '保持；看守'], ['jarak', '距离'], ['melihat', '看见（词根 lihat）'], ['kantor lapangan', '现场办公室'], ['lapangan', '现场；场地'], ['pertanyaan', '问题（词根 tanya）'], ['utamakan', '把……放在首位（utamakan keselamatan 安全第一）']]
});
READ({ id: 'mogok', lv: 'c', kind: '对话', t: 'Ekskavator mogok', zh: '挖掘机坏了',
  s: [
    ['A', 'Halo, bengkel? Ekskavator nomor tujuh mogok di pit dua.', '喂，修理厂吗？七号挖掘机在二号采坑抛锚了。'],
    ['B', 'Kerusakannya apa, Pak?', '是什么故障，先生？'],
    ['A', 'Mesinnya tiba-tiba mati, dan ada oli bocor di bawah.', '发动机突然熄火，下面还有机油漏出来。'],
    ['B', 'Selang hidroliknya sudah dicek?', '液压管检查过了吗？'],
    ['A', 'Sudah. Sepertinya selangnya pecah dan harus diganti.', '检查了。好像是管子爆了，得换。'],
    ['B', 'Baik. Suku cadangnya ada di gudang. Mekanik segera ke sana.', '好的。配件仓库里有。修理工马上过去。'],
    ['A', 'Kira-kira berapa lama perbaikannya?', '大概要修多久？'],
    ['B', 'Kalau hanya ganti selang, sekitar dua jam.', '如果只是换管子，两个小时左右。'],
    ['A', 'Tolong secepatnya, ya. Target produksi hari ini masih kurang.', '请尽快。今天的生产目标还没完成。'],
    ['B', 'Siap, Pak. Nanti saya kabari kalau sudah selesai.', '明白，先生。修好了我通知您。']
  ],
  g: [['pit', '采坑（矿上直接用英语 pit）'], ['tiba-tiba', '突然'], ['hidrolik', '液压'], ['dicek', '被检查（词根 cek）'], ['sepertinya', '好像；看起来'], ['pecah', '破裂；爆'], ['diganti', '被更换（词根 ganti）'], ['ke sana', '去那里'], ['berapa lama', '多久'], ['secepatnya', '尽快（词根 cepat）'], ['hari ini', '今天'], ['siap', '明白；准备好了（下级回答上级时常用）'], ['kabari', '通知；告诉一声（词根 kabar）']]
});
READ({ id: 'tongkang', lv: 'c', kind: '对话', t: 'Muat tongkang', zh: '驳船装货进度',
  s: [
    ['A', 'Pak Agus, tongkang yang kedua sudah selesai muat?', '阿古斯先生，第二艘驳船装完了吗？'],
    ['B', 'Belum, Pak. Baru enam ribu ton dari target delapan ribu.', '还没有，先生。目标八千吨，才装了六千吨。'],
    ['A', 'Kenapa terlambat?', '为什么晚了？'],
    ['B', 'Tadi siang hujan, jadi pemuatan berhenti tiga jam.', '中午下雨了，所以装货停了三个小时。'],
    ['A', 'Kapal induknya tiba kapan?', '母船什么时候到？'],
    ['B', 'Menurut jadwal, besok pagi jam enam.', '按计划是明天早上六点。'],
    ['A', 'Kalau begitu, tongkang harus berangkat malam ini.', '那样的话，驳船今晚必须出发。'],
    ['B', 'Bisa, Pak. Kami tambah satu shift supaya selesai sebelum jam sepuluh malam.', '可以，先生。我们加一个班，争取晚上十点前装完。'],
    ['A', 'Baik. Surveyor sudah mengambil sampel?', '好。检验员取样了吗？'],
    ['B', 'Sudah. Hasil kalori dan kadar airnya keluar besok.', '取了。热值和水分的结果明天出来。']
  ],
  g: [['baru', '才；刚刚（另一个意思是“新”）'], ['tadi siang', '今天中午（已经过去的）'], ['pemuatan', '装货（muat 的名词）'], ['tiba', '到达'], ['kalau begitu', '那样的话'], ['malam ini', '今晚'], ['mengambil', '取；拿（词根 ambil）'], ['hasil', '结果']]
});
READ({ id: 'umum', lv: 'c', kind: '通知', t: 'Pengumuman aturan baru', zh: '矿区新规定通知',
  s: [
    ['', 'Pengumuman untuk seluruh karyawan dan kontraktor.', '致全体员工和承包商的通知。'],
    ['', 'Mulai hari Senin, tanggal tiga, berlaku aturan baru di area tambang.', '从三号星期一起，矿区实行新规定。'],
    ['', 'Semua kendaraan wajib menyalakan lampu, siang dan malam.', '所有车辆必须开灯，白天晚上都一样。'],
    ['', 'Kecepatan paling tinggi di jalan hauling adalah empat puluh kilometer per jam.', '运输道路上的最高时速是四十公里。'],
    ['', 'Pada waktu hujan deras, pekerjaan di dekat lereng dihentikan sementara.', '下大雨时，边坡附近的作业暂时停止。'],
    ['', 'Setiap pekerja harus mengikuti pengarahan keselamatan sebelum mulai shift.', '每名工人上班前都必须参加安全交底。'],
    ['', 'Pekerja yang melanggar aturan akan dikenai sanksi.', '违反规定的工人将受到处罚。'],
    ['', 'Jika ada pertanyaan, silakan hubungi bagian keselamatan kerja.', '如有疑问，请联系安全部门。'],
    ['', 'Terima kasih atas perhatian dan kerja samanya.', '感谢大家的关注与配合。']
  ],
  g: [['pengumuman', '通知；公告'], ['seluruh', '全体；整个'], ['kontraktor', '承包商'], ['area', '区域'], ['kendaraan', '车辆'], ['menyalakan', '打开（灯、机器；词根 nyala）'], ['kecepatan', '速度'], ['adalah', '是（书面语）'], ['kilometer', '公里'], ['per', '每'], ['dihentikan', '被停止（词根 henti）'], ['sementara', '暂时'], ['mengikuti', '参加；跟随（词根 ikut）'], ['pengarahan', '交底；指示说明'], ['melanggar', '违反'], ['dikenai', '被处以；被施加'], ['jika', '如果（比 kalau 正式）'], ['hubungi', '联系'], ['atas', '对于（terima kasih atas…）'], ['perhatian', '关注；注意'], ['pertanyaan', '问题']]
});
READ({ id: 'kabar-bara', lv: 'c', kind: '短新闻', t: 'Produksi batu bara naik', zh: '煤炭产量上升',
  s: [
    ['', 'Produksi batu bara perusahaan itu meningkat pada kuartal kedua tahun ini.', '该公司今年第二季度的煤炭产量有所增加。'],
    ['', 'Menurut laporan perusahaan, produksi mencapai lima juta ton.', '根据公司报告，产量达到五百万吨。'],
    ['', 'Angka itu naik sekitar sepuluh persen dibanding kuartal yang sama tahun lalu.', '这个数字比去年同季度增长了约百分之十。'],
    ['', 'Kenaikan ini terjadi karena cuaca lebih kering dan alat berat bertambah.', '增长的原因是天气比较干燥、重型设备增加了。'],
    ['', 'Sebagian besar batu bara dijual ke pembeli di dalam negeri untuk PLTU.', '大部分煤炭卖给了国内买家，用于燃煤电厂。'],
    ['', 'Sisanya diekspor ke beberapa negara di Asia.', '其余的出口到亚洲的几个国家。'],
    ['', 'Namun, harga batu bara menurun sejak awal tahun.', '不过，煤炭价格从年初开始下降。'],
    ['', 'Karena itu, perusahaan akan mengurangi biaya pengangkutan.', '因此，公司将降低运输成本。'],
    ['', 'Perusahaan tetap menargetkan produksi dua puluh juta ton tahun ini.', '公司仍把今年的产量目标定在两千万吨。']
  ],
  g: [['naik', '上升；上涨（另一个意思是“乘坐”）'], ['tahun ini', '今年'], ['angka', '数字'], ['persen', '百分之……'], ['sama', '相同'], ['tahun lalu', '去年'], ['terjadi', '发生'], ['lebih', '更；比较'], ['bertambah', '增加（词根 tambah）'], ['sebagian besar', '大部分'], ['dijual', '被卖（词根 jual）'], ['dalam negeri', '国内'], ['negeri', '国家；国内'], ['diekspor', '被出口（词根 ekspor）'], ['negara', '国家'], ['namun', '然而；不过（书面语）'], ['awal', '开头；初'], ['karena itu', '因此'], ['mengurangi', '减少；降低'], ['tetap', '仍然；保持'], ['menargetkan', '把……定为目标（词根 target）']],
  n: '这是练习用的仿写新闻，公司和数字都是虚构的。'
});
READ({ id: 'kabar-nikel', lv: 'c', kind: '短新闻', t: 'Smelter nikel baru di Sulawesi', zh: '苏拉威西新建镍冶炼厂',
  s: [
    ['', 'Sebuah perusahaan patungan akan membangun smelter nikel baru di Sulawesi.', '一家合资公司将在苏拉威西新建一座镍冶炼厂。'],
    ['', 'Nilai investasinya sekitar sepuluh triliun rupiah.', '投资额约为十万亿卢比。'],
    ['', 'Smelter itu akan mengolah bijih nikel menjadi bahan baku baterai kendaraan listrik.', '这座冶炼厂将把镍矿石加工成电动车电池的原料。'],
    ['', 'Pembangunan direncanakan mulai tahun depan dan selesai dalam dua tahun.', '建设计划明年开始，两年内完成。'],
    ['', 'Pabrik ini diperkirakan membutuhkan sekitar dua ribu tenaga kerja.', '这座工厂预计需要约两千名工人。'],
    ['', 'Pemerintah melarang ekspor bijih nikel mentah untuk mendorong hilirisasi.', '政府禁止出口未加工的镍矿石，以推动下游化。'],
    ['', 'Menurut pihak perusahaan, sebagian besar pekerja akan berasal dari masyarakat sekitar.', '公司方面表示，大部分工人将来自周边社区。'],
    ['', 'Perusahaan juga wajib mengelola limbah sesuai dengan AMDAL.', '公司还必须按照环评要求处理废弃物。']
  ],
  g: [['sebuah', '一个；一座（se- + buah，量词）'], ['membangun', '建设；建造'], ['nilai', '价值；金额'], ['mengolah', '加工；处理（词根 olah）'], ['pembangunan', '建设（名词）'], ['direncanakan', '被计划（词根 rencana）'], ['tahun depan', '明年'], ['dalam', '在……之内（另一个意思是“里面”）'], ['sekitar', '大约；周围、附近'], ['diperkirakan', '预计；据估计（词根 kira）'], ['membutuhkan', '需要（词根 butuh）'], ['tenaga kerja', '劳动力；工人'], ['pemerintah', '政府'], ['mendorong', '推动（词根 dorong）'], ['sebagian besar', '大部分'], ['berasal', '来自（词根 asal）'], ['mengelola', '管理；处理'], ['sesuai dengan', '按照；符合']],
  n: '这是练习用的仿写新闻，公司和数字都是虚构的。'
});
READ({ id: 'rkab', lv: 'c', kind: '公文', t: 'Pengingat pengajuan RKAB', zh: '提醒申报 RKAB 的内部信',
  s: [
    ['', 'Kepada Yth. Bapak Direktur,', '尊敬的总经理先生：'],
    ['', 'Dengan hormat, kami ingin mengingatkan jadwal pengajuan RKAB.', '您好，我们想提醒您工作计划与预算（RKAB）的申报时间。'],
    ['', 'Dokumen harus diajukan kepada Kementerian ESDM sebelum akhir bulan ini.', '文件必须在本月底之前提交给能矿部。'],
    ['', 'Data cadangan dan rencana produksi sudah kami siapkan.', '储量数据和生产计划我们已经准备好了。'],
    ['', 'Yang masih kurang adalah laporan reklamasi dan bukti pembayaran royalti.', '还缺的是复垦报告和权利金缴纳凭证。'],
    ['', 'Mohon bagian keuangan mengirimkan bukti tersebut paling lambat hari Jumat.', '请财务部最晚星期五把凭证发过来。'],
    ['', 'Tanpa persetujuan RKAB, perusahaan tidak boleh berproduksi atau menjual batu bara.', '没有 RKAB 批复，公司不得生产或销售煤炭。'],
    ['', 'Jika ada perubahan, akan segera kami laporkan.', '如有变化，我们会立即报告。'],
    ['', 'Atas perhatian Bapak, kami ucapkan terima kasih.', '感谢您的关注。'],
    ['', 'Hormat kami, Bagian Perizinan.', '此致敬礼，证照部。']
  ],
  g: [['pengingat', '提醒（名词，词根 ingat）'], ['pengajuan', '申报；提交（名词）'], ['Yth.', '尊敬的（Yang terhormat 的缩写，读作 yang terhormat）'], ['dengan hormat', '您好；谨启（公文开头的敬语）'], ['hormat', '尊敬；敬意'], ['mengingatkan', '提醒（词根 ingat）'], ['diajukan', '被提交（词根 aju）'], ['akhir', '末尾；结束'], ['bulan ini', '这个月'], ['data', '数据'], ['rencana', '计划'], ['adalah', '是（书面语）'], ['bukti', '凭证；证据'], ['pembayaran', '支付；缴纳（词根 bayar）'], ['keuangan', '财务'], ['mengirimkan', '发送；寄（词根 kirim）'], ['tersebut', '上述的；该'], ['persetujuan', '批准；同意（词根 setuju）'], ['berproduksi', '进行生产'], ['menjual', '卖（词根 jual）'], ['jika', '如果（正式）'], ['perubahan', '变化；变更（词根 ubah）'], ['laporkan', '报告（动词，词根 lapor）'], ['atas', '对于'], ['perhatian', '关注'], ['ucapkan', '说；表达（kami ucapkan terima kasih 我们表示感谢）'], ['hormat kami', '此致敬礼（信末敬语）'], ['perizinan', '证照；许可事务（词根 izin）']],
  n: '公文格式是常见写法的仿写。RKAB 的申报期限和要求以能矿部的现行规定为准。'
});
