import { describe, expect, it } from "vitest";
import { calculateCarbonFootprint } from "./carbon.js";

describe("calculateCarbonFootprint", () => {
  it("returns stable category totals and score", () => {
    const result = calculateCarbonFootprint({
      carKm: 100,
      bikeKm: 20,
      publicTransportKm: 50,
      flightKm: 0,
      electricityKwh: 120,
      lpgCylinders: 0.5,
      acHours: 20,
      foodType: "MIXED",
      shoppingHabit: "MODERATE",
      plasticUsageKg: 1,
      waterConsumptionLiters: 5000
    });

    expect(result.monthlyEmissionKg).toBeGreaterThan(0);
    expect(result.annualEmissionKg).toBeCloseTo(result.monthlyEmissionKg * 12, 6);
    expect(result.carbonScore).toBeGreaterThanOrEqual(10);
    expect(result.carbonScore).toBeLessThanOrEqual(100);
  });
});
