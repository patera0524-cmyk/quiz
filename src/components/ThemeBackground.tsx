import { useMemo } from 'react';

interface StickerZone {
  emoji: string;
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
  sizeClass: string;
  opacityClass: string;
}

const STICKER_ZONES: StickerZone[] = [
  // Left open margin pockets (above left speech bubble & between bubble and wheel)
  { emoji: '📖', xMin: 3, xMax: 11, yMin: 15, yMax: 27, sizeClass: 'text-2xl sm:text-3xl', opacityClass: 'opacity-70' },
  { emoji: '✨', xMin: 14, xMax: 22, yMin: 18, yMax: 30, sizeClass: 'text-xl sm:text-2xl', opacityClass: 'opacity-65' },
  { emoji: '🍫', xMin: 4, xMax: 13, yMin: 31, yMax: 42, sizeClass: 'text-2xl sm:text-3xl', opacityClass: 'opacity-65' },
  { emoji: '⭐', xMin: 24, xMax: 30, yMin: 25, yMax: 38, sizeClass: 'text-xl sm:text-2xl', opacityClass: 'opacity-60' },
  { emoji: '💝', xMin: 23, xMax: 30, yMin: 76, yMax: 88, sizeClass: 'text-2xl', opacityClass: 'opacity-70' },
  // Right open margin pockets (above and below right speech bubble)
  { emoji: '📚', xMin: 86, xMax: 94, yMin: 15, yMax: 27, sizeClass: 'text-2xl sm:text-3xl', opacityClass: 'opacity-70' },
  { emoji: '🎀', xMin: 76, xMax: 84, yMin: 18, yMax: 30, sizeClass: 'text-xl sm:text-2xl', opacityClass: 'opacity-65' },
  { emoji: '💖', xMin: 71, xMax: 78, yMin: 24, yMax: 35, sizeClass: 'text-2xl', opacityClass: 'opacity-65' },
  { emoji: '✨', xMin: 74, xMax: 84, yMin: 64, yMax: 75, sizeClass: 'text-xl sm:text-2xl', opacityClass: 'opacity-65' },
  { emoji: '🍫', xMin: 72, xMax: 81, yMin: 79, yMax: 89, sizeClass: 'text-2xl', opacityClass: 'opacity-65' },
];

