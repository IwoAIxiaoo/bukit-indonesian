/* 短对话（三）：第 22–31 课。由 AI 编写，没有经过印尼语母语者审校。行业对话里的公司、数字都是虚构的。 */

/* ---------- 煤炭开采 ---------- */
DLG('coal', 1, '介绍矿区开采方式', [
  ['A', 'Tambang ini tambang terbuka atau tambang bawah tanah?', '这个矿是露天矿还是井工矿？'],
  ['B', 'Tambang terbuka. Pertama ada pengupasan tanah penutup.', '露天矿。首先是剥离覆盖层。'],
  ['A', 'Nisbah kupas di sini berapa?', '这里的剥采比是多少？'],
  ['B', 'Sekitar lima banding satu.', '大约五比一。'],
  ['A', 'Sebelum itu ada pengeboran dan peledakan?', '在那之前要钻孔和爆破吗？'],
  ['B', 'Ya. Setelah peledakan, ekskavator mulai kerja.', '是的。爆破之后挖掘机开始干活。']
]);
DLG('coal', 2, '从堆场到母船', [
  ['A', 'Pengangkutan batu bara lewat mana?', '煤从哪里运？'],
  ['B', 'Lewat jalan hauling ke stockpile dekat dermaga.', '走矿区运输道路，运到码头附近的堆场。'],
  ['A', 'Lalu alih muat ke kapal induk?', '然后过驳到母船上？'],
  ['B', 'Betul. Kapal induknya menunggu di laut.', '对。母船在海上等着。'],
  ['A', 'Kalori batu bara ini berapa?', '这批煤的热值是多少？'],
  ['B', 'Sekitar empat ribu dua ratus. Kadar sulfurnya rendah.', '大约四千二百。硫含量低。']
]);
DLG('coal', 3, '检验和出口', [
  ['A', 'Surveyor sudah ambil sampel?', '检验员取样了吗？'],
  ['B', 'Sudah. Kadar air dan abu masih dicek.', '取了。水分和灰分还在检测。'],
  ['A', 'Pembeli dari Tiongkok mau tambah pasokan.', '中国的买家想增加供应量。'],
  ['B', 'Cadangan kita cukup? Eksplorasi di blok baru belum selesai.', '我们的储量够吗？新区块的勘探还没完成。'],
  ['A', 'Cukup untuk ekspor tahun ini.', '够今年出口。'],
  ['B', 'Tapi PLTU dalam negeri juga butuh batu bara.', '不过国内的燃煤电厂也需要煤。']
]);

/* ---------- 金属矿与冶炼 ---------- */
DLG('metal', 1, '各种矿产', [
  ['A', 'Sulawesi terkenal dengan nikel, ya?', '苏拉威西以镍出名，对吧？'],
  ['B', 'Ya. Papua punya emas dan tembaga.', '对。巴布亚有金和铜。'],
  ['A', 'Timah dan bauksit di mana?', '锡和铝土矿在哪里？'],
  ['B', 'Timah di Bangka, bauksit di Kalimantan Barat.', '锡在邦加，铝土矿在西加里曼丹。'],
  ['A', 'Bijih nikel diolah jadi konsentrat dulu?', '镍矿石先加工成精矿吗？'],
  ['B', 'Tidak, langsung masuk smelter.', '不，直接进冶炼厂。']
]);
DLG('metal', 2, '镍产业链', [
  ['A', 'Smelter ini untuk pemurnian atau pengolahan?', '这家冶炼厂是做精炼还是加工？'],
  ['B', 'Pengolahan bijih mentah jadi feronikel.', '把原矿加工成镍铁。'],
  ['A', 'Nanti juga untuk baterai kendaraan listrik?', '以后也用来做电动车电池吗？'],
  ['B', 'Ya, ada pabrik baterai di kawasan industri ini.', '是的，这个工业园区里有电池厂。'],
  ['A', 'Berapa tungku di sini?', '这里有几座炉？'],
  ['B', 'Enam tungku.', '六座。']
]);
DLG('metal', 3, '合资建厂', [
  ['A', 'Pabrik baru ini perusahaan patungan, ya?', '这座新工厂是合资公司的吧？'],
  ['B', 'Ya, investasi dari dua produsen besar.', '是的，两家大生产商投资的。'],
  ['A', 'Bahan baku dari tambang sendiri?', '原料来自自己的矿吗？'],
  ['B', 'Sebagian besar. Limbah dan tailing harus dikelola dengan baik.', '大部分是。废弃物和尾矿必须好好处理。'],
  ['A', 'Saham perusahaannya ada di bursa?', '公司的股票在交易所上市吗？'],
  ['B', 'Tahun depan baru masuk bursa.', '明年才上市。']
]);

