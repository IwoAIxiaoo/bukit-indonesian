/* 短对话（一）：第 1–10 课。由 AI 编写，没有经过印尼语母语者审校。每段尽量用上这一课按顺序每 8 个词分出的那一组词。 */

/* ---------- 问候与礼貌 ---------- */
DLG('greet', 1, '什么时候说哪句问候', [
  ['A', 'Halo, Bu Guru. Apa kabar?', '老师您好，您好吗？'],
  ['B', 'Baik, terima kasih. Ada pertanyaan?', '很好，谢谢。有问题吗？'],
  ['A', 'Jam sembilan saya bilang apa?', '九点钟我该说什么？'],
  ['B', 'Selamat pagi.', '早上好。'],
  ['A', 'Kalau jam satu siang?', '那中午一点呢？'],
  ['B', 'Selamat siang. Jam empat selamat sore.', '中午好。四点说下午好。'],
  ['A', 'Dan jam delapan malam, selamat malam?', '晚上八点就说晚上好？'],
  ['B', 'Betul. Bagus sekali!', '对。非常好！']
]);
DLG('greet', 2, '在酒店前台', [
  ['A', 'Selamat datang di hotel kami, Pak.', '先生，欢迎光临我们酒店。'],
  ['B', 'Terima kasih. Permisi, kamar saya di mana?', '谢谢。劳驾，我的房间在哪儿？'],
  ['A', 'Mohon tunggu sebentar. Silakan duduk dulu.', '请稍等。请先坐。'],
  ['B', 'Maaf, boleh tolong bawa koper saya?', '不好意思，能帮我拿一下行李箱吗？'],
  ['A', 'Tentu. Ini kuncinya, Pak.', '当然。这是钥匙，先生。'],
  ['B', 'Terima kasih banyak.', '非常感谢。'],
  ['A', 'Sama-sama. Sampai jumpa besok pagi.', '不客气。明早见。']
]);
DLG('greet', 3, '送朋友回国', [
  ['A', 'Senang kenal dengan kamu, Dewi.', '黛薇，很高兴认识你。'],
  ['B', 'Ya, saya juga senang. Kapan kamu kembali?', '是啊，我也很高兴。你什么时候回来？'],
  ['A', 'Belum tahu. Tunggu sebentar, ini oleh-oleh untuk kamu.', '还不知道。等一下，这是给你的礼物。'],
  ['B', 'Wah, tidak usah repot. Terima kasih!', '哇，不用这么客气。谢谢！'],
  ['A', 'Sama-sama. Saya pergi dulu. Selamat tinggal!', '不客气。我先走了。再见！'],
  ['B', 'Selamat jalan! Hati-hati di jalan, ya.', '一路平安！路上小心。']
]);

/* ---------- 人称与自我介绍 ---------- */
DLG('people', 1, '我们、咱们、他们', [
  ['A', 'Saya dari Tiongkok. Kamu dari mana?', '我来自中国。你从哪里来？'],
  ['B', 'Aku dari Bandung. Dia teman saya, Rina.', '我来自万隆。她是我的朋友丽娜。'],
  ['A', 'Halo, Rina. Anda juga dari Bandung?', '你好，丽娜。您也来自万隆吗？'],
  ['B', 'Ya, kami berdua dari Bandung.', '是的，我们俩都来自万隆。'],
  ['A', 'Mereka di sana siapa?', '那边那些人是谁？'],
  ['B', 'Mereka teman kantor kami.', '他们是我们的公司同事。'],
  ['A', 'Ayo, kita makan bersama!', '走，咱们一起吃饭吧！']
]);
DLG('people', 2, '称呼和名字', [
  ['A', 'Permisi, Bapak. Nama Bapak siapa?', '打扰了，先生。您叫什么名字？'],
  ['B', 'Nama saya Hendra. Ini istri saya, Ibu Dewi.', '我叫亨德拉。这是我妻子黛薇女士。'],
  ['A', 'Asal Bapak dari mana?', '您是哪里人？'],
  ['B', 'Saya orang Surabaya.', '我是泗水人。'],
  ['A', 'Mas yang di sana dan Mbak itu siapa?', '那边那位小哥和那位小姐是谁？'],
  ['B', 'Mereka anak kami. Mas Agus dan Mbak Sari.', '他们是我们的孩子，阿古斯和莎丽。'],
  ['A', 'Senang bertemu dengan keluarga Bapak.', '很高兴见到您的家人。']
]);
DLG('people', 3, '在语言班认识新同学', [
  ['A', 'Kamu tinggal di mana?', '你住在哪里？'],
  ['B', 'Saya tinggal di Jakarta. Pekerjaan saya insinyur.', '我住在雅加达。我的工作是工程师。'],
  ['A', 'Umur kamu berapa?', '你多大了？'],
  ['B', 'Tiga puluh tahun. Saya belajar bahasa Indonesia di sini.', '三十岁。我在这里学印尼语。'],
  ['A', 'Kamu bisa bahasa Inggris?', '你会说英语吗？'],
  ['B', 'Bisa sedikit. Tapi saya bukan guru, ya.', '会一点。不过我可不是老师。'],
  ['A', 'Tidak apa-apa. Kalau tidak mengerti, kita tanya teman.', '没关系。要是不懂，我们就问朋友。']
]);

