import { useEffect, useState } from 'react';

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

  // ===============================
  // Sem dados
  // ===============================

  if (!last) {
    return (
      <main className="container py-4">
        <div className="alert alert-info">
          Nenhuma medição válida encontrada. Adicione suas primeiras medidas para começar.
        </div>
      </main>
    );
  }

  return (
    <main className="container py-4">
      {/* Hero */}
      <div
        className="p-4 p-md-5 mb-4 rounded-4 text-white"
        style={{
          background: 'linear-gradient(90deg, #4f46e5, #7c3aed)'
        }}
      >
        <h2 className="fw-bold mb-2">Bem-vindo de volta!!</h2>
        <p className="mb-0 opacity-75">
          Acompanhe seu progresso e alcance seus objetivos de composição corporal.
        </p>
      </div>

      {/* Cards principais */}
      <div className="row g-4 mb-4">

        {/* Peso */}
        <div className="col-12 col-md-6 col-lg-3">
          <div className="card h-100 shadow-sm border-0">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <i className="bi bi-speedometer2 text-primary fs-3"></i>
                <span className="text-muted small fw-medium">Peso</span>
              </div>
              <div className="d-flex align-items-baseline">
                <span className="fs-2 fw-bold">{last.weight}</span>
                <span className="text-muted ms-1">kg</span>
              </div>
              <div className={`small mt-2 ${weightDelta >= 0 ? 'text-success' : 'text-danger'}`}>
                {weightDelta > 0 ? '+' : ''}{weightDelta} kg
              </div>
            </div>
          </div>
        </div>

        {/* Gordura */}
        <div className="col-12 col-md-6 col-lg-3">
          <div className="card h-100 shadow-sm border-0">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <i className="bi bi-heart-pulse text-primary fs-3"></i>
                <span className="text-muted small fw-medium">Gordura Corporal</span>
              </div>
              <div className="d-flex align-items-baseline">
                <span className="fs-2 fw-bold">{last.bodyFat}</span>
                <span className="text-muted ms-1">%</span>
              </div>
              <div className={`small mt-2 ${gorduraDelta <= 0 ? 'text-success' : 'text-danger'}`}>
                {gorduraDelta > 0 ? '+' : ''}{gorduraDelta}%
              </div>
            </div>
          </div>
        </div>

        {/* Massa Muscular */}
        <div className="col-12 col-md-6 col-lg-3">
          <div className="card h-100 shadow-sm border-0">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <i className="bi bi-lightning-charge text-primary fs-3"></i>
                <span className="text-muted small fw-medium">Massa Muscular</span>
              </div>
              <div className="d-flex align-items-baseline">
                <span className="fs-2 fw-bold">{last.muscleMass}</span>
                <span className="text-muted ms-1">kg</span>
              </div>
              <div className={`small mt-2 ${massaDelta >= 0 ? 'text-success' : 'text-danger'}`}>
                {massaDelta > 0 ? '+' : ''}{massaDelta} kg
              </div>
            </div>
          </div>
        </div>

        {/* Cintura */}
        <div className="col-12 col-md-6 col-lg-3">
          <div className="card h-100 shadow-sm border-0">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <i className="bi bi-person text-primary fs-3"></i>
                <span className="text-muted small fw-medium">Cintura</span>
              </div>
              <div className="d-flex align-items-baseline">
                <span className="fs-2 fw-bold">{last.waist}</span>
                <span className="text-muted ms-1">cm</span>
              </div>
              <div className={`small mt-2 ${waistDelta <= 0 ? 'text-success' : 'text-danger'}`}>
                {waistDelta > 0 ? '+' : ''}{waistDelta} cm
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Metas */}
      <div className="row g-4">
        <div className="col-12 col-md-6">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h6 className="fw-semibold mb-0">Redução de Gordura Corporal</h6>
                <span className={`small fw-medium ${gorduraDelta <= 0 ? 'text-success' : 'text-danger'}`}>
                  {gorduraDelta > 0 ? '+' : ''}{gorduraDelta}%
                </span>
              </div>
              <div className="progress" style={{ height: 10 }}>
                <div
                  className={`progress-bar ${gorduraDelta <= 0 ? 'bg-success' : 'bg-danger'}`}
                  role="progressbar"
                  style={{ width: `${fatProgress}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-6">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h6 className="fw-semibold mb-0">Ganho de Massa Muscular</h6>
                <span className={`small fw-medium ${massaDelta >= 0 ? 'text-success' : 'text-danger'}`}>
                  {massaDelta > 0 ? '+' : ''}{massaDelta} kg
                </span>
              </div>
              <div className="progress" style={{ height: 10 }}>
                <div
                  className={`progress-bar ${massaDelta >= 0 ? 'bg-success' : 'bg-danger'}`}
                  role="progressbar"
                  style={{ width: `${muscleProgress}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default DashboardPage;