import React, { useState, useEffect } from 'react';
import { BookOpen, Search, Mail, ShieldCheck, Sparkles, Heart, Bell, ExternalLink } from 'lucide-react';
import BookReader3D from './components/BookReader3D';
import SituationalSearch from './components/SituationalSearch';
import ReminderSettings from './components/ReminderSettings';
import ScanModal from './components/ScanModal';
import TasbihModal from './components/TasbihModal';
import ValidityModal from './components/ValidityModal';
import localNamesData from './data/names_database.json';

export default function App() {
  const [activeTab, setActiveTab] = useState('book'); // 'book' | 'search' | 'reminders' | 'proof'
  const [names, setNames] = useState(localNamesData);
  
  // Modals state
  const [scanModal, setScanModal] = useState({ isOpen: false, file: '', title: '', page: 20 });
  const [tasbihModal, setTasbihModal] = useState({ isOpen: false, name: null });
  const [validityModal, setValidityModal] = useState({ isOpen: false, name: null });

  // Fetch from backend API on mount
  useEffect(() => {
    fetch('/api/names')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setNames(data);
        }
      })
      .catch(err => {
        console.warn('Using local names database fallback:', err.message);
      });
  }, []);

  const openScan = (file, title, page) => {
    setScanModal({ isOpen: true, file, title, page });
  };

  const openTasbih = (name) => {
    setTasbihModal({ isOpen: true, name });
  };

  const openValidity = (name) => {
    setValidityModal({ isOpen: true, name });
  };

  const handleSendQuickReminder = async (name) => {
    try {
      const res = await fetch('/api/reminders/send-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nameId: name.id })
      });
      const data = await res.json();
      if (data.success) {
        alert(`✨ Reminder for ${name.transliteration} processed! ${data.message}`);
      } else {
        alert(data.error || 'Please configure your email in the Email Center tab first.');
        setActiveTab('reminders');
      }
    } catch (e) {
      alert('Email server note: Please configure your email in the Email Center tab.');
      setActiveTab('reminders');
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f17] text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-neutral-950">
      {/* Top Main Navbar */}
      <header className="sticky top-0 z-40 bg-[#0d131f]/95 backdrop-blur-md border-b border-amber-500/20 px-4 sm:px-8 py-3 shadow-2xl">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Logo & Book Citation */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-700 flex items-center justify-center shadow-lg border border-amber-300/40 text-neutral-950 font-serif font-black text-xl">
              ﷽
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white font-serif">
                  The 99 Names of Allah
                </h1>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/30">
                  أسماء الحسنى
                </span>
              </div>
              <p className="text-[11px] text-neutral-400">
                Shems Friedlander (1978) • Personal Edition with Scans & Email System
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center bg-neutral-900/90 rounded-2xl p-1.5 border border-neutral-800 shadow-inner">
            <button
              onClick={() => setActiveTab('book')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition ${
                activeTab === 'book'
                  ? 'bg-amber-500 text-neutral-950 shadow-md shadow-amber-500/25'
                  : 'text-neutral-300 hover:text-white hover:bg-neutral-800'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>3D Book Reader</span>
            </button>

            <button
              onClick={() => setActiveTab('search')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition ${
                activeTab === 'search'
                  ? 'bg-amber-500 text-neutral-950 shadow-md shadow-amber-500/25'
                  : 'text-neutral-300 hover:text-white hover:bg-neutral-800'
              }`}
            >
              <Search className="w-4 h-4" />
              <span>Situational & Prayers</span>
            </button>

            <button
              onClick={() => setActiveTab('reminders')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition relative ${
                activeTab === 'reminders'
                  ? 'bg-amber-500 text-neutral-950 shadow-md shadow-amber-500/25'
                  : 'text-neutral-300 hover:text-white hover:bg-neutral-800'
              }`}
            >
              <Mail className="w-4 h-4" />
              <span>Email Reminders</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            </button>

            <button
              onClick={() => setActiveTab('proof')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition ${
                activeTab === 'proof'
                  ? 'bg-amber-500 text-neutral-950 shadow-md shadow-amber-500/25'
                  : 'text-neutral-300 hover:text-white hover:bg-neutral-800'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Scholarly Proof</span>
            </button>
          </nav>
        </div>
      </header>

      {/* Main View Area */}
      <main className="flex-1 py-4 sm:py-6">
        {activeTab === 'book' && (
          <BookReader3D
            names={names}
            onOpenScan={openScan}
            onOpenTasbih={openTasbih}
            onOpenValidity={openValidity}
            onSendReminder={handleSendQuickReminder}
          />
        )}

        {activeTab === 'search' && (
          <SituationalSearch
            names={names}
            onOpenScan={openScan}
            onOpenTasbih={openTasbih}
            onOpenValidity={openValidity}
            onSendReminder={handleSendQuickReminder}
          />
        )}

        {activeTab === 'reminders' && (
          <ReminderSettings />
        )}

        {activeTab === 'proof' && (
          <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
            <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-neutral-800">
                <span className="p-3 rounded-2xl bg-blue-500/15 text-blue-400 border border-blue-500/30">
                  <ShieldCheck className="w-6 h-6" />
                </span>
                <div>
                  <h2 className="text-2xl font-bold text-white font-serif">
                    Comprehensive Scholarly Proof & Authenticity Analysis
                  </h2>
                  <p className="text-xs sm:text-sm text-neutral-400">
                    Understanding the status of Shems Friedlander's 1978 text in Islamic jurisprudence.
                  </p>
                </div>
              </div>

              {/* 3-Tier Proof System */}
              <div className="space-y-4">
                <div className="p-5 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 space-y-2">
                  <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-bold uppercase tracking-wider">
                    Tier 1: The Divine Names Themselves
                  </span>
                  <h3 className="text-base font-bold text-emerald-200">
                    100% Authentic, Mutawatir & Quranic
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                    Calling upon Allah by His Most Beautiful Names is commanded directly by Allah in the Quran:
                    <br />
                    <em>"And to Allah belong the best names, so invoke Him by them."</em> (Surah Al-A'raf 7:180).
                    <br />
                    The Prophet Muhammad ﷺ explicitly stated: <em>"Allah has ninety-nine names, one hundred minus one; whoever enumerates/preserves them will enter Paradise."</em> (Sahih al-Bukhari #2736, Sahih Muslim #2677).
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-amber-950/30 border border-amber-500/30 space-y-2">
                  <span className="text-xs px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 font-bold uppercase tracking-wider">
                    Tier 2: The Repetition Counts & Specific Worldly Outcomes
                  </span>
                  <h3 className="text-base font-bold text-amber-200">
                    Classified as *Mujarrabat* (Experiential Spiritual Practices)
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                    The specific mechanical formulas in this book (e.g. <em>"recite 100 times after Zuhr on Thursday in silence to have any desire answered"</em>, or <em>"3,000 times for relief from trouble"</em>) originate from classical Sufi scholars (such as Imam Al-Ghazali's <em>Al-Maqsad Al-Asna</em>, Ahmad Al-Buni, Sheikh Abdul Qadir Jilani, and Ottoman Jerrahi masters).
                    <br /><br />
                    <strong>The Consensus Ruling:</strong> Major Hadith authorities (Ibn Taymiyyah, Ibn al-Qayyim, and contemporary fatwa councils) state that while calling upon Allah with any of His names is universally permissible and rewarded, the specific numbers and worldly promises are based on personal trials and spiritual experience (<em>Tajribah</em>), not on direct binding Prophetic command (<em>Marfu' Hadith</em>).
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-indigo-950/30 border border-indigo-500/20 text-indigo-300 space-y-2">
                  <span className="text-xs px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 font-bold uppercase tracking-wider">
                    Tier 3: Strict Source Fidelity
                  </span>
                  <h3 className="text-base font-bold text-indigo-200">
                    Directly Mirrored from Your Google Drive Scans
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                    Every prescription, number, time, and benefit presented in this app is taken verbatim from the scanned 1978 edition of <em>The Ninety-Nine Names of Allah</em> by Shems Friedlander in <code>E:\My Drive\99NamesOfAllah</code>. You can click <strong>"Inspect Scan"</strong> on any card to view the exact physical scan with your own eyes.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-neutral-950 border-t border-neutral-800/80 px-4 py-5 text-center text-xs text-neutral-400">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <span>
            *The Ninety-Nine Names of Allah* • Shems Friedlander (Harper Colophon Books, 1978)
          </span>
          <div className="flex items-center gap-3 text-neutral-400">
            <span>Direct Scans: <code className="text-neutral-300">E:\My Drive\99NamesOfAllah</code></span>
            <span>•</span>
            <span className="text-amber-400/90 font-medium">Personal Edition</span>
          </div>
        </div>
      </footer>

      {/* Global Modals */}
      <ScanModal
        isOpen={scanModal.isOpen}
        onClose={() => setScanModal({ ...scanModal, isOpen: false })}
        scanFile={scanModal.file}
        title={scanModal.title}
        pageNumber={scanModal.page}
      />

      <TasbihModal
        isOpen={tasbihModal.isOpen}
        onClose={() => setTasbihModal({ ...tasbihModal, isOpen: false })}
        name={tasbihModal.name}
      />

      <ValidityModal
        isOpen={validityModal.isOpen}
        onClose={() => setValidityModal({ ...validityModal, isOpen: false })}
        name={validityModal.name}
      />
    </div>
  );
}
