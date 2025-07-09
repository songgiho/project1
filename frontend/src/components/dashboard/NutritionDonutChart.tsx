'use client';

import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface NutritionDonutChartProps {
  carbs: number;
  protein: number;
  fat: number;
  totalCalories: number;
}

export function NutritionDonutChart({ carbs, protein, fat, totalCalories }: NutritionDonutChartProps) {
  // 영양소별 칼로리 계산 (탄수화물, 단백질: 4kcal/g, 지방: 9kcal/g)
  const carbsCalories = carbs * 4;
  const proteinCalories = protein * 4;
  const fatCalories = fat * 9;

  const data = [
    {
      name: '탄수화물',
      value: carbsCalories,
      color: '#3b82f6', // blue-500
      grams: carbs,
      percentage: Math.round((carbsCalories / totalCalories) * 100)
    },
    {
      name: '단백질',
      value: proteinCalories,
      color: '#ef4444', // red-500
      grams: protein,
      percentage: Math.round((proteinCalories / totalCalories) * 100)
    },
    {
      name: '지방',
      value: fatCalories,
      color: '#f59e0b', // amber-500
      grams: fat,
      percentage: Math.round((fatCalories / totalCalories) * 100)
    }
  ];

  const CustomTooltip = ({ active, payload }: {
    active?: boolean;
    payload?: Array<{
      payload: {
        name: string;
        grams: number;
        percentage: number;
        value: number;
      };
    }>;
  }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
          <p className="font-medium">{data.name}</p>
          <p className="text-sm text-muted-foreground">
            {data.grams}g ({data.percentage}%)
          </p>
          <p className="text-sm text-muted-foreground">
            {data.value}kcal
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomLegend = ({ payload }: {
    payload?: Array<{
      value: string;
      color: string;
      payload: {
        grams: number;
        percentage: number;
      };
    }>;
  }) => {
    return (
      <div className="flex flex-col space-y-2 mt-4">
        {payload?.map((entry, index: number) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-sm">{entry.value}</span>
            </div>
            <div className="text-sm text-muted-foreground">
              {entry.payload.grams}g ({entry.payload.percentage}%)
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="card p-6">
      <h3 className="text-lg font-semibold mb-4">영양소 분석</h3>
      
      {/* 총 칼로리 */}
      <div className="text-center mb-4">
        <div className="text-3xl font-bold text-primary">
          {totalCalories.toLocaleString()}
        </div>
        <div className="text-sm text-muted-foreground">총 칼로리 (kcal)</div>
      </div>

      {/* 도넛 차트 */}
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={2}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend content={<CustomLegend />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
} 