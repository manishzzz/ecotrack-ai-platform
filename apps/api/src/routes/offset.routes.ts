import { Router } from "express";
import { z } from "zod";
import { prisma } from "../config/prisma.js";
import { requireAuth } from "../middleware/auth.js";
import { asyncHandler } from "../utils/async-handler.js";

export const offsetRouter = Router();

offsetRouter.get(
  "/",
  asyncHandler(async (_request, response) => {
    const projects = await prisma.offsetProject.findMany({ orderBy: { createdAt: "desc" } });
    response.json(projects);
  })
);

offsetRouter.post(
  "/:id/donate",
  requireAuth,
  asyncHandler(async (request, response) => {
    const projectId = String(request.params.id);
    const schema = z.object({
      amount: z.number().positive(),
      offsetKg: z.number().positive()
    });

    const body = schema.parse(request.body);

    const project = await prisma.offsetProject.update({
      where: { id: projectId },
      data: {
        donationsCount: { increment: 1 },
        totalOffsetKg: { increment: body.offsetKg }
      }
    });

    const user = await prisma.user.update({
      where: { id: request.auth!.userId },
      data: {
        carbonOffsetKg: { increment: body.offsetKg },
        treesSaved: { increment: Math.ceil(body.offsetKg * project.treesEquivalent) },
        points: { increment: Math.round(body.amount * 4) }
      }
    });

    response.json({
      message: "Mock payment successful. Your carbon offset contribution has been recorded.",
      project,
      user
    });
  })
);
