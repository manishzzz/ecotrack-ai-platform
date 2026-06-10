import { Role } from "@prisma/client";
import { Router } from "express";
import { prisma } from "../config/prisma.js";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { asyncHandler } from "../utils/async-handler.js";

export const adminRouter = Router();

adminRouter.use(requireAuth, requireRole(Role.ADMIN));

adminRouter.get(
  "/overview",
  asyncHandler(async (_request, response) => {
    const [users, records, challengeProgress, blogs, adminActivities] = await Promise.all([
      prisma.user.findMany({ orderBy: { createdAt: "desc" } }),
      prisma.carbonRecord.findMany(),
      prisma.challengeProgress.findMany(),
      prisma.blog.findMany({ orderBy: { createdAt: "desc" } }),
      prisma.adminActivity.findMany({ orderBy: { createdAt: "desc" }, take: 12 })
    ]);

    response.json({
      stats: {
        activeUsers: users.length,
        totalCalculations: records.length,
        challengeParticipation: challengeProgress.length,
        averageEmissionKg: Number(
          (
            records.reduce((sum, record) => sum + record.monthlyEmissionKg, 0) /
            Math.max(records.length, 1)
          ).toFixed(2)
        )
      },
      users,
      blogs,
      records: records.slice(-20).reverse(),
      adminActivities
    });
  })
);
