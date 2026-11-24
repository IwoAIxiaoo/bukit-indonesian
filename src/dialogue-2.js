/* 短对话（二）：第 11–21 课。由 AI 编写，没有经过印尼语母语者审校。 */

/* ---------- 日常动作 ---------- */
DLG('daily', 1, '早上的安排', [
  ['A', 'Kamu bangun jam berapa tadi?', '你今天几点起床的？'],
  ['B', 'Jam enam. Tadi malam saya tidur jam sebelas.', '六点。昨晚我十一点睡的。'],
  ['A', 'Sudah mandi? Kita mau pergi jam tujuh.', '洗澡了吗？我们七点要出门。'],
  ['B', 'Sudah. Kamu pulang jam berapa nanti?', '洗了。你待会儿几点回家？'],
  ['A', 'Sore. Kalau teman datang, suruh duduk dulu.', '下午。要是朋友来了，让他先坐。'],
  ['B', 'Baik. Jangan berdiri terus di bus, ya!', '好的。在公交车上别一直站着！']
]);
DLG('daily', 2, '图书馆规定', [
  ['A', 'Boleh saya masuk?', '我可以进来吗？'],
  ['B', 'Silakan. Perpustakaan buka jam delapan dan tutup jam lima.', '请进。图书馆八点开门，五点关门。'],
  ['A', 'Saya mau baca buku dan tulis laporan.', '我想看书，还要写报告。'],
  ['B', 'Boleh, tapi di dalam jangan bicara keras.', '可以，不过在里面别大声说话。'],
  ['A', 'Maaf, saya tidak dengar. Apa?', '不好意思，我没听见。您说什么？'],
  ['B', 'Jangan bicara keras. Mau lihat buku lain, tanya saya.', '别大声说话。想看别的书就问我。'],
  ['A', 'Kalau keluar, bukunya ditaruh di mana?', '出去的时候，书放在哪儿？'],
  ['B', 'Kembalikan ke meja ini.', '还到这张桌子上。']
]);
DLG('daily', 3, '周末做家务', [
  ['A', 'Kamu sedang apa?', '你在做什么？'],
  ['B', 'Saya cuci baju, lalu mau masak.', '我在洗衣服，然后要做饭。'],
  ['A', 'Boleh saya tanya sesuatu?', '我能问你件事吗？'],
  ['B', 'Tanya saja. Saya jawab kalau tahu.', '尽管问。我知道的话就回答。'],
  ['A', 'Saya cari kunci motor. Kamu pakai tadi?', '我在找摩托车钥匙。你刚才用了吗？'],
  ['B', 'Tunggu, saya bicara dulu dengan ibu. Mungkin dia tahu.', '等一下，我先跟妈妈说一声。也许她知道。']
]);
DLG('daily', 4, '忘带东西', [
  ['A', 'Kamu mau kerja atau main hari ini?', '你今天要上班还是出去玩？'],
  ['B', 'Kerja. Tapi saya lupa bawa dompet!', '上班。可是我忘了带钱包！'],
  ['A', 'Kamu ingat taruh di mana?', '你记得放在哪儿了吗？'],
  ['B', 'Tidak tahu. Mungkin di meja.', '不知道。可能在桌上。'],
  ['A', 'Ayo jalan, saya bayar dulu.', '走吧，我先帮你付。']
]);

