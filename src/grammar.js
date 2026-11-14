/* ===== 语法卡片：穿插在课程里，左右滑动阅读 =====
   DECK(id, 中文标题, 印尼语标题, 卡片[], 小测[])
   卡片：h 标题，p 说明（«印尼语» 可点读，**粗体**），ex 例句，t 表格（第一行是表头） */

DECK('g_noconj', '动词不变形，也没有时态', 'Kata kerja tidak berubah', [
  { h: '一个动词，永远一个样', p: '印尼语动词不随人称、单复数或时间变化。«makan»（吃）无论“我吃”“他们吃”还是“昨天吃了”，都还是 «makan»。', ex: [['Saya [makan] nasi.', '我吃米饭。'], ['Mereka [makan] nasi.', '他们吃米饭。'], ['Kemarin dia [makan] nasi.', '昨天他吃了米饭。']] },
  { h: '时间靠“时间词”来交代', p: '想说过去、将来或完成，就加一个时间词：«kemarin»（昨天）、«besok»（明天）、«sudah»（已经）、«akan»（将要）。和中文“我吃过了”“我明天吃”的思路几乎一样。', ex: [['Saya [sudah] makan.', '我吃过了。'], ['Besok saya [akan] makan di sana.', '明天我会在那儿吃。']] }
], [
  { q: '“她昨天去了巴厘岛”怎么说？', o: ['Dia kemarin pergi ke Bali.', 'Dia kemarin pergied ke Bali.', 'Dia kemarin pergian ke Bali.'], a: 0, why: '动词 «pergi» 不变形，加 «kemarin» 就表示过去。' }
]);

DECK('g_please', '四种“请”', 'Tolong, Silakan, Mohon, Minta', [
  { h: '中文一个“请”，印尼语分四种', p: '用错不会出大事，但用对会显得很有礼貌。', t: [['词', '意思', '例子'], ['«tolong»', '请你帮我做', '«Tolong buka pintu.» 请开门。'], ['«silakan»', '请您（自便、先请）', '«Silakan duduk.» 请坐。'], ['«mohon»', '恳请（正式、公告）', '«Mohon tunggu.» 请稍候。'], ['«minta»', '请给我（要东西）', '«Minta air.» 请给我水。']] },
  { h: '一句话记住', p: '**tolong** = 你帮我；**silakan** = 好处给你，你请便；**mohon** = 正式书面；**minta** = 我要。', ex: [['[Tolong] ambilkan garam.', '请把盐递给我。'], ['[Silakan] makan dulu.', '您先吃吧。'], ['[Minta] bonnya, Mbak.', '小姐，请给我账单。']] }
], [
  { q: '你请客人进门，应该说：', o: ['Tolong masuk.', 'Silakan masuk.', 'Minta masuk.'], a: 1, why: '让对方做对他有利、表示礼让的事，用 «silakan»。' }
]);

DECK('g_pronoun', 'kami 与 kita，“您”怎么说', 'Kata ganti orang', [
  { h: '“我们”有两个', p: '«kami» = 我们（**不包括**听话的人）；«kita» = 咱们（**包括**听话的人）。对客户说“我们公司”用 «kami»；对同事说“咱们去吃饭”用 «kita»。', ex: [['[Kami] dari Tiongkok.', '我们是从中国来的（你不是）。'], ['Ayo [kita] pergi!', '咱们走吧！（包括你）']] },
  { h: '代词有礼貌层级', p: '和长辈、客户说话，最自然的“您”其实是 «Bapak / Ibu»，而不是 «Anda»。«Anda» 多见于广告、表格和正式书面语。', t: [['', '正式 / 礼貌', '随便 / 亲密'], ['我', '«saya»', '«aku»'], ['你', '«Bapak / Ibu / Anda»', '«kamu»'], ['他她', '«beliau»（敬称）', '«dia»']] }
], [
  { q: '你对同事说“我们一起去吃午饭吧”，“我们”用哪个？', o: ['kami', 'kita', 'mereka'], a: 1, why: '包括对方在内的“咱们”，用 «kita»。' }
]);

DECK('g_tidakbukan', 'tidak 还是 bukan', 'Tidak atau bukan?', [
  { h: '看否定的是什么', p: '«tidak» 否定**动词和形容词**；«bukan» 否定**名词和代词**。', ex: [['Saya [tidak] lapar.', '我不饿。（形容词）'], ['Saya [tidak] makan daging.', '我不吃肉。（动词）'], ['Ini [bukan] kopi.', '这不是咖啡。（名词）']] },
  { h: 'bukan 的两个常用法', p: '① 句尾的 «…, bukan?» 意思是“……对吧？”，口语缩成 «kan»。② «bukan… tetapi…» = 不是……而是……', ex: [['Anda orang Tiongkok, [bukan]?', '您是中国人，对吧？'], ['Dia [bukan] guru, tetapi dokter.', '他不是老师，而是医生。']] },
  { h: '口语里的 tidak', p: '日常对话里 «tidak» 常说成 «nggak»、«gak» 或 «enggak»。听到要能认出来，正式场合还是用 «tidak»。', ex: [['Saya [nggak] tahu.', '我不知道。（口语）']] }
], [
  { q: '“这不是我的包”怎么说？', o: ['Ini tidak tas saya.', 'Ini bukan tas saya.', 'Ini belum tas saya.'], a: 1, why: '«tas»（包）是名词，用 «bukan» 否定。' },
  { q: '“我不累”怎么说？', o: ['Saya bukan capek.', 'Saya tidak capek.'], a: 1, why: '«capek»（累）是形容词，用 «tidak»。' }
]);

DECK('g_number', '数字的拼装', 'Bilangan', [
  { h: 'se- 就是“一”', p: '«se-» = «satu»（一）。所以 10 = «sepuluh»，11 = «sebelas»，100 = «seratus»，1.000 = «seribu»。记住这一条，数字就会了一半。' },
  { h: '拼装规则', p: '个位在前，单位在后，和中文顺序相同。', t: [['数字', '规则', '例子'], ['11–19', '个位 + «belas»', '«dua belas» 12'], ['20–90', '个位 + «puluh»', '«dua puluh» 20'], ['百', '«ratus»', '«tiga ratus» 300'], ['千', '«ribu»', '«lima ribu» 5.000'], ['百万', '«juta»', '«dua juta» 2.000.000']] },
  { h: '钱怎么读', p: '«Rp75.000» 读作 «tujuh puluh lima ribu rupiah»。印尼用**点号**分千位、**逗号**当小数点：1,5 读作 «satu koma lima»。', ex: [['Harganya [dua puluh lima ribu].', '价格两万五千（盾）。'], ['[Seratus lima puluh ribu] rupiah.', '十五万印尼盾。']] }
], [
  { q: '15.000 怎么读？', o: ['sepuluh lima ribu', 'lima belas ribu', 'lima puluh ribu'], a: 1, why: '15 = «lima belas»，再加 «ribu»（千）。' }
]);

