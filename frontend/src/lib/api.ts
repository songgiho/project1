import axios from 'axios';
import { 
  ApiResponse, 
  DailyNutrition, 
  MonthlyCalendar, 
  Challenge, 
  Badge, 
  AICoachTip,
  MealLog 
} from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 인터셉터 설정 (토큰 인증 등)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// API 함수들
export const apiClient = {
  // 달력 관련 API
  getMonthlyLogs: async (year: number, month: number): Promise<MonthlyCalendar> => {
    const response = await api.get<ApiResponse<MonthlyCalendar>>(`/api/logs/monthly?year=${year}&month=${month}`);
    return response.data.data;
  },

  getDailyReport: async (date: string): Promise<DailyNutrition> => {
    const response = await api.get<ApiResponse<DailyNutrition>>(`/api/logs/daily?date=${date}`);
    return response.data.data;
  },

  // 식사 로그 관련 API
  analyzeImage: async (imageFile: File): Promise<Partial<MealLog>> => {
    const formData = new FormData();
    formData.append('image', imageFile);
    
    const response = await api.post<ApiResponse<Partial<MealLog>>>('/api/logs/analyze-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  },

  createMealLog: async (mealData: Omit<MealLog, 'id'>): Promise<MealLog> => {
    const response = await api.post<ApiResponse<MealLog>>('/api/logs', mealData);
    return response.data.data;
  },

  // 챌린지 관련 API
  getRecommendedChallenges: async (): Promise<Challenge[]> => {
    const response = await api.get<ApiResponse<Challenge[]>>('/api/challenges/recommended');
    return response.data.data;
  },

  getMyChallenges: async (): Promise<Challenge[]> => {
    const response = await api.get<ApiResponse<Challenge[]>>('/api/challenges/my-list');
    return response.data.data;
  },

  getChallengeDetails: async (challengeId: string): Promise<Challenge> => {
    const response = await api.get<ApiResponse<Challenge>>(`/api/challenges/${challengeId}`);
    return response.data.data;
  },

  // AI 코치 관련 API
  getCoachingTip: async (): Promise<AICoachTip> => {
    const response = await api.get<ApiResponse<AICoachTip>>('/api/ai/coaching-tip');
    return response.data.data;
  },

  // 프로필 관련 API
  getUserBadges: async (username: string): Promise<Badge[]> => {
    const response = await api.get<ApiResponse<Badge[]>>(`/api/users/${username}/badges`);
    return response.data.data;
  },
};

export default api; 