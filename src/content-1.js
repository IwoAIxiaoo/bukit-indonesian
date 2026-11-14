/* ===== 课程内容 1：问候 · 人称 · 数字 · 时间 · 疑问与连接 =====
   每行一个词：词|词性|中文|例句=翻译|例句=翻译|!用法说明（可选）
   例句里用 [ ] 标出目标词（可以是加了词缀的形式）。 */

TOPIC({
  id: 'greet', zh: '问候与礼貌', idn: 'Salam dan Sopan Santun', sc: ['daily', 'travel', 'biz'],
  decks: { 9: 'g_noconj', 14: 'g_please' },
  tips: [
    { t: '先叫一声 Bapak / Ibu', b: '对成年男性称 «Bapak»（简称 «Pak»），对成年女性称 «Ibu»（简称 «Bu»），哪怕对方比你年轻，只要是客户、长辈或有身份的人都这样叫。年轻人之间可以用 «Mas»（哥，爪哇用法）、«Mbak»（姐）或 «Kak»。直接叫全名会显得生硬。' },
    { t: '右手与“手放胸口”', b: '握手力度轻一点，很多人握完会把右手轻贴在胸口，意思是“发自内心”，你也可以照做。递东西、收东西、指东西都用右手，左手传统上被认为不洁。' }
  ],
  words: `
selamat pagi|phr|早上好（约上午 10 点前）|[Selamat pagi], Pak!=早上好，先生！|[Selamat pagi], semuanya.=大家早上好。
selamat siang|phr|中午好（约 10 点到 15 点）|[Selamat siang], Bu. Mau makan apa?=中午好，女士。想吃点什么？|[Selamat siang], saya mau bertemu Pak Andi.=中午好，我想见安迪先生。
selamat sore|phr|下午好（约 15 点到天黑）|[Selamat sore], Mbak.=下午好（对年轻女士）。|[Selamat sore], apa kabar hari ini?=下午好，今天过得怎么样？
selamat malam|phr|晚上好；晚安|[Selamat malam], selamat datang di hotel kami.=晚上好，欢迎光临我们酒店。|[Selamat malam], sampai besok!=晚安，明天见！
halo|intj|你好；喂（打电话）|[Halo], nama saya Lina.=你好，我叫丽娜。|[Halo], ini dengan siapa?=喂，请问是哪位？
apa kabar|phr|你好吗；最近怎么样|[Apa kabar], Pak Budi?=布迪先生，您好吗？|Lama tidak bertemu, [apa kabar]?=好久不见，最近怎么样？
baik|adj|好；（回答）很好|Kabar saya [baik], terima kasih.=我很好，谢谢。|Dia orang yang [baik].=他是个好人。
terima kasih|phr|谢谢|[Terima kasih] banyak, Bu!=非常感谢您，女士！|[Terima kasih] atas bantuannya.=谢谢您的帮助。
sama-sama|phr|不客气|“Terima kasih.” “[Sama-sama].”=“谢谢。”“不客气。”|[Sama-sama], senang bisa membantu.=不客气，很高兴能帮上忙。
maaf|intj|对不起；不好意思|[Maaf], saya terlambat.=对不起，我迟到了。|[Maaf], bisa bicara pelan-pelan?=不好意思，能说慢一点吗？
permisi|intj|劳驾；借过；（离开时）告辞|[Permisi], numpang lewat.=劳驾，借过一下。|[Permisi], toiletnya di mana?=打扰一下，洗手间在哪里？
tolong|v|请（帮忙）；救命|[Tolong] bantu saya, ya.=请帮我一下。|[Tolong] tutup pintunya.=请把门关上。
silakan|v|请（您自便、您先请）|[Silakan] duduk.=请坐。|[Silakan] masuk, Pak.=请进，先生。
mohon|v|恳请；敬请（正式）|[Mohon] tunggu sebentar.=请稍等。|[Mohon] maaf atas ketidaknyamanannya.=对于造成的不便，敬请原谅。
selamat datang|phr|欢迎|[Selamat datang] di Indonesia!=欢迎来到印度尼西亚！|[Selamat datang] di rumah kami.=欢迎来到我们家。
sampai jumpa|phr|再见|[Sampai jumpa] minggu depan!=下周见！|Oke, [sampai jumpa] lagi.=好的，再会。
selamat jalan|phr|一路平安（对要离开的人说）|[Selamat jalan], hati-hati di jalan!=一路平安，路上小心！|[Selamat jalan], semoga sampai dengan selamat.=一路顺风，祝平安抵达。
selamat tinggal|phr|再见（离开的人对留下的人说）|[Selamat tinggal], Jakarta!=再见了，雅加达！|Kami pulang dulu. [Selamat tinggal]!=我们先回去了，再见！
hati-hati|adj|小心；保重|[Hati-hati], lantainya licin.=小心，地板很滑。|[Hati-hati] di jalan, ya!=路上小心哦！
ya|part|是的；好的；（句末）……哦|[Ya], saya mengerti.=是的，我明白。|Besok datang, [ya]!=明天要来哦！|!口语里常说 iya
tidak|neg|不；没有（否定动词、形容词）|Saya [tidak] tahu.=我不知道。|Ini [tidak] mahal.=这个不贵。|!口语常说 nggak / gak
kenal|v|认识|Senang [berkenalan] dengan Anda.=很高兴认识您。|Apakah kamu [kenal] Pak Hasan?=你认识哈山先生吗？|!berkenalan = 互相认识、结识
senang|adj|高兴；喜欢|Saya [senang] sekali hari ini.=我今天很高兴。|[Senang] bertemu dengan Anda.=很高兴见到您。
sebentar|adv|一会儿；稍微|Tunggu [sebentar], ya.=等一下哦。|Saya keluar [sebentar].=我出去一下。
kembali|v|回来；（回应感谢）也谢谢你|“Terima kasih.” “Terima kasih [kembali].”=“谢谢。”“也谢谢你。”|Saya akan [kembali] jam tiga.=我三点回来。
`
});

