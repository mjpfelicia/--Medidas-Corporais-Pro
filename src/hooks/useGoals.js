import { useState, useEffect } from 'react';

export const useGoals = () => {
  const [goals, setGoals] = useState(() => {
    const saved = localStorage.getItem('fitnessGoals');
    return saved
      ? JSON.parse(saved)
      : {
          targetWeight: null,
          targetBodyFat: null,
          targetWaist: null,
          createdAt: new Date().toISOString(),
        };
  });

  useEffect(() => {
    localStorage.setItem('fitnessGoals', JSON.stringify(goals));
  }, [goals]);

  const updateGoals = (updatedData) => {
    setGoals(prev => ({ ...prev, ...updatedData }));
  };

  return {
    goals,
    setGoals,
    updateGoals,
    hasGoals: !!(goals.targetWeight || goals.targetBodyFat || goals.targetWaist),
  };
};
