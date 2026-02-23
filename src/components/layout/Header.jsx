import React from 'react';
import './Header.css';

const Header = ({ activeTab, onTabChange }) => {
  return (
    <header className="bg-white border-bottom shadow-sm">
      <div className="container">
        <div className="d-flex justify-content-between align-items-center" style={{ height: 64 }}>

          {/* Logo */}
          <div className="d-flex align-items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="28"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-primary me-2"
              viewBox="0 0 24 24"
            >
              <path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2" />
            </svg>
            <h1 className="h5 mb-0 fw-bold">Medidas Corporais Pro</h1>
          </div>

          {/* Navegação */}
          <nav className="d-flex gap-3">
            <button
              className={`btn btn-sm ${activeTab === 'dashboard' ? 'btn-primary' : 'btn-outline-secondary'}`}
              onClick={() => onTabChange('dashboard')}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-trending-up w-4 h-4 mr-2"
                aria-hidden="true"
              >
                <path d="M16 7h6v6"></path>
                <path d="m22 7-8.5 8.5-5-5L2 17"></path>
              </svg>
              Acompanhamento
            </button>

            <button
              className={`btn btn-sm ${activeTab === 'measurements' ? 'btn-primary' : 'btn-outline-secondary'}`}
              onClick={() => onTabChange('measurements')}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-ruler w-4 h-4 mr-2"
                aria-hidden="true"
              >
                <path d="M21.3 15.3a2.4 2.4 0 0 1 0 3.4l-2.6 2.6a2.4 2.4 0 0 1-3.4 0L2.7 8.7a2.41 2.41 0 0 1 0-3.4l2.6-2.6a2.41 2.41 0 0 1 3.4 0Z"></path>
                <path d="m14.5 12.5 2-2"></path>
                <path d="m11.5 9.5 2-2"></path>
                <path d="m8.5 6.5 2-2"></path>
                <path d="m17.5 15.5 2-2"></path>
              </svg>
              Medições
            </button>

            <button
              className={`btn btn-sm ${activeTab === 'progress' ? 'btn-primary' : 'btn-outline-secondary'}`}
              onClick={() => onTabChange('progress')}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-target w-4 h-4 mr-2"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <circle cx="12" cy="12" r="6"></circle>
                <circle cx="12" cy="12" r="2"></circle>
              </svg>
              Progresso
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;