TOPIC({
  id: 'people', zh: '人称与自我介绍', idn: 'Kata Ganti dan Perkenalan', sc: ['daily', 'biz'],
  decks: { 8: 'g_pronoun', 26: 'g_tidakbukan' },
  tips: [
    { t: '“Tionghoa”，不说 “Cina”', b: '华人族群叫 «Tionghoa»，中国这个国家叫 «Tiongkok»。«Cina» 一词在历史上带有贬义，2014 年政府已正式改用 «Tiongkok / Tionghoa»，正式场合尽量避免说 «Cina»。介绍自己可以说 «Saya orang Tiongkok»。' },
    { t: '被问私事别惊讶', b: '初次见面，印尼人常会问你多大、结婚没有、信什么教、住在哪里。这是表示友好和关心，不算冒犯。可以简单回答，也可以笑着说 «Rahasia, dong!»（秘密啦！）带过。' }
  ],
  words: `
saya|pron|我（通用、礼貌）|[Saya] orang Tiongkok.=我是中国人。|Nama [saya] Wang Wei.=我的名字叫王伟。
aku|pron|我（亲密、口语）|[Aku] lapar sekali.=我好饿。|[Aku] sayang kamu.=我爱你。
kamu|pron|你（平辈、熟人）|[Kamu] dari mana?=你是哪里人？|Ini untuk [kamu].=这是给你的。
Anda|pron|您（正式；书面多用）|Siapa nama [Anda]?=您叫什么名字？|Apakah [Anda] bisa berbahasa Inggris?=您会说英语吗？
dia|pron|他；她|[Dia] teman saya.=他是我的朋友。|[Dia] sedang bekerja.=她正在工作。
kami|pron|我们（不包括听话人）|[Kami] dari Shanghai.=我们来自上海。|[Kami] sudah makan, terima kasih.=我们吃过了，谢谢。
kita|pron|咱们（包括听话人）|Ayo [kita] makan!=咱们去吃饭吧！|[Kita] bertemu besok, ya.=咱们明天见哦。
mereka|pron|他们；她们|[Mereka] orang Indonesia.=他们是印尼人。|[Mereka] belum datang.=他们还没来。
Bapak|n|父亲；先生；（尊称男性）您|[Pak], mau ke mana?=先生，您要去哪儿？|[Bapak] sudah makan?=您吃过饭了吗？|!简称 Pak，常加在名字前：Pak Budi
Ibu|n|母亲；女士；（尊称女性）您|[Bu], ini harganya berapa?=女士，这个多少钱？|[Ibu] tinggal di mana?=您住在哪里？|!简称 Bu，常加在名字前：Bu Sari
Mas|n|哥；小哥（称呼年轻男性）|[Mas], tolong satu kopi lagi.=小哥，请再来一杯咖啡。|[Mas] Andi kerja di bank.=安迪哥在银行工作。
Mbak|n|姐；小姐（称呼年轻女性）|[Mbak], boleh minta menunya?=小姐，可以给我菜单吗？|[Mbak] Sari sangat ramah.=萨丽姐很热情。
nama|n|名字|Siapa [nama] kamu?=你叫什么名字？|[Nama] saya Li Ming.=我叫李明。
orang|n|人；（量词）个（人）|Dia [orang] Jawa.=他是爪哇人。|Kami ada lima [orang].=我们一共五个人。
dari|prep|从；来自|Saya [dari] Tiongkok.=我来自中国。|Dia datang [dari] Surabaya.=他从泗水来。
asal|n|出身；籍贯|[Asal] Anda dari mana?=您是哪里人？|Saya [asal] Guangzhou.=我是广州人。
tinggal|v|住；居住；剩下|Saya [tinggal] di Jakarta.=我住在雅加达。|Kamu [tinggal] dengan siapa?=你跟谁住？
pekerjaan|n|工作；职业|Apa [pekerjaan] Anda?=您是做什么工作的？|[Pekerjaan] saya insinyur.=我的职业是工程师。
umur|n|年龄|Berapa [umur] Anda?=您多大年纪？|[Umur] saya tiga puluh tahun.=我三十岁。
bahasa|n|语言|Saya sedang belajar [bahasa] Indonesia.=我正在学印尼语。|Dia bisa tiga [bahasa].=他会三种语言。
bisa|aux|能；会；可以|Saya [bisa] bahasa Indonesia sedikit.=我会一点印尼语。|[Bisa] bantu saya?=能帮我一下吗？
sedikit|adv|一点；少|Saya mengerti [sedikit].=我懂一点。|Gulanya [sedikit] saja.=糖少放一点。
mengerti|v|明白；懂|Maaf, saya tidak [mengerti].=对不起，我不明白。|Apakah kamu [mengerti]?=你明白吗？
belajar|v|学习|Saya [belajar] setiap malam.=我每天晚上学习。|Di mana kamu [belajar] bahasa Indonesia?=你在哪里学的印尼语？
teman|n|朋友|Dia [teman] kerja saya.=他是我的同事。|Saya punya banyak [teman] di Bali.=我在巴厘岛有很多朋友。
bukan|neg|不是（否定名词）|Saya [bukan] orang Jepang.=我不是日本人。|Ini [bukan] tas saya.=这不是我的包。
`
});

