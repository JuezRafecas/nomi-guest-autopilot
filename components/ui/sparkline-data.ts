function djb2(str: string): number {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash + str.charCodeAt(i)) | 0;
  }
  return hash >>> 0;
}

function mulberry32(seed: number) {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function pseudoSeries(
  seed: string,
  endValue: number,
  points = 30,
  drift = 0.18,
): number[] {
  const rnd = mulberry32(djb2(seed));
  const result: number[] = new Array(points);
  const base = endValue === 0 ? 1 : Math.abs(endValue);
  let cursor = endValue * (1 - drift * (rnd() * 0.6 + 0.2));
  for (let i = 0; i < points; i++) {
    const progress = i / (points - 1);
    const convergence = progress * progress;
    const noise = (rnd() - 0.5) * 2 * drift * base * (1 - convergence * 0.85);
    const target = endValue;
    cursor = cursor + (target - cursor) * (0.08 + convergence * 0.25) + noise;
    result[i] = cursor;
  }
  result[points - 1] = endValue;
  return result;
}

export function weeklyDelta(series: number[]): number {
  if (series.length < 8) return 0;
  const current = series[series.length - 1];
  const weekAgo = series[series.length - 8];
  if (weekAgo === 0) return 0;
  return ((current - weekAgo) / Math.abs(weekAgo)) * 100;
}
