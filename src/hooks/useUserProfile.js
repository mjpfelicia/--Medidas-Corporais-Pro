import { useState, useEffect } from "react";

export const useUserProfile = () => {
  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem("fitnessProfile");
    return saved
      ? JSON.parse(saved)
      : {
          name: "Usuário",
          gender: "male", // male, female
          age: 25,
          height: 175, // em cm
          activityLevel: 1.55, // 1.2 = sedentário, 1.375 = pouco ativo, 1.55 = moderadamente ativo, 1.725 = muito ativo, 1.9 = extremamente ativo
        };
  });

  useEffect(() => {
    localStorage.setItem("fitnessProfile", JSON.stringify(profile));
  }, [profile]);

  const updateProfile = (updatedData) => {
    setProfile(prev => ({ ...prev, ...updatedData }));
  };

  return { 
    profile, 
    setProfile,
    updateProfile,
    activityLevels: {
      1.2: "Sedentário (pouco ou nenhum exercício)",
      1.375: "Pouco ativo (exercício 1-3 dias/semana)",
      1.55: "Moderadamente ativo (exercício 3-5 dias/semana)",
      1.725: "Muito ativo (exercício 6-7 dias/semana)",
      1.9: "Extremamente ativo (exercício intenso diário)"
    }
  };
};

