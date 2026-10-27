import React, { useState } from 'react';
import { X, ZoomIn, ZoomOut, RotateCcw, ExternalLink } from 'lucide-react';

export default function ScanModal({ isOpen, onClose, scanFile, title, pageNumber }) {
  const [zoom, setZoom] = useState(1);

  if (!isOpen || !scanFile) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-5xl h-[90vh] bg-neutral-900 border border-amber-500/40 rounded-2xl flex flex-col overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-950/80">
          <div>
            <h3 className="text-lg font-semibold text-amber-300 flex items-center gap-2">
              📖 Authentic Book Scan: {title}
              {pageNumber && <span className="text-xs px-2 py-0.5 rounded bg-amber-500/20 text-amber-200 border border-amber-500/30">p. {pageNumber}</span>}
            </h3>
            <p className="text-xs text-neutral-400">
              Source: *The Ninety-Nine Names of Allah* (Shems Friedlander, 1978) • <code className="text-neutral-300">{scanFile}</code>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center bg-neutral-800/80 rounded-lg p-1 border border-neutral-700">
              <button
                onClick={() => setZoom(z => Math.max(0.6, z - 0.2))}
                className="p-1.5 text-neutral-300 hover:text-white hover:bg-neutral-700 rounded transition"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="text-xs px-2 text-neutral-300 font-mono">{Math.round(zoom * 100)}%</span>
              <button
                onClick={() => setZoom(z => Math.min(2.5, z + 0.2))}
                className="p-1.5 text-neutral-300 hover:text-white hover:bg-neutral-700 rounded transition"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                onClick={() => setZoom(1)}
                className="p-1.5 text-neutral-300 hover:text-white hover:bg-neutral-700 rounded transition"
                title="Reset Zoom"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            <a
              href={`/scans/${scanFile}`}
              target="_blank"
              rel="noreferrer"
              className="p-2 text-neutral-300 hover:text-amber-400 hover:bg-neutral-800 rounded-lg transition"
              title="Open Raw Scan in New Tab"
            >
              <ExternalLink className="w-5 h-5" />
            </a>

            <button
              onClick={onClose}
              className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Image Content Container */}
        <div className="flex-1 overflow-auto p-4 flex items-center justify-center bg-neutral-950/50">
          <img
            src={`/scans/${scanFile}`}
            alt={title}
            style={{ transform: `scale(${zoom})`, transformOrigin: 'center center' }}
            className="max-h-full max-w-full object-contain rounded-lg shadow-2xl transition-transform duration-200 cursor-grab active:cursor-grabbing border border-neutral-800"
            onError={(e) => {
              // Fallback to static if backend proxy isn't up
              e.target.src = `/book_pages/page_${String(pageNumber).padStart(3, '0')}.jpg`;
            }}
          />
        </div>

        {/* Footer info */}
        <div className="px-6 py-3 border-t border-neutral-800 bg-neutral-950/80 text-xs text-neutral-400 flex items-center justify-between">
          <span>Direct uncompressed scan from your Google Drive folder: <code>E:\My Drive\99NamesOfAllah\{scanFile}</code></span>
          <span className="text-amber-400/80">Press ESC or click X to return to book</span>
        </div>
      </div>
    </div>
  );
}
