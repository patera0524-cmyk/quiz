import { useState } from 'react';
import { PEPERO_PRIZES, PeperoPrize } from '../types/roulette';

interface RouletteWheelProps {
  rotation: number;
  isSpinning: boolean;
  isDisabled?: boolean;
  pointerKick: number;
  onSpin: () => void;
}

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return {
    x: cx + r * Math.cos(rad),
    y: cy + r * Math.sin(rad),
  };
}

function createWedgePath(cx: number, cy: number, r: number, startAngle: number, endAngle: number) {
  const start = polarToCartesian(cx, cy, r, startAngle);
  const end = polarToCartesian(cx, cy, r, endAngle);
  const largeArc = endAngle - startAngle <= 180 ? '0' : '1';
  return [
    `M ${cx} ${cy}`,
    `L ${start.x.toFixed(2)} ${start.y.toFixed(2)}`,
    `A ${r} ${r} 0 ${largeArc} 1 ${end.x.toFixed(2)} ${end.y.toFixed(2)}`,
    'Z',
  ].join(' ');
}

function createTextArcPath(
  cx: number,
  cy: number,
  r: number,
  startAngle: number,
  endAngle: number,
  reverse: boolean
) {
  const pad = 16;
  const a1 = startAngle + pad;
  const a2 = endAngle - pad;
  if (reverse) {
    const pStart = polarToCartesian(cx, cy, r, a2);
    const pEnd = polarToCartesian(cx, cy, r, a1);
    return `M ${pStart.x.toFixed(2)} ${pStart.y.toFixed(2)} A ${r} ${r} 0 0 0 ${pEnd.x.toFixed(2)} ${pEnd.y.toFixed(2)}`;
  }
  const pStart = polarToCartesian(cx, cy, r, a1);
  const pEnd = polarToCartesian(cx, cy, r, a2);
  return `M ${pStart.x.toFixed(2)} ${pStart.y.toFixed(2)} A ${r} ${r} 0 0 1 ${pEnd.x.toFixed(2)} ${pEnd.y.toFixed(2)}`;
}

