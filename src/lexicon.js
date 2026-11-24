/* ===== 词条扩展：词根、口语形式、挖空短句 =====
   由 AI 编写，没有经过印尼语母语者审校。写法见 pre.js 里的 LEX() 说明；没写到的词由 applyLexicon() 自动补默认值。 */

/* ---------- 词根：带词缀的词（含词组里带词缀的那个词）---------- */
[
  ['pekerjaan', 'kerja'], ['pekerja', 'kerja'], ['belajar', 'ajar'], ['kembalian', 'kembali'], ['kembalikan', 'kembali'],
  ['kedua', 'dua'], ['setengah', 'tengah'], ['menikah', 'nikah'], ['pelayan', 'layan'], ['liburan', 'libur'],
  ['berdiri', 'diri'], ['keluar', 'luar'], ['berhenti', 'henti'], ['terlambat', 'lambat'], ['berenang', 'renang'],
  ['berangkat', 'angkat'], ['menginap', 'inap'], ['pemandu', 'pandu'], ['bersihkan', 'bersih'], ['nyalakan', 'nyala'],
  ['matikan', 'mati'], ['kehujanan', 'hujan'], ['kepanasan', 'panas'], ['merasa', 'rasa'], ['setuju', 'tuju'],
  ['semoga', 'moga'], ['kasihan', 'kasih'], ['perusahaan', 'usaha'], ['pengusaha', 'usaha'], ['karyawan', 'karya'],
  ['laporan', 'lapor'], ['penawaran', 'tawar'], ['pelanggan', 'langgan'], ['keselamatan', 'selamat'], ['pelabuhan', 'labuh'],
  ['perbaikan', 'baik'], ['perbaiki', 'baik'], ['pengawas', 'awas'], ['berdoa', 'doa'], ['bersama', 'sama'],
  ['pengupasan', 'kupas'], ['pengeboran', 'bor'], ['peledakan', 'ledak'], ['pengangkutan', 'angkut'], ['cadangan', 'cadang'],
  ['suku cadang', 'cadang'], ['pembeli', 'beli'], ['pasokan', 'pasok'], ['pemurnian', 'murni'], ['pengolahan', 'olah'],
  ['larangan', 'larang'], ['melarang', 'larang'], ['dilarang', 'larang'], ['pencabutan', 'cabut'], ['peraturan', 'atur'],
  ['pembebasan lahan', 'bebas'], ['meningkat', 'tingkat'], ['menurun', 'turun'], ['penurunan', 'turun'], ['kenaikan', 'naik'],
  ['mencapai', 'capai'], ['sebesar', 'besar'], ['sekitar', 'kitar'], ['menetapkan', 'tetap'], ['menerbitkan', 'terbit'],
  ['mewajibkan', 'wajib'], ['berlaku', 'laku'], ['mengumumkan', 'umum'], ['kebijakan', 'bijak'], ['permintaan', 'minta'],
  ['dibanding', 'banding'], ['menurut', 'turut'], ['terkait', 'kait'], ['terputus', 'putus'], ['tagihan', 'tagih'],
  ['perpanjang', 'panjang'], ['petani', 'tani'], ['pedagang', 'dagang'], ['pembantu', 'bantu'], ['wartawan', 'warta'],
  ['penerjemah', 'terjemah'], ['siapkan', 'siap'], ['biasanya', 'biasa'], ['setiap', 'tiap'], ['semakin', 'makin'],
  ['kerusakan', 'rusak'], ['kecelakaan', 'celaka'], ['kebakaran', 'bakar'], ['bahan bakar', 'bakar'], ['luka bakar', 'bakar'],
  ['tergelincir', 'gelincir'], ['jalan-jalan', 'jalan'], ['kadang-kadang', 'kadang'], ['sekali-sekali', 'kali'],
  ['pemerintah daerah', 'perintah'], ['kendaraan listrik', 'kendara'], ['pegawai negeri', 'gawai'], ['pascatambang', 'tambang'],
  ['hilirisasi', 'hilir'], ['tanah penutup', 'tutup'], ['titik kumpul', 'kumpul'], ['secara tahunan', 'tahun'],
  ['undang-undang', 'undang'], ['ucapan', 'ucap']
].forEach(([id, root]) => LEX(id, { rootWord: root }));

/* ---------- 口语形式：日常说话里的缩写和变体 ---------- */
// 复习时打出这些形式也算对，会同时提示标准写法
[
  ['tidak', ['gak', 'nggak', 'enggak']], ['tidak pernah', ['gak pernah', 'nggak pernah']], ['sudah', ['udah', 'dah']],
  ['belum', ['belom']], ['saja', ['aja']], ['tahu', ['tau']], ['bagaimana', ['gimana']], ['kenapa', ['napa']],
  ['mau', ['mo']], ['sedang', ['lagi']], ['aku', ['gue', 'gua']], ['kamu', ['lu', 'lo', 'elu']],
  ['terima kasih', ['makasih', 'trims']], ['dengan', ['sama']], ['kemarin', ['kemaren']], ['benar', ['bener']],
  ['pakai', ['pake']], ['cari', ['nyari']], ['ambil', ['ngambil']], ['lihat', ['liat']], ['dengar', ['denger']],
  ['sebentar', ['bentar']], ['sedikit', ['dikit']], ['mengerti', ['ngerti']], ['datang', ['dateng']], ['malam', ['malem']],
  ['dalam', ['dalem']], ['pedas', ['pedes']], ['cepat', ['cepet']], ['dekat', ['deket']], ['hitam', ['item']],
  ['besar', ['gede']], ['sangat', ['banget']], ['karena', ['karna']], ['kalau', ['kalo']], ['sampai', ['sampe']],
  ['ingin', ['pengen', 'pingin']], ['teman', ['temen']], ['uang', ['duit']], ['lapar', ['laper']], ['senang', ['seneng']],
  ['di mana', ['dimana']], ['ke mana', ['kemana']], ['dari mana', ['darimana']], ['perempuan', ['cewek']],
  ['laki-laki', ['cowok']], ['nanti', ['ntar', 'entar']], ['Bapak', ['Pak']], ['Ibu', ['Bu']], ['kakak', ['kak']],
  ['adik', ['dik', 'dek']], ['tulis', ['nulis']], ['tunggu', ['nunggu']], ['kirim', ['ngirim']], ['tanya', ['nanya']],
  ['cuci', ['nyuci']], ['telepon', ['nelpon']], ['pinjam', ['minjem']], ['cas', ['ngecas']], ['cek', ['ngecek']]
].forEach(([id, forms]) => LEX(id, { colloquial: forms }));

/* ---------- 挖空短句：只在默认例句不合适时覆盖 ---------- */
// tolak 的例句里都是加了词缀的形式（menolak、ditolak），挖空时换一句用原形的
LEX('tolak', { clozeSentence: { id: 'Jangan [tolak] bantuan mereka.', zh: '别拒绝他们的帮助。', hint: '拒绝（用原形，祈使句）' } });
LEX('kami', { clozeSentence: { id: '[Kami] dari Shanghai.', zh: '我们来自上海。', hint: '我们（不包括听话的人）' } });
LEX('kita', { clozeSentence: { id: 'Ayo [kita] makan!', zh: '咱们吃饭吧！', hint: '咱们（包括听话的人）' } });
