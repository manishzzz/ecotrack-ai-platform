export const mockDashboard = {
  stats: {
    totalEmissionsKg: 612.4,
    averageMonthlyKg: 204.1,
    latestCarbonScore: 74,
    completedChallenges: 14,
    points: 860,
    level: 4,
    treesSaved: 18,
    carbonOffsetKg: 126
  },
  charts: {
    monthlyTrend: [
      { label: "Jan", emissions: 242, score: 68 },
      { label: "Feb", emissions: 219, score: 71 },
      { label: "Mar", emissions: 204, score: 74 },
      { label: "Apr", emissions: 192, score: 78 }
    ],
    weeklyTrend: [
      { label: "Week 1", emissions: 58, score: 72 },
      { label: "Week 2", emissions: 54, score: 73 },
      { label: "Week 3", emissions: 50, score: 75 },
      { label: "Week 4", emissions: 48, score: 78 }
    ],
    breakdown: [
      { name: "Transportation", value: 82 },
      { name: "Energy", value: 56 },
      { name: "Food", value: 38 },
      { name: "Lifestyle", value: 28 }
    ],
    predictionSeries: [
      { label: "1 Month", predictedKg: 188, confidenceScore: 86 },
      { label: "3 Month", predictedKg: 175, confidenceScore: 81 },
      { label: "6 Month", predictedKg: 162, confidenceScore: 76 }
    ]
  },
  history: [
    { monthLabel: "April 2026", monthlyEmissionKg: 192, carbonScore: 78 },
    { monthLabel: "March 2026", monthlyEmissionKg: 204, carbonScore: 74 },
    { monthLabel: "February 2026", monthlyEmissionKg: 219, carbonScore: 71 }
  ],
  rewards: [
    { title: "Green Beginner", description: "Completed your first 5 eco actions." },
    { title: "Eco Warrior", description: "Maintained 3 low-emission months in a row." }
  ],
  activityFeed: [
    { title: "No Plastic Day", status: "COMPLETED", timestamp: "09 Jun 2026" },
    { title: "Public Transport Day", status: "COMPLETED", timestamp: "07 Jun 2026" }
  ]
};

export const mockBlogs = [
  {
    id: "1",
    title: "Build a lower-carbon workweek",
    excerpt: "Simple routines that reduce commuting, power, and food waste across a normal office schedule.",
    content:
      "Start with commute batching, power down idle devices, and shift one lunch plan toward lower-carbon options. These changes are realistic and compound quickly.",
    likesCount: 24,
    comments: [
      {
        id: "c1",
        content: "Meal planning made the biggest difference for me.",
        user: { name: "Riya", avatarUrl: "" }
      }
    ],
    author: { name: "EcoTrack Editorial", avatarUrl: "" }
  }
];