/* ---------- 方向与交通 ---------- */
DLG('place', 1, '问路', [
  ['A', 'Permisi, apotek dekat dari sini?', '劳驾，药店离这儿近吗？'],
  ['B', 'Tidak jauh. Jalan lurus saja.', '不远。一直往前走。'],
  ['A', 'Lalu belok kiri atau kanan?', '然后左转还是右转？'],
  ['B', 'Belok kiri di lampu merah.', '在红绿灯左转。'],
  ['A', 'Apoteknya di situ?', '药店就在那儿？'],
  ['B', 'Ya, di situ, sebelah bank.', '对，就在那儿，银行旁边。']
]);
DLG('place', 2, '叫车', [
  ['A', 'Mau ke sana naik apa? Mobil atau motor?', '去那边坐什么？汽车还是摩托？'],
  ['B', 'Naik ojek saja, lebih cepat.', '坐摩的吧，快一点。'],
  ['A', 'Kalau hujan, naik taksi.', '要是下雨就坐出租车。'],
  ['B', 'Ojeknya tunggu di depan atau belakang?', '摩的在前门等还是后门等？'],
  ['A', 'Di depan, samping toko roti.', '前门，面包店旁边。'],
  ['B', 'Oke, saya ke sana sekarang.', '好，我现在过去。']
]);
DLG('place', 3, '去机场', [
  ['A', 'Ke bandara lebih baik naik kereta atau bus?', '去机场坐火车好还是坐大巴好？'],
  ['B', 'Naik kereta dari stasiun pusat.', '从中央火车站坐火车。'],
  ['A', 'Turun di mana?', '在哪儿下车？'],
  ['B', 'Turun di stasiun bandara. Keretanya berhenti di sana.', '在机场站下。火车会停在那儿。'],
  ['A', 'Pesawat saya jam empat sore.', '我的飞机是下午四点。'],
  ['B', 'Masih banyak waktu.', '时间还很充裕。']
]);
DLG('place', 4, '堵车迟到', [
  ['A', 'Maaf, saya terlambat. Jalannya macet sekali.', '对不起，我迟到了。路上太堵了。'],
  ['B', 'Tidak apa-apa. Kamu sampai jam berapa tadi?', '没关系。你刚才几点到的？'],
  ['A', 'Jam sembilan. Sopir salah alamat.', '九点。司机走错了地址。'],
  ['B', 'Nanti saya antar kamu pulang.', '待会儿我送你回家。'],
  ['A', 'Terima kasih banyak.', '太感谢了。']
]);

/* ---------- 酒店与旅行 ---------- */
DLG('trip', 1, '房间有问题', [
  ['A', 'Selamat malam. Masih ada kamar kosong di hotel ini?', '晚上好。这家酒店还有空房间吗？'],
  ['B', 'Ada. Ini kuncinya, kamar nomor dua belas.', '有。这是钥匙，十二号房。'],
  ['A', 'Maaf, tempat tidurnya rusak.', '不好意思，床坏了。'],
  ['B', 'Oh, maaf. Ada masalah lain?', '哦，抱歉。还有别的问题吗？'],
  ['A', 'Di kamar mandi tidak ada handuk.', '浴室里没有毛巾。'],
  ['B', 'Kami ganti kamarnya dan bawa handuk sekarang.', '我们给您换房间，现在就送毛巾过去。']
]);
DLG('trip', 2, '计划旅行', [
  ['A', 'Liburan nanti mau ke pantai atau gunung?', '放假要去海边还是山里？'],
  ['B', 'Ke pulau kecil dekat Bali. Ada danau juga.', '去巴厘岛附近的小岛。那里也有湖。'],
  ['A', 'Itu tempat wisata terkenal. Tiket sudah beli?', '那是有名的旅游景点。票买了吗？'],
  ['B', 'Sudah. Jangan lupa bawa paspor.', '买了。别忘了带护照。'],
  ['A', 'Nanti kita ambil banyak foto, ya!', '到时候我们多拍点照片！']
]);
DLG('trip', 3, '海边度假', [
  ['A', 'Kapan kita berangkat?', '我们什么时候出发？'],
  ['B', 'Besok pagi. Koper sudah siap?', '明天早上。行李箱准备好了吗？'],
  ['A', 'Sudah. Kita menginap di mana?', '好了。我们住哪儿？'],
  ['B', 'Di vila dekat pantai. Pantainya indah dan sepi, tidak ramai.', '海边的别墅。那里的海滩很美，人少，不热闹。'],
  ['A', 'Asyik, saya mau berenang setiap hari!', '太好了，我要每天游泳！'],
  ['B', 'Kita bisa sewa motor dan jalan-jalan ke desa.', '我们可以租摩托车，到村子里逛逛。'],
  ['A', 'Perlu pemandu?', '需要导游吗？'],
  ['B', 'Tidak perlu. Liburan santai saja.', '不需要。就轻松度个假。']
]);

