import React, { useState } from 'react';
import PatientForm from './components/PatientForm';
import AppointmentForm from './components/AppointmentForm';
import AppointmentsList from './components/AppointmentsList';
import './styles/App.css';

function App() {
  const [activeTab, setActiveTab] = useState('register');

  const renderContent = () => {
    switch (activeTab) {
      case 'register':
        return <PatientForm onSuccess={() => setActiveTab('appointment')} />;
      case 'appointment':
        return <AppointmentForm onSuccess={() => setActiveTab('list')} />;
      case 'list':
        return <AppointmentsList />;
      default:
        return <PatientForm />;
    }
  };

  return (
    <div className="App">
      <header className="app-header">
        <h1>Sistema de Citas Médicas</h1>
        <p>Gestiona tus citas médicas de forma fácil y rápida</p>
      </header>

      <div className="nav-tabs">
        <button 
          className={`nav-tab ${activeTab === 'register' ? 'active' : ''}`}
          onClick={() => setActiveTab('register')}
          data-testid="tab-register"
        >
          Registrar Paciente
        </button>
        <button 
          className={`nav-tab ${activeTab === 'appointment' ? 'active' : ''}`}
          onClick={() => setActiveTab('appointment')}
          data-testid="tab-appointment"
        >
          Agendar Cita
        </button>
        <button 
          className={`nav-tab ${activeTab === 'list' ? 'active' : ''}`}
          onClick={() => setActiveTab('list')}
          data-testid="tab-list"
        >
          Ver Citas
        </button>
      </div>

      <div className="container">
        {renderContent()}
      </div>
    </div>
  );
}

export default App;