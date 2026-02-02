import { useState } from 'react';

export const useMeasurements = () => {
  const [measurements, setMeasurements] = useState([
    {
      id: 1,
      date: '2026-01-17',
      weight: 75.5,
      bodyFat: 18.2,
      muscleMass: 32.1,
      waist: 85
    }
  ]);

  const addMeasurement = (data) => {
    setMeasurements(prev =>
      [...prev, { ...data, id: Date.now() }].sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      )
    );
  };

  return { measurements, addMeasurement };
};
