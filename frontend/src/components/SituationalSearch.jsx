import React, { useState } from 'react';
import { Search, Sparkles, BookOpen, Clock, ShieldCheck, Mail, ArrowRight, HeartHandshake } from 'lucide-react';

export default function SituationalSearch({ names, onOpenScan, onOpenTasbih, onOpenValidity, onSendReminder }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  const filterChips = [
    { id: 'all', label: 'All 99 Names', icon: '✨' },
    { id: 'fajr', label: '🌅 After Fajr (Morning)', query: 'fajr' },
    { id: 'friday', label: '🕌 Blessed Friday (Jumu\'ah)', query: 'friday' },
    { id: 'zuhr', label: '☀️ After Zuhr / Thursday', query: 'zuhr' },
    { id: 'maghrib', label: '🌇 Maghrib & Isha', query: 'maghrib' },
    { id: 'night', label: '🌙 Night / Tahajjud', query: 'night' },
    { id: 'anxiety', label: '💚 Anxiety & Heavy Heart', query: 'anxiety' },
    { id: 'sustenance', label: '💰 Debt & Sustenance (Rizq)', query: 'sustenance' },
    { id: 'child', label: '👶 Children & Pregnancy', query: 'child' },
    { id: 'healing', label: '🩺 Illness & Healing', query: 'healing' },
    { id: 'protection', label: '🛡️ Protection & Safety', query: 'protection' },
    { id: 'desire', label: '🤲 Fulfillment of Desire', query: 'desire' }
  ];

  const filteredNames = names.filter(item => {
    // Check chip filter
    if (activeFilter !== 'all') {
      const chip = filterChips.find(c => c.id === activeFilter);
      const q = chip.query.toLowerCase();
      const matchChip = 
        item.prayer_category === q ||
        item.prayer_time.toLowerCase().includes(q) ||
        item.situation_tags.some(t => t.toLowerCase().includes(q));
      if (!matchChip) return false;
    }

    // Check search term
    if (!searchTerm.trim()) return true;
    const s = searchTerm.toLowerCase();
    return (
      item.transliteration.toLowerCase().includes(s) ||
      item.name_en.toLowerCase().includes(s) ||
      item.meaning.toLowerCase().includes(s) ||
      item.wazifa.toLowerCase().includes(s) ||
      item.benefit.toLowerCase().includes(s) ||
      item.prayer_time.toLowerCase().includes(s) ||
      item.situation_tags.some(t => t.toLowerCase().includes(s))
    );
  });

  return (
    <div className="w-full max-w-5xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Search Box Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-100 font-serif">
          Situational & Prayer Dhikr Guide
        </h2>
        <p className="text-xs sm:text-sm text-neutral-300">
          Search by prayer time (e.g. <em>"Fajr"</em>, <em>"Friday prayer"</em>) or life situation (<em>"anxiety"</em>, <em>"debt"</em>, <em>"child"</em>) to see the exact prescriptions from Shems Friedlander's 1978 book.
        </p>

        {/* Search Input Bar */}
        <div className="relative mt-4">
          <input
            type="text"
            placeholder="Type your prayer or situation (e.g. 'I just prayed Fajr', 'Friday wazifa', 'anxiety')..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-10 py-3.5 rounded-2xl bg-neutral-900 border-2 border-amber-500/40 focus:border-amber-400 text-white placeholder-neutral-500 text-sm focus:outline-none shadow-xl"
          />
          <Search className="absolute left-4 top-4 w-5 h-5 text-amber-400" />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-4 top-4 text-xs text-neutral-400 hover:text-white"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Filter Chips Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {filterChips.map(chip => (
          <button
            key={chip.id}
            onClick={() => {
              setActiveFilter(chip.id);
            }}
            className={`whitespace-nowrap px-3.5 py-1.5 rounded-full text-xs font-semibold transition border flex-shrink-0 ${
              activeFilter === chip.id
                ? 'bg-amber-500 text-neutral-950 border-amber-400 shadow-md shadow-amber-500/20'
                : 'bg-neutral-900 text-neutral-300 border-neutral-800 hover:border-neutral-700 hover:text-white'
            }`}
          >
            {chip.label}
          </button>
        ))}
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between text-xs text-neutral-400 px-1">
        <span>
          Showing <strong className="text-amber-400">{filteredNames.length}</strong> matching Names from the book
        </span>
        {activeFilter !== 'all' && (
          <button
            onClick={() => setActiveFilter('all')}
            className="text-amber-400 hover:underline"
          >
            Reset filter
          </button>
        )}
      </div>

      {/* Results Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredNames.map(item => (
          <div
            key={item.id}
            className="bg-neutral-900/90 border border-neutral-800 hover:border-amber-500/50 rounded-3xl p-5 shadow-lg flex flex-col justify-between transition-all duration-200 group relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-28 h-28 bg-amber-500/5 rounded-bl-full pointer-events-none group-hover:bg-amber-500/10 transition-colors"></div>

            {/* Top Row: Arabic & Info */}
            <div>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-neutral-800 text-neutral-300 border border-neutral-700">
                      #{item.id}
                    </span>
                    <h3 className="text-base font-bold text-neutral-100 tracking-wide group-hover:text-amber-300 transition-colors">
                      {item.transliteration}
                    </h3>
                  </div>
                  <p className="text-xs text-neutral-400 italic mt-0.5">
                    "{item.name_en}"
                  </p>
                </div>

                <div className="text-right">
                  <div className="text-3xl font-serif text-amber-400 group-hover:scale-105 transition-transform">
                    {item.arabic}
                  </div>
                </div>
              </div>

              {/* Wazifa Box */}
              <div className="p-3.5 rounded-2xl bg-neutral-950/80 border border-emerald-500/25 mb-3">
                <div className="flex items-center justify-between text-[11px] text-neutral-400 mb-1">
                  <span className="font-semibold text-emerald-400">PRESCRIBED INVOCATION:</span>
                  <span className="font-bold text-amber-300 bg-amber-500/15 px-2 py-0.5 rounded-full border border-amber-500/30">
                    {item.count}× Repetitions
                  </span>
                </div>
                <div className="text-emerald-300 font-bold text-sm tracking-wide">
                  {item.wazifa}
                </div>
                <div className="text-xs text-neutral-300 mt-1.5 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-400/80 flex-shrink-0" />
                  <span><strong>Timing:</strong> {item.prayer_time}</span>
                </div>
              </div>

              {/* Book Benefit */}
              <div className="p-3 rounded-2xl bg-amber-950/20 border border-amber-500/20 text-xs text-neutral-200 mb-3 leading-relaxed">
                <strong className="text-amber-400/90 block mb-1">
                  📖 Stated Benefit in Friedlander's Book (p. {item.book_page}):
                </strong>
                "{item.benefit}"
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {item.situation_tags.map(t => (
                  <span
                    key={t}
                    onClick={() => setSearchTerm(t)}
                    className="text-[10px] px-2 py-0.5 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white cursor-pointer transition border border-neutral-700/60"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-3 border-t border-neutral-800/80 flex items-center justify-between gap-2">
              <button
                onClick={() => onOpenTasbih(item)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 text-xs font-semibold transition"
                title="Open Digital Counter with this count"
              >
                <span>📿</span> Tasbih ({item.count}×)
              </button>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => onOpenValidity(item)}
                  className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-blue-400 transition border border-neutral-700"
                  title="Scholarly Validity & Internet Reports"
                >
                  <ShieldCheck className="w-4 h-4" />
                </button>

                <button
                  onClick={() => onOpenScan(item.scan_file, item.transliteration, item.book_page)}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-amber-400 text-xs font-medium transition border border-neutral-700"
                  title="Inspect authentic scanned page"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>p. {item.book_page}</span>
                </button>

                <button
                  onClick={() => onSendReminder(item)}
                  className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-amber-400 transition border border-neutral-700"
                  title="Send email reminder for this Name"
                >
                  <Mail className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