/* ---------- 矿业政策与合规 ---------- */
DLG('policy', 1, '办证和缴费', [
  ['A', 'IUP kita masih berlaku?', '我们的采矿经营许可证还有效吗？'],
  ['B', 'Masih. Tapi RKAB tahun depan harus diajukan ke Kementerian ESDM.', '有效。不过明年的工作计划与预算要报能矿部。'],
  ['A', 'Direktorat Minerba sudah minta data?', '矿物与煤炭总司要数据了吗？'],
  ['B', 'Sudah. Mereka juga cek pembayaran royalti dan pajak.', '要了。他们还查权利金和税的缴纳。'],
  ['A', 'Bagaimana dengan bea keluar?', '出口关税呢？'],
  ['B', 'Untuk bijih nikel ada larangan ekspor, jadi tidak ada bea keluar.', '镍矿石禁止出口，所以没有出口关税。']
]);
DLG('policy', 2, '环保和下游化', [
  ['A', 'Pemerintah dorong hilirisasi, ya?', '政府在推动下游化，对吧？'],
  ['B', 'Ya. Untuk batu bara ada DMO dan HBA.', '对。煤炭有国内市场供应义务和基准价。'],
  ['A', 'AMDAL proyek baru sudah selesai?', '新项目的环评做完了吗？'],
  ['B', 'Belum. Rencana reklamasi dan pascatambang juga harus ada.', '还没。还要有复垦和闭坑计划。'],
  ['A', 'Kalau tidak ada?', '要是没有呢？'],
  ['B', 'Ada sanksi. Perusahaan asing juga wajib divestasi saham.', '会被处罚。外资公司还必须剥离股权。']
]);
DLG('policy', 3, '和地方打交道', [
  ['A', 'Pemerintah daerah ada pertemuan dengan masyarakat besok.', '地方政府明天和当地社区开会。'],
  ['B', 'Soal pembebasan lahan, ya?', '是关于征地的吧？'],
  ['A', 'Ya, dan soal tambang ilegal di dekat sini.', '对，还有附近非法采矿的问题。'],
  ['B', 'Menurut undang-undang, izinnya bisa kena pencabutan.', '按法律，许可证可能会被撤销。'],
  ['A', 'Peraturan baru juga atur kuota tenaga kerja asing.', '新法规还规定了外籍员工的配额。'],
  ['B', 'Kita wajib ikut aturan itu.', '我们必须遵守这些规定。']
]);

