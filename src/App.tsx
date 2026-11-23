import { useCallback, useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { ConfettiOverlay } from './components/ConfettiOverlay';
import { ResultModal } from './components/ResultModal';
import { RouletteWheel } from './components/RouletteWheel';
import { ThemeBackground } from './components/ThemeBackground';
import { getPrizeAtRotation, pickWeightedPrize, PeperoPrize } from './types/roulette';
import { playApplauseSound, playStartSound, playTickSound, playWinFanfare } from './utils/sound';

function getSecureRandomUnit(): number {
  if (typeof window !== 'undefined' && window.crypto?.getRandomValues) {
    const arr = new Uint32Array(1);
    window.crypto.getRandomValues(arr);
    return arr[0] / (0xffffffff + 1);
  }
  return Math.random();
}

export default function App() {
  const [rotation, setRotation] = useState<number>(0);
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [pointerKick, setPointerKick] = useState<number>(0);
  const [winningPrize, setWinningPrize] = useState<PeperoPrize | null>(null);
  const [showConfetti, setShowConfetti] = useState<boolean>(false);
  const [drawCounts, setDrawCounts] = useState<Record<PeperoPrize['id'], number>>({
    choco: 0,
    chocofilled: 0,
    almond: 0,
  });

  const rotationRef = useRef<number>(0);
  const rafRef = useRef<number | null>(null);
  const kickTimeoutRef = useRef<number | null>(null);
  const confettiTimeoutRef = useRef<number | null>(null);
  const soundEnabledRef = useRef<boolean>(soundEnabled);

  useEffect(() => {
    soundEnabledRef.current = soundEnabled;
  }, [soundEnabled]);

  useEffect(() => {
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      if (kickTimeoutRef.current !== null) window.clearTimeout(kickTimeoutRef.current);
      if (confettiTimeoutRef.current !== null) window.clearTimeout(confettiTimeoutRef.current);
    };
  }, []);

  const triggerSpin = useCallback(() => {
    if (isSpinning) return;

    setWinningPrize(null);
    setShowConfetti(false);
    setIsSpinning(true);
    playStartSound(soundEnabledRef.current);

    // Pick a weighted random slice (4:3:3 for Choco : Choco-Filled : Almond) while keeping equal 120-deg slices
    const chosenSlice = pickWeightedPrize(getSecureRandomUnit());
    const safeMargin = 16; // stay at least 16 deg away from 120-deg boundaries
    const sliceSpan = chosenSlice.endAngle - chosenSlice.startAngle - safeMargin * 2;
    const targetWheelAngle =
      chosenSlice.startAngle + safeMargin + getSecureRandomUnit() * sliceSpan;

    // Wheel rotates clockwise, so wheelAngle under top pointer is (360 - (R % 360)) % 360
    const desiredMod = (360 - targetWheelAngle + 360) % 360;
    const startRotation = rotationRef.current;
    const currentMod = ((startRotation % 360) + 360) % 360;
    const deltaMod = (desiredMod - currentMod + 360) % 360;

    // 7 to 9 full high-speed spins
    const extraRevolutions = 7 + Math.floor(getSecureRandomUnit() * 3);
    const totalDelta = extraRevolutions * 360 + deltaMod;
    const targetRotation = startRotation + totalDelta;

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const durationMs = prefersReducedMotion ? 600 : 4400;

    const startTime = performance.now();
    let lastPegIndex = Math.floor(startRotation / 30);

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const t = Math.min(1, elapsed / durationMs);

      // Quartic ease-out: ultra-fast launch, smooth suspenseful deceleration
      const eased = 1 - Math.pow(1 - t, 4);
      const currentRot = startRotation + totalDelta * eased;

      rotationRef.current = currentRot;
      setRotation(currentRot);

      // Tick sound & subtle heart pointer kick every 30-degree peg
      const pegIndex = Math.floor(currentRot / 30);
      if (pegIndex > lastPegIndex && t < 0.995) {
        lastPegIndex = pegIndex;
        const speedRatio = Math.pow(1 - t, 3);
        playTickSound(soundEnabledRef.current, speedRatio);
        setPointerKick(-11);
        if (kickTimeoutRef.current !== null) window.clearTimeout(kickTimeoutRef.current);
        kickTimeoutRef.current = window.setTimeout(() => {
          setPointerKick(0);
        }, 65);
      }

      if (t < 1) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        rafRef.current = null;
        setPointerKick(0);
        setIsSpinning(false);

        const actualWinner = getPrizeAtRotation(targetRotation);
        setWinningPrize(actualWinner);
        setDrawCounts((prev) => ({
          ...prev,
          [actualWinner.id]: prev[actualWinner.id] + 1,
        }));
        playWinFanfare(soundEnabledRef.current);
        playApplauseSound(soundEnabledRef.current);
        setShowConfetti(true);
        if (confettiTimeoutRef.current !== null) window.clearTimeout(confettiTimeoutRef.current);
        confettiTimeoutRef.current = window.setTimeout(() => {
          setShowConfetti(false);
        }, 5200);
      }
    };

    rafRef.current = requestAnimationFrame(animate);
  }, [isSpinning]);

  const handleSpinAgain = () => {
    setWinningPrize(null);
    window.setTimeout(() => {
      triggerSpin();
    }, 120);
  };

  const totalDraws = drawCounts.choco + drawCounts.chocofilled + drawCounts.almond;

  return (
    <div className="bg-pastel-dots font-cute relative flex h-dvh flex-col items-center justify-between overflow-hidden px-4 py-3 sm:py-4">
      <ThemeBackground />
      <ConfettiOverlay active={showConfetti} />

      {/* Top-Right Sound Toggle */}
      <div className="fixed right-4 top-3.5 z-30 sm:right-6 sm:top-5">
        <button
          type="button"
          onClick={() => setSoundEnabled((prev) => !prev)}
          aria-label={soundEnabled ? '효과음 끄기' : '효과음 켜기'}
          title={soundEnabled ? '효과음 끄기' : '효과음 켜기'}
          className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border-2 border-white bg-white/95 shadow-[0_4px_12px_rgba(75,38,30,0.14)] transition-transform hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#3BB54A]/40 sm:h-12 sm:w-12"
        >
          {soundEnabled ? (
            <Volume2 className="h-5 w-5 text-[#3BB54A] sm:h-6 sm:w-6" />
          ) : (
            <VolumeX className="h-5 w-5 text-[#9C7B72] sm:h-6 sm:w-6" />
          )}
        </button>
      </div>

      {/* Header Section */}
      <header className="relative z-10 flex w-full max-w-4xl shrink-0 flex-col items-center text-center">
        <div className="rounded-full border-[3px] border-[#4B261E] bg-[#FFFDF9]/95 px-5 py-1.5 shadow-[0_4px_0_#F9AEBE,0_8px_18px_rgba(75,38,30,0.12)] sm:px-7">
          <h1 className="title-choco-outline whitespace-nowrap text-[clamp(1rem,2.6vw,1.8rem)] leading-tight tracking-normal">
            평택초등학교 폰프리 스쿨{' '}
            <span className="text-[#EE4568]">&lt;독서 퀴즈&gt;</span>
          </h1>
        </div>

        <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#FF758F] to-[#F34E6D] px-4 py-1 text-[clamp(0.85rem,2vw,1.05rem)] text-white shadow-[0_3px_0_#C93356,0_6px_14px_rgba(243,78,109,0.28)]">
          <span aria-hidden="true">🎁</span>
          <span>오늘의 선물은 바로바로~</span>
        </div>

        {/* Subheading flanked by cute heart emojis */}
        <div className="mt-1.5 flex items-center justify-center gap-2 sm:gap-3.5">
          <span
            role="img"
            aria-label="하트 선물"
            className="inline-flex -rotate-12 items-center justify-center text-[clamp(1.75rem,3.8vw,2.4rem)] leading-none drop-shadow-[0_4px_6px_rgba(238,61,110,0.28)]"
          >
            💝
          </span>
          <p className="subtitle-choco-outline text-[clamp(1.45rem,3.6vw,2.1rem)] leading-none tracking-tight whitespace-nowrap">
            달콤한{' '}
            <span style={{ color: '#EC3D3D' }}>빼</span>
            <span style={{ color: '#F5B800' }}>빼</span>
            <span style={{ color: '#3BB54A' }}>로</span>!
          </p>
          <span
            role="img"
            aria-label="하트"
            className="inline-flex rotate-12 items-center justify-center text-[clamp(1.75rem,3.8vw,2.4rem)] leading-none drop-shadow-[0_4px_6px_rgba(238,61,110,0.28)]"
          >
            💖
          </span>
        </div>
      </header>

      {/* Main Focal Point: Pepero Roulette Wheel */}
      <main className="relative z-10 my-1 flex w-full flex-1 items-center justify-center px-2 min-h-0">
        <RouletteWheel
          rotation={rotation}
          isSpinning={isSpinning}
          pointerKick={pointerKick}
          onSpin={triggerSpin}
        />
      </main>

      {/* Bottom Prompt (shown on smaller screens where side speech bubbles hide, or while spinning) & Draw Count Tally */}
      <footer className="relative z-10 flex shrink-0 flex-col items-center gap-1.5 text-center">
        <div
          className={`rounded-full border border-[#4B261E]/15 bg-[#FFFDF9]/90 px-5 py-1.5 text-[clamp(0.85rem,2vw,1.02rem)] text-[#53261B] shadow-[0_4px_12px_rgba(75,38,30,0.08)] ${
            isSpinning ? 'block' : 'lg:hidden'
          }`}
        >
          {isSpinning
            ? '빙글빙글~ 과연 어떤 빼빼로가 나올까요?'
            : '가운데 시작 버튼을 눌러 빼빼로를 뽑아 보세요'}
        </div>

        {totalDraws > 0 && (
          <div className="font-cute-body flex flex-wrap items-center justify-center gap-2 rounded-full bg-[#FFFDF9]/80 px-4 py-1 text-xs text-[#6E473D]">
            <span>초코 {drawCounts.choco}</span>
            <span aria-hidden="true">·</span>
            <span>초코필드 {drawCounts.chocofilled}</span>
            <span aria-hidden="true">·</span>
            <span>아몬드 {drawCounts.almond}</span>
            <span aria-hidden="true">·</span>
            <button
              type="button"
              onClick={() => setDrawCounts({ choco: 0, chocofilled: 0, almond: 0 })}
              className="cursor-pointer underline decoration-[#6E473D]/40 underline-offset-2 hover:text-[#4B261E]"
            >
              기록 초기화
            </button>
          </div>
        )}
      </footer>

      {/* Winning Result Modal */}
      <ResultModal
        prize={winningPrize}
        onClose={() => setWinningPrize(null)}
        onSpinAgain={handleSpinAgain}
      />
    </div>
  );
}
