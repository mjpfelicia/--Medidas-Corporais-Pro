import { useEffect, useState, useMemo } from 'react';
import { localStorageService } from '../hooks/localStorageService';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const Progress = () => {
  const [measurements, setMeasurements] = useState([]);
  const [period, setPeriod] = useState(30); // dias para exibir no gráfico (padrão 30)

  useEffect(() => {
    const saved = localStorageService.get('measurements');
    if (Array.isArray(saved)) {
      // Filtra medições válidas (mesmo critério anterior)
      const valid = saved.filter(m => {
        if (!m.date || !m.weight || !m.bodyFat || !m.muscleMass) return false;

        const weight = parseFloat(m.weight);
        const bodyFat = parseFloat(m.bodyFat);
        const muscle = parseFloat(m.muscleMass);

        if (isNaN(weight) || isNaN(bodyFat) || isNaN(muscle)) return false;
        if (weight < 20 || weight > 300) return false;
        if (bodyFat < 0 || bodyFat > 80) return false;
        if (muscle < 0 || muscle > 300) return false;
        if (isNaN(new Date(m.date).getTime())) return false;

        return true;
      });

      // Ordena do mais antigo para o mais recente
      const sorted = [...valid].sort((a, b) => new Date(a.date) - new Date(b.date));
      setMeasurements(sorted);
    } else {
      setMeasurements([]);
    }
  }, []);

  // Dados para o gráfico (filtrados pelo período selecionado)
  const chartData = useMemo(() => {
    if (measurements.length === 0) return [];

    const now = new Date();
    const cutoff = new Date(now.setDate(now.getDate() - period));

    // Pega medições a partir da data de corte
    const filtered = measurements.filter(m => new Date(m.date) >= cutoff);

    // Formata para o gráfico (data abreviada e valores numéricos)
    return filtered.map(m => ({
      date: new Date(m.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
      peso: parseFloat(m.weight),
      gordura: parseFloat(m.bodyFat),
      musculo: parseFloat(m.muscleMass)
    }));
  }, [measurements, period]);

  // Cálculo das diferenças entre primeira e última medição (geral)
  const differences = useMemo(() => {
    if (measurements.length < 2) return null;

    const oldest = measurements[0];
    const latest = measurements[measurements.length - 1];

    const oldestWeight = parseFloat(oldest.weight);
    const latestWeight = parseFloat(latest.weight);
    const oldestBodyFat = parseFloat(oldest.bodyFat);
    const latestBodyFat = parseFloat(latest.bodyFat);
    const oldestMuscle = parseFloat(oldest.muscleMass);
    const latestMuscle = parseFloat(latest.muscleMass);

    const weightDiff = latestWeight - oldestWeight;
    const fatDiff = oldestBodyFat - latestBodyFat;
    const muscleDiff = latestMuscle - oldestMuscle;

    return {
      weight: weightDiff.toFixed(1),
      weightPercent: ((weightDiff / oldestWeight) * 100).toFixed(1),
      fat: fatDiff.toFixed(1),
      fatPercent: ((fatDiff / oldestBodyFat) * 100).toFixed(1),
      muscle: muscleDiff.toFixed(1),
      musclePercent: ((muscleDiff / oldestMuscle) * 100).toFixed(1)
    };
  }, [measurements]);

  if (measurements.length === 0) {
    return <p className="text-muted">Nenhuma medição encontrada.</p>;
  }

  return (
    <div className="card p-4 shadow-sm">
      <h5 className="mb-3">Evolução do Progresso</h5>

      {/* Seletor de período */}
      <div className="mb-3 d-flex gap-2">
        <button
          className={`btn btn-sm ${period === 7 ? 'btn-primary' : 'btn-outline-secondary'}`}
          onClick={() => setPeriod(7)}
        >
          7 dias
        </button>
        <button
          className={`btn btn-sm ${period === 30 ? 'btn-primary' : 'btn-outline-secondary'}`}
          onClick={() => setPeriod(30)}
        >
          30 dias
        </button>
        <button
          className={`btn btn-sm ${period === 90 ? 'btn-primary' : 'btn-outline-secondary'}`}
          onClick={() => setPeriod(90)}
        >
          90 dias
        </button>
      </div>

      {/* Gráfico */}
      {chartData.length > 1 ? (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Legend />
            <Line yAxisId="left" type="monotone" dataKey="peso" stroke="#8884d8" name="Peso (kg)" />
            <Line yAxisId="right" type="monotone" dataKey="gordura" stroke="#ff7300" name="Gordura (%)" />
            <Line yAxisId="left" type="monotone" dataKey="musculo" stroke="#82ca9d" name="Músculo (kg)" />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <p className="text-muted">Dados insuficientes para o gráfico no período selecionado.</p>
      )}

      {/* Cards de resumo com variação absoluta e percentual */}
      {differences && (
        <div className="row mt-4 g-3">
          <div className="col-md-4">
            <div className="card text-center p-2 border-0 bg-light">
              <strong>Peso</strong>
              <span className={differences.weight >= 0 ? 'text-success' : 'text-danger'}>
                {differences.weight >= 0 ? '+' : ''}{differences.weight} kg
              </span>
              <small className="text-muted">
                ({differences.weightPercent}%)
              </small>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card text-center p-2 border-0 bg-light">
              <strong>Gordura</strong>
              <span className={differences.fat >= 0 ? 'text-success' : 'text-danger'}>
                {differences.fat >= 0 ? '+' : ''}{differences.fat}%
              </span>
              <small className="text-muted">
                ({differences.fatPercent}%)
              </small>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card text-center p-2 border-0 bg-light">
              <strong>Músculo</strong>
              <span className={differences.muscle >= 0 ? 'text-success' : 'text-danger'}>
                {differences.muscle >= 0 ? '+' : ''}{differences.muscle} kg
              </span>
              <small className="text-muted">
                ({differences.musclePercent}%)
              </small>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Progress;