export function ThemeBackground() {
  const randomStickers = useMemo(() => {
    return STICKER_ZONES.map((zone, idx) => {
      const x = zone.xMin + Math.random() * (zone.xMax - zone.xMin);
      const y = zone.yMin + Math.random() * (zone.yMax - zone.yMin);
      const rotate = Math.round((Math.random() - 0.5) * 44);
      const delay = (idx * 0.45).toFixed(2);
      return {
        ...zone,
        x,
        y,
        rotate,
        delay,
      };
    });
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden select-none"
    >
      {/* Top-left & Top-right festive classroom bunting flags */}
      <svg
        viewBox="0 0 360 120"
        className="absolute -left-4 -top-2 w-40 opacity-85 sm:w-64 md:w-72"
        fill="none"
      >
        <path
          d="M-10 12 Q 160 68 350 8"
          stroke="#6E473D"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray="6 4"
          opacity="0.35"
        />
        <polygon points="18,18 66,30 34,64" fill="#FF7B95" stroke="#4B261E" strokeWidth="2.5" strokeLinejoin="round" />
        <polygon points="82,32 132,37 104,74" fill="#F7C625" stroke="#4B261E" strokeWidth="2.5" strokeLinejoin="round" />
        <polygon points="148,37 198,35 174,73" fill="#56C463" stroke="#4B261E" strokeWidth="2.5" strokeLinejoin="round" />
        <polygon points="214,33 262,25 244,64" fill="#FF8FA3" stroke="#4B261E" strokeWidth="2.5" strokeLinejoin="round" />
        <polygon points="278,22 322,12 308,50" fill="#FDE047" stroke="#4B261E" strokeWidth="2.5" strokeLinejoin="round" />
      </svg>

      <svg
        viewBox="0 0 360 120"
        className="absolute -right-4 -top-2 w-40 -scale-x-100 opacity-85 sm:w-64 md:w-72"
        fill="none"
      >
        <path
          d="M-10 12 Q 160 68 350 8"
          stroke="#6E473D"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray="6 4"
          opacity="0.35"
        />
        <polygon points="18,18 66,30 34,64" fill="#56C463" stroke="#4B261E" strokeWidth="2.5" strokeLinejoin="round" />
        <polygon points="82,32 132,37 104,74" fill="#FF7B95" stroke="#4B261E" strokeWidth="2.5" strokeLinejoin="round" />
        <polygon points="148,37 198,35 174,73" fill="#F7C625" stroke="#4B261E" strokeWidth="2.5" strokeLinejoin="round" />
        <polygon points="214,33 262,25 244,64" fill="#7DD3FC" stroke="#4B261E" strokeWidth="2.5" strokeLinejoin="round" />
        <polygon points="278,22 322,12 308,50" fill="#FF8FA3" stroke="#4B261E" strokeWidth="2.5" strokeLinejoin="round" />
      </svg>

      {/* Left Group: Speech Bubble emerging directly from the Stacked Books */}
      <div className="absolute bottom-[7%] left-[1.5%] hidden flex-col items-start lg:flex xl:left-[3.5%]">
        <div className="relative w-[220px] rounded-[28px] border-[3.5px] border-[#4B261E] bg-[#FFFDF9]/95 px-4 py-4 text-center shadow-[0_6px_0_#F9AEBE,0_12px_24px_rgba(75,38,30,0.12)] xl:w-[315px] xl:px-6 xl:py-5">
          <div className="mb-1.5 inline-flex items-center gap-1 rounded-full bg-[#FFE6EE] px-3 py-0.5 text-sm text-[#D93660] xl:text-base">
            <span>📖</span>
            <span>독서 퀴즈 미션!</span>
          </div>
          <p className="text-[17px] leading-snug text-[#4B261E] xl:text-[22px]">
            <span className="text-[#EE4568]">폰은 잠시 쉬고, 책은 가까이!</span>
            <br />
            독서 퀴즈 정답을 맞혔다면
            <br />
            달콤한 선물도 챙겨 가세요.
          </p>
          {/* Tail pointing DOWN directly at the books below */}
          <div className="absolute -bottom-[13px] left-14 h-5 w-5 rotate-45 border-b-[3.5px] border-r-[3.5px] border-[#4B261E] bg-[#FFFDF9] xl:left-20" />
        </div>

        {/* Stacked Books directly beneath the bubble */}
        <div className="ml-4 mt-4 opacity-95 xl:ml-8">
          <svg width="132" height="114" viewBox="0 0 136 120" fill="none" className="rotate-3 drop-shadow-[0_6px_12px_rgba(75,38,30,0.14)]">
            <rect x="14" y="74" width="96" height="26" rx="7" fill="#56C463" stroke="#4B261E" strokeWidth="3.5" />
            <rect x="24" y="80" width="76" height="14" rx="4" fill="#FFFDF7" opacity="0.9" />
            <rect x="22" y="48" width="88" height="26" rx="7" fill="#F7C625" stroke="#4B261E" strokeWidth="3.5" />
            <rect x="32" y="54" width="68" height="14" rx="4" fill="#FFFDF7" opacity="0.9" />
            <rect x="18" y="22" width="82" height="26" rx="7" fill="#FF7B95" stroke="#4B261E" strokeWidth="3.5" />
            <path d="M32 35 H80" stroke="#FFFDF7" strokeWidth="3.5" strokeLinecap="round" />
            <path d="M110 34 C110 28, 118 27, 120 32 C122 27, 130 28, 130 34 C130 41, 120 47, 120 47 C120 47, 110 41, 110 34 Z" fill="#FF5E82" stroke="#4B261E" strokeWidth="2.5" />
          </svg>
        </div>
      </div>

      {/* Right Speech Bubble: Emerging directly from the Roulette Wheel */}
      <div className="absolute right-[1.5%] top-[48%] hidden w-[215px] -translate-y-1/2 lg:block xl:right-[4%] xl:w-[305px]">
        <div className="relative rounded-[28px] border-[3.5px] border-[#4B261E] bg-[#FFFDF9]/95 px-4 py-4 text-center shadow-[0_6px_0_#FDE08D,0_12px_24px_rgba(75,38,30,0.12)] xl:px-6 xl:py-5">
          <div className="mb-1.5 inline-flex items-center gap-1 rounded-full bg-[#FEF3C7] px-3 py-0.5 text-sm text-[#B45309] xl:text-base">
            <span>🎯</span>
            <span>룰렛 안내</span>
          </div>
          <p className="text-[18px] leading-snug text-[#4B261E] xl:text-[23px]">
            가운데 <span className="text-[#EE4568]">시작 버튼</span>을 눌러
            <br />
            빼빼로를 뽑아 보세요!
          </p>
          {/* Tail pointing LEFT directly toward the Roulette Wheel */}
          <div className="absolute -left-[13px] top-1/2 h-5 w-5 -translate-y-1/2 rotate-45 border-b-[3.5px] border-l-[3.5px] border-[#4B261E] bg-[#FFFDF9]" />
        </div>
      </div>

      {/* Right Bottom: Crossed Sweet Pepero Sticks & Chocolate */}
      <div className="absolute bottom-[6%] right-[4%] hidden opacity-90 md:block">
        <svg width="118" height="114" viewBox="0 0 132 132" fill="none" className="-rotate-6 drop-shadow-[0_6px_12px_rgba(75,38,30,0.12)]">
          <g transform="rotate(-18 66 66)">
            <rect x="48" y="14" width="12" height="102" rx="6" fill="#F3C68F" stroke="#4B261E" strokeWidth="3" />
            <rect x="48" y="14" width="12" height="68" rx="6" fill="#6E3B2B" stroke="#4B261E" strokeWidth="3" />
            <circle cx="53" cy="28" r="2.2" fill="#FDE68A" />
            <circle cx="56" cy="44" r="2.5" fill="#FDE68A" />
            <circle cx="52" cy="60" r="2" fill="#FDE68A" />
          </g>
          <g transform="rotate(14 66 66)">
            <rect x="70" y="16" width="12" height="100" rx="6" fill="#F3C68F" stroke="#4B261E" strokeWidth="3" />
            <rect x="70" y="16" width="12" height="66" rx="6" fill="#FF7B95" stroke="#4B261E" strokeWidth="3" />
            <circle cx="75" cy="30" r="2" fill="#FFFFFF" />
            <circle cx="77" cy="48" r="2" fill="#FDE047" />
          </g>
          <circle cx="66" cy="80" r="7" fill="#F7C625" stroke="#4B261E" strokeWidth="2.5" />
        </svg>
      </div>

      {/* Organically Scattered Randomized Thematic Emojis in Safe Margin Pockets */}
      {randomStickers.map((sticker, idx) => (
        <div
          key={idx}
          className={`absolute hidden sm:block ${sticker.sizeClass} ${sticker.opacityClass}`}
          style={{
            left: `${sticker.x.toFixed(1)}%`,
            top: `${sticker.y.toFixed(1)}%`,
          }}
        >
          <span
            className="inline-block drop-shadow-[0_3px_5px_rgba(75,38,30,0.14)]"
            style={{ transform: `rotate(${sticker.rotate}deg)` }}
          >
            {sticker.emoji}
          </span>
        </div>
      ))}
    </div>
  );
}