DECK('g_classifier', '序数词与量词', 'Bilangan tingkat dan kata penggolong', [
  { h: '第几：ke- + 数字', p: '«ke-» 加数字就是序数：«kedua»（第二）、«ketiga»（第三）。只有“第一”特殊，说 «pertama»。', ex: [['Ini kali [ketiga] saya ke Bali.', '这是我第三次来巴厘岛。'], ['Dia anak [pertama].', '他是老大。']] },
  { h: '量词：和中文很像', p: '«orang»（个，用于人）、«ekor»（只/条，动物）、«buah»（个，物品，常可省略）、«lembar»（张）、«botol»（瓶）。“一个”用 «se-» 加量词：«seorang»、«seekor»、«sebuah»。', ex: [['[Dua orang] teman.', '两个朋友。'], ['Saya punya [seekor] kucing.', '我有一只猫。'], ['[Tiga botol] air, ya.', '三瓶水。']] }
], [
  { q: '“一只狗”怎么说？', o: ['satu orang anjing', 'seekor anjing', 'sebuah anjing'], a: 1, why: '动物用量词 «ekor»，“一只”就是 «seekor»。' }
]);

DECK('g_aspect', '用时间词代替时态', 'Penanda waktu', [
  { h: '六个常用时间词', p: '放在动词前面，就能表达完成、进行、将来。', t: [['词', '意思', '例子'], ['«sudah»', '已经', '«Saya sudah makan.»'], ['«belum»', '还没', '«Saya belum makan.»'], ['«sedang»', '正在', '«Dia sedang tidur.»'], ['«akan»', '将要', '«Kami akan pindah.»'], ['«masih»', '仍然', '«Toko masih buka.»'], ['«baru»', '刚刚', '«Saya baru sampai.»']] },
  { h: '回答“Sudah…?”', p: '肯定回答 «Sudah»；否定要说 «Belum»（还没），不说 «tidak»。«belum» 暗含“以后会”，更自然也更礼貌。', ex: [['“Sudah makan?” “[Belum].”', '“吃了吗？”“还没。”'], ['“Sudah menikah?” “[Belum].”', '“结婚了吗？”“还没。”']] },
  { h: '口语替换', p: '口语里 «lagi» 常代替 «sedang»，«udah» 代替 «sudah»：«Saya lagi makan.» = 我正在吃饭。' }
], [
  { q: '有人问 “Sudah selesai?”（做完了吗？），还没做完的你最自然的回答是：', o: ['Tidak.', 'Belum.', 'Bukan.'], a: 1, why: '«belum» = 还没（之后会完成），是回答 «sudah» 问句的标准否定。' }
]);

DECK('g_clock', '看时间：小心“半”', 'Membaca jam', [
  { h: 'jam 放前面还是后面？', p: '«jam» + 数字 = 几点；数字 + «jam» = 几个小时。', ex: [['Sekarang [jam tiga].', '现在三点。'], ['Saya menunggu [tiga jam].', '我等了三个小时。']] },
  { h: '过几分、差几分', p: '«lewat» = 过；«kurang» = 差；«seperempat» = 一刻钟。', t: [['说法', '时间'], ['«jam tujuh lewat sepuluh»', '7:10'], ['«jam sembilan lewat seperempat»', '9:15'], ['«jam delapan kurang lima»', '7:55']] },
  { h: '最大的陷阱：setengah', p: '«setengah» 放在**下一个钟点**前面：«jam setengah tujuh» 是 **6:30**，意思是“到七点还差一半”，不是 7:30！', ex: [['Rapatnya [jam setengah sembilan].', '会议八点半开始。']] }
], [
  { q: '“jam setengah lima” 是几点？', o: ['5:30', '4:30', '5:15'], a: 1, why: '«setengah lima» = 离五点还差半小时，即 4:30。' }
]);

DECK('g_question', '疑问句怎么问、怎么答', 'Kalimat tanya', [
  { h: '是非问句的三种做法', p: '① 陈述句 + 语调上扬：«Kamu lapar?» ② 句首加 «apakah»（正式）：«Apakah Anda lapar?» ③ 句尾加 «ya / kan»：«Kamu lapar, kan?»（你饿了吧？）' },
  { h: '回答要看词性', p: '肯定说 «Ya / Iya»。否定：动词、形容词用 «Tidak»，名词用 «Bukan»，“已经”类问题用 «Belum»。', ex: [['“Ini kopi?” “[Bukan], ini teh.”', '“这是咖啡吗？”“不是，是茶。”'], ['“Mahal?” “[Tidak], murah.”', '“贵吗？”“不贵，很便宜。”']] },
  { h: '疑问词放哪儿都行', p: '疑问词可以放句首，也可以放句尾，放句尾更口语：«Kamu mau ke mana?» 和 «Ke mana kamu mau pergi?» 都对。', ex: [['Kamu mau ke [mana]?', '你要去哪儿？']] }
], [
  { q: '“这是你的车吗？”——不是。应该回答：', o: ['Tidak.', 'Bukan.', 'Belum.'], a: 1, why: '问的是“是不是你的车”（名词），否定用 «bukan»。' }
]);

DECK('g_yang', 'yang 的三种用法', 'Kata yang', [
  { h: 'yang + 形容词 = “……的那个”', p: '«yang merah»（红的那个）、«yang ini»（这个）、«yang mana»（哪个）。买东西时特别好用。', ex: [['Saya mau [yang] kecil.', '我要小的。']] },
  { h: '引导从句 = 中文的“……的”', p: '«orang yang tinggal di sini» = 住在这里的人。注意顺序：名词在前，修饰的部分放在 «yang» 后面。', ex: [['Orang [yang] memakai topi itu manajer saya.', '戴帽子的那个人是我的经理。']] },
  { h: '强调“就是……”', p: '«Dia yang bayar.» = 是他付的钱（不是别人）。', ex: [['Saya [yang] salah.', '是我错了。']] }
], [
  { q: '“我要大的那个”怎么说？', o: ['Saya mau besar.', 'Saya mau yang besar.', 'Saya yang mau besar.'], a: 1, why: '«yang besar» = 大的那个。' }
]);

