import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, RotateCw, CheckCircle2, Star, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

export const FlashcardModal = ({ isOpen, onClose, cards = [], onMarkReviewed }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  if (!isOpen || cards.length === 0) return null;

  const currentCard = cards[currentIndex];

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % cards.length);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length);
  };

  const handleMarkMastered = () => {
    confetti({ particleCount: 70, spread: 60, origin: { y: 0.7 } });
    if (onMarkReviewed && currentCard) {
      onMarkReviewed(currentCard.subjectId, currentCard.topicId, 5);
    }
    handleNext();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-xl rounded-3xl bg-slate-900 border border-slate-700/60 p-6 md:p-8 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400">
              <Sparkles className="w-4 h-4" />
            </span>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Flashcard {currentIndex + 1} of {cards.length}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 3D Flashcard Container */}
        <div
          onClick={() => setIsFlipped(!isFlipped)}
          className="cursor-pointer min-h-[280px] p-8 rounded-3xl border border-indigo-500/30 bg-gradient-to-br from-slate-800/90 to-slate-900/90 shadow-2xl flex flex-col justify-between transition-all duration-300 transform hover:scale-[1.01]"
        >
          <div className="flex items-center justify-between text-xs">
            <span
              className="px-2.5 py-1 rounded-full font-semibold text-white text-[11px]"
              style={{ backgroundColor: currentCard.subjectColor || '#6366f1' }}
            >
              {currentCard.subjectName}
            </span>
            <span className="text-slate-400 flex items-center gap-1">
              <RotateCw className="w-3.5 h-3.5" /> Tap card to {isFlipped ? 'see question' : 'reveal answer & formulas'}
            </span>
          </div>

          <div className="my-auto text-center py-6">
            {!isFlipped ? (
              <div>
                <h3 className="text-2xl md:text-3xl font-extrabold text-white font-display">
                  {currentCard.title}
                </h3>
                <p className="text-sm text-slate-400 mt-2">
                  Difficulty: <span className="font-semibold text-amber-400">{currentCard.difficulty || 'Medium'}</span>
                </p>
              </div>
            ) : (
              <div className="space-y-4 text-left">
                {currentCard.keyFormulas && currentCard.keyFormulas.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400 mb-1.5">
                      Key Formulas / Definition:
                    </h4>
                    <div className="space-y-1">
                      {currentCard.keyFormulas.map((f, i) => (
                        <div key={i} className="p-2 rounded-xl bg-slate-950/70 border border-slate-700 font-mono text-sm text-indigo-300">
                          {f}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {currentCard.notes && (
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                      Core Concept Notes:
                    </h4>
                    <p className="text-sm text-slate-200 bg-slate-800/50 p-3 rounded-xl border border-slate-700/50 leading-relaxed">
                      {currentCard.notes}
                    </p>
                  </div>
                )}

                {!currentCard.notes && (!currentCard.keyFormulas || currentCard.keyFormulas.length === 0) && (
                  <p className="text-slate-400 italic text-center">No additional notes added for this topic yet.</p>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-800">
            <span>Status: <strong className="text-slate-300">{currentCard.status || 'Active'}</strong></span>
            <span>Confidence: {currentCard.confidence || 3}/5</span>
          </div>
        </div>

        {/* Card Navigation & Actions */}
        <div className="flex items-center justify-between mt-6">
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              className="p-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNext}
              className="p-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <button
            onClick={handleMarkMastered}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-600/25 transition-all"
          >
            <CheckCircle2 className="w-4 h-4" />
            Mark Revised Today
          </button>
        </div>
      </div>
    </div>
  );
};
