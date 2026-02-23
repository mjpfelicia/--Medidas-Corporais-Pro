import { useEffect, useState } from 'react';
import { localStorageService } from '../hooks/localStorageService';

const DashboardPage = () => {
  const [measurements,setMeasurements] = useState([]);
  const [last, setLast] = useState(null);
  const [first, setFirst] = useState(null);

  console.log({ measurements });

  useEffect(() => {
    const saved = localStorageService.get('measurements');
    if (saved && saved.length > 0) {
      setMeasurements(saved);
      setLast(saved[0]);
      setFirst(saved[saved.length - 1]);
    }
  }, []);

  // Calcular progresso
  let gorduraDelta = '';
  let massaDelta = '';
  if (last && first) {
    gorduraDelta = (first.bodyFat - last.bodyFat).toFixed(1);
    massaDelta = (last.muscleMass - first.muscleMass).toFixed(1);
  }

  return (
    <main className="container py-4">

      {/* Hero / Boas-vindas */}
      <div className="p-4 p-md-5 mb-4 rounded-4 text-white"
           style={{
             background: 'linear-gradient(90deg, #4f46e5, #7c3aed)'
           }}>
        <h2 className="fw-bold mb-2">Bem-vindo de volta!</h2>
        <p className="mb-0 opacity-75">
          Acompanhe seu progresso e alcance seus objetivos de composição corporal.
        </p>
      </div>

      {/* Cards principais */}
      <div className="row g-4 mb-4">
        {last && (
          <>
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
                  <div className="text-success small mt-2">{first && last.weight - first.weight > 0 ? '+' : ''}{(last.weight - (first ? first.weight : 0)).toFixed(1)}kg</div>
                </div>
              </div>
            </div>
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
                  <div className="text-success small mt-2">{gorduraDelta > 0 ? '+' : ''}{gorduraDelta}%</div>
                </div>
              </div>
            </div>
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
                  <div className="text-success small mt-2">{massaDelta > 0 ? '+' : ''}{massaDelta}kg</div>
                </div>
              </div>
            </div>
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
                  <div className="text-success small mt-2">{first && last.waist - first.waist > 0 ? '+' : ''}{(last.waist - (first ? first.waist : 0)).toFixed(1)}cm</div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Metas / Progressos */}
      <div className="row g-4">

        {/* Gordura */}
        <div className="col-12 col-md-6">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <div className="d-flex justify-content-between mb-2">
                <h6 className="fw-semibold mb-0">Redução de Gordura Corporal</h6>
                <span className="text-muted small">18.2 / 15</span>
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

        {/* Massa */}
        <div className="col-12 col-md-6">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <div className="d-flex justify-content-between mb-2">
                <h6 className="fw-semibold mb-0">Ganho de Massa Muscular</h6>
                <span className="text-muted small">32.1 / 35</span>
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
