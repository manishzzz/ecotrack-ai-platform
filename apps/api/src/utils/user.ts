import { User } from "@prisma/client";

export function toPublicUser(user: User) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    avatarUrl: user.avatarUrl,
    role: user.role,
    location: user.location,
    sustainabilityGoal: user.sustainabilityGoal,
    points: user.points,
    level: user.level,
    treesSaved: user.treesSaved,
    carbonOffsetKg: user.carbonOffsetKg,
    provider: user.provider,
    createdAt: user.createdAt
  };
}
