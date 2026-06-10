import { Router } from "express";
import dayjs from "dayjs";
import { prisma } from "../config/prisma.js";
import { requireAuth } from "../middleware/auth.js";
import { asyncHandler } from "../utils/async-handler.js";

export const dashboardRouter = Router();

dashboardRouter.get(
  "/overview",
  requireAuth,
  asyncHandler(async (request, response) => {
    const [user, records, challengeProgress, rewards, predictions] = await Promise.all([
      prisma.user.findUniqueOrThrow({ where: { id: request.auth!.userId } }),
      prisma.carbonRecord.findMany({
        where: { userId: request.auth!.userId },
        orderBy: { createdAt: "asc" }
      }),
      prisma.challengeProgress.findMany({
        where: { userId: request.auth!.userId },
        include: { challenge: true }
      }),
      prisma.reward.findMany({
        where: { userId: request.auth!.userId },
        orderBy: { awardedAt: "desc" }
      }),
      prisma.carbonPrediction.findMany({
        where: { userId: request.auth!.userId },
        orderBy: { createdAt: "desc" },
        take: 3
      })
    ]);

    const totalEmissions = records.reduce((sum, record) => sum + record.monthlyEmissionKg, 0);
    const monthlyTrend = records.map((record) => ({
      label: record.monthLabel,
      emissions: record.monthlyEmissionKg,
      score: record.carbonScore
    }));

    const weeklyTrend = monthlyTrend.slice(-4).map((item, index) => ({
      label: `Week ${index + 1}`,
      emissions: Number((item.emissions / 4).toFixed(2)),
      score: item.score
    }));

    const breakdown = records.length
      ? [
          {
            name: "Transportation",
            value: Number((records.reduce((sum, record) => sum + record.transportationKg, 0) / records.length).toFixed(2))
          },
          {
            name: "Energy",
            value: Number((records.reduce((sum, record) => sum + record.energyKg, 0) / records.length).toFixed(2))
          },
          {
            name: "Food",
            value: Number((records.reduce((sum, record) => sum + record.foodKg, 0) / records.length).toFixed(2))
          },
          {
            name: "Lifestyle",
            value: Number((records.reduce((sum, record) => sum + record.lifestyleKg, 0) / records.length).toFixed(2))
          }
        ]
      : [];

    response.json({
      user,
      stats: {
        totalEmissionsKg: Number(totalEmissions.toFixed(2)),
        averageMonthlyKg: Number((totalEmissions / Math.max(records.length, 1)).toFixed(2)),
        latestCarbonScore: records[records.length - 1]?.carbonScore ?? 0,
        completedChallenges: challengeProgress.filter((item) => item.status === "COMPLETED").length,
        points: user.points,
        level: user.level,
        treesSaved: user.treesSaved,
        carbonOffsetKg: user.carbonOffsetKg
      },
      charts: {
        monthlyTrend,
        weeklyTrend,
        breakdown,
        predictionSeries: predictions.map((item) => ({
          label: `${item.forecastMonths} Month`,
          predictedKg: item.predictedKg,
          confidenceScore: item.confidenceScore
        }))
      },
      history: records.slice(-12).reverse(),
      rewards,
      activityFeed: challengeProgress
        .slice(-5)
        .reverse()
        .map((item) => ({
          title: item.challenge.title,
          status: item.status,
          timestamp: dayjs(item.completedAt ?? item.createdAt).format("DD MMM YYYY")
        }))
    });
  })
);
