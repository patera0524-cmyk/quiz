import peperoAlmondImg from '../assets/pepero_almond.png';
import peperoChocoImg from '../assets/pepero_choco.png';
import peperoChocoFilledImg from '../assets/pepero_chocofilled.png';

export interface PeperoPrize {
  id: 'chocofilled' | 'almond' | 'choco';
  name: string;
  shortName: string;
  englishName: string;
  description: string;
  color: string;
  innerColor: string;
  accentBg: string;
  textColor: string;
  imageUrl: string;
  /** Probability weight (4:3:3 for choco : chocofilled : almond) */
  weight: number;
  /** Start angle in degrees clockwise from 12 o'clock (0°) */
  startAngle: number;
  /** End angle in degrees clockwise from 12 o'clock */
  endAngle: number;
}

export const PEPERO_PRIZES: PeperoPrize[] = [
  {
    id: 'chocofilled',
    name: '초코필드 빼빼로',
    shortName: '초코필드',
    englishName: 'Choco-Filled',
    description: '바삭한 비스킷 속에 달콤한 초콜릿이 듬뿍!',
    color: '#F7C625',
    innerColor: '#FAD34D',
    accentBg: '#FEF7D6',
    textColor: '#A16207',
    imageUrl: peperoChocoFilledImg,
    weight: 3,
    startAngle: 0,
    endAngle: 120,
  },
  {
    id: 'almond',
    name: '아몬드 빼빼로',
    shortName: '아몬드',
    englishName: 'Almond',
    description: '고소한 캘리포니아 아몬드가 콕콕 박힌 인기 만점 맛!',
    color: '#3BB54A',
    innerColor: '#56C463',
    accentBg: '#E4F7E7',
    textColor: '#15803D',
    imageUrl: peperoAlmondImg,
    weight: 3,
    startAngle: 120,
    endAngle: 240,
  },
  {
    id: 'choco',
    name: '초코 빼빼로',
    shortName: '초코',
    englishName: 'Original Choco',
    description: '언제 먹어도 맛있는 오리지널 달콤 초코 빼빼로!',
    color: '#EC3D3D',
    innerColor: '#F15B5B',
    accentBg: '#FEE6E6',
    textColor: '#B91C1C',
    imageUrl: peperoChocoImg,
    weight: 4,
    startAngle: 240,
    endAngle: 360,
  },
];

/**
 * Selects a prize according to the configured 4:3:3 weights using a uniform
 * random value in [0, 1).
 */
export function pickWeightedPrize(randomUnit: number): PeperoPrize {
  const totalWeight = PEPERO_PRIZES.reduce((sum, p) => sum + p.weight, 0);
  let threshold = randomUnit * totalWeight;
  for (const prize of PEPERO_PRIZES) {
    if (threshold < prize.weight) {
      return prize;
    }
    threshold -= prize.weight;
  }
  return PEPERO_PRIZES[PEPERO_PRIZES.length - 1];
}

/**
 * Given a clockwise wheel rotation in degrees, returns the prize currently
 * under the 12 o'clock pointer (0°).
 */
export function getPrizeAtRotation(rotationDeg: number): PeperoPrize {
  const normalized = ((360 - (rotationDeg % 360)) + 360) % 360;
  const found = PEPERO_PRIZES.find(
    (prize) => normalized >= prize.startAngle && normalized < prize.endAngle
  );
  return found ?? PEPERO_PRIZES[0];
}
