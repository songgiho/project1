// 기본 타입 정의
export interface User {
  id: string;
  username: string;
  email: string;
  profilePicture?: string;
  nickname: string;
}

export interface MealLog {
  id: string;
  date: string;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  foodName: string;
  calories: number;
  carbs: number;
  protein: number;
  fat: number;
  nutriScore: 'A' | 'B' | 'C' | 'D' | 'E';
  imageUrl?: string;
}

export interface DailyNutrition {
  date: string;
  totalCalories: number;
  totalCarbs: number;
  totalProtein: number;
  totalFat: number;
  meals: MealLog[];
}

export interface MonthlyCalendar {
  year: number;
  month: number;
  days: {
    [date: string]: {
      meals: Array<{
        type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
        hasLog: boolean;
      }>;
    };
  };
}

export interface Challenge {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  targetType: 'weight' | 'calorie' | 'macro';
  targetValue: number;
  isActive: boolean;
  participants: ChallengeParticipant[];
}

export interface ChallengeParticipant {
  id: string;
  user: User;
  status: 'survived' | 'eliminated';
  eliminationDate?: string;
  currentStreak: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  iconUrl: string;
  isAcquired: boolean;
  acquiredDate?: string;
}

export interface AICoachTip {
  id: string;
  message: string;
  type: 'warning' | 'suggestion' | 'encouragement';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
} 