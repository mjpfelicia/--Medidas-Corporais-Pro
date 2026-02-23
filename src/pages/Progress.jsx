import { useEffect, useState } from 'react';
import { localStorageService } from '../hooks/localStorageService';

const Progress = () => {
  const [measurements, setMeasurements] = useState([]);

  useEffect(() => {
    const saved = localStorageService.get('measurements');
    setMeasurements(saved && saved.length > 0 ? saved : []);
  }, []);

  if (measurements.length < 2) return <p>Dados insuficientes.</p>;

  const first = measurements[measurements.length - 1];
  const last = measurements[0];

  return (
    <div className="card p-4 shadow-sm">
      <p><strong>Peso:</strong> {(last.weight - first.weight).toFixed(1)} kg</p>
      <p><strong>Gordura:</strong> {(first.bodyFat - last.bodyFat).toFixed(1)}%</p>
      <p><strong>Músculo:</strong> {(last.muscleMass - first.muscleMass).toFixed(1)} kg</p>
    </div>
  );
};

export default Progress;
