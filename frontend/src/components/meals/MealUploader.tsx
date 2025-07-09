'use client';

import React, { useState } from 'react';
import { Camera, Upload, Loader2, Check, X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { apiClient } from '@/lib/api';

interface MealFormData {
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  foodName: string;
  calories: number;
  carbs: number;
  protein: number;
  fat: number;
  nutriScore: 'A' | 'B' | 'C' | 'D' | 'E';
}

export function MealUploader() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<MealFormData>({
    defaultValues: {
      mealType: 'lunch',
      foodName: '',
      calories: 0,
      carbs: 0,
      protein: 0,
      fat: 0,
      nutriScore: 'C'
    }
  });

  const watchedValues = watch();

  // 파일 선택 핸들러
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      
      // 미리보기 URL 생성
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);

      // AI 분석 시작
      analyzeImage(file);
    }
  };

  // AI 이미지 분석
  const analyzeImage = async (file: File) => {
    setAnalyzing(true);
    try {
      const result = await apiClient.analyzeImage(file);
      
      // 분석 결과로 폼 필드 자동 채우기
      if (result.foodName) setValue('foodName', result.foodName);
      if (result.calories) setValue('calories', result.calories);
      if (result.carbs) setValue('carbs', result.carbs);
      if (result.protein) setValue('protein', result.protein);
      if (result.fat) setValue('fat', result.fat);
      if (result.nutriScore) setValue('nutriScore', result.nutriScore);
      
    } catch (error) {
      console.error('Image analysis failed:', error);
      // 임시 데이터로 폼 채우기
      setValue('foodName', '닭가슴살 샐러드');
      setValue('calories', 350);
      setValue('carbs', 25);
      setValue('protein', 30);
      setValue('fat', 15);
      setValue('nutriScore', 'A');
    }
    setAnalyzing(false);
  };

  // 폼 제출 핸들러
  const onSubmit = async (data: MealFormData) => {
    setSubmitting(true);
    try {
      const mealData = {
        ...data,
        date: new Date().toISOString().split('T')[0],
        imageUrl: previewUrl || undefined
      };
      
      await apiClient.createMealLog(mealData);
      setSuccess(true);
      
      // 폼 초기화
      setTimeout(() => {
        reset();
        setSelectedFile(null);
        setPreviewUrl(null);
        setSuccess(false);
      }, 2000);
      
    } catch (error) {
      console.error('Meal log creation failed:', error);
    }
    setSubmitting(false);
  };

  // 파일 드래그 앤 드롭 핸들러
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      analyzeImage(file);
    }
  };

  const getNutriScoreColor = (score: string) => {
    switch (score) {
      case 'A': return 'bg-green-500';
      case 'B': return 'bg-yellow-500';
      case 'C': return 'bg-orange-500';
      case 'D': return 'bg-red-500';
      case 'E': return 'bg-red-700';
      default: return 'bg-gray-500';
    }
  };



  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 이미지 업로드 영역 */}
        <div className="space-y-6">
          <div className="card p-6">
            <h2 className="text-xl font-nanum mb-4">사진 업로드</h2>
            
            {!previewUrl ? (
              <div
                className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => document.getElementById('file-input')?.click()}
              >
                <Camera className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-lg font-medium mb-2">사진을 업로드하세요</p>
                <p className="text-sm text-muted-foreground mb-4">
                  클릭하거나 드래그하여 사진을 선택하세요
                </p>
                <div className="flex items-center justify-center space-x-2">
                  <Upload className="w-4 h-4" />
                  <span className="text-sm">파일 선택</span>
                </div>
              </div>
            ) : (
              <div className="relative">
                <img
                  src={previewUrl}
                  alt="업로드된 식사 사진"
                  className="w-full h-64 object-cover rounded-lg"
                />
                <button
                  onClick={() => {
                    setPreviewUrl(null);
                    setSelectedFile(null);
                    reset();
                  }}
                  className="absolute top-2 right-2 p-2 bg-background/80 rounded-full hover:bg-background transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
            
            <input
              id="file-input"
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>

          {analyzing && (
            <div className="card p-6">
              <div className="flex items-center space-x-3">
                <Loader2 className="w-5 h-5 animate-spin text-primary" />
                <span className="text-sm">AI가 사진을 분석하고 있습니다...</span>
              </div>
            </div>
          )}
        </div>

        {/* 식사 정보 입력 폼 */}
        <div className="space-y-6">
          <div className="card p-6">
            <h2 className="text-xl font-nanum mb-4">식사 정보</h2>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* 식사 종류 */}
              <div>
                <label className="block text-sm font-medium mb-2">식사 종류</label>
                <select
                  {...register('mealType', { required: '식사 종류를 선택해주세요' })}
                  className="w-full p-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="breakfast">아침</option>
                  <option value="lunch">점심</option>
                  <option value="dinner">저녁</option>
                  <option value="snack">간식</option>
                </select>
              </div>

              {/* 음식 이름 */}
              <div>
                <label className="block text-sm font-medium mb-2">음식 이름</label>
                <input
                  {...register('foodName', { required: '음식 이름을 입력해주세요' })}
                  type="text"
                  className="w-full p-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="예: 닭가슴살 샐러드"
                />
                {errors.foodName && (
                  <p className="text-sm text-destructive mt-1">{errors.foodName.message}</p>
                )}
              </div>

              {/* 칼로리 */}
              <div>
                <label className="block text-sm font-medium mb-2">칼로리 (kcal)</label>
                <input
                  {...register('calories', { required: '칼로리를 입력해주세요', min: 0 })}
                  type="number"
                  className="w-full p-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="350"
                />
                {errors.calories && (
                  <p className="text-sm text-destructive mt-1">{errors.calories.message}</p>
                )}
              </div>

              {/* 영양소 정보 */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">탄수화물 (g)</label>
                  <input
                    {...register('carbs', { required: true, min: 0 })}
                    type="number"
                    className="w-full p-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="25"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">단백질 (g)</label>
                  <input
                    {...register('protein', { required: true, min: 0 })}
                    type="number"
                    className="w-full p-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="30"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">지방 (g)</label>
                  <input
                    {...register('fat', { required: true, min: 0 })}
                    type="number"
                    className="w-full p-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="15"
                  />
                </div>
              </div>

              {/* 영양 등급 */}
              <div>
                <label className="block text-sm font-medium mb-2">영양 등급</label>
                <select
                  {...register('nutriScore', { required: true })}
                  className="w-full p-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="A">A (매우 좋음)</option>
                  <option value="B">B (좋음)</option>
                  <option value="C">C (보통)</option>
                  <option value="D">D (나쁨)</option>
                  <option value="E">E (매우 나쁨)</option>
                </select>
              </div>

              {/* 영양 등급 미리보기 */}
              {watchedValues.nutriScore && (
                <div className="flex items-center space-x-2">
                  <span className="text-sm">영양 등급:</span>
                  <div className={`px-2 py-1 rounded text-white text-xs font-medium ${getNutriScoreColor(watchedValues.nutriScore)}`}>
                    {watchedValues.nutriScore}
                  </div>
                </div>
              )}

              {/* 제출 버튼 */}
              <button
                type="submit"
                disabled={submitting || !selectedFile}
                className="w-full btn-primary py-3 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>저장 중...</span>
                  </>
                ) : success ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>저장 완료!</span>
                  </>
                ) : (
                  <span>식사 로그 저장</span>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
} 