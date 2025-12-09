const menuLinks = document.querySelectorAll("nav a");
const sections = document.querySelectorAll("section");

// Sembunyikan semua section dulu
function hideAll() {
    sections.forEach(sec => sec.classList.remove("active"));
}

// Klik navbar → tampilkan section sesuai ID
menuLinks.forEach(link => {
    link.addEventListener("click", () => {
        const target = link.getAttribute("href").substring(1);

        hideAll();
        document.getElementById(target).classList.add("active");
    });
});

// Default tampil menu ABOUT saat pertama buka
document.getElementById("about").classList.add("active");
// ============================================
// QUIZ GENERATOR - JAVASCRIPT IMPLEMENTATION
// Menggunakan RAKE & CFG Algorithm
// ============================================

// ============================================
// 1. RAKE MODULE (Rapid Automatic Keyword Extraction)
// (Tidak Ada Perubahan Logika)
// ============================================
const RAKEModule = {
  // Stopwords Bahasa Indonesia
  stopwords: [
    'yang', 'untuk', 'pada', 'ke', 'para', 'namun', 'menurut', 'antara', 'dia',
    'dua', 'ia', 'seperti', 'jika', 'sehingga', 'kembali', 'dan', 'tidak',
    'ini', 'karena', 'oleh', 'tentang', 'saat', 'dari', 'dengan', 'atau', 'akan',
    'tetapi', 'dalam', 'adalah', 'itu', 'sebagai', 'ada', 'sudah', 'saya', 'kami',
    'kita', 'mereka', 'anda', 'juga', 'dapat', 'bisa', 'hal', 'tersebut', 'bahwa',
    'agar', 'telah', 'harus', 'sangat', 'masih', 'lebih', 'paling', 'yaitu', 'dimana'
  ],

  preprocessText: function(text) {
    return text.toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  },

  getCandidatePhrases: function(text) {
    const processed = this.preprocessText(text);
    const words = processed.split(' ');
    const phrases = [];
    let currentPhrase = [];

    words.forEach(word => {
      if (this.stopwords.includes(word) || word.length < 2) {
        if (currentPhrase.length > 0) {
          phrases.push(currentPhrase.join(' '));
          currentPhrase = [];
        }
      } else {
        currentPhrase.push(word);
      }
    });

    if (currentPhrase.length > 0) {
      phrases.push(currentPhrase.join(' '));
    }

    return phrases;
  },

  calculateWordScores: function(phrases) {
    const wordFreq = {};
    const wordDegree = {};

    phrases.forEach(phrase => {
      const words = phrase.split(' ');
      const phraseLength = words.length;

      words.forEach(word => {
        wordFreq[word] = (wordFreq[word] || 0) + 1;
        wordDegree[word] = (wordDegree[word] || 0) + phraseLength;
      });
    });

    const wordScores = {};
    Object.keys(wordFreq).forEach(word => {
      wordScores[word] = wordDegree[word] / wordFreq[word];
    });

    return wordScores;
  },

  extractKeywords: function(text, maxKeywords = 10) {
    const phrases = this.getCandidatePhrases(text);
    if (phrases.length === 0) return [];

    const wordScores = this.calculateWordScores(phrases);

    const phraseScores = phrases.map(phrase => {
      const words = phrase.split(' ');
      const score = words.reduce((sum, word) => sum + (wordScores[word] || 0), 0);
      return { phrase, score };
    });

    return phraseScores
      .sort((a, b) => b.score - a.score)
      .slice(0, maxKeywords)
      .map(item => item.phrase);
  }
};