/* ---------- 读懂矿业新闻 ---------- */
DLG('news', 1, '读产量新闻', [
  ['A', 'Berita hari ini: produksi batu bara meningkat.', '今天的新闻：煤炭产量上升了。'],
  ['B', 'Tapi harga menurun, kan?', '可是价格下降了，对吧？'],
  ['A', 'Ya. Kenaikan produksi sebesar sepuluh persen.', '是的。产量增加了百分之十。'],
  ['B', 'Penurunan harga berapa?', '价格降了多少？'],
  ['A', 'Sekitar lima persen. Produksi mencapai dua juta ton.', '大约百分之五。产量达到两百万吨。'],
  ['B', 'Pemerintah menetapkan harga acuan baru juga.', '政府也规定了新的基准价。']
]);
DLG('news', 2, '新政策公布', [
  ['A', 'Kementerian menerbitkan kebijakan baru.', '部里发布了新政策。'],
  ['B', 'Apa isinya?', '内容是什么？'],
  ['A', 'Mewajibkan smelter lapor realisasi produksi setiap kuartal.', '规定冶炼厂必须每季度报告实际产量。'],
  ['B', 'Kapan berlaku?', '什么时候生效？'],
  ['A', 'Mulai tahun depan. Mereka juga melarang ekspor tanpa izin.', '明年开始。他们还禁止无证出口。'],
  ['B', 'Kapan diumumkan? Saya belum dengar.', '什么时候宣布的？我还没听说。'],
  ['A', 'Menteri mengumumkan kemarin sore.', '部长昨天下午宣布的。']
]);
DLG('news', 3, '分析市场趋势', [
  ['A', 'Menurut pihak perusahaan, permintaan dari India naik.', '据公司方面说，印度的需求增加了。'],
  ['B', 'Dibanding tahun lalu?', '和去年相比吗？'],
  ['A', 'Ya, naik dua puluh persen secara tahunan.', '是的，同比增长百分之二十。'],
  ['B', 'Terkait nikel, trennya bagaimana?', '镍方面，趋势怎么样？'],
  ['A', 'Investasinya mencapai tiga miliar dolar.', '投资达到三十亿美元。'],
  ['B', 'Kalau rupiah, puluhan triliun, ya.', '换成卢比的话，有几十万亿了。']
]);

/* ---------- 手机与网络 ---------- */
DLG('phone', 1, '刚到印尼买电话卡', [
  ['A', 'HP saya tidak ada sinyal.', '我的手机没信号。'],
  ['B', 'Sudah beli pulsa dan paket data?', '买话费和流量套餐了吗？'],
  ['A', 'Belum. Di sini ada WiFi?', '还没。这里有无线网络吗？'],
  ['B', 'Ada. Kata sandinya di kertas itu.', '有。密码写在那张纸上。'],
  ['A', 'Saya mau unduh aplikasi ojek.', '我想下载打车软件。'],
  ['B', 'Unduh aplikasi itu, gratis.', '下载那个软件吧，免费的。']
]);
DLG('phone', 2, '视频会议', [
  ['A', 'Tolong telepon saya nanti, ya.', '待会儿请给我打电话。'],
  ['B', 'Saya balas email dulu, lalu cas HP.', '我先回邮件，然后给手机充电。'],
  ['A', 'Layar laptop saya rusak.', '我笔记本电脑的屏幕坏了。'],
  ['B', 'Pakai HP saja untuk video.', '就用手机视频吧。'],
  ['A', 'Internetnya lambat. Saya tidak bisa unggah file.', '网速很慢。我没法上传文件。'],
  ['B', 'Coba keluar dari akun, lalu masuk lagi.', '试试退出账号，再重新登录。']
]);
DLG('phone', 3, '迷路时打电话', [
  ['A', 'Halo? Suara kamu tidak jelas.', '喂？你的声音听不清楚。'],
  ['B', 'Sinyal di sini jelek, sering terputus.', '这里信号不好，经常断。'],
  ['A', 'Kamu sudah lihat peta?', '你看地图了吗？'],
  ['B', 'HP saya hampir mati. Tolong kirim lokasi di grup.', '我手机快没电了。请在群里发个位置。'],
  ['A', 'Oke. Simpan kontak saya juga.', '好。也存一下我的联系方式。'],
  ['B', 'Saya tidak main media sosial, cuma pakai pesan.', '我不玩社交媒体，只用短信。'],
  ['A', 'HP kamu masih hidup? Oke, cepat ke sini!', '你手机还开着吧？好，快过来！']
]);

