import { PrismaClient, RewardType, Role } from "@prisma/client";
import { hashPassword } from "../src/utils/hash.js";
import { defaultChallenges, defaultOffsetProjects, seedBlogPosts } from "../src/data/constants.js";

const prisma = new PrismaClient();

async function main() {
  const seedAdminPassword = process.env.SEED_ADMIN_PASSWORD;

  const admin =
    seedAdminPassword
      ? await prisma.user.upsert({
          where: { email: "admin@ecotrack.ai" },
          update: {
            passwordHash: await hashPassword(seedAdminPassword)
          },
          create: {
            email: "admin@ecotrack.ai",
            name: "EcoTrack Admin",
            passwordHash: await hashPassword(seedAdminPassword),
            role: Role.ADMIN,
            points: 500,
            level: 5,
            sustainabilityGoal: "Lead sustainability transformation across the platform."
          }
        })
      : await prisma.user.findUnique({ where: { email: "admin@ecotrack.ai" } });

  for (const challenge of defaultChallenges) {
    await prisma.challenge.upsert({
      where: { id: `${challenge.title.toLowerCase().replace(/\s+/g, "-")}` },
      update: {},
      create: {
        id: `${challenge.title.toLowerCase().replace(/\s+/g, "-")}`,
        ...challenge
      }
    });
  }

  for (const project of defaultOffsetProjects) {
    await prisma.offsetProject.create({
      data: project
    }).catch(() => undefined);
  }

  for (const blog of seedBlogPosts) {
    if (admin) {
      await prisma.blog.upsert({
        where: { slug: blog.slug },
        update: {},
        create: {
          ...blog,
          authorId: admin.id
        }
      });
    }
  }

  if (admin) {
    await prisma.reward
      .create({
        data: {
          userId: admin.id,
          title: "Sustainability Champion",
          description: "Awarded to the platform's founding administrator.",
          type: RewardType.BADGE,
          value: 500
        }
      })
      .catch(() => undefined);
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