// ============================================
// 2. CFG MODULE (Context-Free Grammar)
// (Tidak Ada Perubahan Logika)
// ============================================
const CFGModule = {
  grammarRules: {
    definition: [
      'Apa yang dimaksud dengan {keyword}?', 'Jelaskan pengertian dari {keyword}!',
      'Definisikan istilah {keyword}!', 'Apa definisi dari {keyword}?',
      'Jelaskan apa itu {keyword}!'
    ],
    purpose: [
      'Apa fungsi dari {keyword}?', 'Apa tujuan dari {keyword}?',
      'Untuk apa {keyword} digunakan?', 'Sebutkan kegunaan dari {keyword}!',
      'Mengapa {keyword} penting?'
    ],
    process: [
      'Bagaimana cara kerja {keyword}?', 'Jelaskan proses {keyword}!',
      'Bagaimana {keyword} bekerja?', 'Uraikan tahapan dalam {keyword}!',
      'Jelaskan mekanisme {keyword}!'
    ],
    example: [
      'Berikan contoh dari {keyword}!', 'Sebutkan contoh penerapan {keyword}!',
      'Apa saja contoh {keyword}?', 'Tuliskan contoh implementasi {keyword}!',
      'Ilustrasikan {keyword} dengan contoh!'
    ],
    comparison: [
      'Apa perbedaan antara {keyword1} dan {keyword2}?', 'Bandingkan {keyword1} dengan {keyword2}!',
      'Jelaskan persamaan dan perbedaan {keyword1} dan {keyword2}!', 'Apa yang membedakan {keyword1} dari {keyword2}?'
    ],
    advantages: [
      'Apa kelebihan dari {keyword}?', 'Sebutkan keuntungan menggunakan {keyword}!',
      'Apa manfaat dari {keyword}?', 'Jelaskan kelebihan dan kekurangan {keyword}!',
      'Apa keunggulan {keyword}?'
    ],
    characteristic: [
      'Sebutkan ciri-ciri {keyword}!', 'Apa karakteristik dari {keyword}?',
      'Jelaskan sifat-sifat {keyword}!', 'Apa yang menjadi ciri khas {keyword}?'
    ]
  },

  generateQuestions: function(keywords, questionCount = 5) {
    const questions = [];
    const ruleTypes = Object.keys(this.grammarRules).filter(type => type !== 'comparison');
    
    for (let i = 0; i < questionCount && i < keywords.length; i++) {
      const keyword = keywords[i];
      
      if (i > 0 && keywords.length > 1 && Math.random() > 0.7) {
        const availableKeywords = keywords.filter(k => k !== keyword);
        if (availableKeywords.length > 0) {
            const keyword2 = availableKeywords[Math.floor(Math.random() * availableKeywords.length)];
            const template = this.grammarRules.comparison[
              Math.floor(Math.random() * this.grammarRules.comparison.length)
            ];
            questions.push({
              id: i + 1,
              question: template.replace('{keyword1}', keyword).replace('{keyword2}', keyword2),
              keyword: `${keyword}, ${keyword2}`,
              type: 'comparison'
            });
            continue;
        }
      }
      
      const ruleType = ruleTypes[i % ruleTypes.length];
      const template = this.grammarRules[ruleType][
        Math.floor(Math.random() * this.grammarRules[ruleType].length)
      ];
      questions.push({
        id: i + 1,
        question: template.replace('{keyword}', keyword),
        keyword: keyword,
        type: ruleType
      });
    }

    return questions;
  }
};

