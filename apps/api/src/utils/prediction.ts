export function generateForecast(series: number[], months: number) {
  if (series.length === 0) {
    return { predictedKg: 0, confidenceScore: 45 };
  }

  const recent = series.slice(-6);
  const weightedAverage =
    recent.reduce((total, value, index) => total + value * (index + 1), 0) /
    recent.reduce((total, _, index) => total + index + 1, 0);

  const slope =
    recent.length > 1 ? (recent[recent.length - 1] - recent[0]) / (recent.length - 1) : 0;

  const predictedKg = Number(Math.max(weightedAverage + slope * months, 0).toFixed(2));
  const confidenceScore = Math.max(55, Math.min(92, 88 - Math.round(Math.abs(slope) * 2)));

  return { predictedKg, confidenceScore };
}
