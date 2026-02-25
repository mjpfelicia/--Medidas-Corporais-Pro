// IMC
export const calculateBMI = (weight, height) => {
  return weight / (height * height);
};

// Relação Cintura/Altura
export const calculateWHtR = (waist, heightCm) => {
  return waist / heightCm;
};

// Massa Magra
export const calculateLeanMass = (weight, bodyFat) => {
  return weight * (1 - bodyFat / 100);
};

// Fórmula Navy
export const calculateNavyBodyFat = (gender, waist, neck, height, hip = 0) => {
  if (gender === "male") {
    return (
      86.010 * Math.log10(waist - neck) -
      70.041 * Math.log10(height) +
      36.76
    );
  } else {
    return (
      163.205 * Math.log10(waist + hip - neck) -
      97.684 * Math.log10(height) -
      78.387
    );
  }
};

// TMB (Mifflin-St Jeor)
export const calculateBMR = (gender, weight, heightCm, age) => {
  if (gender === "male") {
    return 10 * weight + 6.25 * heightCm - 5 * age + 5;
  } else {
    return 10 * weight + 6.25 * heightCm - 5 * age - 161;
  }
};