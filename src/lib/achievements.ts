export type AchievementId =
  | "streak_3"
  | "streak_7"
  | "streak_14"
  | "streak_30"
  | "reader_1"
  | "reader_5"
  | "reader_all"
  | "explorer_1"
  | "explorer_5"
  | "challenger"
  | "subscriber"
  | "ambassador";

export type AchievementCategory = "streak" | "reading" | "interactive" | "social";

export interface AchievementDef {
  id: AchievementId;
  title: string;
  description: string;
  icon: string;
  category: AchievementCategory;
}

export const ACHIEVEMENTS: AchievementDef[] = [
  { id: "streak_3", title: "On a Roll", description: "3-day reading streak", icon: "🔥", category: "streak" },
  { id: "streak_7", title: "Week Warrior", description: "7-day reading streak", icon: "📅", category: "streak" },
  { id: "streak_14", title: "Fortnight Force", description: "14-day reading streak", icon: "⚡", category: "streak" },
  { id: "streak_30", title: "Monthly Master", description: "30-day reading streak", icon: "🏆", category: "streak" },
  { id: "reader_1", title: "First Steps", description: "Read your first post", icon: "📖", category: "reading" },
  { id: "reader_5", title: "Bookworm", description: "Read 5 posts", icon: "📚", category: "reading" },
  { id: "reader_all", title: "Completionist", description: "Read every published post", icon: "🎯", category: "reading" },
  { id: "explorer_1", title: "Curious Mind", description: "Use your first interactive widget", icon: "🔍", category: "interactive" },
  { id: "explorer_5", title: "Explorer", description: "Use 5 different widgets", icon: "🧭", category: "interactive" },
  { id: "challenger", title: "Challenger", description: "Complete 3 quizzes", icon: "🏅", category: "interactive" },
  { id: "subscriber", title: "Insider", description: "Subscribe to the newsletter", icon: "✉️", category: "social" },
  { id: "ambassador", title: "Ambassador", description: "Share a post", icon: "📣", category: "social" },
];

export interface UserState {
  currentStreak: number;
  longestStreak: number;
  lastVisitDate: string;
  readPostSlugs: string[];
  usedWidgetIds: string[];
  completedQuizIds: string[];
  subscribed: boolean;
  shared: boolean;
  totalPublishedSlugs: string[];
}

export interface AchievementUnlock {
  id: AchievementId;
  unlockedAt: string;
}
