import { Router } from "express";
import { prisma } from "../config/prisma.js";
import { asyncHandler } from "../utils/async-handler.js";

export const publicRouter = Router();

publicRouter.get(
  "/summary",
  asyncHandler(async (_request, response) => {
    const [blogCount, challengeCount, projectCount, userCount] = await Promise.all([
      prisma.blog.count({ where: { published: true } }),
      prisma.challenge.count(),
      prisma.offsetProject.count(),
      prisma.user.count()
    ]);

    response.json({
      blogCount,
      challengeCount,
      projectCount,
      userCount
    });
  })
);
