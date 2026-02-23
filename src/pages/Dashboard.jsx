import { useEffect, useState } from 'react';
import { localStorageService } from '../hooks/localStorageService';
import { col } from 'framer-motion/client';

const DashboardPage = () => {
  const [measurements, setMeasurements] = useState([]);
  const [last, setLast] = useState(null);
  const [first, setFirst] = useState(null);

  useEffect(() => {
    const saved = localStorageService.get('measurements');
    if (Array.isArray(saved) && saved.length > 0) {
      // Filtra medições com valores absurdos
      const valid = saved.filter(m => 
        m.bodyFat < 100 && m.muscleMass < 500 && 
        m.weight > 20 && m.weight < 300 &&
        m.waist > 20 && m.waist < 200
      );

      if (valid.length === 0) {
        setMeasurements([]);
        return;
      }

      // Ordena do mais antigo para o mais recente (campo date)
      const sorted = [...valid];
      setMeasurements(sorted);
      setFirst(sorted[0]);                // mais antigo
      setLast(sorted[sorted.length - 1]); // mais recente
     
    }
  }, []);

  // Calcula deltas apenas se houver pelo menos 2 medições
  let gorduraDelta = '';
  let massaDelta = '';
  if (first && last && measurements.length >= 2) {
    const firstFat = parseFloat(first.bodyFat);
    const lastFat = parseFloat(last.bodyFat);
    const firstMuscle = parseFloat(first.muscleMass);
    const lastMuscle = parseFloat(last.muscleMass);

    gorduraDelta = (firstFat - lastFat).toFixed(1);
    massaDelta = (lastMuscle - firstMuscle).toFixed(1);
  }

  // Se não houver dados válidos, exibe mensagem
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
      <div className="p-4 p-md-5 mb-4 rounded-4 text-white"
        style={{
          background: 'linear-gradient(90deg, #4f46e5, #7c3aed)'
        }}>
        <h2 className="fw-bold mb-2">Bem-vindo de volta!!</h2>
        <p className="mb-0 opacity-75">
          Acompanhe seu progresso e alcance seus objetivos de composição corporal.
        </p>
      </div>

      {/* Cards principais */}
      <div className="row g-4 mb-4">
        <>
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
                <div className={`small mt-2 ${last.weight - first.weight >= 0 ? 'text-success' : 'text-danger'}`}>
                  {last.weight - first.weight > 0 ? '+' : ''}
                  {(last.weight - first.weight).toFixed(1)} kg
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
                <div className={`small mt-2 ${parseFloat(gorduraDelta) >= 0 ? 'text-success' : 'text-danger'}`}>
                  {gorduraDelta && parseFloat(gorduraDelta) > 0 ? '+' : ''}{gorduraDelta}%
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
                <div className={`small mt-2 ${parseFloat(massaDelta) >= 0 ? 'text-success' : 'text-danger'}`}>
                  {massaDelta && parseFloat(massaDelta) > 0 ? '+' : ''}{massaDelta}kg
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
                <div className={`small mt-2 ${last.waist - first.waist <= 0 ? 'text-success' : 'text-danger'}`}>
                  {last.waist - first.waist > 0 ? '+' : ''}
                  {(last.waist - first.waist).toFixed(1)} cm
                </div>
              </div>
            </div>
          </div>
        </>
      </div>

      {/* Metas (valores fixos por enquanto) */}
      <div className="row g-4">
        <div className="col-12 col-md-6">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <div className="d-flex justify-content-between mb-2">
                <h6 className="fw-semibold mb-0">Redução de Gordura Corporal</h6>
                <span className="text-muted small">{last.bodyFat} / {first.bodyFat}</span>
              </div>
              <div className="progress" style={{ height: 10 }}>
                <div
                  className="progress-bar bg-danger"
                  role="progressbar"
                  style={{ width: '100%' }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-6">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <div className="d-flex justify-content-between mb-2">
                <h6 className="fw-semibold mb-0">Ganho de Massa Muscular</h6>
                <span className="text-muted small">{last.muscleMass} / {first.muscleMass}</span>
              </div>
              <div className="progress" style={{ height: 10 }}>
                <div
                  className="progress-bar bg-success"
                  role="progressbar"
                  style={{ width: '92%' }}
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