import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RotateCcw, Sparkles, X } from 'lucide-react';
import { PeperoPrize } from '../types/roulette';

interface ResultModalProps {
  prize: PeperoPrize | null;
  onClose: () => void;
  onSpinAgain: () => void;
}

export function ResultModal({ prize, onClose, onSpinAgain }: ResultModalProps) {
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setImgError(false);
  }, [prize?.id]);

  useEffect(() => {
    if (!prize) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [prize, onClose]);

  return (
    <AnimatePresence>
      {prize && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#3B1D16]/45 p-4 backdrop-blur-[3px]"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-labelledby="result-modal-title"
        >
          <motion.div
            initial={{ scale: 0.78, opacity: 0, y: 24 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 12 }}
            transition={{ type: 'spring', stiffness: 360, damping: 22 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-lg sm:max-w-xl overflow-hidden rounded-[36px] border-[5px] border-[#4B261E] bg-[#FFFDF9] p-7 pt-8 text-center shadow-[0_24px_56px_rgba(75,38,30,0.36)] sm:p-10"
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="결과 창 닫기"
              className="absolute right-5 top-5 z-20 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-[#F6ECE9] text-[#5D3329] transition-colors hover:bg-[#ECD9D3] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4B261E]"
            >
              <X className="h-6 w-6" />
            </button>

            {/* Animated Celebration Top Badge */}
            <motion.div
              initial={{ scale: 0.7, opacity: 0, y: -10 }}
              animate={{ scale: [0.85, 1.08, 1], opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="relative z-10 mx-auto mb-3 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#FF5E82] via-[#FF4772] to-[#FF6E8E] px-6 py-1.5 text-lg text-white shadow-[0_4px_0_#C93356] sm:text-xl"
            >
              <Sparkles className="h-5 w-5" />
              <span>독서 퀴즈 정답! 축하해요!</span>
              <Sparkles className="h-5 w-5" />
            </motion.div>

            {/* Winning Pepero Showcase with Rotating Sunburst & Floating Cheers */}
            <div className="relative mx-auto my-3 flex h-64 w-64 items-center justify-center sm:h-72 sm:w-72">
              {/* Rotating sunburst halo */}
              <motion.div
                aria-hidden="true"
                animate={{ rotate: 360 }}
                transition={{ duration: 16, repeat: Infinity, ease: 'linear' }}
                className="pointer-events-none absolute -inset-4 rounded-full opacity-55"
                style={{
                  background: `repeating-conic-gradient(from 0deg, ${prize.accentBg} 0deg 15deg, transparent 15deg 30deg)`,
                }}
              />

              {/* Floating celebratory emojis around showcase */}
              <motion.span
                aria-hidden="true"
                animate={{ y: [0, -8, 0], rotate: [-12, 8, -12] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                className="pointer-events-none absolute -left-3 top-5 z-20 text-3xl sm:-left-5 sm:text-4xl"
              >
                🎉
              </motion.span>
              <motion.span
                aria-hidden="true"
                animate={{ y: [0, -7, 0], scale: [1, 1.15, 1] }}
                transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }}
                className="pointer-events-none absolute -right-3 top-6 z-20 text-3xl sm:-right-5 sm:text-4xl"
              >
                👏
              </motion.span>
              <motion.span
                aria-hidden="true"
                animate={{ y: [0, 6, 0], rotate: [10, -10, 10] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
                className="pointer-events-none absolute -left-2 bottom-5 z-20 text-2xl sm:text-3xl"
              >
                ⭐
              </motion.span>
              <motion.span
                aria-hidden="true"
                animate={{ y: [0, -6, 0], scale: [1, 1.2, 1] }}
                transition={{ duration: 1.9, repeat: Infinity, ease: 'easeInOut', delay: 0.6 }}
                className="pointer-events-none absolute -right-2 bottom-6 z-20 text-2xl sm:text-3xl"
              >
                ✨
              </motion.span>

              <div
                className="relative z-10 flex h-full w-full items-center justify-center rounded-[36px] border-4 border-white p-5 shadow-[inset_0_4px_14px_rgba(75,38,30,0.08),0_10px_24px_rgba(75,38,30,0.12)]"
                style={{ backgroundColor: prize.accentBg }}
              >
                {!imgError ? (
                  <motion.img
                    src={prize.imageUrl}
                    alt={prize.name}
                    referrerPolicy="no-referrer"
                    onError={() => setImgError(true)}
                    initial={{ rotate: -8, scale: 0.72 }}
                    animate={{ rotate: [0, -4, 4, -2, 0], scale: [0.95, 1.06, 1] }}
                    transition={{ duration: 0.75, ease: 'easeOut' }}
                    className="max-h-full max-w-full object-contain drop-shadow-[0_14px_20px_rgba(75,38,30,0.28)]"
                  />
                ) : (
                  <span
                    className="text-3xl"
                    style={{ color: prize.textColor }}
                  >
                    {prize.name}
                  </span>
                )}
              </div>
            </div>

            {/* Animated Winning Title & Praise Message */}
            <motion.h2
              id="result-modal-title"
              initial={{ scale: 0.85, opacity: 0, y: 8 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ delay: 0.15, type: 'spring', stiffness: 320, damping: 20 }}
              className="mt-3 text-4xl tracking-tight sm:text-5xl"
              style={{ color: prize.textColor }}
            >
              {prize.name}
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.28, duration: 0.35 }}
              className="mt-2.5 space-y-1"
            >
              <p className="inline-flex items-center justify-center gap-1.5 rounded-full bg-[#FFF2F5] px-4 py-1 text-base text-[#D93660] sm:text-lg">
                <motion.span
                  animate={{ rotate: [0, -14, 14, -10, 0] }}
                  transition={{ duration: 0.9, repeat: 2, delay: 0.35 }}
                  className="inline-block"
                >
                  👏
                </motion.span>
                <span>짝짝짝! 독서 퀴즈를 맞힌 멋진 친구 최고예요!</span>
              </p>
              <p className="font-cute-body text-base leading-relaxed text-[#6E473D] sm:text-lg">
                {prize.description}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.36, duration: 0.3 }}
              className="mt-6 flex items-center justify-center gap-3.5"
            >
              <button
                type="button"
                onClick={onSpinAgain}
                className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-2xl border-2 border-[#4B261E] bg-gradient-to-b from-[#FF7590] to-[#EE4568] px-6 py-3.5 text-xl text-white shadow-[0_4px_0_#4B261E] transition-transform hover:brightness-105 active:translate-y-0.5 active:shadow-[0_2px_0_#4B261E] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#FF5E82]/40 whitespace-nowrap"
              >
                <RotateCcw className="h-5 w-5" />
                <span>한 번 더 돌리기</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="cursor-pointer rounded-2xl border-2 border-[#4B261E]/25 bg-[#F7EFEA] px-6 py-3.5 text-xl text-[#4B261E] transition-colors hover:bg-[#EDE0D8] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#4B261E]/25 whitespace-nowrap"
              >
                확인
              </button>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