/* ---------- 住处与家居 ---------- */
DLG('home', 1, '看出租房', [
  ['A', 'Rumah ini punya dua kamar dan satu dapur.', '这房子有两个房间和一个厨房。'],
  ['B', 'Pintunya baru, ya? Jendelanya juga besar.', '门是新的吧？窗户也很大。'],
  ['A', 'Lantainya bersih. Ada kursi dan lemari.', '地板很干净。有椅子和柜子。'],
  ['B', 'Kasurnya bagaimana?', '床垫怎么样？'],
  ['A', 'Kasurnya baru juga. Mau lihat?', '床垫也是新的。要看看吗？'],
  ['B', 'Boleh.', '好啊。']
]);
DLG('home', 2, '搬进出租屋', [
  ['A', 'Minggu depan saya pindah ke kos baru.', '下周我搬到新的出租屋。'],
  ['B', 'Di sana ada kulkas dan kipas angin?', '那里有冰箱和电风扇吗？'],
  ['A', 'Ada. Lampu dan listrik juga sudah termasuk.', '有。灯和电费也都包含了。'],
  ['B', 'Sampah dibuang di mana?', '垃圾扔在哪里？'],
  ['A', 'Di depan rumah. Saya juga harus beli sapu.', '房子前面。我还得买把扫帚。']
]);
DLG('home', 3, '出门前检查', [
  ['A', 'Di luar sudah gelap. Tolong nyalakan lampu.', '外面已经黑了。请把灯打开。'],
  ['B', 'Di dalam masih terang. Sebentar lagi.', '屋里还亮着。过一会儿吧。'],
  ['A', 'Sebelum pergi, matikan kipas di atas.', '出门前，把楼上的风扇关掉。'],
  ['B', 'Ada sampah di bawah meja. Saya bersihkan dulu.', '桌子底下有垃圾。我先打扫一下。'],
  ['A', 'Terima kasih. Kuncinya ada di saya.', '谢谢。钥匙在我这儿。']
]);

/* ---------- 身体与健康 ---------- */
DLG('health', 1, '儿童学身体部位', [
  ['A', 'Ini apa, Nak?', '孩子，这是什么？'],
  ['B', 'Ini kepala. Ini mata dan telinga.', '这是头。这是眼睛和耳朵。'],
  ['A', 'Pintar! Ini hidung atau mulut?', '真聪明！这是鼻子还是嘴？'],
  ['B', 'Hidung! Dan di dalam mulut ada gigi.', '鼻子！嘴里面有牙齿。'],
  ['A', 'Ini tangan, dan ini?', '这是手，那这个呢？'],
  ['B', 'Kaki!', '脚！']
]);
DLG('health', 2, '向同事请病假', [
  ['A', 'Kamu kenapa? Badan kamu panas.', '你怎么了？你身上很烫。'],
  ['B', 'Saya demam dan batuk sejak kemarin.', '我从昨天开始发烧、咳嗽。'],
  ['A', 'Pilek juga?', '也流鼻涕吗？'],
  ['B', 'Ya. Kepala pusing dan perut mual.', '是的。头晕，还恶心想吐。'],
  ['A', 'Kalau sakit, pulang saja. Saya bilang ke atasan.', '不舒服就回家吧。我跟上司说。']
]);
DLG('health', 3, '看完医生', [
  ['A', 'Dokter bilang apa di rumah sakit?', '医生在医院怎么说？'],
  ['B', 'Saya cuma masuk angin. Harus istirahat dua hari.', '我只是着凉了。要休息两天。'],
  ['A', 'Obatnya sudah beli di apotek?', '药在药店买了吗？'],
  ['B', 'Sudah. Saya alergi satu obat, jadi dokter ganti.', '买了。我对一种药过敏，所以医生换了。'],
  ['A', 'Luka di tangan kamu juga sudah sembuh?', '你手上的伤口也好了吗？'],
  ['B', 'Sudah. Semoga cepat sehat lagi.', '好了。希望早点恢复健康。']
]);

