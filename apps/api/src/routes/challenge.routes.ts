import { ProgressStatus, RewardType } from "@prisma/client";
import { Router } from "express";
import { z } from "zod";
import { prisma } from "../config/prisma.js";
import { requireAuth } from "../middleware/auth.js";
import { asyncHandler } from "../utils/async-handler.js";

export const challengeRouter = Router();

challengeRouter.get(
  "/",
  requireAuth,
  asyncHandler(async (request, response) => {
    const [challenges, progress, leaderboard] = await Promise.all([
      prisma.challenge.findMany({ orderBy: { createdAt: "desc" } }),
      prisma.challengeProgress.findMany({
        where: { userId: request.auth!.userId },
        include: { challenge: true },
        orderBy: { createdAt: "desc" }
      }),
      prisma.user.findMany({
        orderBy: [{ points: "desc" }, { level: "desc" }],
        take: 10,
        select: {
          id: true,
          name: true,
          points: true,
          level: true,
          avatarUrl: true
        }
      })
    ]);

    response.json({ challenges, progress, leaderboard });
  })
);

challengeRouter.post(
  "/:id/complete",
  requireAuth,
  asyncHandler(async (request, response) => {
    const challengeId = String(request.params.id);
    const challenge = await prisma.challenge.findUniqueOrThrow({ where: { id: challengeId } });
    const existingProgress = await prisma.challengeProgress.findUnique({
      where: {
        userId_challengeId: {
          userId: request.auth!.userId,
          challengeId
        }
      }
    });

    if (existingProgress?.status === ProgressStatus.COMPLETED) {
      response.status(409).json({ message: "Challenge already completed." });
      return;
    }

    const progress = await prisma.challengeProgress.upsert({
      where: {
        userId_challengeId: {
          userId: request.auth!.userId,
          challengeId
        }
      },
      create: {
        userId: request.auth!.userId,
        challengeId,
        status: ProgressStatus.COMPLETED,
        completedAt: new Date()
      },
      update: {
        status: ProgressStatus.COMPLETED,
        completedAt: new Date()
      }
    });

    const user = await prisma.user.update({
      where: { id: request.auth!.userId },
      data: {
        points: { increment: challenge.pointsReward },
        level: { increment: challenge.pointsReward >= 120 ? 1 : 0 },
        treesSaved: { increment: challenge.category === "Offset" ? 1 : 0 }
      }
    });

    if (challenge.badgeName) {
      await prisma.reward.create({
        data: {
          userId: request.auth!.userId,
          title: challenge.badgeName,
          description: `Awarded for completing ${challenge.title}.`,
          type: RewardType.BADGE,
          value: challenge.pointsReward
        }
      });
    }

    response.status(201).json({ progress, user });
  })
);

challengeRouter.post(
  "/",
  requireAuth,
  asyncHandler(async (request, response) => {
    const schema = z.object({
      title: z.string().min(2),
      description: z.string().min(10),
      category: z.string().min(2),
      difficulty: z.enum(["EASY", "MEDIUM", "HARD"]),
      pointsReward: z.number().int().min(10),
      badgeName: z.string().optional(),
      isDaily: z.boolean().default(true)
    });

    const body = schema.parse(request.body);
    const created = await prisma.challenge.create({ data: body });
    response.status(201).json(created);
  })
);