DECK('g_possessive', '“我的、你的、他的”', 'Kepemilikan dan -nya', [
  { h: '名词 + 人称 = 谁的', p: '顺序和中文相反：«rumah saya»（我的房子）、«mobil Anda»（您的车）、«ibu dia»（他的妈妈）。', ex: [['Ini [rumah saya].', '这是我的房子。']] },
  { h: '缩略后缀 -ku / -mu / -nya', p: '口语里常把人称缩成后缀：«-ku»（我的）、«-mu»（你的）、«-nya»（他/她的）。', t: [['完整', '缩略', '意思'], ['«rumah aku»', '«rumahku»', '我的房子'], ['«mobil kamu»', '«mobilmu»', '你的车'], ['«ibu dia»', '«ibunya»', '他的妈妈']] },
  { h: '-nya 还能表示“这个、那个”', p: '«-nya» 也常用来特指双方都知道的东西：«Harganya berapa?»（这个的价格是多少？）«Makanannya enak.»（这饭菜好吃。）', ex: [['[Harganya] berapa?', '价钱多少？'], ['[Kamarnya] bersih.', '房间很干净。']] }
], [
  { q: '“他的名字”怎么说？', o: ['namanya', 'nyanama', 'dia nama'], a: 0, why: '«nama» + «-nya»（他的）= «namanya»。' }
]);

DECK('g_plural', '复数怎么表达', 'Bentuk jamak', [
  { h: '名词本身不分单复数', p: '«Saya beli buku.» 可以是“我买了一本书”，也可以是“我买了书（好几本）”，靠上下文判断。' },
  { h: '叠词 = 很多、各种', p: '需要强调多数时，把名词重复：«anak-anak»（孩子们）、«buku-buku»（各种书）。但有了数字或数量词就**不再叠**：说 «dua anak»，不说 «dua anak-anak»。', ex: [['[Anak-anak] bermain di taman.', '孩子们在公园玩。'], ['Saya punya [tiga anak].', '我有三个孩子。']] },
  { h: '其他复数标记', p: '«banyak»（很多）、«semua»（所有）、«para»（诸位，用于人）：«para tamu»（各位来宾）。', ex: [['Selamat datang, [para tamu].', '欢迎各位来宾。']] }
], [
  { q: '“很多书”怎么说？', o: ['banyak buku-buku', 'banyak buku'], a: 1, why: '已经有了 «banyak»，名词就不用再叠。' }
]);

DECK('g_order', '修饰语放后面', 'Hukum D-M', [
  { h: '和中文顺序相反', p: '被修饰的词在前，修饰的词在后：«nasi goreng» = 炒饭（饭 + 炒），«teh manis» = 甜茶，«rumah besar» = 大房子。语法书管这叫 D-M（Diterangkan–Menerangkan）规则。', ex: [['Saya mau [nasi putih].', '我要白米饭。'], ['[Es teh manis] satu.', '一杯冰甜茶。']] },
  { h: '“我的”“这个”也放后面', p: '所有者和指示词同样后置：«buku saya»（我的书）、«buku ini»（这本书）、«buku saya ini»（我的这本书）。', ex: [['[Kopi ini] enak.', '这咖啡好喝。']] },
  { h: '想强调就加 yang', p: '«rumah yang besar itu» = 那栋大大的房子。«yang» 让修饰部分更清楚、更有强调意味。' }
], [
  { q: '“辣的炒面”怎么说？', o: ['pedas mi goreng', 'mi goreng pedas', 'goreng mi pedas'], a: 1, why: '中心词 «mi» 在最前，«goreng»、«pedas» 依次放后面。' }
]);

DECK('g_imperative', '祈使句：让别人做或别做', 'Kalimat perintah', [
  { h: '最简单：直接用动词', p: '«Duduk!»（坐！）«Tunggu!»（等着！）加上 «-lah» 语气更柔和：«Duduklah.»' },
  { h: '五个常用开头', t: [['词', '意思', '例子'], ['«ayo / yuk»', '咱们……吧', '«Ayo makan!»'], ['«jangan»', '别……', '«Jangan lupa.»'], ['«coba»', '试着……', '«Coba lihat ini.»'], ['«tolong»', '请帮我……', '«Tolong tunggu.»'], ['«silakan»', '请您……', '«Silakan masuk.»']], ex: [['[Jangan] lupa, ya.', '别忘了哦。'], ['[Coba] lihat ini.', '你看看这个。']] },
  { h: '加个 ya，命令变商量', p: '句尾加 «ya» 会让语气温和很多：«Tunggu sebentar, ya.»（等一下哦。）' }
], [
  { q: '“别放辣椒”怎么说？', o: ['Tidak pakai cabai!', 'Jangan pakai cabai.', 'Bukan pakai cabai.'], a: 1, why: '劝阻、禁止别人做某事用 «jangan»。' }
]);

DECK('g_me', 'me- 前缀：先认识词根', 'Awalan me- (1)', [
  { h: '同一个词的两种形式', p: '很多及物动词有“词根”和“me- 形式”：«beli» → «membeli»（买），«baca» → «membaca»（读）。me- 形式更正式，多用在书面语、新闻和完整句子里。', ex: [['Dia [membeli] mobil baru.', '他买了一辆新车。']] },
  { h: '口语常常直接用词根', p: '说话时经常省掉 me-：«Saya beli dua.»（我买两个。）所以**先认识词根**最重要。查词典也是按词根查：查 «membeli» 要翻到 «beli»。', ex: [['Saya [beli] dua.', '我买两个。']] },
  { h: '有些词就用 me- 形式', p: '一些词几乎只用 me- 形式：«menikah»（结婚）、«menginap»（住宿）、«menunggu»（等）。遇到就整体记住。' }
], [
  { q: '在词典里查 “membaca”，应该查哪个词？', o: ['membaca', 'baca', 'mbaca'], a: 1, why: '词典按词根排序，«membaca» = «me-» + «baca»。' }
]);

DECK('g_me2', 'me- 的鼻音变化', 'Awalan me- (2)', [
  { h: '词根首字母决定前缀形状', p: '加 me- 时，前缀会根据词根第一个字母变形：', t: [['首字母', '前缀', '例子'], ['l m n r w y', 'me-', '«lihat → melihat»'], ['b f v', 'mem-', '«beli → membeli»'], ['p（脱落）', 'mem-', '«pakai → memakai»'], ['d c j z', 'men-', '«dengar → mendengar»'], ['t（脱落）', 'men-', '«tulis → menulis»'], ['g h 元音', 'meng-', '«ambil → mengambil»'], ['k（脱落）', 'meng-', '«kirim → mengirim»'], ['s（脱落）', 'meny-', '«sewa → menyewa»'], ['单音节', 'menge-', '«cek → mengecek»']] },
  { h: '口诀：p t k s 会“消失”', p: '遇到 me-，开头的 p、t、k、s 会被鼻音吞掉。反过来，看到 «menulis» 就要想到词根可能是 «tulis»，看到 «memakai» 想到 «pakai»。', ex: [['Saya [menulis] email.', '我在写邮件。'], ['Dia [mengirim] paket.', '他寄包裹。'], ['Kami [menyewa] mobil.', '我们租车。']] }
], [
  { q: '«sapu»（扫）加 me- 是：', o: ['mesapu', 'menyapu', 'mensapu'], a: 1, why: 's 开头 → «meny-»，s 脱落：«menyapu»。' },
  { q: '«memukul»（打）的词根是：', o: ['pukul', 'mukul', 'kukul'], a: 0, why: '«mem-» 前面脱落的是 p，所以词根是 «pukul»。' }
]);

