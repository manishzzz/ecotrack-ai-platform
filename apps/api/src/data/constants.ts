export const defaultChallenges = [
  {
    title: "No Plastic Day",
    description: "Avoid single-use plastic for one full day and use reusable alternatives.",
    category: "Lifestyle",
    difficulty: "EASY",
    pointsReward: 50,
    badgeName: "Plastic-Free Starter"
  },
  {
    title: "Public Transport Day",
    description: "Replace at least one private ride with metro, bus, or shared transport.",
    category: "Transportation",
    difficulty: "MEDIUM",
    pointsReward: 90,
    badgeName: "Transit Hero"
  },
  {
    title: "Plant a Tree",
    description: "Participate in a local plantation drive or fund one through the offset marketplace.",
    category: "Offset",
    difficulty: "HARD",
    pointsReward: 150,
    badgeName: "Earth Guardian"
  }
] as const;

export const defaultOffsetProjects = [
  {
    title: "Urban Forest Revival",
    description: "Funds native tree planting across urban heat islands and monitors survival rates.",
    pricePerKg: 2.5,
    treesEquivalent: 0.08,
    totalOffsetKg: 12000,
    donationsCount: 380,
    imageUrl:
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1200&q=80"
  },
  {
    title: "Clean Cookstove Initiative",
    description: "Supports efficient cookstoves to reduce wood burning and indoor air pollution.",
    pricePerKg: 1.9,
    treesEquivalent: 0.04,
    totalOffsetKg: 18600,
    donationsCount: 510,
    imageUrl:
      "https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&w=1200&q=80"
  }
] as const;

export const seedBlogPosts = [
  {
    title: "7 Everyday Habits That Cut Household Emissions Fast",
    slug: "everyday-habits-cut-household-emissions",
    excerpt: "Practical ways to lower emissions without changing your whole life overnight.",
    content:
      "Small actions compound quickly. Swapping commute patterns, reducing standby power, and planning weekly meals can lower emissions meaningfully over a month. EcoTrack AI helps you identify which habits have the highest payoff for your own footprint profile."
  },
  {
    title: "Why Carbon Dashboards Change Behavior Better Than Raw Numbers",
    slug: "why-carbon-dashboards-change-behavior",
    excerpt: "Context, goals, and trend lines make sustainability progress more actionable.",
    content:
      "Behavior change improves when data is visual, personal, and tied to progress loops. Dashboards that connect actions, forecasts, and rewards help users see momentum instead of isolated statistics. That is the core idea behind EcoTrack AI."
  }
] as const;
