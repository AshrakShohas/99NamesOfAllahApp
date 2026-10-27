import React, { useState, useEffect } from 'react';
import { X, RotateCcw, Volume2, VolumeX, Sparkles, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function TasbihModal({ isOpen, onClose, name }) {
  const [count, setCount] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const targetCount = name?.count || 100;

  useEffect(() => {
    setCount(0);
  }, [name]);

  // Audio click sound using Web Audio API (zero external assets required)
  const playClickSound = () => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(650, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(400, audioCtx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.09);
    } catch (e) {
      // Audio not supported or blocked
    }
  };

  const handleIncrement = () => {
    const nextCount = count + 1;
    setCount(nextCount);
    playClickSound();

    if (navigator.vibrate) {
      navigator.vibrate(40);
    }

    if (nextCount === targetCount) {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#d4af37', '#10b981', '#3b82f6', '#f59e0b']
      });
    }
  };

  if (!isOpen || !name) return null;

  const percentage = Math.min(100, Math.round((count / targetCount) * 100));
  const isCompleted = count >= targetCount;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
      <div className="relative w-full max-w-md bg-neutral-900 border border-emerald-500/30 rounded-3xl p-6 shadow-2xl flex flex-col items-center">
        {/* Top bar */}
        <div className="w-full flex items-center justify-between pb-4 border-b border-neutral-800">
          <div className="flex items-center gap-2">
            <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30">
              📿 Digital Tasbih
            </span>
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-1 text-neutral-400 hover:text-white"
              title={soundEnabled ? 'Mute Chime' : 'Enable Chime'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-neutral-500" />}
            </button>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-full transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Name details */}
        <div className="text-center my-4">
          <div className="text-4xl text-amber-400 font-bold mb-1 font-serif">{name.arabic}</div>
          <div className="text-lg font-bold text-neutral-100 tracking-wider">{name.wazifa}</div>
          <div className="text-xs text-neutral-400 mt-1">Prescribed Target: <span className="text-amber-400 font-bold">{targetCount}×</span> ({name.prayer_time})</div>
        </div>

        {/* Counter Ring Button */}
        <div className="relative my-6 flex items-center justify-center">
          <svg className="w-64 h-64 transform -rotate-90">
            <circle
              cx="128"
              cy="128"
              r="105"
              stroke="#262626"
              strokeWidth="12"
              fill="transparent"
            />
            <circle
              cx="128"
              cy="128"
              r="105"
              stroke={isCompleted ? "#10b981" : "#d4af37"}
              strokeWidth="12"
              fill="transparent"
              strokeDasharray={2 * Math.PI * 105}
              strokeDashoffset={2 * Math.PI * 105 * (1 - count / targetCount)}
              strokeLinecap="round"
              className="transition-all duration-150"
            />
          </svg>

          {/* Interactive Tap Area */}
          <button
            onClick={handleIncrement}
            className={`absolute w-48 h-48 rounded-full flex flex-col items-center justify-center transition-all transform active:scale-95 shadow-inner ${
              isCompleted
                ? 'bg-emerald-950/80 border-4 border-emerald-500 text-emerald-300'
                : 'bg-neutral-950 border-4 border-amber-500/40 hover:border-amber-400 text-amber-400'
            }`}
          >
            <span className="text-5xl font-mono font-extrabold tracking-tight">
              {count}
            </span>
            <span className="text-xs uppercase tracking-widest text-neutral-400 mt-1">
              {isCompleted ? 'Completed 🎉' : 'Tap to Count'}
            </span>
            <span className="text-xs text-neutral-500 mt-0.5">
              Target: {targetCount}
            </span>
          </button>
        </div>

        {/* Progress & Reset */}
        <div className="w-full flex items-center justify-between text-xs text-neutral-400 px-2 mt-2">
          <span>Progress: <strong className="text-neutral-200">{percentage}%</strong></span>
          <button
            onClick={() => setCount(0)}
            className="flex items-center gap-1.5 text-neutral-400 hover:text-amber-400 px-3 py-1.5 rounded-lg bg-neutral-800/60 hover:bg-neutral-800 transition border border-neutral-700/60"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Count
          </button>
        </div>

        {/* Stated Benefit reminder */}
        <div className="mt-5 w-full bg-neutral-950/70 border border-neutral-800 rounded-xl p-3 text-xs text-neutral-300 text-center leading-relaxed">
          <span className="text-amber-400/90 font-semibold block mb-0.5">📖 Stated Benefit in Book (p. {name.book_page}):</span>
          "{name.benefit}"
        </div>
      </div>
    </div>
  );
}