/* ---------- 银行与办事 ---------- */
DLG('bank', 1, '在银行开户', [
  ['A', 'Saya mau buka rekening di bank ini.', '我想在这家银行开户。'],
  ['B', 'Baik. Nanti bisa transfer dan cek saldo lewat aplikasi.', '好的。以后可以用应用转账、查余额。'],
  ['A', 'Bisa tarik tunai di ATM mana saja?', '在哪个取款机都能取现吗？'],
  ['B', 'Bisa. Kalau mau setor uang, datang ke sini.', '可以。要存钱的话来这里。'],
  ['A', 'Kurs dolar hari ini berapa?', '今天美元汇率是多少？'],
  ['B', 'Lima belas ribu lima ratus. Tagihan listrik juga bisa dibayar di sini.', '一万五千五。电费账单也可以在这里交。']
]);
DLG('bank', 2, '在移民局办手续', [
  ['A', 'Di kantor imigrasi, saya harus isi formulir?', '在移民局要填表吗？'],
  ['B', 'Ya, isi formulir ini dulu, lalu antre.', '是的，先填这张表，然后排队。'],
  ['A', 'Syaratnya apa saja?', '需要哪些材料？'],
  ['B', 'Paspor asli dan fotokopi.', '护照原件和复印件。'],
  ['A', 'Surat dari kantor perlu cap?', '公司的信要盖章吗？'],
  ['B', 'Perlu, cap perusahaan.', '要，盖公司的章。']
]);
DLG('bank', 3, '钱包丢了', [
  ['A', 'Dompet saya hilang. Paspor dan izin tinggal di dalam!', '我钱包丢了。护照和居留许可都在里面！'],
  ['B', 'Lapor ke polisi dulu. Mereka buat surat.', '先去报警。他们会开证明。'],
  ['A', 'Biayanya berapa?', '要多少钱？'],
  ['B', 'Gratis. Tulis data diri kamu.', '免费。写下你的个人信息。'],
  ['A', 'Izin tinggal saya juga harus diperpanjang bulan depan.', '我的居留许可下个月也要延期。'],
  ['B', 'Sekalian saja. Perpanjang di imigrasi minggu ini.', '那就一起办吧。这周去移民局延期。']
]);

/* ---------- 职业与身份 ---------- */
DLG('jobs', 1, '村里的人都做什么', [
  ['A', 'Ayahmu guru, ya?', '你爸爸是老师吧？'],
  ['B', 'Ya. Saya masih mahasiswa.', '是的。我还是大学生。'],
  ['A', 'Orang di desa kamu kerja apa?', '你们村里的人做什么工作？'],
  ['B', 'Banyak petani dan nelayan. Ada pedagang juga.', '很多是农民和渔民。也有商贩。'],
  ['A', 'Kakak kamu insinyur di tambang?', '你哥哥是矿上的工程师？'],
  ['B', 'Ya. Paman saya satpam di sana, sepupu saya manajer.', '是的。我叔叔是那里的保安，我表哥是经理。']
]);
DLG('jobs', 2, '公司里的人', [
  ['A', 'Direktur kita orang mana?', '我们总经理是哪里人？'],
  ['B', 'Orang Jakarta. Sekretarisnya dari Medan.', '雅加达人。他的秘书来自棉兰。'],
  ['A', 'Akuntan baru itu dulu pengusaha, ya?', '那位新会计以前是做生意的吧？'],
  ['B', 'Ya. Di kantor juga ada tukang dan montir.', '对。公司里还有工匠和修车师傅。'],
  ['A', 'Juru masak di kantin enak masakannya.', '食堂厨师做的饭很好吃。'],
  ['B', 'Dia dulu pembantu di rumah direktur.', '他以前在总经理家里当帮工。']
]);
DLG('jobs', 3, '接待客人', [
  ['A', 'Hari ini ada tamu dari Tiongkok.', '今天有中国来的客人。'],
  ['B', 'Klien baru bos kita?', '我们老板的新客户？'],
  ['A', 'Ya. Saya jadi penerjemah.', '是的。我当翻译。'],
  ['B', 'Ada wartawan juga? Dan pegawai negeri dari dinas?', '也有记者吗？还有政府部门的公务员？'],
  ['A', 'Ada. Istrinya dulu pramugari, sekarang sudah pensiun.', '有。他妻子以前是空姐，现在已经退休了。']
]);

