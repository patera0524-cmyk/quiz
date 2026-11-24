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

export const INITIAL_STOCK: Record<PeperoPrize['id'], number> = {
  choco: 48,
  almond: 27,
  chocofilled: 24,
};

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
    weight: INITIAL_STOCK.chocofilled,
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
    weight: INITIAL_STOCK.almond,
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
    weight: INITIAL_STOCK.choco,
    startAngle: 240,
    endAngle: 360,
  },
];

const CHOCO_PRIORITY_BOOST = 2.2;

/**
 * Selects a prize dynamically from remaining stock, with extra priority on Original Choco
 * while still adjusting automatically on every draw and never picking a depleted flavor.
 */
export function pickPrizeByRemaining(
  remaining: Record<PeperoPrize['id'], number>,
  randomUnit: number
): PeperoPrize | null {
  const available = PEPERO_PRIZES.filter((p) => (remaining[p.id] ?? 0) > 0);
  if (available.length === 0) return null;

  const getEffectiveWeight = (prize: PeperoPrize) => {
    const count = remaining[prize.id];
    return prize.id === 'choco' ? count * CHOCO_PRIORITY_BOOST : count;
  };

  const totalWeight = available.reduce((sum, p) => sum + getEffectiveWeight(p), 0);
  let threshold = randomUnit * totalWeight;
  for (const prize of available) {
    const weight = getEffectiveWeight(prize);
    if (threshold < weight) {
      return prize;
    }
    threshold -= weight;
  }
  return available[available.length - 1];
}

/**
 * Selects a prize according to the initial weights using a uniform random value in [0, 1).
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
