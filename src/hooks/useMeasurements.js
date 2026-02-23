import { useState, useEffect } from 'react';
import { localStorageService } from './localStorageService';

export const useMeasurements = () => {
  const [measurements, setMeasurements] = useState(() => {
    const saved = localStorageService.get('measurements');
    return saved && saved.length > 0 ? saved : [];
  });

  useEffect(() => {
    localStorageService.set('measurements', measurements);
  }, [measurements]);

  const addMeasurement = (data) => {
    setMeasurements(prev =>
      [...prev, { ...data, id: Date.now() }].sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      )
    );
  };

  return { measurements, addMeasurement };
};
