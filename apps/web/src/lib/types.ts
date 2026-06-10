export type PublicUser = {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string | null;
  role: "USER" | "ADMIN";
  location?: string | null;
  sustainabilityGoal?: string | null;
  points: number;
  level: number;
  treesSaved: number;
  carbonOffsetKg: number;
  provider: string;
  createdAt: string;
};

export type DashboardOverview = {
  user: PublicUser;
  stats: {
    totalEmissionsKg: number;
    averageMonthlyKg: number;
    latestCarbonScore: number;
    completedChallenges: number;
    points: number;
    level: number;
    treesSaved: number;
    carbonOffsetKg: number;
  };
  charts: {
    monthlyTrend: Array<{ label: string; emissions: number; score: number }>;
    weeklyTrend: Array<{ label: string; emissions: number; score: number }>;
    breakdown: Array<{ name: string; value: number }>;
    predictionSeries: Array<{ label: string; predictedKg: number; confidenceScore: number }>;
  };
  history: Array<{ monthLabel: string; monthlyEmissionKg: number; carbonScore: number }>;
  rewards: Array<{ title: string; description: string }>;
  activityFeed: Array<{ title: string; status: string; timestamp: string }>;
};

export type BlogComment = {
  id: string;
  content: string;
  user: {
    name: string;
    avatarUrl?: string | null;
  };
};

export type BlogPost = {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  likesCount: number;
  comments: BlogComment[];
  author: {
    name: string;
    avatarUrl?: string | null;
  };
};