/* ---------- 数字与金钱 ---------- */
DLG('number', 1, '留电话号码', [
  ['A', 'Nomor HP kamu berapa?', '你的手机号是多少？'],
  ['B', 'Nol delapan satu dua.', '零八一二。'],
  ['A', 'Lalu?', '然后呢？'],
  ['B', 'Tiga empat lima, enam tujuh tujuh.', '三四五，六七七。'],
  ['A', 'Saya ulang: nol delapan satu dua, tiga empat lima, enam tujuh tujuh.', '我重复一遍：零八一二，三四五，六七七。'],
  ['B', 'Betul. Kalau tidak bisa, telepon lagi, ya.', '对。打不通的话再打一次。'],
  ['A', 'Oke, terima kasih.', '好的，谢谢。']
]);
DLG('number', 2, '在市场问价钱', [
  ['A', 'Bu, kaos ini harganya berapa?', '大姐，这件T恤多少钱？'],
  ['B', 'Delapan puluh ribu.', '八万。'],
  ['A', 'Kalau dua?', '买两件呢？'],
  ['B', 'Dua, seratus lima puluh ribu.', '两件十五万。'],
  ['A', 'Wah, sepuluh orang di kantor saya mau beli.', '哇，我办公室有十个人想买。'],
  ['B', 'Sepuluh kaos, tujuh ratus ribu saja.', '十件只要七十万。'],
  ['A', 'Boleh sembilan ratus ribu untuk dua belas kaos?', '十二件九十万可以吗？'],
  ['B', 'Boleh. Total belum sampai satu juta, ya!', '可以。总共还不到一百万哦！']
]);
DLG('number', 3, '在收银台付钱', [
  ['A', 'Semuanya berapa, Mbak?', '小姐，一共多少钱？'],
  ['B', 'Semua empat puluh lima ribu rupiah.', '一共四万五千卢比。'],
  ['A', 'Ini uangnya, lima puluh ribu.', '给你钱，五万。'],
  ['B', 'Kembaliannya lima ribu. Ini nomor antrean Bapak.', '找您五千。这是您的排队号。'],
  ['A', 'Saya yang pertama?', '我是第一个吗？'],
  ['B', 'Bukan, Bapak yang kedua. Tidak banyak orang hari ini.', '不是，您是第二个。今天人不多。'],
  ['A', 'Setengah jam lagi selesai?', '再过半小时能好吗？'],
  ['B', 'Ya, sekitar setengah jam.', '是的，大约半小时。']
]);