// ============================================
// 3. QUIZ MANAGER - FIX INTERAKSI UI/UX
// ============================================
const QuizManager = {
  soalList: [], 
  navLinks: null,
  sections: null,

  init: function() {
    // AMBIL ELEMEN NAVIGASI & KONTEN (SECTIONS) SAAT INIT
    this.navLinks = document.querySelectorAll('nav a');
    this.sections = document.querySelectorAll('main section');
    
    // Default: tampilkan section pertama (About)
    this.showSection('about');

    this.attachEventListeners();
    this.setupBackToTop();
    this.setupSmoothScroll();
  },

  // FUNGSIONALITAS NAVIGASI MENU (ABOUT, INPUT, GENERATE)
  showSection: function(targetId) {
    if (!this.sections) return;
    
    // Sembunyikan semua sections dan hapus kelas 'active' dari link
    this.sections.forEach(sec => {
      sec.classList.remove('active');
    });
    this.navLinks.forEach(link => {
      link.classList.remove('active');
    });

    // Tampilkan section yang dituju
    const targetSection = document.getElementById(targetId);
    if (targetSection) {
      targetSection.classList.add('active');
    }

    // Beri highlight pada link yang aktif
    const activeLink = document.querySelector(`nav a[href="#${targetId}"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }
  },

  attachEventListeners: function() {
    const materiInput = document.getElementById('materi-input');
    const generateBtn = document.getElementById('generate-btn');
    const tampilkanBtn = document.getElementById('tampilkan-soal-btn');
    const resetBtn = document.getElementById('reset-btn');

    // 1. EVENT LISTENER UNTUK NAVIGASI (Perbaikan Masalah Menu Tidak Bisa Klik)
    if (this.navLinks) {
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                // Ambil ID tujuan dari atribut href (misal: dari "#input" jadi "input")
                const targetId = link.getAttribute('href').substring(1);
                this.showSection(targetId);
            });
        });
    }

    // 2. EVENT LISTENER UNTUK TOMBOL GENERATE
    if (materiInput && generateBtn) {
      materiInput.addEventListener('input', function() {
        const text = this.value.trim();
        generateBtn.disabled = text.length < 50; 
      });
      // Menggunakan arrow function untuk mempertahankan 'this' sebagai QuizManager
      generateBtn.addEventListener('click', () => this.generateSoal()); 
    }

    // 3. EVENT LISTENER UNTUK TOMBOL TAMPILKAN SEMUA SOAL
    if (tampilkanBtn) {
      tampilkanBtn.addEventListener('click', () => this.tampilkanSemuaSoal());
    }

    // 4. EVENT LISTENER UNTUK TOMBOL RESET/CLEAR
    if (resetBtn) {
      resetBtn.addEventListener('click', () => this.resetSoal());
    }
  },

  generateSoal: function() {
    // ... (Logika RAKE dan CFG di sini tidak berubah) ...
    const materiInput = document.getElementById('materi-input');
    const soalOutput = document.getElementById('soal-output');
    const loadingIndicator = document.getElementById('loading-indicator');
    
    const inputText = materiInput.value.trim();

    if (inputText.length < 50) {
      this.showNotification('Mohon masukkan materi minimal 50 karakter!', 'error');
      return;
    }

    // Show loading
    loadingIndicator.style.display = 'block';
    soalOutput.value = 'Memproses materi... Silakan tunggu sebentar.';

    setTimeout(() => {
      try {
        const keywords = RAKEModule.extractKeywords(inputText, 15);
        
        if (keywords.length < 3) {
          throw new Error('Tidak dapat mengekstrak kata kunci yang cukup (minimal 3) dari materi Anda. Coba masukkan teks yang lebih panjang atau lebih formal.'); 
        }

        const jumlahSoal = Math.min(5, keywords.length);
        const questions = CFGModule.generateQuestions(keywords, jumlahSoal);

        let output = `=== SOAL HASIL GENERATE askIFY ===\n`;
        output += `Tanggal: ${new Date().toLocaleDateString('id-ID')}\n`;
        output += `Jumlah Soal: ${questions.length}\n`;
        output += `Kata Kunci Teratas: ${keywords.slice(0, 5).join(', ')}\n\n`;
        
        questions.forEach((q, index) => {
          output += `${index + 1}. ${q.question}\n`;
          output += '\n'; 
        });

        const newSoal = {
          id: Date.now(),
          timestamp: new Date().toLocaleString('id-ID'),
          questions: questions,
          keywords: keywords,
          sourceText: inputText.substring(0, 100) + '...'
        };
        this.soalList.push(newSoal);

        soalOutput.value = output;
        
        loadingIndicator.style.display = 'none';
        
        this.showNotification(`Berhasil generate ${questions.length} soal!`, 'success');

        // Setelah generate, tampilkan section 'generate'
        this.showSection('generate');

      } catch (error) {
        loadingIndicator.style.display = 'none';
        soalOutput.value = 'Gagal memproses soal.';
        this.showNotification('Terjadi kesalahan: ' + error.message, 'error');
      }
    }, 1000); 
  },

  tampilkanSemuaSoal: function() {
    // ... (Logika tampilkan semua soal tidak berubah) ...
    const soalListContainer = document.getElementById('soal-list');
    
    if (this.soalList.length === 0) {
      soalListContainer.innerHTML = '<p class="empty-state">Belum ada soal yang di-generate. Silakan generate soal terlebih dahulu!</p>';
      this.showSection('tampilkan-soal'); // Pindah ke section tampilkan-soal
      return;
    }

    let html = '';
    this.soalList.slice().reverse().forEach((soal) => { 
      html += `
        <div class="soal-item" data-id="${soal.id}">
          <div class="soal-header">
            <h3>Set Soal (${soal.questions.length} Soal)</h3>
            <span class="soal-timestamp">${soal.timestamp}</span>
          </div>
          <div class="soal-info">
            <p><strong>Sumber:</strong> ${soal.sourceText}</p>
            <p><strong>Kata Kunci:</strong> ${soal.keywords.slice(0, 5).join(', ')}</p>
          </div>
          <div class="soal-questions">
            ${soal.questions.map((q, i) => `
              <div class="question-item">
                <span class="question-number">${i + 1}.</span>
                <span class="question-text">${q.question}</span>
                <span class="question-keyword" title="Kata Kunci Utama">[${q.keyword}]</span>
              </div>
            `).join('')}
          </div>
          <div class="soal-actions">
            <button class="btn-copy" onclick="QuizManager.copySoal(${soal.id})">
              📋 Salin
            </button>
            <button class="btn-delete" onclick="QuizManager.deleteSoal(${soal.id})">
              🗑️ Hapus
            </button>
          </div>
        </div>
      `;
    });

    soalListContainer.innerHTML = html;
    this.showSection('tampilkan-soal'); // Pindah ke section tampilkan-soal
  },
  
  // Fungsi copySoal, deleteSoal, resetSoal, showNotification, setupBackToTop, setupSmoothScroll
  // (Tidak ada perubahan)
  // Di dalam objek QuizManager:
  copySoal: function(id) {
    // 1. Ambil data set soal berdasarkan ID
    const soalSet = this.soalList.find(s => s.id === id);
    if (!soalSet) {
        // Hentikan jika ID tidak ditemukan (safety check)
        this.showNotification('Error: Soal tidak ditemukan!', 'error');
        return; 
    }
    // 2. Format teks yang akan disalin
    // Menggabungkan semua pertanyaan menjadi satu string format
    let textToCopy = `===== Set Soal: ${soalSet.timestamp} =====\n\n`;
    soalSet.questions.forEach((q, i) => {
        textToCopy += `${i + 1}. ${q.question}\n\n`;
    });
    textToCopy += `(Sumber Materi: ${soalSet.sourceText.substring(0, 50)}...)\n`;

    // 3. Salin ke Clipboard dan berikan feedback
    navigator.clipboard.writeText(textToCopy)
        .then(() => {
            // Sukses menyalin: Tampilkan notifikasi
            this.showNotification('Soal berhasil disalin ke clipboard!', 'success');
            
            // Panggil fungsi untuk efek visual tombol (langkah 4)
            this.animateCopyButton(id); 

        })
        .catch(err => {
            // Gagal menyalin (misalnya, izin ditolak): Tampilkan notifikasi error
            console.error('Gagal menyalin:', err);
            this.showNotification('Gagal menyalin. Coba lagi atau salin manual.', 'error');
        });
},

// Di dalam objek QuizManager:
  animateCopyButton: function(id) {
    // Dapatkan tombol yang diklik (menggunakan ID dan kelas tombol)
    const btn = document.querySelector(`.soal-item[data-id="${id}"] .btn-copy`);
    
    if (btn) {
        const originalText = btn.innerHTML; // Simpan teks aslinya
        
        // 1. Ubah tampilan tombol menjadi status sukses
        btn.innerHTML = '✅ Disalin!';
        btn.classList.add('btn-copied'); // Tambahkan kelas CSS untuk gaya sukses
        
        // 2. Set Timer untuk mengembalikan tombol ke keadaan semula
        setTimeout(() => {
            btn.innerHTML = originalText;
            btn.classList.remove('btn-copied'); // Hapus kelas CSS
        }, 1500); // Tahan selama 1.5 detik
    }
},

  deleteSoal: function(id) {
    if (confirm('Yakin ingin menghapus set soal ini?')) {
      return;
    }
    const itemToDelete = document.querySelector(`.soal-item[data-id="${id}"]`);
    if(itemToDelete){
      itemToDelete.classList.add('deleting');
    
    setTimeout(() => {
      this.soalList = this.soalList.filter(s => s.id !== id);
            this.tampilkanSemuaSoal(); 
            this.showNotification('Soal berhasil dihapus', 'success');
        }, 300); 
    } else {
        // Fallback jika elemen tidak ditemukan di DOM (lanjutkan penghapusan data)
        this.soalList = this.soalList.filter(s => s.id !== id);
        this.tampilkanSemuaSoal(); 
        this.showNotification('Soal berhasil dihapus', 'success');
    }
  },

  resetSoal: function() {
    if (this.soalList.length === 0) {
      this.showNotification('Tidak ada soal untuk dihapus', 'info');
      return;
    }

    if (confirm('Yakin ingin menghapus SEMUA soal?')) {
      this.soalList = [];
      document.getElementById('soal-list').innerHTML = '<p class="empty-state">Semua soal telah dihapus.</p>';
      document.getElementById('materi-input').value = '';
      document.getElementById('soal-output').value = '';
      this.showNotification('Semua soal berhasil dihapus', 'success');
    }
  },

  showNotification: function(message, type = 'info') {
    const notificationBar = document.getElementById('notification-bar');
    
    notificationBar.textContent = message;
    notificationBar.className = `notification ${type}`; 
    notificationBar.style.display = 'block';

    setTimeout(() => {
      notificationBar.style.display = 'none';
    }, 3000);
    
  },

  setupBackToTop: function() {
    const backToTopBtn = document.getElementById('back-to-top');
    
    if (backToTopBtn) {
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                backToTopBtn.style.display = 'block';
            } else {
                backToTopBtn.style.display = 'none';
            }
        });

        backToTopBtn.addEventListener('click', function() {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
  },

  setupSmoothScroll: function() {
    // Note: Karena navigasi kini ditangani oleh showSection, bagian ini
    // hanya digunakan untuk scroll eksternal/internal jika ada.
    document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        // e.preventDefault(); // Tidak perlu preventDefault jika showSection sudah menangani
        // ...
      });
    });
  }
};

// ============================================
// 4. INITIALIZE SAAT PAGE LOAD
// ============================================

window.QuizManager = QuizManager;
window.RAKEModule = RAKEModule;
window.CFGModule = CFGModule;

document.addEventListener('DOMContentLoaded', function() {
  QuizManager.init(); 
  console.log('✅ Quiz Generator askIFY berhasil diinisialisasi!');
});