export function RouletteWheel({
  rotation,
  isSpinning,
  isDisabled = false,
  pointerKick,
  onSpin,
}: RouletteWheelProps) {
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  const cx = 250;
  const cy = 250;
  const pegAngles = Array.from({ length: 12 }, (_, i) => i * 30);

  const handleImageError = (id: PeperoPrize['id']) => {
    setFailedImages((prev) => ({ ...prev, [id]: true }));
  };

  return (
    <div className="relative mx-auto flex aspect-square w-[min(88vw,calc(100dvh-235px),600px)] min-w-[260px] items-center justify-center select-none">
      {/* Soft ambient ground shadow under wheel */}
      <div
        aria-hidden="true"
        className="absolute inset-[6%] rounded-full bg-[#53261b]/15 blur-xl translate-y-4"
      />

      {/* Top Heart Pointer */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-3.5 left-1/2 z-20 -translate-x-1/2 transition-transform duration-75 ease-out"
        style={{
          transform: `rotate(${pointerKick}deg)`,
          transformOrigin: '50% 28%',
        }}
      >
        <svg
          width="52"
          height="50"
          viewBox="0 0 48 46"
          className="drop-shadow-[0_4px_6px_rgba(75,38,30,0.3)]"
        >
          <path
            d="M24 42.5C24 42.5 5 29.5 5 15.5C5 8.8 10.3 4 16.4 4C20.1 4 22.7 5.8 24 8.2C25.3 5.8 27.9 4 31.6 4C37.7 4 43 8.8 43 15.5C43 29.5 24 42.5 24 42.5Z"
            fill="#FF5E82"
            stroke="#FFFFFF"
            strokeWidth="4"
            strokeLinejoin="round"
          />
          <path
            d="M24 42.5C24 42.5 5 29.5 5 15.5C5 8.8 10.3 4 16.4 4C20.1 4 22.7 5.8 24 8.2C25.3 5.8 27.9 4 31.6 4C37.7 4 43 8.8 43 15.5C43 29.5 24 42.5 24 42.5Z"
            fill="none"
            stroke="#4B261E"
            strokeWidth="1.5"
            strokeLinejoin="round"
            opacity="0.35"
          />
        </svg>
      </div>

      {/* Main Wheel SVG */}
      <svg
        viewBox="0 0 500 500"
        className="relative z-10 h-full w-full overflow-visible drop-shadow-[0_12px_24px_rgba(75,38,30,0.18)]"
        role="img"
        aria-label="초코, 초코필드, 아몬드 빼빼로 룰렛 휠"
      >
        <defs>
          <filter id="pepero-box-shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#3b1b14" floodOpacity="0.28" />
          </filter>

          {PEPERO_PRIZES.map((prize) => (
            <path
              key={`arc-${prize.id}`}
              id={`wheel-arc-${prize.id}`}
              d={createTextArcPath(cx, cy, 178, prize.startAngle, prize.endAngle, false)}
            />
          ))}
        </defs>

        {/* Outer Dark Chocolate Ring + Pink Rim Frame */}
        <circle cx={cx} cy={cy} r={241} fill="#4B261E" />
        <circle cx={cx} cy={cy} r={235} fill="#F9AEBE" />
        <circle cx={cx} cy={cy} r={208} fill="#4B261E" />

        {/* Spinning Group */}
        <g transform={`rotate(${rotation} ${cx} ${cy})`}>
          {/* 3 Colored Wedges */}
          {PEPERO_PRIZES.map((prize) => {
            const midAngle = (prize.startAngle + prize.endAngle) / 2;
            const imgFailed = failedImages[prize.id];
            return (
              <g key={prize.id}>
                <path
                  d={createWedgePath(cx, cy, 205, prize.startAngle, prize.endAngle)}
                  fill={prize.color}
                />
                <path
                  d={createWedgePath(cx, cy, 146, prize.startAngle, prize.endAngle)}
                  fill={prize.innerColor}
                  opacity="0.6"
                />

                {/* Real Pepero Box Image inside the wedge */}
                <g transform={`rotate(${midAngle} ${cx} ${cy})`}>
                  {!imgFailed ? (
                    <image
                      href={prize.imageUrl}
                      x={cx - 48}
                      y={83}
                      width="96"
                      height="104"
                      preserveAspectRatio="xMidYMid meet"
                      filter="url(#pepero-box-shadow)"
                      onError={() => handleImageError(prize.id)}
                    />
                  ) : (
                    <g>
                      <rect
                        x={cx - 34}
                        y={95}
                        width="68"
                        height="86"
                        rx="10"
                        fill="#FFFFFF"
                        opacity="0.9"
                      />
                      <text
                        x={cx}
                        y={144}
                        textAnchor="middle"
                        fill={prize.textColor}
                        fontSize="16"
                        fontFamily="Jua, sans-serif"
                      >
                        {prize.shortName}
                      </text>
                    </g>
                  )}
                </g>

                {/* Curved Slice Label */}
                <text
                  fontFamily="Jua, sans-serif"
                  fontSize="24"
                  letterSpacing="0.5"
                  fill="#4B261E"
                  stroke="#FFFFFF"
                  strokeWidth="6"
                  strokeLinejoin="round"
                  paintOrder="stroke fill"
                >
                  <textPath
                    href={`#wheel-arc-${prize.id}`}
                    startOffset="50%"
                    textAnchor="middle"
                  >
                    {prize.name}
                  </textPath>
                </text>
              </g>
            );
          })}

          {/* White Divider Lines */}
          {PEPERO_PRIZES.map((prize) => {
            const edge = polarToCartesian(cx, cy, 205, prize.startAngle);
            return (
              <line
                key={`div-${prize.id}`}
                x1={cx}
                y1={cy}
                x2={edge.x}
                y2={edge.y}
                stroke="#FFFFFF"
                strokeWidth="4.5"
                strokeLinecap="round"
              />
            );
          })}

          {/* 12 Rim Light Pegs */}
          {pegAngles.map((deg) => {
            const pt = polarToCartesian(cx, cy, 221.5, deg);
            return (
              <circle
                key={`peg-${deg}`}
                cx={pt.x}
                cy={pt.y}
                r={5.8}
                fill="#FFFDF9"
                stroke="#4B261E"
                strokeWidth="2.4"
              />
            );
          })}
        </g>
      </svg>

      {/* Center Stationary '시작!' Spin Button */}
      <button
        type="button"
        onClick={onSpin}
        disabled={isSpinning || isDisabled}
        aria-label={isDisabled ? '모든 빼빼로 소진됨' : isSpinning ? '룰렛 회전 중' : '룰렛 시작하기'}
        className={`font-cute absolute left-1/2 top-1/2 z-30 flex h-[23.5%] w-[23.5%] min-h-[84px] min-w-[84px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-[5px] border-white bg-gradient-to-b from-[#FF7B95] via-[#F75375] to-[#DF385B] text-white shadow-[0_6px_0_#A92341,0_12px_24px_rgba(75,38,30,0.28)] transition-all duration-150 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#4B261E]/40 ${
          isSpinning || isDisabled
            ? 'scale-95 cursor-not-allowed opacity-85 shadow-[0_3px_0_#A92341,0_6px_12px_rgba(75,38,30,0.2)]'
            : 'cursor-pointer hover:scale-105 hover:brightness-105 active:translate-y-[-46%] active:scale-95'
        }`}
      >
        <span className="text-[clamp(1.35rem,3.4vw,1.95rem)] tracking-wide drop-shadow-[0_2px_0_rgba(125,20,44,0.45)] whitespace-nowrap">
          {isDisabled ? '완료!' : isSpinning ? '두근!' : '시작!'}
        </span>
      </button>
    </div>
  );
}
