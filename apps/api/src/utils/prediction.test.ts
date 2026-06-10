import { describe, expect, it } from "vitest";
import { generateForecast } from "./prediction.js";

describe("generateForecast", () => {
  it("produces a non-negative prediction", () => {
    const result = generateForecast([220, 210, 205, 198, 190], 3);
    expect(result.predictedKg).toBeGreaterThanOrEqual(0);
    expect(result.confidenceScore).toBeGreaterThanOrEqual(55);
    expect(result.confidenceScore).toBeLessThanOrEqual(92);
  });

  it("handles empty history safely", () => {
    expect(generateForecast([], 6)).toEqual({ predictedKg: 0, confidenceScore: 45 });
  });
});