TOPIC({
  id: 'number', zh: '数字与金钱', idn: 'Angka dan Uang', sc: ['daily', 'travel', 'biz'],
  decks: { 16: 'g_number', 24: 'g_classifier' },
  tips: [
    { t: '印尼盾的“零”很多', b: '1 元人民币约合两千多印尼盾（汇率会变动）。书写时用点号分隔千位：«Rp15.000»，逗号才是小数点。摊贩报价常省掉 «ribu»（千）：说 «lima belas» 往往就是 15.000。«rb» = ribu，«jt» = juta。' },
    { t: '雅加达街头的闽南语数字', b: '在雅加达常听到来自闽南语的数字俚语：«seceng» = 1.000，«goceng» = 5.000，«ceban» = 10.000，«goban» = 50.000，«cepek» = 100。听到 «goceng» 不用慌，就是“五千”。' }
  ],
  words: `
nol|num|零|Nomor HP saya [nol] delapan satu dua.=我的手机号是 0812 开头。|Skornya dua [nol].=比分二比零。
satu|num|一|Saya mau [satu] gelas teh.=我要一杯茶。|Tunggu [satu] menit.=等一分钟。
dua|num|二|Saya punya [dua] adik.=我有两个弟弟妹妹。|Minta [dua] tiket, ya.=请给我两张票。
tiga|num|三|Kami menginap [tiga] malam.=我们住三晚。|Jam [tiga] saya ada rapat.=我三点有会。
empat|num|四|Rumahnya ada [empat] kamar.=他家有四个房间。|Kita bertemu tanggal [empat].=我们四号见。
lima|num|五|[Lima] menit lagi saya sampai.=我还有五分钟到。|Harganya [lima] puluh ribu.=价格五万（盾）。
enam|num|六|Saya bangun jam [enam].=我六点起床。|Anaknya berumur [enam] tahun.=他的孩子六岁。
tujuh|num|七|Seminggu ada [tujuh] hari.=一周有七天。|Kantor buka jam [tujuh] pagi.=办公室早上七点开门。
delapan|num|八|Kamar saya nomor [delapan].=我的房间是八号。|Saya kerja [delapan] jam sehari.=我一天工作八小时。
sembilan|num|九|Pesawatnya berangkat jam [sembilan].=飞机九点起飞。|[Sembilan] orang sudah daftar.=已经有九个人报名了。
sepuluh|num|十|Tunggu [sepuluh] menit, ya.=等十分钟哦。|Harganya [sepuluh] ribu rupiah.=价格一万印尼盾。
belas|num|十几（11–19，放在个位后）|Dua [belas], tiga [belas], empat [belas].=十二、十三、十四。|Umurnya lima [belas] tahun.=他十五岁。|!11 是 sebelas，不说 satu belas
puluh|num|几十（dua puluh = 20）|Saya sudah tiga [puluh] tahun.=我已经三十岁了。|Dua [puluh] ribu, boleh?=两万，可以吗？
ratus|num|百（100 = seratus）|[Seratus] ribu rupiah.=十万印尼盾。|Ada tiga [ratus] pekerja di sini.=这里有三百名工人。
ribu|num|千（1.000 = seribu）|Ini harganya lima belas [ribu].=这个一万五（千盾）。|Jaraknya [seribu] meter.=距离一千米。
juta|num|百万|Gajinya sepuluh [juta] per bulan.=他月薪一千万（盾）。|Penduduk Jakarta lebih dari sepuluh [juta].=雅加达人口超过一千万。
setengah|num|一半；半|Saya mau [setengah] kilo.=我要半公斤。|Tunggu [setengah] jam lagi.=再等半小时。
berapa|q|多少；几|[Berapa] harganya?=多少钱？|Anda di sini [berapa] lama?=您在这里待多久？
uang|n|钱|Saya tidak bawa [uang] tunai.=我没带现金。|[Uang]nya kurang.=钱不够。
rupiah|n|印尼盾|Satu dolar berapa [rupiah]?=一美元换多少印尼盾？|Harganya dua puluh ribu [rupiah].=价格两万印尼盾。
kembalian|n|找零|Ini [kembalian]nya, Pak.=先生，这是找您的零钱。|Maaf, tidak ada [kembalian].=抱歉，没有零钱找。
nomor|n|号码；编号|Boleh minta [nomor] HP Anda?=可以给我您的手机号吗？|Kamar [nomor] berapa?=几号房间？
pertama|num|第一|Ini kali [pertama] saya ke Bali.=这是我第一次去巴厘岛。|Hari [pertama] kerja sangat sibuk.=上班第一天非常忙。
kedua|num|第二；两者|Ini anak [kedua] saya.=这是我的第二个孩子。|Kami bertemu untuk [kedua] kalinya.=我们这是第二次见面。
banyak|adj|多；很多|Terima kasih [banyak]!=非常感谢！|Di sini [banyak] orang.=这里人很多。
semua|pron|所有；全部|[Semua] sudah siap.=全部都准备好了。|Berapa [semua]nya?=一共多少钱？
`
});