DECK('g_compare', '程度与比较', 'Perbandingan', [
  { h: '“非常”有两种放法', p: '«sangat» 放形容词**前**（偏书面）；«sekali» 放形容词**后**（偏口语）。«terlalu» = 太，«agak» = 有点，«kurang» = 不太。', ex: [['[Sangat] mahal.', '非常贵。'], ['Mahal [sekali]!', '太贵了！'], ['[Agak] jauh.', '有点远。']] },
  { h: '比较级与最高级', p: '比较：«lebih» + 形容词 + «daripada / dari»。最高：«paling» + 形容词，或 «ter-» + 形容词（«termurah» 最便宜）。', ex: [['Bali [lebih] ramai [daripada] Lombok.', '巴厘岛比龙目岛热闹。'], ['Ini yang [paling] enak.', '这个最好吃。']] },
  { h: '一样……', p: '«sama» + 形容词 + «dengan»，或 «se-» + 形容词：«Dia setinggi saya.»（他和我一样高。）', ex: [['Harganya [sama dengan] kemarin.', '价格和昨天一样。']] }
], [
  { q: '“这个比那个便宜”怎么说？', o: ['Ini lebih murah daripada itu.', 'Ini murah lebih itu.', 'Ini paling murah itu.'], a: 0, why: '比较级：«lebih» + 形容词 + «daripada»。' }
]);

DECK('g_prep', 'di、ke、dari', 'Kata depan di, ke, dari', [
  { h: '在、去、从', p: '«di» = 在（地点）；«ke» = 去、往；«dari» = 从、来自。它们都和地点词连用：«di sini»、«ke sana»、«dari mana»。«ke» 后面的动词 «pergi» 常被省略。', ex: [['Saya [di] hotel.', '我在酒店。'], ['Saya [ke] pasar.', '我去市场。'], ['Saya [dari] kantor.', '我从办公室来。']] },
  { h: '加上方位词', p: '«di atas»（上面）、«di bawah»（下面）、«di depan»（前面）、«di dalam»（里面）、«ke luar»（往外）、«dari belakang»（从后面）。', ex: [['Tasnya [di atas] meja.', '包在桌子上面。']] },
  { h: '写法：分开还是连写', p: '介词 «di» 要和后面的词**分开写**（«di rumah»）；被动前缀 «di-» 要**连写**（«dibeli»）。这是印尼人自己也常写错的地方。' }
], [
  { q: '“我从泗水来”怎么说？', o: ['Saya di Surabaya.', 'Saya ke Surabaya.', 'Saya dari Surabaya.'], a: 2, why: '“从”用 «dari»。' }
]);

DECK('g_ter', 'ter- 前缀', 'Awalan ter-', [
  { h: 'ter- + 形容词 = 最……', p: '书面里常用 ter- 表示最高级：«terbesar»（最大）、«termahal»（最贵）、«terbaik»（最好）。', ex: [['Jakarta kota [terbesar] di Indonesia.', '雅加达是印尼最大的城市。']] },
  { h: 'ter- + 动词 = 状态或“不小心”', p: '«terbuka»（开着的）、«tertutup»（关着的）、«tertinggal»（被落下）、«tertidur»（不小心睡着）、«terlambat»（迟到）。', ex: [['Paspor saya [tertinggal] di hotel.', '我的护照落在酒店了。'], ['Pintunya [terbuka].', '门开着。']] }
], [
  { q: '“我不小心睡着了”怎么说？', o: ['Saya tertidur.', 'Saya ditidur.', 'Saya menidur.'], a: 0, why: '«ter-» 表示非故意的动作：«tertidur»。' }
]);

DECK('g_ber', 'ber- 前缀', 'Awalan ber-', [
  { h: '做某个活动（不及物）', p: 'ber- 多构成不带宾语的动词：«berjalan»（走）、«berenang»（游泳）、«bermain»（玩）、«bekerja»（工作，r 脱落）、«belajar»（学习，特殊形式）。', ex: [['Kami [berenang] di laut.', '我们在海里游泳。']] },
  { h: 'ber- + 名词 = 有、穿、用', p: '«beristri»（有妻子）、«berbaju merah»（穿红衣服）、«bersepeda»（骑自行车）、«berbahasa Indonesia»（说印尼语）。', ex: [['Dia [berbaju] merah.', '她穿着红衣服。'], ['Anda bisa [berbahasa] Inggris?', '您会说英语吗？']] },
  { h: 'ber- + 数字 = 几个人一起', p: '«berdua»（两个人一起）、«bertiga»（三个人一起）。', ex: [['Kami datang [berdua].', '我们两个人来的。']] }
], [
  { q: '“我们三个人一起去”怎么说？', o: ['Kami pergi bertiga.', 'Kami pergi ketiga.', 'Kami pergi tiga.'], a: 0, why: '«ber-» + 数字 = 几人一起：«bertiga»。«ketiga» 是“第三”。' }
]);

DECK('g_redup', '叠词', 'Kata ulang', [
  { h: '表示多、各种', p: '«rumah-rumah»（许多房子）、«buah-buahan»（各种水果）。' },
  { h: '表示随意、放松', p: '«jalan-jalan»（逛逛）、«lihat-lihat»（随便看看）、«duduk-duduk»（坐坐）。', ex: [['Kami cuma [jalan-jalan].', '我们只是逛逛。']] },
  { h: '有的词天生就是叠词', p: '«kupu-kupu»（蝴蝶）、«hati-hati»（小心）、«pelan-pelan»（慢慢地）、«oleh-oleh»（伴手礼）。书写时中间加连字符“-”。', ex: [['[Pelan-pelan] saja.', '慢慢来。']] }
], [
  { q: '“孩子们”怎么说？', o: ['anak-anak', 'anak anak-anak', 'para anak-anak'], a: 0, why: '名词重叠表示复数：«anak-anak»。«para» 后面不再叠词。' }
]);

