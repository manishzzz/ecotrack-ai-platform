import { FoodType, ShoppingHabit } from "@prisma/client";
import { Router } from "express";
import { z } from "zod";
import { prisma } from "../config/prisma.js";
import { requireAuth } from "../middleware/auth.js";
import { asyncHandler } from "../utils/async-handler.js";
import { calculateCarbonFootprint, comparisonBenchmarks } from "../utils/carbon.js";
import { generateAdvisorPlan } from "../services/ai.service.js";
import { generateForecast } from "../utils/prediction.js";
import { buildCarbonReport } from "../services/report.service.js";

const calculatorSchema = z.object({
  carKm: z.number().min(0),
  bikeKm: z.number().min(0),
  publicTransportKm: z.number().min(0),
  flightKm: z.number().min(0),
  electricityKwh: z.number().min(0),
  lpgCylinders: z.number().min(0),
  acHours: z.number().min(0),
  foodType: z.nativeEnum(FoodType),
  shoppingHabit: z.nativeEnum(ShoppingHabit),
  plasticUsageKg: z.number().min(0),
  waterConsumptionLiters: z.number().min(0),
  monthLabel: z.string().min(2)
});

export const carbonRouter = Router();

carbonRouter.post(
  "/calculate",
  requireAuth,
  asyncHandler(async (request, response) => {
    const body = calculatorSchema.parse(request.body);
    const metrics = calculateCarbonFootprint(body);
    const aiAdvice = await generateAdvisorPlan({ ...body, monthlyEmissionKg: metrics.monthlyEmissionKg });

    const record = await prisma.carbonRecord.upsert({
      where: {
        userId_monthLabel: {
          userId: request.auth!.userId,
          monthLabel: body.monthLabel
        }
      },
      create: {
        ...body,
        ...metrics,
        aiAdvice,
        userId: request.auth!.userId
      },
      update: {
        ...body,
        ...metrics,
        aiAdvice
      }
    });

    response.status(201).json({
      record,
      comparison: {
        vsGlobalAverageKg: Number((metrics.monthlyEmissionKg - comparisonBenchmarks.globalAverageMonthlyKg).toFixed(2)),
        vsCountryAverageKg: Number((metrics.monthlyEmissionKg - comparisonBenchmarks.indiaAverageMonthlyKg).toFixed(2))
      }
    });
  })
);

carbonRouter.get(
  "/history",
  requireAuth,
  asyncHandler(async (request, response) => {
    const category = request.query.category?.toString();
    const from = request.query.from?.toString();
    const to = request.query.to?.toString();

    const records = await prisma.carbonRecord.findMany({
      where: {
        userId: request.auth!.userId,
        createdAt: {
          gte: from ? new Date(from) : undefined,
          lte: to ? new Date(to) : undefined
        }
      },
      orderBy: { createdAt: "desc" }
    });

    const filtered =
      category && category !== "all"
        ? records.map((record) => ({
            ...record,
            categoryValue:
              category === "transportation"
                ? record.transportationKg
                : category === "energy"
                  ? record.energyKg
                  : category === "food"
                    ? record.foodKg
                    : record.lifestyleKg
          }))
        : records;

    response.json(filtered);
  })
);

carbonRouter.get(
  "/predictions",
  requireAuth,
  asyncHandler(async (request, response) => {
    const records = await prisma.carbonRecord.findMany({
      where: { userId: request.auth!.userId },
      orderBy: { createdAt: "asc" }
    });

    const series = records.map((record) => record.monthlyEmissionKg);
    const forecasts = [1, 3, 6].map((months) => {
      const { predictedKg, confidenceScore } = generateForecast(series, months);
      return {
        forecastMonths: months,
        predictedKg,
        confidenceScore,
        narrative:
          predictedKg > (series[series.length - 1] ?? 0)
            ? "Your current trajectory trends upward. Focus on transport and energy changes to flatten the curve."
            : "Your recent improvements are likely to continue if your current habits remain consistent."
      };
    });

    await prisma.carbonPrediction.deleteMany({
      where: { userId: request.auth!.userId }
    });

    await prisma.carbonPrediction.createMany({
      data: forecasts.map((forecast) => ({
        userId: request.auth!.userId,
        ...forecast
      }))
    });

    response.json(forecasts);
  })
);

carbonRouter.get(
  "/report",
  requireAuth,
  asyncHandler(async (request, response) => {
    const user = await prisma.user.findUniqueOrThrow({ where: { id: request.auth!.userId } });
    const records = await prisma.carbonRecord.findMany({
      where: { userId: request.auth!.userId },
      orderBy: { createdAt: "desc" }
    });

    if (records.length === 0) {
      response.status(400).json({ message: "Create at least one carbon record before generating a report." });
      return;
    }

    const latestAdvice =
      records[0]?.aiAdvice ??
      "Keep tracking your footprint consistently to unlock more accurate recommendations and forecasts.";

    const pdf = await buildCarbonReport(user, records, latestAdvice);
    response.setHeader("Content-Type", "application/pdf");
    response.setHeader("Content-Disposition", 'attachment; filename="ecotrack-report.pdf"');
    response.send(pdf);
  })
);
