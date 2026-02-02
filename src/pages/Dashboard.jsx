import React from 'react';

const DashboardPage = () => {
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

        {[
          { label: 'Peso', value: '75.5', unit: 'kg', delta: '+0.7kg', icon: 'speedometer2' },
          { label: 'Gordura Corporal', value: '18.2', unit: '%', delta: '+0.6%', icon: 'heart-pulse' },
          { label: 'Massa Muscular', value: '32.1', unit: 'kg', delta: '+0.3kg', icon: 'lightning-charge' },
          { label: 'Cintura', value: '85', unit: 'cm', delta: '+1.0cm', icon: 'person' }
        ].map((item, i) => (
          <div className="col-12 col-md-6 col-lg-3" key={i}>
            <div className="card h-100 shadow-sm border-0">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <i className={`bi bi-${item.icon} text-primary fs-3`}></i>
                  <span className="text-muted small fw-medium">{item.label}</span>
                </div>

                <div className="d-flex align-items-baseline">
                  <span className="fs-2 fw-bold">{item.value}</span>
                  <span className="text-muted ms-1">{item.unit}</span>
                </div>

                <div className="text-success small mt-2">{item.delta}</div>
              </div>
            </div>
          </div>
        ))}

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
