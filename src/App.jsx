import { useState } from 'react';
import Header from './components/layout/Header';
import Dashboard from './pages/Dashboard';
import Measurements from './pages/Measurements';
import Progress from './pages/Progress';
import { useMeasurements } from './hooks/useMeasurements';

const App = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { measurements, addMeasurement } = useMeasurements();

  return (
    <div className="min-vh-100 bg-light">
      <Header activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="container py-4">
        {activeTab === 'dashboard' && <Dashboard measurements={measurements} />}
        {activeTab === 'measurements' && (
          <Measurements measurements={measurements} onAdd={addMeasurement} />
        )}
        {activeTab === 'progress' && <Progress measurements={measurements} />}
      </main>
    </div>
  );
};

export default App;