/* ---------- 时间与日期 ---------- */
DLG('time', 1, '约开会时间', [
  ['A', 'Sekarang jam berapa?', '现在几点？'],
  ['B', 'Jam sembilan lewat sepuluh menit.', '九点十分。'],
  ['A', 'Rapatnya nanti jam berapa?', '会议待会儿几点开？'],
  ['B', 'Jam sepuluh. Setiap hari Senin ada rapat.', '十点。每个星期一都有会。'],
  ['A', 'Setiap minggu?', '每个星期都有？'],
  ['B', 'Ya. Dan setiap bulan ada rapat besar.', '是的。每个月还有一次大会。'],
  ['A', 'Tahun ini saya baru ikut sekali.', '今年我才参加过一次。']
]);
DLG('time', 2, '昨天、今天、明天', [
  ['A', 'Tadi pagi kamu ke mana?', '今天早上你去哪儿了？'],
  ['B', 'Ke bank. Kemarin saya tidak sempat.', '去银行了。昨天我没来得及。'],
  ['A', 'Siang ini kita makan bersama?', '今天中午一起吃饭？'],
  ['B', 'Maaf, siang ini saya sibuk. Sore bagaimana?', '抱歉，今天中午我很忙。下午怎么样？'],
  ['A', 'Sore saya ada kelas. Besok malam bisa?', '下午我有课。明天晚上可以吗？'],
  ['B', 'Besok hari Senin, ya? Bisa, jam tujuh malam.', '明天是星期一吧？可以，晚上七点。']
]);
DLG('time', 3, '这周哪天有空', [
  ['A', 'Kapan kamu ada waktu minggu ini?', '这周你什么时候有空？'],
  ['B', 'Selasa dan Rabu saya sibuk. Kamis bisa.', '星期二和星期三我忙。星期四可以。'],
  ['A', 'Kamis saya sudah ada janji. Jumat?', '星期四我已经有约了。星期五呢？'],
  ['B', 'Jumat siang saya salat. Sabtu saja.', '星期五中午我要做礼拜。就星期六吧。'],
  ['A', 'Sabtu pagi oke. Hari Minggu saya ke gereja.', '星期六上午可以。星期天我去教堂。'],
  ['B', 'Sudah, kita bertemu hari Sabtu, ya.', '那就说定了，星期六见。']
]);
DLG('time', 4, '项目做完没有', [
  ['A', 'Laporannya sudah selesai?', '报告做完了吗？'],
  ['B', 'Belum. Saya sedang menulis bagian terakhir.', '还没有。我正在写最后一部分。'],
  ['A', 'Hari ini tanggal berapa?', '今天几号？'],
  ['B', 'Tanggal dua puluh. Besok akan selesai.', '二十号。明天会写完。'],
  ['A', 'Jam berapa sekarang?', '现在几点？'],
  ['B', 'Jam lima kurang seperempat. Jam lima lewat sedikit saya kirim.', '四点四十五。五点过一点我就发。']
]);

/* ---------- 疑问词与连接词 ---------- */
DLG('connect', 1, '问路和问人', [
  ['A', 'Itu apa?', '那是什么？'],
  ['B', 'Itu kantor polisi. Kenapa?', '那是警察局。怎么了？'],
  ['A', 'Saya cari teman. Dia siapa, ya? Saya lupa.', '我在找朋友。他是谁来着？我忘了。'],
  ['B', 'Kamu dari mana tadi?', '你刚才从哪儿来？'],
  ['A', 'Dari hotel. Sekarang mau ke mana, saya juga bingung.', '从酒店来。现在要去哪儿，我也糊涂了。'],
  ['B', 'Hotelnya di mana? Yang mana, yang besar itu?', '酒店在哪儿？哪一家，那家大的吗？'],
  ['A', 'Ya. Bagaimana cara kembali ke sana?', '对。怎么回那边去？']
]);
DLG('connect', 2, '点咖啡还是茶', [
  ['A', 'Apakah kamu mau kopi atau teh?', '你要咖啡还是茶？'],
  ['B', 'Teh saja. Saya tidak minum kopi karena sakit perut.', '茶就好。我不喝咖啡，因为会肚子疼。'],
  ['A', 'Saya juga mau teh, tapi tanpa gula.', '我也要茶，不过不加糖。'],
  ['B', 'Kalau dingin, kita pesan es teh.', '要是想喝凉的，我们点冰茶。'],
  ['A', 'Jadi dua es teh dan roti, ya?', '那就两杯冰茶和面包？'],
  ['B', 'Ya, dan saya bayar.', '对，我来付钱。']
]);
DLG('connect', 3, '饭前饭后', [
  ['A', 'Kamu masih di kantor?', '你还在办公室吗？'],
  ['B', 'Ya, saya hanya perlu kirim satu email lagi.', '在，我只要再发一封邮件。'],
  ['A', 'Setelah itu kita makan dengan teman?', '然后我们和朋友一起吃饭？'],
  ['B', 'Boleh. Tapi sebelum makan saya ke ATM dulu.', '可以。不过吃饭前我先去取款机。'],
  ['A', 'Saya pesan meja untuk empat orang saja.', '我就订一张四个人的桌子。'],
  ['B', 'Pesan yang dekat jendela, ya.', '订靠窗的那张吧。']
]);