/* ---------- 天气与自然 ---------- */
DLG('weather', 1, '雨季来了', [
  ['A', 'Cuaca hari ini bagaimana?', '今天天气怎么样？'],
  ['B', 'Tadi pagi cerah, sekarang mendung.', '早上还晴朗，现在阴天了。'],
  ['A', 'Mungkin nanti hujan. Anginnya kencang.', '待会儿可能下雨。风很大。'],
  ['B', 'Sekarang sudah masuk musim hujan.', '现在已经进入雨季了。'],
  ['A', 'Semoga tidak banjir seperti tahun lalu.', '希望别像去年那样发大水。'],
  ['B', 'Musim kemarau masih lama.', '离旱季还早呢。']
]);
DLG('weather', 2, '山上的天气', [
  ['A', 'Di gunung udaranya sejuk, ya.', '山上空气真凉爽。'],
  ['B', 'Suhu pagi ini cuma lima belas derajat.', '今天早上气温只有十五度。'],
  ['A', 'Lihat langit itu. Banyak awan hitam.', '看那片天空。好多乌云。'],
  ['B', 'Matahari sudah hilang. Ada petir juga.', '太阳已经不见了。还打雷了。'],
  ['A', 'Kemarin ada gempa kecil di sini.', '昨天这里有个小地震。'],
  ['B', 'Pantas udaranya lembap sekali.', '难怪空气这么潮湿。']
]);
DLG('weather', 3, '被雨淋了', [
  ['A', 'Kenapa baju kamu basah?', '你衣服怎么湿了？'],
  ['B', 'Saya kehujanan. Lupa bawa payung.', '我被雨淋了。忘带伞了。'],
  ['A', 'Kemarin kamu kepanasan, hari ini kehujanan!', '昨天你热坏了，今天又被雨淋了！'],
  ['B', 'Ha ha. Di pinggir sungai tidak ada pohon besar.', '哈哈。河边没有大树。'],
  ['A', 'Ganti baju yang kering dulu.', '先换上干衣服。'],
  ['B', 'Besok kita ke laut saja. Udaranya lebih segar.', '明天我们去海边吧。那里空气更清新。']
]);

/* ---------- 情绪与想法 ---------- */
DLG('feel', 1, '今天心情怎么样', [
  ['A', 'Kamu kenapa? Sedih atau marah?', '你怎么了？难过还是生气？'],
  ['B', 'Tidak, saya cuma capek dan bosan.', '没有，我只是累了，也很无聊。'],
  ['A', 'Saya kaget tadi lihat muka kamu.', '刚才看到你的脸色，我吓了一跳。'],
  ['B', 'Jangan takut. Saya baik-baik saja.', '别担心。我没事。'],
  ['A', 'Kamu suka film? Ayo nonton film cinta.', '你喜欢电影吗？走，去看爱情片。'],
  ['B', 'Boleh, saya suka sekali!', '好啊，我很喜欢！']
]);
DLG('feel', 2, '第一次上台讲话', [
  ['A', 'Besok saya harus bicara di depan direktur.', '明天我得在总经理面前讲话。'],
  ['B', 'Jangan khawatir. Kamu perlu sabar dan tenang.', '别担心。你需要耐心、冷静。'],
  ['A', 'Saya malu kalau salah.', '要是说错了我会很难为情。'],
  ['B', 'Boleh salah sedikit. Saya ingin dengar juga.', '错一点没关系。我也想听听。'],
  ['A', 'Terima kasih. Kalau berhasil, saya bangga sekali.', '谢谢。要是成功了，我会很自豪。']
]);
DLG('feel', 3, '意见不同', [
  ['A', 'Saya pikir rencana ini benar.', '我觉得这个计划是对的。'],
  ['B', 'Saya merasa ada yang salah.', '我觉得有地方不对。'],
  ['A', 'Mungkin kamu bingung soal biayanya.', '也许你对费用有点糊涂。'],
  ['B', 'Mungkin. Tapi saya belum setuju.', '也许吧。不过我还不同意。'],
  ['A', 'Tenang saja. Pasti ada jalan keluarnya.', '别急。一定会有办法的。'],
  ['B', 'Semoga. Kasihan tim kita kalau gagal.', '希望如此。要是失败了，我们团队就太可怜了。']
]);