DECK('g_ada', 'ada：有、在', 'Kata ada', [
  { h: 'ada 与 punya', p: '中文的“有”分两种：**某处存在**用 «ada»；**某人拥有**用 «punya»。«ada» 还表示“在”：«Pak Budi ada?»（布迪先生在吗？）', ex: [['[Ada] air panas?', '有热水吗？'], ['Saya [punya] mobil.', '我有一辆车。']] },
  { h: '存在句', p: '地点 + «ada» + 东西，或 «ada» + 东西 + 地点：«Di kamar ada AC.» = «Ada AC di kamar.»（房间里有空调。）否定说 «tidak ada»，口语 «nggak ada»。', ex: [['[Tidak ada] kamar kosong.', '没有空房间。']] },
  { h: '两个常用短语', p: '«Ada apa?» = 怎么了？«Ada-ada saja!» = 真是的！（无奈）', ex: [['[Ada apa]?', '怎么了？']] }
], [
  { q: '“这附近有取款机吗？”怎么说？', o: ['Ada ATM di dekat sini?', 'Punya ATM di dekat sini?'], a: 0, why: '某个地方存在某物用 «ada»；«punya» 是某人拥有。' }
]);

DECK('g_kan_i', '后缀 -kan 与 -i', 'Akhiran -kan dan -i', [
  { h: '-kan：使……', p: '«mati»（灭）→ «matikan»（关掉），«nyala»（亮）→ «nyalakan»（打开），«bersih»（干净）→ «bersihkan»（弄干净）。', ex: [['Tolong [matikan] lampunya.', '请把灯关掉。']] },
  { h: '-kan：为别人做', p: '«ambilkan»（帮……拿）、«belikan»（给……买）、«bukakan»（帮……开）。', ex: [['Tolong [ambilkan] air.', '请帮我拿点水。'], ['Saya [belikan] kamu kopi.', '我给你买了咖啡。']] },
  { h: '-i：动作指向某处或某人', p: '«datangi»（去找某人）、«masuki»（进入某处）、«temani»（陪伴）、«kunjungi»（拜访）。', ex: [['Saya akan [temani] Anda.', '我会陪着您。']] }
], [
  { q: '“请帮我开一下门”最地道的是：', o: ['Tolong bukakan pintu.', 'Tolong bukai pintu.', 'Tolong membukai pintu.'], a: 0, why: '为别人做某事用 «-kan»：«bukakan»。' }
]);

DECK('g_body', '病痛怎么说', 'Menyatakan sakit', [
  { h: 'sakit + 部位', p: '«sakit kepala»（头疼）、«sakit perut»（肚子疼）、«sakit gigi»（牙疼）。也可以说 «Kepala saya sakit.»', ex: [['Saya [sakit kepala].', '我头疼。']] },
  { h: '常用说法', p: '«Saya merasa kurang enak badan.»（我觉得不太舒服。）«Saya kena flu.»（我得了流感，«kena» = 染上、遭受。）«Saya alergi …»（我对……过敏。）', ex: [['Saya [kena] flu.', '我得了流感。']] },
  { h: '在药店', p: '«Ada obat untuk …?»（有治……的药吗？）«Diminum berapa kali sehari?»（一天吃几次？）«Sebelum atau sesudah makan?»（饭前还是饭后？）', ex: [['Obat ini diminum [sesudah makan].', '这药饭后吃。']] }
], [
  { q: '“我肚子疼”怎么说？', o: ['Saya sakit perut.', 'Saya perut sakit saya.', 'Sakit saya perut.'], a: 0, why: '«sakit» + 部位：«sakit perut»。' }
]);

DECK('g_kean', 'ke-an：遭受与抽象名词', 'Imbuhan ke-an', [
  { h: '遭受（不好的事）', p: '«kehujanan»（被雨淋）、«kepanasan»（热坏了）、«kedinginan»（冻着了）、«kemalingan»（遭贼）、«ketinggalan»（错过、落下）。', ex: [['Saya [ketinggalan] kereta.', '我没赶上火车。']] },
  { h: '变成抽象名词', p: '«bersih → kebersihan»（清洁）、«sehat → kesehatan»（健康）、«selamat → keselamatan»（安全）、«indah → keindahan»（美）。', ex: [['[Kesehatan] itu penting.', '健康很重要。']] },
  { h: '口语：太……了', p: '«kebesaran»（太大了）、«kemahalan»（太贵了）、«kepedasan»（太辣了）。', ex: [['Bajunya [kebesaran].', '衣服太大了。']] }
], [
  { q: '“我遭贼了（东西被偷）”怎么说？', o: ['Saya kemalingan.', 'Saya bermaling.', 'Saya termaling.'], a: 0, why: '«ke-an» 表示遭受不幸：«kemalingan»。' }
]);

DECK('g_modal', '想、能、可以、必须', 'Kata kerja bantu', [
  { h: '常用情态词', t: [['词', '意思'], ['«mau»', '想要（口语）'], ['«ingin»', '想要（书面）'], ['«bisa»', '能、会'], ['«boleh»', '可以（被允许）'], ['«harus»', '必须'], ['«perlu»', '需要']] },
  { h: 'bisa 和 boleh', p: '«bisa» = 有能力或有可能；«boleh» = 被允许。问“可以吗”用 «boleh»，说“我会”用 «bisa»。', ex: [['[Boleh] saya duduk di sini?', '我可以坐这儿吗？'], ['Saya [bisa] menyetir.', '我会开车。']] },
  { h: '否定说法', p: '«tidak mau»（不想）、«tidak bisa»（不能）、«tidak boleh»（不准）、«tidak perlu»（不需要）、«tidak usah»（不用了）。', ex: [['[Tidak usah], terima kasih.', '不用了，谢谢。']] }
], [
  { q: '“我不会游泳”怎么说？', o: ['Saya tidak boleh berenang.', 'Saya tidak bisa berenang.'], a: 1, why: '说能力用 «bisa»；«tidak boleh» 是“不准”。' }
]);

DECK('g_slang', '雅加达口语速成', 'Bahasa gaul', [
  { h: '常见缩略', t: [['正式', '口语'], ['«tidak»', '«nggak / gak»'], ['«sudah»', '«udah»'], ['«saja»', '«aja»'], ['«bagaimana»', '«gimana»'], ['«begitu»', '«gitu»'], ['«sekali»（非常）', '«banget»']], ex: [['Enak [banget]!', '超好吃！'], ['[Gimana] kabarnya?', '最近怎么样？']] },
  { h: 'gue 和 lo', p: '雅加达年轻人用 «gue / gua»（我）、«lo / lu»（你），来源于闽南话的“我”“汝”。非常随便，对长辈和在工作场合不要用。', ex: [['[Gue] udah makan.', '我吃过了。（很随便）']] },
  { h: '语气词', p: '«dong»（嘛，催促）、«sih»（呢，缓和或疑惑）、«kok»（怎么会）、«deh»（吧，让步）、«yuk»（走吧）。', ex: [['Ayo [dong]!', '快点嘛！'], ['[Kok] mahal banget?', '怎么这么贵？']] }
], [
  { q: '“Saya nggak tahu” 里的 nggak，正式说法是：', o: ['bukan', 'tidak', 'belum'], a: 1, why: '«nggak» 是 «tidak» 的口语形式。' }
]);

