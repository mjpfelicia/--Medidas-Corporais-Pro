import React, { useState, useEffect } from 'react';
import './Header.css';

const Header = ({ activeTab, onTabChange, onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleTabChange = (tab) => {
    onTabChange(tab);
    setIsMenuOpen(false);
  };

  const NavButton = ({ icon, label, tabName }) => (
    <button
      className={`nav-btn w-100 d-flex align-items-center gap-2 px-3 py-2 transition-all ${
        activeTab === tabName ? 'btn-primary text-white' : 'btn-outline-secondary text-dark'
      }`}
      onClick={() => handleTabChange(tabName)}
    >
      {icon}
      <span className="nav-label">{label}</span>
    </button>
  );

  return (
    <header className={`header-wrapper bg-white border-bottom shadow-sm ${isScrolled ? 'scrolled' : ''}`}>
      <div className="container-fluid px-3 px-md-4">
        <div className="header-content d-flex justify-content-between align-items-center py-3 py-md-2">

          {/* Logo */}
          <div className="logo-section d-flex align-items-center gap-2 flex-shrink-0">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="28"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-primary flex-shrink-0"
              viewBox="0 0 24 24"
            >
              <path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2" />
            </svg>
            <h1 className="h6 h5-md mb-0 fw-bold text-nowrap logo-text">Medidas Corporais Pro</h1>
          </div>

          {/* Menu Hambúrguer (Mobile) */}
          <button
            className="btn btn-link text-dark p-0 d-lg-none flex-shrink-0"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Menu"
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
            >
              <line x1="4" y1="6" x2="20" y2="6"></line>
              <line x1="4" y1="12" x2="20" y2="12"></line>
              <line x1="4" y1="18" x2="20" y2="18"></line>
            </svg>
          </button>

          {/* Navegação Desktop */}
          <nav className="nav-desktop d-none d-lg-flex gap-2">
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

            <button
              className={`btn btn-sm ${activeTab === 'goals' ? 'btn-primary' : 'btn-outline-secondary'}`}
              onClick={() => onTabChange('goals')}
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
              Metas
            </button>

            <button
              className={`btn btn-sm ${activeTab === 'profile' ? 'btn-primary' : 'btn-outline-secondary'}`}
              onClick={() => onTabChange('profile')}
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
                className="lucide lucide-user w-4 h-4 mr-2"
                aria-hidden="true"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              Perfil
            </button>

            <button
              className="btn btn-sm btn-outline-danger"
              onClick={onLogout}
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
                className="lucide lucide-log-out w-4 h-4 mr-2"
                aria-hidden="true"
              >
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
              Sair
            </button>
          </nav>
        </div>

        {/* Navegação Mobile */}
        <nav className={`nav-mobile d-lg-none ${isMenuOpen ? 'show' : ''}`}>
          <div className="d-flex flex-column gap-2 pb-3">
            <NavButton
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M16 7h6v6"></path>
                  <path d="m22 7-8.5 8.5-5-5L2 17"></path>
                </svg>
              }
              label="Acompanhamento"
              tabName="dashboard"
            />

            <NavButton
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21.3 15.3a2.4 2.4 0 0 1 0 3.4l-2.6 2.6a2.4 2.4 0 0 1-3.4 0L2.7 8.7a2.41 2.41 0 0 1 0-3.4l2.6-2.6a2.41 2.41 0 0 1 3.4 0Z"></path>
                  <path d="m14.5 12.5 2-2"></path>
                  <path d="m11.5 9.5 2-2"></path>
                  <path d="m8.5 6.5 2-2"></path>
                  <path d="m17.5 15.5 2-2"></path>
                </svg>
              }
              label="Medições"
              tabName="measurements"
            />

            <NavButton
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <circle cx="12" cy="12" r="6"></circle>
                  <circle cx="12" cy="12" r="2"></circle>
                </svg>
              }
              label="Progresso"
              tabName="progress"
            />

            <NavButton
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <circle cx="12" cy="12" r="6"></circle>
                  <circle cx="12" cy="12" r="2"></circle>
                </svg>
              }
              label="Metas"
              tabName="goals"
            />

            <NavButton
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              }
              label="Perfil"
              tabName="profile"
            />

            <button
              className="nav-btn w-100 d-flex align-items-center gap-2 px-3 py-2 transition-all btn-outline-danger text-danger"
              onClick={() => {
                onLogout();
                setIsMenuOpen(false);
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
              <span className="nav-label">Sair</span>
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;