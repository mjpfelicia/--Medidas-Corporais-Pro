// ============================================================================
// CÁLCULOS DE FITNESS COM BASE NO GÊNERO, IDADE E NÍVEL DE ATIVIDADE
// ============================================================================

// IMC (Índice de Massa Corporal)
export const calculateBMI = (weight, heightCm) => {
  const heightM = heightCm / 100;
  return weight / (heightM * heightM);
};

// Classificação de IMC
export const getBMIClassification = (bmi) => {
  if (bmi < 18.5) return { label: 'Abaixo do peso', color: 'info' };
  if (bmi < 25) return { label: 'Peso normal', color: 'success' };
  if (bmi < 30) return { label: 'Sobrepeso', color: 'warning' };
  if (bmi < 35) return { label: 'Obesidade grau 1', color: 'danger' };
  return { label: 'Obesidade grau 2+', color: 'danger' };
};

// Relação Cintura/Altura (mais preditivo que IMC para saúde)
export const calculateWHtR = (waistCm, heightCm) => {
  return (waistCm / heightCm).toFixed(2);
};

// Massa Muscular (baseado em fórmula de Katch-McArdle)
export const calculateMuscleMass = (weight, bodyFatPercentage) => {
  const leanMass = weight * (1 - bodyFatPercentage / 100);
  return parseFloat(leanMass.toFixed(1));
};

// Gordura Corporal (Fórmula Navy)
// Mais precisa que IMC quando temos medidas de cintura
export const calculatenavyBodyFat = (gender, waistCm, neckCm, heightCm, hipCm = null) => {
  if (gender === "male") {
    // Homens: usar cintura e pescoço
    if (!neckCm || !waistCm) return null;
    
    const bodyFat =
      86.010 * Math.log10(waistCm - neckCm) -
      70.041 * Math.log10(heightCm) +
      36.76;
    
    return Math.max(0, parseFloat(bodyFat.toFixed(1))); // Mínimo 0%
  } else {
    // Mulheres: usar cintura, quadril e pescoço
    if (!neckCm || !waistCm || !hipCm) return null;
    
    const bodyFat =
      163.205 * Math.log10(waistCm + hipCm - neckCm) -
      97.684 * Math.log10(heightCm) -
      78.387;
    
    return Math.max(0, parseFloat(bodyFat.toFixed(1))); // Mínimo 0%
  }
};

// Gordura Corporal (Fórmula por IMC - fallback quando não temos medidas)
export const estimateBodyFatFromBMI = (bmi, gender, age) => {
  // Fórmula de Deurenberg (estimativa por IMC)
  // Menos precisa que Navy, mas funciona sem medidas extras
  let bodyFat;
  
  if (gender === "male") {
    bodyFat = (1.20 * bmi) + (0.23 * age) - (10.8 * 1) - 5.4;
  } else {
    bodyFat = (1.20 * bmi) + (0.23 * age) - (10.8 * 0) - 5.4;
  }
  
  return Math.max(0, Math.min(100, parseFloat(bodyFat.toFixed(1)))); // Entre 0-100%
};

// TMB - Taxa Metabólica Basal (Mifflin-St Jeor)
export const calculateBMR = (gender, weightKg, heightCm, ageYears) => {
  let bmr;
  
  if (gender === "male") {
    bmr = 10 * weightKg + 6.25 * heightCm - 5 * ageYears + 5;
  } else {
    bmr = 10 * weightKg + 6.25 * heightCm - 5 * ageYears - 161;
  }
  
  return parseFloat(bmr.toFixed(0));
};

// TDEE - Gasto Energético Diário Total (usando nível de atividade)
export const calculateTDEE = (gender, weightKg, heightCm, ageYears, activityLevel) => {
  const bmr = calculateBMR(gender, weightKg, heightCm, ageYears);
  const tdee = bmr * activityLevel;
  return parseFloat(tdee.toFixed(0));
};

// Faixa de Gordura Corporal Ideal por Gênero e Idade
export const getIdealBodyFatRange = (gender, ageYears) => {
  if (gender === "male") {
    if (ageYears < 20) return { min: 6, max: 17 };
    if (ageYears < 30) return { min: 8, max: 18 };
    if (ageYears < 40) return { min: 10, max: 20 };
    if (ageYears < 50) return { min: 12, max: 22 };
    return { min: 13, max: 24 };
  } else {
    if (ageYears < 20) return { min: 16, max: 26 };
    if (ageYears < 30) return { min: 17, max: 27 };
    if (ageYears < 40) return { min: 18, max: 29 };
    if (ageYears < 50) return { min: 19, max: 30 };
    return { min: 20, max: 32 };
  }
};

// Classificação de Gordura Corporal
export const getBodyFatClassification = (bodyFatPercent, gender) => {
  if (gender === "male") {
    if (bodyFatPercent < 6) return { label: 'Essencial', color: 'danger' };
    if (bodyFatPercent < 13) return { label: 'Atleta', color: 'success' };
    if (bodyFatPercent < 17) return { label: 'Fitness', color: 'success' };
    if (bodyFatPercent < 25) return { label: 'Normal', color: 'info' };
    return { label: 'Obeso', color: 'danger' };
  } else {
    if (bodyFatPercent < 13) return { label: 'Essencial', color: 'danger' };
    if (bodyFatPercent < 20) return { label: 'Atleta', color: 'success' };
    if (bodyFatPercent < 24) return { label: 'Fitness', color: 'success' };
    if (bodyFatPercent < 32) return { label: 'Normal', color: 'info' };
    return { label: 'Obeso', color: 'danger' };
  }
};

