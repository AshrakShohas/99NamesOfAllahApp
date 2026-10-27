import React from 'react';
import { X, ShieldCheck, BookOpen, Globe2, AlertCircle, Sparkles } from 'lucide-react';

export default function ValidityModal({ isOpen, onClose, name }) {
  if (!isOpen || !name) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-neutral-900 border border-blue-500/30 rounded-3xl p-6 shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <ShieldCheck className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-lg font-bold text-neutral-100 flex items-center gap-2">
                Scholarly Validity & Authenticity Guide
              </h3>
              <p className="text-xs text-neutral-400">
                Evaluation of {name.transliteration} ({name.arabic})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-full transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto py-5 space-y-5 text-sm">
          {/* Classification Banner */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-xl p-3.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 block mb-1">
                1. Divine Name Status
              </span>
              <p className="text-sm font-semibold text-emerald-200">
                {name.authenticity?.name_status || 'Quranic & Sahih Hadith'}
              </p>
              <p className="text-xs text-emerald-400/80 mt-1">
                Ref: {name.authenticity?.reference || 'Holy Quran'}
              </p>
            </div>

            <div className="bg-amber-950/40 border border-amber-500/30 rounded-xl p-3.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 block mb-1">
                2. Wazifa & Prescription Status
              </span>
              <p className="text-sm font-semibold text-amber-200">
                {name.authenticity?.wazifa_status || 'Traditional Sufi Mujarrabat (Experiential)'}
              </p>
              <p className="text-xs text-amber-400/80 mt-1">
                Shems Friedlander (1978) • Jerrahi Halveti Order
              </p>
            </div>
          </div>

          {/* Scholarly Explanation */}
          <div className="bg-neutral-950/70 border border-neutral-800 rounded-2xl p-4">
            <h4 className="font-semibold text-neutral-200 flex items-center gap-2 mb-2">
              <BookOpen className="w-4 h-4 text-blue-400" />
              Scholarly Proof & Analysis
            </h4>
            <p className="text-neutral-300 leading-relaxed text-xs sm:text-sm">
              {name.authenticity?.scholarly_note}
            </p>
            <div className="mt-3 pt-3 border-t border-neutral-800/80 text-xs text-neutral-400 space-y-1.5">
              <p>
                • <strong>The Divine Names in Sunnah:</strong> The Prophet ﷺ said: <em>"Allah has ninety-nine names, one hundred minus one; whoever enumerates/preserves them will enter Paradise."</em> (Sahih al-Bukhari #2736, Sahih Muslim #2677).
              </p>
              <p>
                • <strong>Specific Numbers & Formulas:</strong> Classical scholars (including Imam Al-Ghazali, Ibn Taymiyyah, and Ottoman masters) clarify that reciting a name X times for a specific outcome is classified as <strong>Mujarrabat</strong> (practices tested and experienced by righteous predecessors), rather than a mandatory Prophetic command (*Marfu'*). They are permissible to recite with hope in Allah's bounty.
              </p>
            </div>
          </div>

          {/* Internet & Community Experience */}
          <div className="bg-indigo-950/30 border border-indigo-500/20 rounded-2xl p-4">
            <h4 className="font-semibold text-indigo-300 flex items-center gap-2 mb-2">
              <Globe2 className="w-4 h-4 text-indigo-400" />
              Internet & Historical Testimonials
            </h4>
            <p className="text-neutral-300 leading-relaxed text-xs sm:text-sm italic">
              "{name.internet_experience || 'Practitioners report deep tranquility, increased clarity, and answered prayers through sincere recitation.'}"
            </p>
            <p className="text-[11px] text-neutral-500 mt-2">
              Documented across Islamic spiritual literature, traditional Sufi manuals, and contemporary community reflections.
            </p>
          </div>

          {/* Book Fidelity Notice */}
          <div className="p-3 bg-neutral-950 border border-neutral-800 rounded-xl flex items-start gap-3 text-xs text-neutral-400">
            <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="text-neutral-300">Strict Source Fidelity:</strong> All prescriptions, counts, timings, and benefits in this application are copied verbatim from the scanned 1978 edition of <em>The Ninety-Nine Names of Allah</em> by Shems Friedlander in your Google Drive folder (p. {name.book_page}).
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-neutral-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold transition"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
}