DECK('g_di', 'di- 被动句', 'Kalimat pasif di-', [
  { h: 'di- + 词根 = 被……', p: '«dibeli»（被买）、«ditulis»（被写）、«dikirim»（被发出）。印尼语非常爱用被动句，公文、邮件、新闻里尤其多。', ex: [['Barangnya sudah [dikirim].', '货已经发出了。']] },
  { h: '谁做的：用 oleh', p: '施动者用 «oleh» 引出，也可以省略。', ex: [['Kontrak itu [ditandatangani] oleh kedua pihak.', '合同由双方签署。'], ['Surat ini ditulis [oleh] direktur.', '这封信是总监写的。']] },
  { h: '“我”“你”做的不用 di-', p: '第一、二人称的被动：代词 + 词根，放在动词前：«Surat ini saya tulis.»（这封信是我写的。）«Sudah kamu baca?»（你看过了吗？）', ex: [['Emailnya sudah [saya kirim].', '邮件我已经发了。']] }
], [
  { q: '“报告已经检查过了（被检查了）”怎么说？', o: ['Laporannya sudah diperiksa.', 'Laporannya sudah memeriksa.'], a: 0, why: '东西“被检查”用被动 «diperiksa»。' }
]);

DECK('g_pean', '名词是怎么造出来的', 'Pe-, -an, pe-an', [
  { h: 'pe- + 动词 = 做这件事的人', t: [['词根', '名词', '意思'], ['«kerja»', '«pekerja»', '工人'], ['«jual»', '«penjual»', '卖家'], ['«beli»', '«pembeli»', '买家'], ['«awas»', '«pengawas»', '主管、监工']] },
  { h: '动词 + -an = 结果、东西', p: '«makan → makanan»（食物）、«minum → minuman»（饮料）、«tulis → tulisan»（文字）、«lapor → laporan»（报告）。', ex: [['[Makanan] di sini enak.', '这里的食物好吃。']] },
  { h: 'pe-…-an = 过程、行业、场所', p: '«kerja → pekerjaan»（工作）、«baik → perbaikan»（维修）、«tambang → pertambangan»（采矿业）、«labuh → pelabuhan»（港口）。', ex: [['Dia bekerja di sektor [pertambangan].', '他在采矿行业工作。']] }
], [
  { q: '“卖家”怎么说？', o: ['penjual', 'jualan', 'penjualan'], a: 0, why: '«pe-» + «jual» = «penjual»（卖东西的人）。«penjualan» 是“销售”。' }
]);

DECK('g_selamat', 'selamat 祝福公式', 'Ucapan selamat', [
  { h: 'selamat + 时间或节日', p: '«Selamat pagi»（早上好）、«Selamat ulang tahun»（生日快乐）、«Selamat Tahun Baru»（新年快乐）、«Selamat Hari Raya»（节日快乐）。' },
  { h: 'selamat + 动词 = 祝你……顺利', p: '«Selamat makan»（请慢用）、«Selamat bekerja»（工作顺利）、«Selamat jalan»（一路平安）、«Selamat berlibur»（假期愉快）、«Selamat beristirahat»（好好休息）。', ex: [['[Selamat makan]!', '请慢用！'], ['[Selamat berlibur]!', '假期愉快！']] },
  { h: '单独一句：恭喜！', p: '«Selamat!» = 恭喜！后面可以加 «atas»：«Selamat atas pernikahannya!»（恭喜新婚！）', ex: [['[Selamat atas] kelahiran anak Anda!', '恭喜您喜得贵子！']] }
], [
  { q: '春节时对华人朋友说：', o: ['Selamat Natal!', 'Selamat Tahun Baru Imlek!', 'Selamat Idul Fitri!'], a: 1, why: '«Imlek» = 农历新年。' }
]);

/* ---------- 矿业专题的语法卡片 ---------- */

DECK('g_spec', '读技术规格：小数、单位、大数字', 'Angka dan satuan', [
  { h: '逗号是小数点', p: '印尼语用**逗号**作小数点、**点号**分千位：«0,8» 读作 «nol koma delapan»，«4.200» 读作 «empat ribu dua ratus»。百分比说 «persen»。', ex: [['Kadar sulfurnya [nol koma delapan persen].', '硫含量为 0.8%。'], ['Kadar abunya [delapan persen].', '灰分为 8%。']] },
  { h: '单位的读法', p: '«kkal/kg» 读作 «kilokalori per kilogram»，«per» 就是“每”。«ton» 吨，«meter kubik» 立方米，«dolar per ton» 每吨多少美元。', ex: [['Kalorinya [empat ribu dua ratus kilokalori per kilogram].', '热值为每千克 4200 大卡。'], ['Harganya [enam puluh dolar per ton].', '价格每吨 60 美元。']] },
  { h: '没有“万”和“亿”', p: '«ribu» 千、«juta» 百万、«miliar» 十亿、«triliun» 万亿。中文的“万”“亿”要换算：一万 = «sepuluh ribu»，十万 = «seratus ribu»，一亿 = «seratus juta»。', ex: [['Produksinya [lima juta ton] per tahun.', '年产量五百万吨。'], ['Targetnya [seratus ribu ton].', '目标是十万吨。']] }
], [
  { q: '“2,5 juta ton” 是多少？', o: ['25 万吨', '250 万吨', '2500 万吨'], a: 1, why: '«2,5 juta» = 2.5 × 百万 = 250 万。' },
  { q: '“一亿”用印尼语怎么说？', o: ['satu miliar', 'seratus juta', 'sepuluh juta'], a: 1, why: '一亿 = 100 × 百万 = «seratus juta»；«satu miliar» 是十亿。' }
]);

