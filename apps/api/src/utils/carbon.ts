import { FoodType, ShoppingHabit } from "@prisma/client";

export type CalculatorInput = {
  carKm: number;
  bikeKm: number;
  publicTransportKm: number;
  flightKm: number;
  electricityKwh: number;
  lpgCylinders: number;
  acHours: number;
  foodType: FoodType;
  shoppingHabit: ShoppingHabit;
  plasticUsageKg: number;
  waterConsumptionLiters: number;
};

const factors = {
  carKm: 0.21,
  bikeKm: 0.0,
  publicTransportKm: 0.08,
  flightKm: 0.18,
  electricityKwh: 0.82,
  lpgCylinder: 42,
  acHour: 1.2,
  plasticKg: 6,
  waterLiter: 0.0003
};

const foodFactors: Record<FoodType, number> = {
  VEGETARIAN: 110,
  MIXED: 165,
  NON_VEGETARIAN: 240
};

const shoppingFactors: Record<ShoppingHabit, number> = {
  LOW: 35,
  MODERATE: 75,
  HIGH: 130
};

export function calculateCarbonFootprint(input: CalculatorInput) {
  const transportationKg =
    input.carKm * factors.carKm +
    input.bikeKm * factors.bikeKm +
    input.publicTransportKm * factors.publicTransportKm +
    input.flightKm * factors.flightKm;

  const energyKg =
    input.electricityKwh * factors.electricityKwh +
    input.lpgCylinders * factors.lpgCylinder +
    input.acHours * factors.acHour;

  const foodKg = foodFactors[input.foodType];

  const lifestyleKg =
    shoppingFactors[input.shoppingHabit] +
    input.plasticUsageKg * factors.plasticKg +
    input.waterConsumptionLiters * factors.waterLiter;

  const monthlyEmissionKg = Number((transportationKg + energyKg + foodKg + lifestyleKg).toFixed(2));
  const annualEmissionKg = Number((monthlyEmissionKg * 12).toFixed(2));
  const carbonScore = Math.max(10, Math.min(100, Math.round(100 - monthlyEmissionKg / 12)));

  return {
    transportationKg: Number(transportationKg.toFixed(2)),
    energyKg: Number(energyKg.toFixed(2)),
    foodKg: Number(foodKg.toFixed(2)),
    lifestyleKg: Number(lifestyleKg.toFixed(2)),
    monthlyEmissionKg,
    annualEmissionKg,
    carbonScore
  };
}

export const comparisonBenchmarks = {
  globalAverageMonthlyKg: 400,
  indiaAverageMonthlyKg: 180,
  usaAverageMonthlyKg: 1250
};
