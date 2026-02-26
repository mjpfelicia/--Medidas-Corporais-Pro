import { useState } from 'react';
import Header from './components/layout/Header';
import Dashboard from './pages/Dashboard';
import Measurements from './pages/Measurements';
import Progress from './pages/Progress';
import Profile from './pages/Profile';
import Goals from './pages/Goals';
import LoginPage from './pages/Login';
import { useMeasurements } from './hooks/useMeasurements';
import { useAuth } from './hooks/useAuth';

const App = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { measurements, addMeasurement } = useMeasurements();
  const { isAuthenticated, isLoading, logout } = useAuth();

  if (isLoading) {
    return (
      <div className="min-vh-100 bg-light d-flex align-items-center justify-content-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Carregando...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginPage onLoginSuccess={() => window.location.reload()} />;
  }

  return (
    <div className="min-vh-100 bg-light">
      <Header activeTab={activeTab} onTabChange={setActiveTab} onLogout={logout} />

      <main className="container py-4">
        {activeTab === 'dashboard' && <Dashboard measurements={measurements} />}
        {activeTab === 'measurements' && (
          <Measurements measurements={measurements} onAdd={addMeasurement} />
        )}
        {activeTab === 'progress' && <Progress measurements={measurements} />}
        {activeTab === 'profile' && <Profile measurements={measurements} />}
        {activeTab === 'goals' && <Goals />}
      </main>
    </div>
  );
};

export default App;