TOPIC({
  id: 'time', zh: '时间与日期', idn: 'Waktu dan Tanggal', sc: ['daily', 'biz'],
  decks: { 27: 'g_aspect', 30: 'g_clock' },
  tips: [
    { t: '“Jam karet”：橡皮时间', b: '印尼人常自嘲 «jam karet»（橡皮做的钟），朋友聚会迟到 15–30 分钟很常见。但航班、商务会议和政府办事要准时。约时间时可以确认一句 «Jam berapa tepatnya?»（具体几点？）。' },
    { t: '周五中午别约会', b: '每周五中午穆斯林男性要去清真寺做聚礼（«Salat Jumat»），大约 11:30–13:00 很多办公室和小店会暂停，安排会议、拜访时最好避开这个时段。' }
  ],
  words: `
jam|n|点钟；小时；手表|Sekarang [jam] berapa?=现在几点？|Saya menunggu dua [jam].=我等了两个小时。
menit|n|分钟|Lima [menit] lagi kita berangkat.=再过五分钟我们出发。|Jam tujuh lewat sepuluh [menit].=七点十分。
hari|n|天；日|[Hari] ini panas sekali.=今天很热。|Saya di Bali tiga [hari].=我在巴厘岛待三天。
minggu|n|星期；周|Saya libur [minggu] depan.=我下周休假。|Dua [minggu] lagi saya pulang.=再过两周我回国。|!大写 Minggu 是“星期日”
bulan|n|月；月亮|[Bulan] depan saya pindah.=下个月我搬家。|Lihat, [bulan]nya bulat sekali!=看，月亮好圆！
tahun|n|年；岁|Saya sudah dua [tahun] di sini.=我在这里两年了。|Selamat [Tahun] Baru!=新年快乐！
sekarang|adv|现在|Saya sibuk [sekarang].=我现在很忙。|[Sekarang] jam berapa?=现在几点？
nanti|adv|待会儿；以后|[Nanti] saya telepon, ya.=我待会儿给你打电话。|Sampai [nanti]!=回头见！
tadi|adv|刚才|[Tadi] ada orang mencari Anda.=刚才有人找您。|[Tadi] pagi saya ke pasar.=今天早上我去了市场。
kemarin|adv|昨天|[Kemarin] hujan deras.=昨天下大雨。|Saya bertemu dia [kemarin].=我昨天见了他。
besok|adv|明天|[Besok] saya libur.=明天我休息。|Sampai [besok]!=明天见！
pagi|n|早上|Saya minum kopi setiap [pagi].=我每天早上喝咖啡。|Besok [pagi] jam berapa?=明天早上几点？
siang|n|中午；白天|Kita makan [siang] bersama, yuk.=我们一起吃午饭吧。|[Siang] ini panas sekali.=今天中午好热。
sore|n|下午；傍晚|Saya pulang kerja jam lima [sore].=我下午五点下班。|Setiap [sore] dia lari di taman.=他每天傍晚在公园跑步。
malam|n|晚上；夜|Tadi [malam] saya tidak bisa tidur.=昨晚我睡不着。|Kami menginap dua [malam].=我们住两晚。
Senin|n|星期一|Hari [Senin] saya ada rapat.=星期一我有会。|Toko ini tutup setiap [Senin].=这家店每周一关门。
Selasa|n|星期二|Hari [Selasa] saya ke Surabaya.=星期二我去泗水。|Rapatnya hari [Selasa] pagi.=会议在星期二上午。
Rabu|n|星期三|Hari ini hari [Rabu].=今天是星期三。|[Rabu] depan saya cuti.=下周三我请假。
Kamis|n|星期四|Kami bertemu hari [Kamis].=我们星期四见面。|Laporannya harus selesai hari [Kamis].=报告必须在星期四完成。
Jumat|n|星期五|Setiap [Jumat] siang banyak orang salat di masjid.=每周五中午很多人去清真寺礼拜。|Sampai hari [Jumat]!=星期五见！
Sabtu|n|星期六|Hari [Sabtu] saya tidak kerja.=星期六我不上班。|[Sabtu] malam kita nonton film, yuk.=星期六晚上我们去看电影吧。
Minggu|n|星期日|Hari [Minggu] pasar sangat ramai.=星期天市场很热闹。|Setiap hari [Minggu] dia ke gereja.=他每个星期天去教堂。
kapan|q|什么时候|[Kapan] Anda datang ke Indonesia?=您什么时候来印尼的？|[Kapan] rapatnya mulai?=会议什么时候开始？
sudah|adv|已经|Saya [sudah] makan.=我已经吃过了。|[Sudah] jam sembilan!=已经九点了！|!口语常说 udah
belum|adv|还没|Saya [belum] makan.=我还没吃饭。|“Sudah selesai?” “[Belum].”=“做完了吗？”“还没有。”
sedang|adv|正在|Dia [sedang] rapat.=他正在开会。|Saya [sedang] di jalan.=我在路上了。
akan|adv|将要；会|Saya [akan] pulang bulan depan.=我下个月要回国。|Harga [akan] naik.=价格会上涨。
tanggal|n|日期；号|Hari ini [tanggal] berapa?=今天几号？|[Tanggal] lima belas saya cuti.=十五号我请假。
lewat|v|过；经过（几点过几分）|Jam delapan [lewat] lima belas.=八点十五分。|Bus ini [lewat] Monas?=这辆公交车经过独立纪念碑吗？
kurang|adv|差；少；不够（几点差几分）|Jam sembilan [kurang] sepuluh.=差十分九点（8:50）。|Garamnya [kurang].=盐不够。
`
});