/* ---------- 办公与商务 ---------- */
DLG('work', 1, '签合同', [
  ['A', 'Kantor perusahaan Bapak di mana?', '您公司的办公室在哪里？'],
  ['B', 'Di Jakarta Selatan. Besok ada rapat dengan atasan saya.', '在南雅加达。明天和我上司开会。'],
  ['A', 'Berapa karyawan di sana?', '那里有多少员工？'],
  ['B', 'Sekitar dua ratus. Rekan kerja saya juga ikut rapat.', '大约两百人。我的同事也参加会议。'],
  ['A', 'Kontraknya sudah siap?', '合同准备好了吗？'],
  ['B', 'Sudah. Tinggal tanda tangan direktur.', '好了。只差总经理签字。']
]);
DLG('work', 2, '项目进度', [
  ['A', 'Jadwal proyek minggu ini bagaimana?', '这周的项目日程怎么样？'],
  ['B', 'Saya harus kirim laporan dan penawaran ke pelanggan.', '我要给客户发报告和报价。'],
  ['A', 'Kerja sama dengan perusahaan itu lancar?', '和那家公司合作顺利吗？'],
  ['B', 'Lancar. Mereka mau proyek kedua.', '顺利。他们想做第二个项目。'],
  ['A', 'Bagus. Mungkin gaji kita naik, ha ha.', '好啊。说不定我们会涨工资，哈哈。']
]);
DLG('work', 3, '请假和加班', [
  ['A', 'Minggu depan saya mau ambil cuti.', '下周我想请假。'],
  ['B', 'Tapi ada janji dengan klien. Dokumennya belum siap.', '可是和客户有约。文件还没准备好。'],
  ['A', 'Saya lembur malam ini dan kirim lewat email.', '我今晚加班，用电子邮件发过去。'],
  ['B', 'Jangan lupa produk baru kita. Untungnya besar.', '别忘了我们的新产品。利润很高。'],
  ['A', 'Oke. Kartu nama saya habis, tolong pesan lagi.', '好。我的名片用完了，请再订一些。']
]);
DLG('work', 4, '交代任务', [
  ['A', 'Proyek ini mulai hari Senin.', '这个项目星期一开始。'],
  ['B', 'Siapa yang tanggung jawab?', '谁负责？'],
  ['A', 'Kamu. Harus selesai tepat waktu.', '你。必须按时完成。'],
  ['B', 'Baik, saya usahakan selesai hari Jumat.', '好的，我争取星期五完成。']
]);