/* ---------- 家人与人际 ---------- */
DLG('family', 1, '看全家福', [
  ['A', 'Ini foto keluarga kamu?', '这是你的全家福？'],
  ['B', 'Ya. Ini ayah dan ibu, orang tua saya.', '是的。这是爸爸和妈妈，我的父母。'],
  ['A', 'Yang tinggi ini kakak kamu?', '这个高个子是你哥哥？'],
  ['B', 'Ya, dan ini istri kakak saya.', '是的，这是我嫂子。'],
  ['A', 'Anak kecil ini siapa?', '这个小孩是谁？'],
  ['B', 'Itu adik saya. Sekarang dia sudah punya suami.', '那是我妹妹。她现在已经有丈夫了。']
]);
DLG('family', 2, '过年回老家', [
  ['A', 'Lebaran nanti kamu pulang kampung?', '开斋节你回老家吗？'],
  ['B', 'Ya, ke rumah kakek dan nenek.', '回，去爷爷奶奶家。'],
  ['A', 'Banyak saudara di sana?', '那边亲戚多吗？'],
  ['B', 'Banyak. Ada paman, tante, dan semua sepupu.', '很多。有叔叔、阿姨，还有所有的表兄弟姐妹。'],
  ['A', 'Kakek sudah punya cucu berapa?', '爷爷已经有几个孙子了？'],
  ['B', 'Sepuluh. Enam laki-laki, empat perempuan.', '十个。六个男孩，四个女孩。']
]);
DLG('family', 3, '邻居生了宝宝', [
  ['A', 'Tetangga kita punya bayi baru!', '我们邻居生了个宝宝！'],
  ['B', 'Oh ya? Laki-laki atau perempuan?', '真的？男孩还是女孩？'],
  ['A', 'Perempuan. Lahir kemarin malam.', '女孩。昨天晚上出生的。'],
  ['B', 'Mereka baru menikah tahun lalu, kan?', '他们去年才结婚的，对吧？'],
  ['A', 'Betul. Kamu kapan menikah dengan pacar kamu?', '对。你什么时候和你女朋友结婚？'],
  ['B', 'Belum tahu. Dia di Tiongkok, saya rindu sekali.', '还不知道。她在中国，我很想她。'],
  ['A', 'Sayang sekali kalian jauh.', '你们离得那么远，真可惜。']
]);

