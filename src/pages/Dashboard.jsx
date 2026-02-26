import { useEffect, useState } from 'react';
import { calculateBMI, getBMIClassification } from '../utils/fitnessCalculations';

const DashboardPage = ({ measurements = [] }) => {
  const [last, setLast] = useState(null);
  const [first, setFirst] = useState(null);

  useEffect(() => {
    if (Array.isArray(measurements) && measurements.length > 0) {
      const valid = measurements.filter(m =>
        m.bodyFat < 100 &&
        m.muscleMass < 500 &&
        m.weight > 20 &&
        m.weight < 300 &&
        m.waist > 20 &&
        m.waist < 200
      );

      if (valid.length === 0) {
        setFirst(null);
        setLast(null);
        return;
      }

      // ✅ Ordena corretamente por data (mais antigo → mais recente)
      const sorted = [...valid].sort(
        (a, b) => new Date(a.date) - new Date(b.date)
      );

      setFirst(sorted[0]);
      setLast(sorted[sorted.length - 1]);
    }
  }, [measurements]);

  // ===============================
  // Cálculos seguros
  // ===============================

  let gorduraDelta = 0;
  let massaDelta = 0;
  let weightDelta = 0;
  let waistDelta = 0;

  let fatProgress = 0;
  let muscleProgress = 0;

  if (last && measurements.length >= 2) {
    // Pega a medição anterior (penúltima)
    const previous = measurements[measurements.length - 2];

    const prevFat = parseFloat(previous.bodyFat);
    const lastFat = parseFloat(last.bodyFat);

    const prevMuscle = parseFloat(previous.muscleMass);
    const lastMuscle = parseFloat(last.muscleMass);

    const prevWeight = parseFloat(previous.weight);
    const lastWeight = parseFloat(last.weight);

    const prevWaist = parseFloat(previous.waist);
    const lastWaist = parseFloat(last.waist);

    // ✅ Comparação com medição anterior (não com a primeira)
    gorduraDelta = (lastFat - prevFat).toFixed(1);
    massaDelta = (lastMuscle - prevMuscle).toFixed(1);
    weightDelta = (lastWeight - prevWeight).toFixed(1);
    waistDelta = (lastWaist - prevWaist).toFixed(1);

    // ✅ Progresso real limitado entre 0 e 100
    fatProgress = Math.min(
      100,
      Math.max(0, ((prevFat - lastFat) / prevFat) * 100)
    );

    muscleProgress = Math.min(
      100,
      Math.max(0, ((lastMuscle - prevMuscle) / prevMuscle) * 100)
    );
  }

  if (!last) {
    return (
      <main className="container py-4">
        <div className="alert alert-info">
          <i className="bi bi-info-circle me-2"></i>
          Nenhuma medição válida encontrada. Adicione suas primeiras medidas para começar.
        </div>
      </main>
    );
  }

  // Cálculo de IMC
  const bmi = calculateBMI(last.weight, last.height);
  const bmiClass = getBMIClassification(bmi);
  const weightStatus = bmiClass.label;

  return (
    <main className="container py-4">
      {/* Hero */}
      <div
        className="p-4 p-md-5 mb-4 rounded-4 text-white"
        style={{
          background: 'linear-gradient(90deg, #4f46e5, #7c3aed)'
        }}
      >
        <h2 className="fw-bold mb-2">Bem-vindo de volta! 👋</h2>
        <p className="mb-0 opacity-75">
          Seu peso atual: <strong>{last.weight} kg</strong> • Status: <strong>{weightStatus}</strong>
        </p>
      </div>

      {/* Status Principal - Peso e Classificação */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body text-center py-5">
              <div className="mb-4">
                <span style={{ fontSize: '48px' }}>
                  {bmiClass.label === 'Peso normal' && '✅'}
                  {bmiClass.label === 'Abaixo do peso' && '⬇️'}
                  {bmiClass.label === 'Sobrepeso' && '⚠️'}
                  {bmiClass.label.includes('Obesidade') && '❌'}
                </span>
              </div>
              <div className="mb-3">
                <h3 className="fw-bold mb-1" style={{ fontSize: '2.5rem', color: '#667eea' }}>
                  {last.weight} kg
                </h3>
                <p className="text-muted mb-0">Seu peso atual</p>
              </div>
              
              {measurements.length >= 2 && (
                <div className={`badge bg-${weightDelta >= 0 ? 'danger' : 'success'} p-2 mb-3`}>
                  {weightDelta > 0 ? '+' : ''}{weightDelta} kg desde a última medição
                </div>
              )}

              <div className="mt-4 p-3 rounded" style={{ backgroundColor: '#f9f9f9' }}>
                <h5 className={`mb-2 fw-bold bg-${bmiClass.color} text-white p-2 rounded`}>
                  {weightStatus}
                </h5>
                <p className="text-muted small mb-0">
                  IMC: {bmi.toFixed(1)} 
                  {bmiClass.label === 'Peso normal' && ' - Continue mantendo este peso'}
                  {bmiClass.label === 'Abaixo do peso' && ' - Precise ganhar peso'}
                  {bmiClass.label === 'Sobrepeso' && ' - Recomenda-se perder peso'}
                  {bmiClass.label.includes('Obesidade') && ' - Procure orientação profissional'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cards de Métricas Rápidas */}
      <div className="row g-4 mb-4">
        {/* Gordura */}
        <div className="col-12 col-md-6 col-lg-3">
          <div className="card h-100 shadow-sm border-0">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <i className="bi bi-heart-pulse text-danger fs-3"></i>
                <span className="text-muted small fw-medium">Gordura</span>
              </div>
              <div className="d-flex align-items-baseline">
                <span className="fs-2 fw-bold">{last.bodyFat.toFixed(1)}</span>
                <span className="text-muted ms-1">%</span>
              </div>
              <div className={`small mt-2 ${gorduraDelta <= 0 ? 'text-success' : 'text-danger'}`}>
                {gorduraDelta > 0 ? '↑' : '↓'} {Math.abs(gorduraDelta)}%
              </div>
            </div>
          </div>
        </div>

        {/* Massa Muscular */}
        <div className="col-12 col-md-6 col-lg-3">
          <div className="card h-100 shadow-sm border-0">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <i className="bi bi-lightning-charge text-warning fs-3"></i>
                <span className="text-muted small fw-medium">Músculos</span>
              </div>
              <div className="d-flex align-items-baseline">
                <span className="fs-2 fw-bold">{last.muscleMass.toFixed(1)}</span>
                <span className="text-muted ms-1">kg</span>
              </div>
              <div className={`small mt-2 ${massaDelta >= 0 ? 'text-success' : 'text-danger'}`}>
                {massaDelta > 0 ? '↑' : '↓'} {Math.abs(massaDelta)} kg
              </div>
            </div>
          </div>
        </div>

        {/* Cintura */}
        {last.waist && (
          <div className="col-12 col-md-6 col-lg-3">
            <div className="card h-100 shadow-sm border-0">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <i className="bi bi-diagram-3 text-info fs-3"></i>
                  <span className="text-muted small fw-medium">Cintura</span>
                </div>
                <div className="d-flex align-items-baseline">
                  <span className="fs-2 fw-bold">{last.waist.toFixed(1)}</span>
                  <span className="text-muted ms-1">cm</span>
                </div>
                <div className={`small mt-2 ${waistDelta <= 0 ? 'text-success' : 'text-danger'}`}>
                  {waistDelta > 0 ? '↑' : '↓'} {Math.abs(waistDelta)} cm
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Data da Última Medição */}
        <div className="col-12 col-md-6 col-lg-3">
          <div className="card h-100 shadow-sm border-0">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <i className="bi bi-calendar-event text-secondary fs-3"></i>
                <span className="text-muted small fw-medium">Última Medição</span>
              </div>
              <div className="fs-6 fw-bold">
                {new Date(last.date).toLocaleDateString('pt-BR')}
              </div>
              <div className="small mt-2 text-muted">
                {Math.floor((new Date() - new Date(last.date)) / (1000 * 60 * 60 * 24))} dias atrás
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dica para Ver Detalhes */}
      <div className="alert alert-info d-flex align-items-center gap-3">
        <i className="bi bi-lightbulb fs-5"></i>
        <div>
          <strong>Dica:</strong> Clique em "<strong>Perfil</strong>" no menu para ver todas as métricas avançadas (IMC, Relação Cintura/Altura, TMB, TDEE, e muito mais!)
        </div>
      </div>
    </main>
  );
};

export default DashboardPage;