/* ---------- 工地与矿区 ---------- */
DLG('site', 1, '新工人第一天', [
  ['A', 'Selamat datang di tambang batu bara.', '欢迎来到煤矿。'],
  ['B', 'Terima kasih. Saya pekerja baru di sini.', '谢谢。我是这里的新工人。'],
  ['A', 'Keselamatan nomor satu. Selalu pakai helm.', '安全第一。一直要戴安全帽。'],
  ['B', 'Alat berat di sana untuk apa?', '那边的重型机械是干什么的？'],
  ['A', 'Untuk muat batu bara ke truk.', '把煤装上卡车。'],
  ['B', 'Sopir truknya kerja berapa jam?', '卡车司机工作几个小时？'],
  ['A', 'Dua belas jam, dua shift.', '十二个小时，两班倒。']
]);
DLG('site', 2, '港口装货', [
  ['A', 'Kapal tongkang sudah sampai di pelabuhan?', '驳船到港口了吗？'],
  ['B', 'Sudah. Sekarang mulai muat batu bara.', '到了。现在开始装煤。'],
  ['A', 'Kapan bongkar di kapal besar?', '什么时候卸到大船上？'],
  ['B', 'Besok pagi, kalau izin sudah keluar.', '明天早上，要是许可下来了的话。'],
  ['A', 'Target produksi bulan ini berapa?', '这个月的生产目标是多少？'],
  ['B', 'Lima ratus ribu ton.', '五十万吨。']
]);
DLG('site', 3, '设备检修', [
  ['A', 'Awas! Mesin itu sedang dalam perbaikan.', '小心！那台机器正在维修。'],
  ['B', 'Ada bahaya apa?', '有什么危险？'],
  ['A', 'Solar bocor di lokasi itu. Pengawas sudah datang.', '那个地点柴油泄漏了。监工已经来了。'],
  ['B', 'Suku cadangnya ada di gudang?', '配件在仓库里吗？'],
  ['A', 'Ada. Menurut aturan, satu shift harus cek dulu.', '有。按规定，每个班先要检查。'],
  ['B', 'Mesin ini bisa angkat berapa ton?', '这台机器能吊多少吨？'],
  ['A', 'Sekitar tiga puluh ton.', '大约三十吨。']
]);

/* ---------- 宗教与节日 ---------- */
DLG('religion', 1, '各种宗教', [
  ['A', 'Di Indonesia ada berapa agama?', '印尼有几种宗教？'],
  ['B', 'Ada enam, misalnya Islam, Kristen, Buddha, dan Hindu.', '有六种，比如伊斯兰教、基督教、佛教和印度教。'],
  ['A', 'Orang Islam salat di masjid, ya?', '穆斯林在清真寺做礼拜，对吧？'],
  ['B', 'Ya. Orang Kristen ke gereja.', '是的。基督徒去教堂。'],
  ['A', 'Klenteng itu untuk siapa?', '华人庙宇是给谁的？'],
  ['B', 'Untuk orang Tionghoa, banyak yang Buddha.', '是给华人的，很多是佛教徒。']
]);
DLG('religion', 2, '节日一年到头', [
  ['A', 'Bulan Ramadan teman Islam puasa, ya?', '斋月里穆斯林朋友要斋戒，对吧？'],
  ['B', 'Ya, dan salat lima kali sehari.', '对，一天还要礼拜五次。'],
  ['A', 'Setelah itu Lebaran. Banyak orang mudik.', '之后就是开斋节。很多人回乡。'],
  ['B', 'Kami merayakan Imlek, teman Kristen merayakan Natal.', '我们过春节，基督徒朋友过圣诞节。'],
  ['A', 'Kalau undang teman Islam makan, pilih restoran halal.', '请穆斯林朋友吃饭，要选清真餐厅。']
]);
DLG('religion', 3, '开斋节祝福', [
  ['A', 'Selamat Hari Raya! Mohon maaf lahir dan batin.', '节日快乐！请原谅我的一切过错。'],
  ['B', 'Sama-sama. Terima kasih atas ucapannya.', '彼此彼此。谢谢你的祝福。'],
  ['A', 'Kamu sudah terima THR dari kantor?', '你收到公司的节日津贴了吗？'],
  ['B', 'Sudah. Libur kali ini kami berdoa bersama di rumah nenek.', '收到了。这次放假我们在奶奶家一起祈祷。'],
  ['A', 'Semoga Tuhan memberkati kalian.', '愿神保佑你们。'],
  ['B', 'Amin. Daging babi haram untuk kami, jadi kita makan ayam saja.', '但愿如此。猪肉对我们来说是禁忌，所以我们就吃鸡肉吧。']
]);