/* ---------- 食物与饮料 ---------- */
DLG('food', 1, '午饭吃什么', [
  ['A', 'Kamu sudah makan?', '你吃饭了吗？'],
  ['B', 'Belum. Saya mau makan nasi ayam.', '还没。我想吃鸡肉饭。'],
  ['A', 'Saya mau mi. Atau roti saja.', '我想吃面。或者就吃面包。'],
  ['B', 'Di warung itu ada ikan dan daging juga.', '那家小饭馆也有鱼和肉。'],
  ['A', 'Minum apa?', '喝什么？'],
  ['B', 'Air putih saja.', '白开水就好。']
]);
DLG('food', 2, '早餐自助', [
  ['A', 'Ini daging sapi atau babi?', '这是牛肉还是猪肉？'],
  ['B', 'Sapi. Di sini tidak ada babi.', '牛肉。这里没有猪肉。'],
  ['A', 'Ada telur dan sayur?', '有鸡蛋和蔬菜吗？'],
  ['B', 'Ada, di sebelah buah.', '有，在水果旁边。'],
  ['A', 'Saya mau teh. Kamu?', '我要茶。你呢？'],
  ['B', 'Kopi, dan satu botol air.', '咖啡，再来一瓶水。']
]);
DLG('food', 3, '辣不辣', [
  ['A', 'Wah, saya lapar dan haus.', '哇，我又饿又渴。'],
  ['B', 'Coba ayam goreng ini. Enak sekali.', '尝尝这个炸鸡。特别好吃。'],
  ['A', 'Pedas, tidak? Saya tidak bisa makan sambal.', '辣吗？我不能吃辣椒酱。'],
  ['B', 'Tidak pedas. Kalau kurang garam, tambah sendiri.', '不辣。要是不够咸，自己加盐。'],
  ['A', 'Teh ini terlalu manis. Banyak gula.', '这茶太甜了。放了很多糖。'],
  ['B', 'Minta teh dengan susu saja.', '那就要奶茶吧。'],
  ['A', 'Sudah, saya kenyang sekarang.', '好了，我现在饱了。']
]);

/* ---------- 在餐厅 ---------- */
DLG('resto', 1, '点外卖打包', [
  ['A', 'Mas, boleh lihat menu?', '小哥，可以看看菜单吗？'],
  ['B', 'Silakan. Mau makan di restoran atau bungkus?', '请看。在餐厅吃还是打包？'],
  ['A', 'Bungkus saja. Saya pesan nasi goreng dua.', '打包吧。我点两份炒饭。'],
  ['B', 'Baik. Silakan bayar di kasir.', '好的。请到收银台付钱。'],
  ['A', 'Pelayan di warung ini ramah sekali.', '这家小饭馆的服务员真热情。'],
  ['B', 'Terima kasih, Pak!', '谢谢您，先生！']
]);
DLG('resto', 2, '要餐具', [
  ['A', 'Mbak, meja nomor lima belum ada sendok.', '小姐，五号桌还没有勺子。'],
  ['B', 'Maaf. Ini sendok, garpu, dan piring.', '抱歉。这是勺子、叉子和盘子。'],
  ['A', 'Saya minta satu gelas lagi.', '我再要一个杯子。'],
  ['B', 'Mau tambah es?', '要加冰吗？'],
  ['A', 'Tidak, tanpa es. Tambah nasi satu, ya.', '不，不加冰。再加一份饭。'],
  ['B', 'Baik, tunggu sebentar.', '好的，稍等。']
]);
DLG('resto', 3, '结账', [
  ['A', 'Porsinya besar sekali. Rasanya enak, tapi agak asin.', '分量真大。味道不错，就是有点咸。'],
  ['B', 'Jangan dibuang. Sisanya bisa dibungkus.', '别扔。剩下的可以打包。'],
  ['A', 'Sudah cukup. Saya kenyang.', '够了。我饱了。'],
  ['B', 'Minumannya mau es atau panas?', '饮料要冰的还是热的？'],
  ['A', 'Teh panas saja. Air dingin tidak usah.', '热茶就好。冰水不用了。'],
  ['B', 'Mbak, minta bon, ya.', '小姐，麻烦结账。']
]);