/* ---------- 常用动词 ---------- */
DLG('verbs', 1, '借东西', [
  ['A', 'Boleh saya pinjam payung kamu?', '我可以借你的伞吗？'],
  ['B', 'Boleh. Nanti kembalikan, ya.', '可以。之后还给我。'],
  ['A', 'Pasti. Tolong bantu saya bawa kotak ini.', '一定。请帮我搬这个箱子。'],
  ['B', 'Ini kotak dari siapa?', '这个箱子是谁给的？'],
  ['A', 'Teman kasih kemarin. Saya terima dengan senang.', '朋友昨天给的。我很高兴地收下了。'],
  ['B', 'Simpan di gudang saja.', '放在仓库里吧。'],
  ['A', 'Oke. Nanti saya beri dia oleh-oleh juga.', '好。以后我也送他点礼物。']
]);
DLG('verbs', 2, '出发去机场前', [
  ['A', 'Kamu jemput saya jam berapa?', '你几点来接我？'],
  ['B', 'Jam lima. Saya ajak adik juga.', '五点。我也叫上弟弟。'],
  ['A', 'Tolong periksa paspor saya dulu.', '请先帮我检查一下护照。'],
  ['B', 'Ada. Percaya saja, semua sudah siap. Mau ganti baju?', '在呢。放心吧，都准备好了。要换衣服吗？'],
  ['A', 'Ya. Pilih yang mana, merah atau biru?', '要。选哪件，红的还是蓝的？'],
  ['B', 'Biru. Hitung koper kamu, ada tiga?', '蓝的。数一下你的行李箱，是三个吗？'],
  ['A', 'Ya, tiga. Panggil taksi, ya.', '对，三个。叫辆出租车吧。']
]);
DLG('verbs', 3, '修车', [
  ['A', 'Mobil saya mogok. Bisa perbaiki?', '我的车抛锚了。能修吗？'],
  ['B', 'Bisa. Siapkan alatnya dulu.', '能。先把工具准备好。'],
  ['A', 'Perlu angkat mobilnya?', '要把车抬起来吗？'],
  ['B', 'Tidak. Kita dorong ke bengkel saja.', '不用。我们推到修理厂吧。'],
  ['A', 'Hati-hati, jangan tarik kabel itu. Bisa jatuh.', '小心，别拉那根线。会掉下来的。'],
  ['B', 'Jangan lempar kuncinya! Mau ikut ke bengkel?', '别扔钥匙！要一起去修理厂吗？'],
  ['A', 'Tidak, saya tolak. Saya tunggu di sini.', '不了，我就不去了。我在这儿等。']
]);

/* ---------- 频率与程度 ---------- */
DLG('freq', 1, '运动习惯', [
  ['A', 'Kamu selalu olahraga setiap pagi?', '你每天早上都运动吗？'],
  ['B', 'Tidak selalu. Biasanya tiga kali seminggu.', '不是每天。通常一周三次。'],
  ['A', 'Saya jarang olahraga. Kadang-kadang jalan kaki.', '我很少运动。有时候走走路。'],
  ['B', 'Kamu pernah berenang di laut?', '你在海里游过泳吗？'],
  ['A', 'Tidak pernah. Tapi saya sering ke pantai.', '从来没有。不过我常去海边。']
]);
DLG('freq', 2, '学印尼语的进步', [
  ['A', 'Bahasa Indonesia kamu semakin lancar!', '你的印尼语越来越流利了！'],
  ['B', 'Terima kasih. Saya terus belajar setiap hari.', '谢谢。我每天一直在学。'],
  ['A', 'Saya baru saja mulai. Hampir tidak bisa apa-apa.', '我才刚开始。几乎什么都不会。'],
  ['B', 'Langsung bicara dengan orang lokal saja.', '直接和当地人说话吧。'],
  ['A', 'Sekali-sekali saya coba, tapi malu.', '我偶尔试一下，可是不好意思。'],
  ['B', 'Segera mulai, jangan takut salah.', '马上开始，别怕说错。']
]);
DLG('freq', 3, '估算价钱', [
  ['A', 'Restoran ini paling murah di sini?', '这家餐厅是这里最便宜的吗？'],
  ['B', 'Ya, makan siang cuma dua puluh ribu.', '是的，午饭只要两万。'],
  ['A', 'Kalau lima orang, kira-kira berapa?', '五个人的话，大概多少钱？'],
  ['B', 'Kira-kira seratus ribu. Datang jam dua belas tepat, ya.', '大概十万。十二点整来啊。']
]);