// Cálculo de Variação (ganho/perda de peso ou gordura)
export const calculateChange = (newValue, oldValue) => {
  if (!oldValue || oldValue === 0) return null;
  const difference = newValue - oldValue;
  const percentage = ((difference / oldValue) * 100).toFixed(2);
  return {
    difference: parseFloat(difference.toFixed(1)),
    percentage: parseFloat(percentage),
    isGain: difference > 0
  };
};

// ============================================================================
// PESO IDEAL E MEDIDAS IDEAIS
// ============================================================================

// Peso Ideal (Fórmula de Devine)
// Baseado em altura com ajuste por gênero
export const calculateIdealWeight = (gender, heightCm) => {
  let idealWeight;
  
  if (gender === "male") {
    // Homens: 50kg + 2.3kg por polegada acima de 5' (152.4cm)
    const inchesAbove152 = (heightCm - 152.4) / 2.54;
    idealWeight = 50 + (2.3 * inchesAbove152);
  } else {
    // Mulheres: 45.5kg + 2.3kg por polegada acima de 5' (152.4cm)
    const inchesAbove152 = (heightCm - 152.4) / 2.54;
    idealWeight = 45.5 + (2.3 * inchesAbove152);
  }
  
  return parseFloat(idealWeight.toFixed(1));
};

// Medidas Ideais da Cintura (baseado em altura e gênero)
// Proporção 0.35-0.40 da altura é considerada saudável
export const calculateIdealWaist = (gender, heightCm) => {
  let waistPercentage;
  
  if (gender === "male") {
    // Homens: 36-38% da altura
    waistPercentage = 0.37; // Valor médio ótimo
  } else {
    // Mulheres: 35-37% da altura
    waistPercentage = 0.36; // Valor médio ótimo
  }
  
  const idealWaist = heightCm * waistPercentage;
  return parseFloat(idealWaist.toFixed(1));
};

// Medidas Ideais do Quadril (apenas para mulheres)
// Proporção ideal: cintura:quadril de 0.7-0.8 para saúde
export const calculateIdealHip = (gender, heightCm) => {
  if (gender === "female") {
    // Mulheres: aproximadamente 44-46% da altura
    const hipPercentage = 0.45; // Valor médio ótimo
    const idealHip = heightCm * hipPercentage;
    return parseFloat(idealHip.toFixed(1));
  }
  return null;
};

// Medidas Ideais do Pescoço
// Proporção: ~37-38% da cintura ideal
export const calculateIdealNeck = (waistIdeal, gender) => {
  let neckPercentage;
  
  if (gender === "male") {
    neckPercentage = 0.37; // Homens: ~37% da cintura
  } else {
    neckPercentage = 0.35; // Mulheres: ~35% da cintura
  }
  
  const idealNeck = waistIdeal * neckPercentage;
  return parseFloat(idealNeck.toFixed(1));
};

// Medidas Ideais da Coxa/Perna
// Proporção baseada em altura: ~27-30% da altura
export const calculateIdealThigh = (heightCm, gender) => {
  let thighPercentage;
  
  if (gender === "male") {
    thighPercentage = 0.29; // Homens: ~29% da altura
  } else {
    thighPercentage = 0.28; // Mulheres: ~28% da altura
  }
  
  const idealThigh = heightCm * thighPercentage;
  return parseFloat(idealThigh.toFixed(1));
};

// Medidas Ideais do Braço (bíceps)
// Proporção baseada em altura: ~11-12% da altura
export const calculateIdealArm = (heightCm, gender) => {
  let armPercentage;
  
  if (gender === "male") {
    armPercentage = 0.125; // Homens: ~12.5% da altura
  } else {
    armPercentage = 0.11; // Mulheres: ~11% da altura
  }
  
  const idealArm = heightCm * armPercentage;
  return parseFloat(idealArm.toFixed(1));
};

// Medidas Ideais da Panturrilha
// Proporção baseada em altura: ~13-14% da altura
export const calculateIdealCalf = (heightCm, gender) => {
  let calfPercentage;
  
  if (gender === "male") {
    calfPercentage = 0.14; // Homens: ~14% da altura
  } else {
    calfPercentage = 0.133; // Mulheres: ~13.3% da altura
  }
  
  const idealCalf = heightCm * calfPercentage;
  return parseFloat(idealCalf.toFixed(1));
};

// Calcular quanto precisa perder/ganhar de peso
export const calculateWeightDifference = (currentWeight, idealWeight) => {
  const difference = currentWeight - idealWeight;
  return {
    needsToChangePounds: Math.abs(parseFloat(difference.toFixed(1))),
    isOverweight: difference > 0,
    isUnderweight: difference < 0,
    status: 
      difference > 2 ? 'Acima do peso ideal' :
      difference < -2 ? 'Abaixo do peso ideal' :
      'Dentro da faixa ideal'
  };
};

// Calcular quanto precisa perder/ganhar em medidas (cintura, quadril, pescoço)
export const calculateMeasurementDifference = (currentMeasure, idealMeasure, measurementType) => {
  const difference = currentMeasure - idealMeasure;
  return {
    currentMeasure: parseFloat(currentMeasure.toFixed(1)),
    idealMeasure: parseFloat(idealMeasure.toFixed(1)),
    difference: parseFloat(difference.toFixed(1)),
    needsToChange: Math.abs(parseFloat(difference.toFixed(1))),
    isAboveIdeal: difference > 0,
    isBelowIdeal: difference < 0,
    percentageDifference: parseFloat(((difference / idealMeasure) * 100).toFixed(1))
  };
};