DECK('g_np', '长名词短语：从后往前读', 'Frasa nomina panjang', [
  { h: '技术名词要倒着翻', p: '因为“中心词在前”，长的技术名词要从后往前理解：«pabrik pemurnian tembaga» = 铜 · 精炼 · 厂 → 铜精炼厂。', ex: [['[Bijih nikel kadar rendah].', '低品位镍矿石。'], ['[Pabrik pemurnian tembaga].', '铜精炼厂。']] },
  { h: '一层层剥开', p: '«izin usaha pertambangan» = 采矿 · 经营 · 许可 → 采矿经营许可证；«kawasan industri nikel» = 镍 · 工业 · 园区 → 镍工业园区。', ex: [['[Fasilitas pengolahan dan pemurnian].', '加工与精炼设施。'], ['[Izin usaha pertambangan] khusus.', '特别采矿经营许可证。']] },
  { h: '遇到 yang 和介词就断开', p: '«yang»、«di»、«ke»、«dari»、«untuk» 往往是切分点：«smelter yang dibangun di Morowali» = 在莫罗瓦利建的冶炼厂；«ekspor bijih ke Tiongkok» = 向中国出口矿石。', ex: [['Smelter [yang] dibangun di Morowali.', '在莫罗瓦利建的冶炼厂。']] }
], [
  { q: '«konsentrat tembaga kadar tinggi» 的意思是：', o: ['高品位铜精矿', '铜精矿高含量厂', '高铜精矿品位'], a: 0, why: '中心词 «konsentrat»（精矿）在最前，后面依次修饰：铜的、高品位的。' }
]);

DECK('g_formal', '公文和新闻里的“套话”', 'Bahasa resmi', [
  { h: '常见的引导词', t: [['词', '意思'], ['«berdasarkan»', '根据'], ['«sesuai dengan»', '按照；符合'], ['«terkait / mengenai»', '关于'], ['«dalam rangka»', '为了；在……框架下'], ['«paling lambat»', '最迟'], ['«terhitung sejak»', '自……起算']], ex: [['[Berdasarkan] Peraturan Menteri ESDM, harga ditetapkan setiap bulan.', '根据能矿部部长条例，价格每月确定。']] },
  { h: '义务、禁止与处罚', p: '«wajib» = 必须（法定义务）；«dilarang» = 禁止；«dapat» = 可以（法律上允许）；«dikenai sanksi» = 将受处罚。', ex: [['Pemegang IUP [wajib] membangun smelter.', '采矿许可证持有者必须建设冶炼厂。'], ['Setiap orang [dilarang] menambang tanpa izin.', '任何人不得无证采矿。']] },
  { h: '公文爱用被动', p: '«ditetapkan»（被确定）、«diatur»（被规范）、«diberlakukan»（被实施）。看到 di- 开头的动词，先找“被什么”，再找“由谁”（«oleh»）。', ex: [['Harga acuan [ditetapkan] oleh Menteri.', '基准价由部长确定。']] }
], [
  { q: '“最迟 30 天内”怎么说？', o: ['paling lambat 30 hari', 'paling cepat 30 hari', 'sesuai dengan 30 hari'], a: 0, why: '«paling lambat» = 最迟；«paling cepat» = 最早。' }
]);

DECK('g_family', '词族：一个词根变出一串词', 'Keluarga kata', [
  { h: '以 naik（上升）为例', p: '«naik» 自己上升；«menaikkan» 使……上升（提高）；«kenaikan» 上涨（名词）。新闻里三种形式经常同时出现。', ex: [['Harga [naik].', '价格上涨。'], ['Pemerintah [menaikkan] tarif.', '政府提高了费率。'], ['[Kenaikan] harga cukup besar.', '涨幅相当大。']] },
  { h: '同一个模式，换一个词根', t: [['词根', '自己变化', '使……变化', '名词'], ['«turun»', '«turun / menurun»', '«menurunkan»', '«penurunan»'], ['«tingkat»', '«meningkat»', '«meningkatkan»', '«peningkatan»'], ['«ekspor»', '—', '«mengekspor»', '«pengekspor»（出口商）']] },
  { h: '读新闻的小技巧', p: '先剥掉 me-、-kan、ke-…-an、pe-…-an，找到词根，再看形状猜词性：-an 结尾多是名词；me-…-kan 多是“使……”；ke-…-an 多是抽象名词或“遭受”。' }
], [
  { q: '“出口商”是哪个词？', o: ['pengekspor', 'mengekspor', 'ekspornya'], a: 0, why: '«pe-» + 词根 = 做这件事的人：«pengekspor»。' },
  { q: '“政府降低了税率”里的“降低”用：', o: ['turun', 'menurunkan', 'penurunan'], a: 1, why: '有宾语（税率），用及物的 «menurunkan»。' }
]);

/* ---------- 第二批课程的语法卡片 ---------- */

DECK('g_serapan', '外来词有规律', 'Kata serapan', [
  { h: '英语词怎么变成印尼语', p: '很多现代词借自英语，按固定规律改拼法：-tion → «-si»（«informasi»、«operasi»），-ty → «-tas»（«kualitas»、«universitas»），-ic → «-ik»（«elektronik»、«teknik»），发 k 音的 c 写成 k（«komputer»、«aktif»）。', ex: [['Kami butuh [informasi] lebih lanjut.', '我们需要更多信息。'], ['[Kualitas] internet di sini kurang baik.', '这里的网络质量不太好。']] },
  { h: '荷兰语留下的词', p: '印尼曾是荷兰殖民地，很多日常词来自荷兰语：«kantor»（办公室，kantoor）、«handuk»（毛巾，handdoek）、«kulkas»（冰箱，koelkast）、«polisi»（警察，politie）、«sepeda»（自行车，velocipede）。' },
  { h: '读外来词也按印尼语规则', p: '外来词照印尼语拼读：«aplikasi» 读作 a-pli-ka-si，«internet» 的 e 读得很轻。拿不准就按字母一个个读，基本不会错。' }
], [
  { q: '英语 information 在印尼语里是：', o: ['informasion', 'informasi', 'informatie'], a: 1, why: '-tion 对应 «-si»。' }
]);

DECK('g_date', '日期、年份和号码怎么读', 'Membaca tanggal dan nomor', [
  { h: '日期顺序：日、月、年', p: '印尼语按“日 月 年”说：«tanggal 17 Agustus 2026» 读作 «tanggal tujuh belas Agustus dua ribu dua puluh enam»。月份：Januari, Februari, Maret, April, Mei, Juni, Juli, Agustus, September, Oktober, November, Desember。', ex: [['Saya lahir [tanggal lima Mei].', '我五月五日出生。']] },
  { h: '电话号码一位一位读', p: '手机号逐位读：«0812» 读作 «nol delapan satu dua»；数字 0 说 «nol»，有人也说 «kosong»。', ex: [['Nomor saya [nol delapan satu satu], lalu…', '我的号码是 0811，后面是……']] },
  { h: '年份和价格', p: '年份按整数读：«2026» = «dua ribu dua puluh enam»。价格常说“多少千”：«Rp45.000» = «empat puluh lima ribu»，后面的 «rupiah» 常省略。', ex: [['Proyek ini mulai [tahun dua ribu dua puluh lima].', '这个项目 2025 年开始。']] }
], [
  { q: '«tanggal 3 Oktober» 是哪天？', o: ['3 月 10 日', '10 月 3 日', '3 月 3 日'], a: 1, why: '先说日，再说月：3 号，10 月。' }
]);