TOPIC({
  id: 'connect', zh: '疑问词与连接词', idn: 'Kata Tanya dan Penghubung', sc: ['daily', 'travel', 'biz'],
  decks: { 9: 'g_question', 25: 'g_yang' },
  tips: [
    { t: '听懂语气词，像个本地人', b: '印尼口语里到处是 «sih»、«dong»、«kok»、«deh»、«kan»、«yuk»。它们本身没有意思，却决定语气：«Ayo dong!»（快点嘛！）、«Kok mahal?»（怎么这么贵？）、«Enak, kan?»（好吃吧？）。先学会听懂，再慢慢开口用。' },
    { t: '印尼人很少直接说“不”', b: '当对方回答 «Nanti saja»（以后再说）、«Kita lihat nanti»（到时候看看）或 «Insya Allah»（如果真主允许）时，往往表示“不确定”，甚至是委婉的拒绝。需要明确答复时，可以再温和地确认一次。' }
  ],
  words: `
apa|q|什么|[Apa] ini?=这是什么？|Kamu mau minum [apa]?=你想喝什么？
siapa|q|谁|[Siapa] nama Anda?=您叫什么名字？|Ini rumah [siapa]?=这是谁的房子？
di mana|q|在哪里|Toilet [di mana]?=洗手间在哪里？|[Di mana] Anda tinggal?=您住在哪里？
ke mana|q|去哪里|Mau [ke mana], Pak?=先生，您去哪儿？|[Ke mana] kita setelah ini?=这之后我们去哪儿？
dari mana|q|从哪里|Anda [dari mana]?=您是哪里人？|Baru pulang [dari mana]?=你刚从哪儿回来？
kenapa|q|为什么|[Kenapa] kamu terlambat?=你为什么迟到？|[Mengapa] harganya naik?=为什么价格上涨了？|!正式说法 mengapa
bagaimana|q|怎么样；怎么|[Bagaimana] kabarnya?=近况如何？|[Bagaimana] cara ke bandara?=怎么去机场？|!口语常说 gimana
yang mana|q|哪一个|Tas Anda [yang mana]?=您的包是哪一个？|Kamu mau [yang mana], merah atau biru?=你要哪个，红的还是蓝的？
apakah|q|是否（正式疑问句开头）|[Apakah] Anda sudah makan?=您吃过饭了吗？|[Apakah] kamar ini ada AC?=这个房间有空调吗？
dan|conj|和；与|Saya [dan] istri saya.=我和我妻子。|Nasi goreng [dan] es teh, ya.=一份炒饭和一杯冰茶。
atau|conj|或者；还是|Teh [atau] kopi?=茶还是咖啡？|Hari ini [atau] besok, sama saja.=今天或明天都一样。
tapi|conj|但是|Murah, [tapi] bagus.=便宜但是好。|Saya mau ikut, [tetapi] saya sibuk.=我想去，但是我很忙。|!正式说法 tetapi
karena|conj|因为|Saya terlambat [karena] macet.=我因为堵车迟到了。|[Karena] hujan, kami di rumah saja.=因为下雨，我们就待在家里。
jadi|conj|所以；那么；成为|Hujan deras, [jadi] saya naik taksi.=雨很大，所以我坐出租车。|[Jadi], kapan kita mulai?=那么，我们什么时候开始？
kalau|conj|如果；至于|[Kalau] hujan, kita tidak jadi pergi.=如果下雨，我们就不去了。|[Kalau] saya, pilih yang ini.=要是我的话，选这个。
juga|adv|也|Saya [juga] suka kopi.=我也喜欢咖啡。|Dia [juga] dari Tiongkok.=他也是从中国来的。
saja|adv|只；就（……好了）|Air putih [saja].=白开水就好。|Di sini [saja].=就在这儿吧。|!口语常说 aja
masih|adv|还；仍然|Toko itu [masih] buka.=那家店还开着。|Saya [masih] belajar.=我还在学习。
lagi|adv|再；又；（口语）正在|Satu [lagi], ya.=再来一个。|Coba [lagi]!=再试一次！
hanya|adv|只；仅仅|Saya [hanya] punya uang kecil.=我只有零钱。|[Hanya] lima menit dari sini.=离这里只有五分钟。
dengan|prep|和；跟；用|Saya pergi [dengan] teman.=我跟朋友一起去。|Bayar [dengan] kartu bisa?=可以刷卡付款吗？
untuk|prep|为了；给|Ini [untuk] Anda.=这是给您的。|Meja [untuk] dua orang.=两人桌。
setelah|conj|……之后|[Setelah] makan, kita jalan-jalan.=吃完饭后我们去逛逛。|Telepon saya [setelah] rapat.=开完会后给我打电话。
sebelum|conj|……之前|Cuci tangan [sebelum] makan.=饭前洗手。|[Sebelum] tidur, saya membaca.=睡前我看书。
yang|part|……的（关系词）|Saya mau [yang] besar.=我要大的。|Orang [yang] pakai topi itu bos saya.=戴帽子的那个人是我老板。
`
});
