import { Router } from "express";
import { z } from "zod";
import { prisma } from "../config/prisma.js";
import { requireAuth } from "../middleware/auth.js";
import { asyncHandler } from "../utils/async-handler.js";
import { answerEcoQuestion } from "../services/ai.service.js";

export const chatRouter = Router();

chatRouter.post(
  "/assistant",
  requireAuth,
  asyncHandler(async (request, response) => {
    const schema = z.object({
      question: z.string().min(5)
    });

    const body = schema.parse(request.body);
    const latestRecord = await prisma.carbonRecord.findFirst({
      where: { userId: request.auth!.userId },
      orderBy: { createdAt: "desc" }
    });

    const context = latestRecord
      ? `Latest footprint: ${latestRecord.monthlyEmissionKg} kg monthly, score ${latestRecord.carbonScore}.`
      : "No footprint calculation available yet.";

    const answer = await answerEcoQuestion(body.question, context);
    response.json({ answer });
  })
);
