import { useState, useEffect } from "react";

export const useUserProfile = () => {
  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem("fitnessProfile");
    return saved
      ? JSON.parse(saved)
      : {
          gender: "male",
          age: 25,
          height: 1.75, // metros
          activityLevel: 1.55
        };
  });

  useEffect(() => {
    localStorage.setItem("fitnessProfile", JSON.stringify(profile));
  }, [profile]);

  return { profile, setProfile };
};