DECK('g_profesi', '职业名称怎么构成', 'Nama profesi', [
  { h: '-wan 和 -wati', p: '来自梵语的后缀 «-wan» 表示“……的人”：«wartawan»（记者）、«karyawan»（员工）、«wisatawan»（游客）；女性用 «-wati»：«wartawati»、«karyawati»。', ex: [['Banyak [wisatawan] datang ke Bali.', '很多游客来巴厘岛。']] },
  { h: 'juru 和 tukang', p: '«juru» 指专门负责某事的人：«juru masak»（厨师）、«juru bicara»（发言人）；«tukang» 多指手艺人或体力活：«tukang kayu»（木匠）、«tukang cukur»（理发师）、«tukang ojek»（摩的司机）。', ex: [['[Juru bicara] perusahaan memberi keterangan.', '公司发言人做了说明。']] },
  { h: '问职业、答职业', p: '问：«Apa pekerjaan Anda?» 或 «Kerja di mana?»。答：«Saya (seorang) insinyur.»，«seorang»（一位）可以省略。', ex: [['Saya [seorang] guru.', '我是一名老师。']] }
], [
  { q: '“游客”是哪个词？', o: ['wisatawan', 'juru wisata', 'tukang wisata'], a: 0, why: '«wisata»（旅游）+ «-wan»（……的人）。' }
]);

DECK('g_serial', '动词可以直接串起来', 'Kata kerja berurutan', [
  { h: '不需要连接词', p: '两个动作可以直接连用：«mau pergi makan»（想去吃饭）、«coba lihat»（试着看看）、«ikut belajar»（一起学）。', ex: [['Saya [mau pergi makan].', '我想去吃饭。'], ['Ayo [ikut belajar]!', '一起来学吧！']] },
  { h: '表示目的：untuk 可省略', p: '«Saya ke pasar untuk beli sayur.» 和 «Saya ke pasar beli sayur.» 都对，意思是“我去市场买菜”。口语常省掉 «untuk»。', ex: [['Saya ke bank [untuk] setor uang.', '我去银行存钱。']] },
  { h: 'minta + di- 形式', p: '“请别人为我做”用 «minta» 加被动形式：«minta diantar»（请人送）、«minta dijemput»（请人接）、«minta dibungkus»（请人打包）。', ex: [['Saya [minta dijemput] jam lima.', '我请人五点来接我。']] }
], [
  { q: '“我想去买咖啡”怎么说？', o: ['Saya mau pergi beli kopi.', 'Saya mau untuk pergi untuk beli kopi.', 'Saya pergi mau kopi beli.'], a: 0, why: '动词按顺序直接连用：mau + pergi + beli。' }
]);

DECK('g_freq', '频率词放在哪里', 'Kata keterangan frekuensi', [
  { h: '一般放在动词前面', p: '«selalu / sering / kadang-kadang / jarang / tidak pernah» 一般放在主语后、动词前；«kadang-kadang» 和 «biasanya» 也能放在句首。', ex: [['Saya [sering] makan di sini.', '我常在这儿吃饭。'], ['[Biasanya] dia datang jam delapan.', '他通常八点来。']] },
  { h: '问“多久一次”', p: '«Berapa kali seminggu?»（一周几次？）、«Seberapa sering?»（多常？）。回答：«dua kali seminggu»（一周两次）、«sebulan sekali»（一个月一次）。', ex: [['Saya olahraga [tiga kali seminggu].', '我一周锻炼三次。']] },
  { h: 'pernah 和 sudah', p: '«pernah» = 有过这种经历（……过）；«sudah» = 已经完成。«Saya pernah ke Bali» 是“我去过巴厘岛”；«Saya sudah makan» 是“我已经吃过饭了”。' }
], [
  { q: '“你吃过榴莲吗？”怎么说？', o: ['Kamu pernah makan durian?', 'Kamu selalu makan durian?', 'Kamu jarang makan durian?'], a: 0, why: '问经历用 «pernah»。' }
]);

DECK('g_problem', '描述故障', 'Melaporkan kerusakan', [
  { h: '东西 + -nya + 状态', p: '最常用的说法：«Remnya blong»（刹车失灵）、«Mesinnya mati»（机器熄火了）、«Bannya bocor»（轮胎漏气）。«-nya» 指“这个、那个”。', ex: [['[Mesinnya] tidak mau hidup.', '机器打不着火。']] },
  { h: 'tidak mau 和 tidak bisa', p: '机器“不肯”工作常说 «tidak mau»：«tidak mau hidup»（打不着）、«tidak mau jalan»（开不动）；«tidak bisa» 表示没法：«tidak bisa dibuka»（打不开）。', ex: [['Pintunya [tidak bisa] dibuka.', '门打不开。']] },
  { h: '问原因、问进度', p: '«Kenapa?»（怎么了？）、«Rusaknya di mana?»（哪里坏了？）、«Sejak kapan?»（从什么时候开始？）、«Perlu berapa lama?»（要多久？）。', ex: [['[Sejak kapan] pompanya rusak?', '水泵从什么时候开始坏的？']] }
], [
  { q: '“发动机打不着火”怎么说？', o: ['Mesinnya tidak mau hidup.', 'Mesinnya bukan hidup.', 'Mesinnya belum mau mati.'], a: 0, why: '机器“不肯”工作用 «tidak mau»。' }
]);

DECK('g_sign', '告示牌和应急喊话', 'Papan peringatan', [
  { h: '四个开头词', t: [['开头', '意思', '例子'], ['«Dilarang»', '禁止', '«Dilarang merokok»'], ['«Harap»', '请', '«Harap tenang»'], ['«Awas»', '当心', '«Awas licin»'], ['«Wajib»', '必须', '«Wajib memakai helm»']], ex: [['[Dilarang] parkir di sini.', '此处禁止停车。']] },
  { h: 'dilarang 其实是被动', p: '«dilarang» = di- + larang（被禁止），后面直接跟动词：«Dilarang masuk»（禁止入内）。«harap» 本义是“希望”，用在告示里就是“请”。', ex: [['[Dilarang masuk] tanpa APD.', '未穿戴防护装备禁止入内。']] },
  { h: '紧急时最有用的几句', p: '«Tolong!»（救命！）、«Ada kebakaran!»（着火了！）、«Panggil ambulans!»（叫救护车！）、«Semua keluar!»（所有人出去！）、«Ke titik kumpul!»（到集合点！）。', ex: [['[Tolong]! Ada yang pingsan!', '救命！有人晕倒了！']] }
], [
  { q: '告示 «Harap antre» 的意思是：', o: ['禁止排队', '请排队', '当心排队'], a: 1, why: '«harap» 在告示里等于“请”。' }
]);
