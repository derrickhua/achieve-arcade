'use client'
import React, { useState, useEffect } from 'react';
// Utility Functions
import { getAllGoals, deleteGoal } from '@/lib/goals';
import DailySchedule from '@/components/schedule/Schedule';
import TimeBlock from '@/components/schedule/TimeBlock';
export default function GoalDashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');



  return (
        <DailySchedule />
  );
}