/* ---------- 购物与砍价 ---------- */
DLG('shop', 1, '在市场砍价', [
  ['A', 'Bu, saya mau beli mangga. Harganya berapa?', '大姐，我想买芒果。多少钱？'],
  ['B', 'Tiga puluh ribu sekilo. Saya jual yang paling manis.', '三万一公斤。我卖的是最甜的。'],
  ['A', 'Wah, mahal sekali. Di pasar sebelah lebih murah.', '哇，太贵了。隔壁市场便宜些。'],
  ['B', 'Mau tawar berapa?', '你想还多少？'],
  ['A', 'Dua puluh ribu, ya?', '两万怎么样？'],
  ['B', 'Dua puluh lima. Itu sudah diskon.', '两万五。这已经打折了。']
]);
DLG('shop', 2, '在商场试衣服', [
  ['A', 'Toko ini di lantai berapa di mal?', '这家店在商场几楼？'],
  ['B', 'Lantai dua. Kamu mau beli apa?', '二楼。你想买什么？'],
  ['A', 'Saya mau baju ini. Ada ukuran besar?', '我想要这件衣服。有大号吗？'],
  ['B', 'Ada. Coba yang itu dulu.', '有。先试试那件。'],
  ['A', 'Yang ini terlalu kecil. Saya ambil itu saja.', '这件太小了。我就拿那件吧。'],
  ['B', 'Mau ini atau itu, terserah kamu.', '要这件还是那件，你随便。']
]);
DLG('shop', 3, '买伴手礼', [
  ['A', 'Mbak, saya cuma lihat-lihat dulu, ya.', '小姐，我先随便看看。'],
  ['B', 'Silakan. Ada oleh-oleh, tas, baju, dan sepatu.', '请随意。有伴手礼、包、衣服和鞋子。'],
  ['A', 'Sepatu ini pas. Bisa bayar pakai kartu?', '这双鞋正好合脚。可以刷卡吗？'],
  ['B', 'Bisa, atau tunai juga boleh.', '可以，付现金也行。'],
  ['A', 'Kalau tidak cocok, bisa tukar?', '要是不合适，可以换吗？'],
  ['B', 'Bisa, tapi bawa struknya, ya.', '可以，不过要带上小票。']
]);

/* ---------- 颜色与形容 ---------- */
DLG('desc', 1, '挑颜色', [
  ['A', 'Kamu suka warna apa?', '你喜欢什么颜色？'],
  ['B', 'Saya suka biru dan hijau.', '我喜欢蓝色和绿色。'],
  ['A', 'Tas ini ada warna merah, putih, dan hitam.', '这个包有红色、白色和黑色。'],
  ['B', 'Yang kuning ada?', '有黄色的吗？'],
  ['A', 'Tidak ada. Ada yang cokelat.', '没有。有棕色的。'],
  ['B', 'Saya ambil yang hitam saja.', '我就拿黑色的吧。']
]);
DLG('desc', 2, '找新房子', [
  ['A', 'Rumah baru kamu besar?', '你的新房子大吗？'],
  ['B', 'Tidak besar, agak kecil. Tapi bagus.', '不大，有点小。不过挺好的。'],
  ['A', 'Rumah lama kamu tinggi, ya? Lantai tiga.', '你的旧房子很高吧？三层。'],
  ['B', 'Ya. Rumah baru hanya satu lantai.', '是的。新房子只有一层。'],
  ['A', 'Jalannya panjang dari kantor?', '从办公室过去路远吗？'],
  ['B', 'Tidak, jalannya pendek. Sepuluh menit saja.', '不远，路很短。只要十分钟。']
]);
DLG('desc', 3, '评价新同事', [
  ['A', 'Rekan kerja baru itu cantik, ya.', '那位新同事真漂亮。'],
  ['B', 'Suaminya juga ganteng.', '她丈夫也很帅。'],
  ['A', 'Mejanya selalu bersih, tidak pernah kotor.', '她的桌子总是很干净，从来不脏。'],
  ['B', 'Dia kerja cepat sekali.', '她干活很快。'],
  ['A', 'Pekerjaan susah pun jadi mudah untuk dia.', '再难的工作到她手里都变容易了。'],
  ['B', 'Tapi tulisannya jelek, ha ha.', '不过她的字很难看，哈哈。']
]);
DLG('desc', 4, '打车说话', [
  ['A', 'Pak, tolong agak pelan. Jalannya licin.', '师傅，请开慢一点。路很滑。'],
  ['B', 'Baik. Tadi terlalu cepat, ya?', '好的。刚才太快了吧？'],
  ['A', 'Sangat cepat. Saya takut sekali.', '非常快。我特别害怕。'],
  ['B', 'Maaf, Bu. Sekarang saya pelan-pelan.', '抱歉，女士。现在我慢慢开。']
]);