/* ---------- 设备与维修 ---------- */
DLG('equip', 1, '车辆保养', [
  ['A', 'Mobil ini perlu ganti oli dan ban.', '这辆车要换机油和轮胎。'],
  ['B', 'Remnya juga bunyi. Aki juga lemah.', '刹车也有响声。蓄电池也没劲了。'],
  ['A', 'Bawa ke bengkel saja. Mekaniknya bagus.', '送修理厂吧。那里的机修工很好。'],
  ['B', 'Suku cadangnya ada?', '有配件吗？'],
  ['A', 'Ada. Alat mereka juga lengkap.', '有。他们的工具也很齐全。']
]);
DLG('equip', 2, '发电机出问题', [
  ['A', 'Genset di lokasi mogok lagi.', '现场的发电机组又坏了。'],
  ['B', 'Sudah servis bulan lalu, kan?', '上个月不是保养过了吗？'],
  ['A', 'Sudah. Tapi selang pompanya bocor.', '保养过。可是泵的软管漏了。'],
  ['B', 'Mungkin bautnya lepas. Perlu las juga?', '可能是螺栓松了。还要焊吗？'],
  ['A', 'Mungkin. Saya panggil mekanik sekarang.', '可能要。我现在就叫机修工。']
]);
DLG('equip', 3, '每天开工前检查', [
  ['A', 'Sebelum mulai, cek bahan bakar dan HM dulu.', '开工前，先检查燃料和运行小时数。'],
  ['B', 'Bannya sudah aus.', '轮胎已经磨损了。'],
  ['A', 'Bautnya kencang atau longgar?', '螺栓是紧的还是松的？'],
  ['B', 'Agak longgar. Ada kerusakan kecil juga.', '有点松。还有点小故障。'],
  ['A', 'Tulis di laporan, ya.', '写进报告里。']
]);

/* ---------- 安全与应急 ---------- */
DLG('safety', 1, '安全培训', [
  ['A', 'Kalau ada kecelakaan atau keadaan darurat, apa yang kita lakukan?', '要是发生事故或紧急情况，我们该怎么办？'],
  ['B', 'Pertama, pakai APD: helm, sarung tangan, kacamata, dan rompi.', '首先，穿戴劳保用品：安全帽、手套、护目镜和反光背心。'],
  ['A', 'Kalau ada kebakaran?', '要是着火了呢？'],
  ['B', 'Pakai APAR. Ada di samping pintu.', '用灭火器。就在门旁边。'],
  ['A', 'Saya belum pernah pakai APAR.', '我还没用过灭火器。'],
  ['B', 'Nanti kita latihan bersama.', '待会儿我们一起练习。']
]);
DLG('safety', 2, '紧急撤离', [
  ['A', 'Ada api di gudang! Cepat evakuasi!', '仓库着火了！快撤离！'],
  ['B', 'Titik kumpul di mana?', '集合点在哪里？'],
  ['A', 'Di depan kantor. Hati-hati, ada longsor di jalan belakang.', '办公室前面。小心，后面的路有滑坡。'],
  ['B', 'Ada korban? Satu orang pingsan!', '有伤员吗？有一个人晕倒了！'],
  ['A', 'Bawa kotak P3K. Saya telepon ambulans.', '拿急救箱来。我打电话叫救护车。']
]);
DLG('safety', 3, '边坡作业提醒', [
  ['A', 'Lihat tanda itu: "Dilarang masuk".', '看那个牌子：“禁止进入”。'],
  ['B', 'Harap waspada. Lereng itu tidak aman.', '请注意。那段边坡不安全。'],
  ['A', 'Kemarin ada pekerja tergelincir di sana.', '昨天有个工人在那儿滑倒了。'],
  ['B', 'Dia luka bakar juga?', '他也烧伤了吗？'],
  ['A', 'Tidak. Hanya luka kecil di kaki.', '没有。只是脚上有点小伤。']
]);
