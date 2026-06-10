import { Router } from "express";
import { prisma } from "../config/prisma.js";
import { asyncHandler } from "../utils/async-handler.js";

export const insightsRouter = Router();

export const esgFacts = [
  {
    title: "Renewables Momentum",
    value: "30%+",
    description: "Renewables continue to capture a growing share of new power generation capacity."
  },
  {
    title: "Behavior Shift",
    value: "15-20%",
    description: "Sustained transport changes often cut personal footprints more than isolated purchases."
  },
  {
    title: "Water-Energy Link",
    value: "70%",
    description: "Efficient water use reduces both direct water waste and the energy used to pump and treat it."
  }
];

insightsRouter.get(
  "/",
  asyncHandler(async (_request, response) => {
    const records = await prisma.carbonRecord.findMany();
    const users = await prisma.user.findMany();

    response.json({
      cards: esgFacts,
      metrics: {
        platformEmissionAverage: Number(
          (
            records.reduce((sum, record) => sum + record.monthlyEmissionKg, 0) /
            Math.max(records.length, 1)
          ).toFixed(2)
        ),
        totalTreesSaved: users.reduce((sum, user) => sum + user.treesSaved, 0),
        totalCarbonOffsetKg: Number(
          users.reduce((sum, user) => sum + user.carbonOffsetKg, 0).toFixed(2)
        )
      }
    });
  })
);
