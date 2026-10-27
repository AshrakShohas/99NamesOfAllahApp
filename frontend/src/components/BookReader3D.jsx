import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, BookOpen, Sparkles, Image as ImageIcon, ShieldCheck, Mail, ZoomIn, Volume2, VolumeX } from 'lucide-react';

// Synthesize authentic antique paper rustle using Web Audio API
function playPaperSound(muted) {
  if (muted) return;
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();

    const duration = 0.38;
    const bufferSize = ctx.sampleRate * duration;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      // Pink-tinted decaying noise burst
      const decay = Math.exp(-i / (bufferSize * 0.45));
      data[i] = (Math.random() * 2 - 1) * decay;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    // Resonant bandpass filter mimicking sliding dry parchment
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1250, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(320, ctx.currentTime + duration);
    filter.Q.value = 2.4;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.01, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.24, ctx.currentTime + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    noise.start();
    noise.stop(ctx.currentTime + duration + 0.02);
  } catch (err) {
    // Audio context may be restricted before user gesture
  }
}

export default function BookReader3D({ names, onOpenScan, onOpenTasbih, onOpenValidity, onSendReminder }) {
  const [spreadIndex, setSpreadIndex] = useState(0);
  const [viewMode, setViewMode] = useState('both'); // 'scan' | 'digital' | 'both'
  const [mobilePageTab, setMobilePageTab] = useState('left'); // 'left' | 'right' | 'both'
  const [soundMuted, setSoundMuted] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  // 3D Flipping leaf state
  const [flippingState, setFlippingState] = useState({
    active: false,
    dir: 'next', // 'next' | 'prev'
    fromSpread: 0,
    toSpread: 0
  });

  const totalSpreads = 50; // 50 spreads for 99 names

  // Compute pages for current view
  const currentLeftName = names[spreadIndex * 2];
  const currentRightName = names[spreadIndex * 2 + 1];
  const leftPageNum = 20 + spreadIndex * 2;
  const rightPageNum = leftPageNum + 1;

  // Dynamic fore-edge paper stack depth (ranges 5px to 22px as book progresses)
  const leftStackThickness = Math.max(5, Math.min(22, Math.round((spreadIndex / totalSpreads) * 22)));
  const rightStackThickness = Math.max(5, Math.min(22, Math.round(((totalSpreads - spreadIndex) / totalSpreads) * 22)));

  const handleNext = () => {
    if (spreadIndex >= totalSpreads - 1 || flippingState.active) return;
    const nextSpread = spreadIndex + 1;
    playPaperSound(soundMuted);
    setFlippingState({
      active: true,
      dir: 'next',
      fromSpread: spreadIndex,
      toSpread: nextSpread
    });

    setTimeout(() => {
      setSpreadIndex(nextSpread);
      setFlippingState({ active: false, dir: 'next', fromSpread: nextSpread, toSpread: nextSpread });
      setMobilePageTab('left');
    }, 660);
  };

  const handlePrev = () => {
    if (spreadIndex <= 0 || flippingState.active) return;
    const prevSpread = spreadIndex - 1;
    playPaperSound(soundMuted);
    setFlippingState({
      active: true,
      dir: 'prev',
      fromSpread: spreadIndex,
      toSpread: prevSpread
    });

    setTimeout(() => {
      setSpreadIndex(prevSpread);
      setFlippingState({ active: false, dir: 'prev', fromSpread: prevSpread, toSpread: prevSpread });
      setMobilePageTab('left');
    }, 660);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [spreadIndex, flippingState.active, soundMuted]);

  // Interactive 3D tilt on desktop mouse move
  const handleMouseMove = (e) => {
    if (window.innerWidth < 1024) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setTilt({
      x: Number(((-y / rect.height) * 4.5).toFixed(2)),
      y: Number(((x / rect.width) * 5.5).toFixed(2))
    });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  // Determine what to display on the base under-pages during an active flip
  const baseLeftName = flippingState.active && flippingState.dir === 'prev'
    ? names[flippingState.toSpread * 2]
    : currentLeftName;

  const baseRightName = flippingState.active && flippingState.dir === 'next'
    ? names[flippingState.toSpread * 2 + 1]
    : currentRightName;

  const baseLeftPageNum = flippingState.active && flippingState.dir === 'prev'
    ? 20 + flippingState.toSpread * 2
    : leftPageNum;

  const baseRightPageNum = flippingState.active && flippingState.dir === 'next'
    ? 20 + flippingState.toSpread * 2 + 1
    : rightPageNum;

  // Pages for the 3D flipping leaf
  const leafTurningNextFrontName = currentRightName;
  const leafTurningNextFrontPage = rightPageNum;
  const leafTurningNextBackName = names[flippingState.toSpread * 2];
  const leafTurningNextBackPage = 20 + flippingState.toSpread * 2;

  const leafTurningPrevFrontName = currentLeftName;
  const leafTurningPrevFrontPage = leftPageNum;
  const leafTurningPrevBackName = names[flippingState.toSpread * 2 + 1];
  const leafTurningPrevBackPage = 20 + flippingState.toSpread * 2 + 1;

  return (
    <div className="w-full max-w-6xl mx-auto p-2 sm:p-6 flex flex-col items-center select-none">
      {/* Top Controls Bar */}
      <div className="w-full flex flex-wrap items-center justify-between gap-3 bg-neutral-900/90 border border-neutral-800 rounded-2xl px-4 py-3 mb-6 shadow-xl backdrop-blur-md">
        {/* Jump to Name Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-amber-400">Jump to:</span>
          <select
            value={spreadIndex}
            onChange={(e) => {
              setSpreadIndex(parseInt(e.target.value, 10));
              setMobilePageTab('left');
            }}
            className="px-3 py-1.5 rounded-xl bg-neutral-950 border border-neutral-700 text-neutral-200 text-xs font-medium focus:outline-none focus:border-amber-400 cursor-pointer"
          >
            {names.map((n, idx) => {
              const spread = Math.floor(idx / 2);
              return (
                <option key={n.id} value={spread}>
                  #{n.id} {n.transliteration} ({n.arabic}) — p. {n.book_page}
                </option>
              );
            })}
          </select>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center bg-neutral-950 rounded-xl p-1 border border-neutral-800">
          <button
            onClick={() => setViewMode('both')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
              viewMode === 'both' ? 'bg-amber-500 text-neutral-950' : 'text-neutral-400 hover:text-white'
            }`}
          >
            Dual View (Scan + Text)
          </button>
          <button
            onClick={() => setViewMode('scan')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
              viewMode === 'scan' ? 'bg-amber-500 text-neutral-950' : 'text-neutral-400 hover:text-white'
            }`}
          >
            Original Scans
          </button>
          <button
            onClick={() => setViewMode('digital')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
              viewMode === 'digital' ? 'bg-amber-500 text-neutral-950' : 'text-neutral-400 hover:text-white'
            }`}
          >
            Calligraphy & Wazifa
          </button>
        </div>

        {/* Page Info, Sound Toggle, and Zoom */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setSoundMuted(!soundMuted)}
            className={`p-1.5 rounded-xl border text-xs font-medium transition flex items-center gap-1.5 cursor-pointer ${
              soundMuted
                ? 'bg-neutral-950 border-neutral-800 text-neutral-500'
                : 'bg-amber-500/20 border-amber-500/40 text-amber-300'
            }`}
            title={soundMuted ? 'Turn On Page Turn Sound' : 'Mute Page Turn Sound'}
          >
            {soundMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline text-[11px]">{soundMuted ? 'Muted' : 'Sound ON'}</span>
          </button>

          <span className="text-xs text-neutral-400 font-mono hidden sm:inline">
            pp. {leftPageNum}–{rightPageNum} of 128
          </span>

          {currentLeftName?.scan_file && (
            <button
              onClick={() => onOpenScan(currentLeftName.scan_file, `Spread pp. ${leftPageNum}-${rightPageNum}`, leftPageNum)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-amber-300 border border-neutral-700 text-xs font-semibold transition cursor-pointer"
              title="Inspect full uncompressed 3154x1956 scan from Google Drive"
            >
              <ZoomIn className="w-3.5 h-3.5" />
              <span>Full Scan</span>
            </button>
          )}
        </div>
      </div>

      {/* Mobile Page Segmented Switcher (Visible only on small phone screens) */}
      <div className="md:hidden w-full flex items-center justify-center mb-3">
        <div className="inline-flex bg-neutral-900/95 p-1 rounded-2xl border border-amber-500/30 text-xs shadow-lg">
          <button
            onClick={() => setMobilePageTab('left')}
            className={`px-3 py-1.5 rounded-xl font-bold transition ${
              mobilePageTab === 'left'
                ? 'bg-amber-500 text-neutral-950 shadow-md'
                : 'text-neutral-300 hover:text-white'
            }`}
          >
            Page 1: #{currentLeftName?.id} {currentLeftName?.transliteration}
          </button>
          {currentRightName && (
            <button
              onClick={() => setMobilePageTab('right')}
              className={`px-3 py-1.5 rounded-xl font-bold transition ${
                mobilePageTab === 'right'
                  ? 'bg-amber-500 text-neutral-950 shadow-md'
                  : 'text-neutral-300 hover:text-white'
              }`}
            >
              Page 2: #{currentRightName?.id} {currentRightName?.transliteration}
            </button>
          )}
          <button
            onClick={() => setMobilePageTab('both')}
            className={`px-2.5 py-1.5 rounded-xl font-medium transition ${
              mobilePageTab === 'both'
                ? 'bg-amber-500 text-neutral-950 shadow-md'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Both
          </button>
        </div>
      </div>

      {/* 3D Realistic Open Book on Desk Workspace */}
      <div
        className="relative w-full perspective-2500 py-3 sm:py-6 flex items-center justify-center"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* Dynamic Fore-edge Paper Stacks (Desktop: shows physical book page thickness on left & right) */}
        <div
          className="hidden md:block absolute -left-3 sm:-left-4 top-6 bottom-6 paper-stack-edge rounded-l-md border-y border-l border-amber-900/40 z-0 transition-all duration-500"
          style={{ width: `${leftStackThickness}px` }}
          title={`Fore-edge: ~${spreadIndex * 2} pages turned`}
        />
        <div
          className="hidden md:block absolute -right-3 sm:-right-4 top-6 bottom-6 paper-stack-edge rounded-r-md border-y border-r border-amber-900/40 z-0 transition-all duration-500"
          style={{ width: `${rightStackThickness}px` }}
          title={`Fore-edge: ~${(totalSpreads - spreadIndex) * 2} pages remaining`}
        />

        {/* Realistic Hardcover Leather Folio */}
        <div
          className="relative w-full max-w-5xl rounded-[26px] sm:rounded-[32px] p-2.5 sm:p-5 leather-cover transform-style-3d transition-transform duration-300"
          style={{
            transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
            transition: flippingState.active ? 'transform 0.1s ease-out' : 'transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)'
          }}
        >
          {/* Ornate Gold Filigree Corners */}
          <div className="absolute top-2 left-2 text-amber-500/40 text-lg font-serif select-none pointer-events-none">⌜</div>
          <div className="absolute top-2 right-2 text-amber-500/40 text-lg font-serif select-none pointer-events-none">⌝</div>
          <div className="absolute bottom-2 left-2 text-amber-500/40 text-lg font-serif select-none pointer-events-none">⌞</div>
          <div className="absolute bottom-2 right-2 text-amber-500/40 text-lg font-serif select-none pointer-events-none">⌟</div>

          {/* Gold Inset Filigree Borders */}
          <div className="absolute inset-1.5 sm:inset-2 border-2 border-amber-500/35 rounded-[22px] sm:rounded-[26px] pointer-events-none"></div>
          <div className="absolute inset-2.5 sm:inset-3 border border-amber-500/15 rounded-[18px] sm:rounded-[22px] pointer-events-none"></div>

          {/* Woven Silk Headbands (Visible at top and bottom of central spine on desktop) */}
          <div className="hidden md:block absolute -top-1.5 left-1/2 -translate-x-1/2 w-9 h-3 rounded-t-sm silk-headband z-25 border border-amber-900/50" />
          <div className="hidden md:block absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-9 h-3 rounded-b-sm silk-headband z-25 border border-amber-900/50" />

          {/* Crimson Satin Bookmark Ribbon */}
          <div className="hidden md:block absolute top-0 left-1/2 -translate-x-1/2 w-5 h-24 bg-gradient-to-b from-red-700 via-red-800 to-red-950 shadow-xl z-30 pointer-events-none rounded-b-sm border-x border-red-950">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
          </div>

          {/* Central Book Spine Shadow (Visible ONLY on Desktop 2-page spread) */}
          <div className="hidden md:block absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-10 sm:w-14 bg-gradient-to-r from-black/40 via-black/75 to-black/40 z-20 pointer-events-none shadow-2xl"></div>

          {/* Book Spread Container (2 Pages on Desktop, 1 on Mobile) */}
          <div className="relative grid grid-cols-1 md:grid-cols-2 gap-0 overflow-hidden rounded-2xl transform-style-3d shadow-inner">
            
            {/* BASE LEFT PAGE */}
            <div
              className={`relative parchment-bg text-neutral-900 p-5 sm:p-8 min-h-[440px] sm:min-h-[580px] flex-col justify-between border-b md:border-b-0 md:border-r border-amber-900/20 ${
                mobilePageTab === 'right' ? 'hidden md:flex' : 'flex'
              }`}
            >
              {/* 3D Cylindrical Paper Curve Highlight */}
              <div className="hidden md:block absolute inset-0 pointer-events-none page-curve-left z-10 rounded-l-2xl"></div>

              <BookPageContent
                name={baseLeftName}
                pageNum={baseLeftPageNum}
                viewMode={viewMode}
                onOpenScan={onOpenScan}
                onOpenTasbih={onOpenTasbih}
                onOpenValidity={onOpenValidity}
                onSendReminder={onSendReminder}
              />

              {/* Dog-Ear Curl for Turning Prev Page */}
              {spreadIndex > 0 && (
                <button
                  onClick={handlePrev}
                  className="hidden md:flex absolute bottom-2 left-2 w-8 h-8 items-end justify-start p-1 z-25 dog-ear-curl cursor-pointer group"
                  title="Click to turn to previous page"
                >
                  <div className="w-0 h-0 border-solid border-b-[16px] border-l-[16px] border-t-[16px] border-r-[16px] border-b-amber-400 border-l-amber-400 border-t-transparent border-r-transparent drop-shadow-md group-hover:border-b-amber-500 group-hover:border-l-amber-500 transition" />
                </button>
              )}
            </div>

            {/* BASE RIGHT PAGE */}
            <div
              className={`relative parchment-bg text-neutral-900 p-5 sm:p-8 min-h-[440px] sm:min-h-[580px] flex-col justify-between ${
                mobilePageTab === 'left' ? 'hidden md:flex' : 'flex'
              }`}
            >
              {/* 3D Cylindrical Paper Curve Highlight */}
              <div className="hidden md:block absolute inset-0 pointer-events-none page-curve-right z-10 rounded-r-2xl"></div>

              {baseRightName ? (
                <BookPageContent
                  name={baseRightName}
                  pageNum={baseRightPageNum}
                  viewMode={viewMode}
                  onOpenScan={onOpenScan}
                  onOpenTasbih={onOpenTasbih}
                  onOpenValidity={onOpenValidity}
                  onSendReminder={onSendReminder}
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center p-6 space-y-4">
                  <div className="text-4xl text-amber-800 font-serif font-bold">وَاللَّهُ أَعْلَمُ</div>
                  <p className="text-sm text-neutral-700 italic max-w-xs">
                    "Allah has said: Pray to Me, so that I will answer you." (p. 119)
                  </p>
                  <span className="text-xs text-neutral-500 font-mono">End of the 99 Divine Names</span>
                </div>
              )}

              {/* Dog-Ear Curl for Turning Next Page */}
              {spreadIndex < totalSpreads - 1 && (
                <button
                  onClick={handleNext}
                  className="hidden md:flex absolute bottom-2 right-2 w-8 h-8 items-end justify-end p-1 z-25 dog-ear-curl cursor-pointer group"
                  title="Click to turn to next page"
                >
                  <div className="w-0 h-0 border-solid border-b-[16px] border-r-[16px] border-t-[16px] border-r-[16px] border-b-amber-400 border-r-amber-400 border-t-transparent border-l-transparent drop-shadow-md group-hover:border-b-amber-500 group-hover:border-r-amber-500 transition" />
                </button>
              )}
            </div>

            {/* ANIMATED 3D TURNING LEAF (Desktop: lifts, arcs in 3D perspective around spine, and lands) */}
            {flippingState.active && flippingState.dir === 'next' && (
              <div className="hidden md:block absolute top-0 bottom-0 left-1/2 w-1/2 z-30 transform-style-3d anim-flip-next pointer-events-none">
                {/* FRONT FACE of turning leaf (current right page) */}
                <div className="absolute inset-0 backface-hidden parchment-bg p-5 sm:p-8 flex flex-col justify-between rounded-r-2xl border-l border-amber-900/30 shadow-2xl overflow-hidden">
                  <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-black/25 via-black/5 to-transparent"></div>
                  <BookPageContent
                    name={leafTurningNextFrontName}
                    pageNum={leafTurningNextFrontPage}
                    viewMode={viewMode}
                    onOpenScan={() => {}}
                    onOpenTasbih={() => {}}
                    onOpenValidity={() => {}}
                    onSendReminder={() => {}}
                  />
                </div>

                {/* BACK FACE of turning leaf (incoming left page) */}
                <div
                  className="absolute inset-0 backface-hidden parchment-bg p-5 sm:p-8 flex flex-col justify-between rounded-l-2xl border-r border-amber-900/30 shadow-2xl overflow-hidden"
                  style={{ transform: 'rotateY(180deg)' }}
                >
                  <div className="absolute inset-0 pointer-events-none bg-gradient-to-l from-black/25 via-black/5 to-transparent"></div>
                  <BookPageContent
                    name={leafTurningNextBackName}
                    pageNum={leafTurningNextBackPage}
                    viewMode={viewMode}
                    onOpenScan={() => {}}
                    onOpenTasbih={() => {}}
                    onOpenValidity={() => {}}
                    onSendReminder={() => {}}
                  />
                </div>
              </div>
            )}

            {/* ANIMATED 3D TURNING LEAF (Turning Prev from left to right) */}
            {flippingState.active && flippingState.dir === 'prev' && (
              <div className="hidden md:block absolute top-0 bottom-0 left-0 w-1/2 z-30 transform-style-3d anim-flip-prev pointer-events-none">
                {/* FRONT FACE of turning leaf (current left page) */}
                <div className="absolute inset-0 backface-hidden parchment-bg p-5 sm:p-8 flex flex-col justify-between rounded-l-2xl border-r border-amber-900/30 shadow-2xl overflow-hidden">
                  <div className="absolute inset-0 pointer-events-none bg-gradient-to-l from-black/25 via-black/5 to-transparent"></div>
                  <BookPageContent
                    name={leafTurningPrevFrontName}
                    pageNum={leafTurningPrevFrontPage}
                    viewMode={viewMode}
                    onOpenScan={() => {}}
                    onOpenTasbih={() => {}}
                    onOpenValidity={() => {}}
                    onSendReminder={() => {}}
                  />
                </div>

                {/* BACK FACE of turning leaf (incoming right page) */}
                <div
                  className="absolute inset-0 backface-hidden parchment-bg p-5 sm:p-8 flex flex-col justify-between rounded-r-2xl border-l border-amber-900/30 shadow-2xl overflow-hidden"
                  style={{ transform: 'rotateY(180deg)' }}
                >
                  <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-black/25 via-black/5 to-transparent"></div>
                  <BookPageContent
                    name={leafTurningPrevBackName}
                    pageNum={leafTurningPrevBackPage}
                    viewMode={viewMode}
                    onOpenScan={() => {}}
                    onOpenTasbih={() => {}}
                    onOpenValidity={() => {}}
                    onSendReminder={() => {}}
                  />
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Floating 3D Navigation Arrows */}
        <button
          onClick={handlePrev}
          disabled={spreadIndex === 0 || flippingState.active}
          className="absolute -left-2 sm:-left-6 top-1/2 -translate-y-1/2 p-3 sm:p-4 rounded-full bg-neutral-900/90 border-2 border-amber-500/60 text-amber-300 hover:bg-neutral-800 hover:scale-110 active:scale-95 transition shadow-2xl disabled:opacity-30 disabled:pointer-events-none z-30 cursor-pointer"
          title="Previous Page (Left Arrow)"
        >
          <ChevronLeft className="w-6 h-6 sm:w-7 sm:h-7" />
        </button>

        <button
          onClick={handleNext}
          disabled={spreadIndex === totalSpreads - 1 || flippingState.active}
          className="absolute -right-2 sm:-right-6 top-1/2 -translate-y-1/2 p-3 sm:p-4 rounded-full bg-neutral-900/90 border-2 border-amber-500/60 text-amber-300 hover:bg-neutral-800 hover:scale-110 active:scale-95 transition shadow-2xl disabled:opacity-30 disabled:pointer-events-none z-30 cursor-pointer"
          title="Next Page (Right Arrow)"
        >
          <ChevronRight className="w-6 h-6 sm:w-7 sm:h-7" />
        </button>
      </div>

      {/* Bottom Slider & Navigation Bar */}
      <div className="w-full max-w-xl flex items-center justify-center gap-4 mt-6">
        <button
          onClick={handlePrev}
          disabled={spreadIndex === 0 || flippingState.active}
          className="px-4 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-300 text-xs font-semibold border border-neutral-800 transition disabled:opacity-40 cursor-pointer"
        >
          ← Previous
        </button>

        <input
          type="range"
          min="0"
          max={totalSpreads - 1}
          value={spreadIndex}
          onChange={(e) => {
            setSpreadIndex(parseInt(e.target.value, 10));
            setMobilePageTab('left');
          }}
          className="flex-1 accent-amber-500 cursor-pointer h-2 bg-neutral-800 rounded-lg"
        />

        <button
          onClick={handleNext}
          disabled={spreadIndex === totalSpreads - 1 || flippingState.active}
          className="px-4 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-300 text-xs font-semibold border border-neutral-800 transition disabled:opacity-40 cursor-pointer"
        >
          Next →
        </button>
      </div>
    </div>
  );
}

// Subcomponent rendering individual book page content
function BookPageContent({ name, pageNum, viewMode, onOpenScan, onOpenTasbih, onOpenValidity, onSendReminder }) {
  if (!name) return null;

  const croppedPagePath = `/scans/page/${pageNum}`;

  // If scan-only mode selected
  if (viewMode === 'scan') {
    return (
      <div className="flex flex-col items-center justify-between h-full space-y-3">
        <div className="flex-1 w-full flex items-center justify-center overflow-hidden rounded-xl border border-amber-900/10 shadow-sm bg-stone-100">
          <img
            src={croppedPagePath}
            alt={name.transliteration}
            className="w-full h-full object-contain"
            onError={(e) => {
              e.target.src = `/book_pages/page_${String(pageNum).padStart(3, '0')}.jpg`;
            }}
          />
        </div>
        <div className="w-full flex items-center justify-between text-[11px] text-amber-950 font-serif pt-2 border-t border-amber-900/15">
          <span className="font-bold">#{name.id} {name.transliteration}</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenTasbih(name)}
              className="text-emerald-800 hover:underline font-semibold"
            >
              📿 Tasbih ({name.count}×)
            </button>
            <span>•</span>
            <span className="font-mono">{pageNum}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-between h-full space-y-4">
      {/* Top Header */}
      <div>
        <div className="flex items-center justify-between border-b border-amber-900/15 pb-2 text-[11px] text-amber-900/80 font-serif">
          <span>THE NINETY-NINE NAMES OF ALLAH</span>
          <span className="font-mono font-bold">#{name.id}</span>
        </div>

        {/* Arabic Calligraphy & Name */}
        <div className="text-center my-4 space-y-1">
          <div className="text-4xl sm:text-5xl font-serif font-bold text-amber-900 drop-shadow-sm">
            {name.arabic}
          </div>
          <div className="text-lg sm:text-xl font-bold tracking-widest text-neutral-900 uppercase font-serif mt-2">
            {name.transliteration}
          </div>
          <div className="text-sm font-semibold text-amber-800 italic">
            "{name.name_en}"
          </div>
          <p className="text-xs text-neutral-700 leading-relaxed mt-2 px-2">
            {name.meaning}
          </p>
        </div>

        {/* Wazifa Prescription Box */}
        <div className="bg-amber-100/70 border border-amber-800/20 rounded-2xl p-4 my-3 text-xs leading-relaxed shadow-sm">
          <div className="flex items-center justify-between mb-1.5">
            <span className="font-bold tracking-wider text-amber-950 uppercase text-[10px]">
              INVOCATION FORMULA:
            </span>
            <span className="font-bold text-emerald-900 bg-emerald-600/15 px-2 py-0.5 rounded-full border border-emerald-700/20">
              {name.count}× Repetitions
            </span>
          </div>
          <div className="text-base font-extrabold text-emerald-950 font-serif tracking-wide mb-1">
            {name.wazifa}
          </div>
          <div className="text-neutral-800 mt-2 font-medium">
            <strong>Timing & Rule:</strong> {name.prayer_time}
          </div>
          <div className="mt-2 pt-2 border-t border-amber-900/15 text-neutral-900">
            <strong>Stated Benefit:</strong> "{name.benefit}"
          </div>
        </div>
      </div>

      {/* Bottom Page Controls */}
      <div className="pt-2 border-t border-amber-900/15 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onOpenTasbih(name)}
            className="px-2.5 py-1 rounded-lg bg-emerald-800 hover:bg-emerald-700 text-white font-semibold transition shadow-sm text-[11px] cursor-pointer"
            title="Open Tasbih Counter"
          >
            📿 Count ({name.count}×)
          </button>

          <button
            onClick={() => onOpenScan(name.scan_file, name.transliteration, pageNum)}
            className="p-1.5 rounded-lg bg-amber-200/80 hover:bg-amber-300 text-amber-950 transition border border-amber-400/50 cursor-pointer"
            title="Inspect Original Scan"
          >
            <ImageIcon className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => onOpenValidity(name)}
            className="p-1.5 rounded-lg bg-amber-200/80 hover:bg-amber-300 text-amber-950 transition border border-amber-400/50 cursor-pointer"
            title="Scholarly Proof & Validity"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
          </button>
        </div>

        <span className="font-serif font-bold text-neutral-600 font-mono text-sm">
          {pageNum}
        </span>
      </div>
    </div>
  );
}
