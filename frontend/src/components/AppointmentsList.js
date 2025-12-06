import React, { useState, useEffect } from 'react';
import { getAppointments, cancelAppointment } from '../services/api';

function AppointmentsList() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const response = await getAppointments();
      setAppointments(response.data.appointments);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      setMessage({ 
        type: 'error', 
        text: 'Error al cargar las citas' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm('¿Está seguro de cancelar esta cita?')) {
      return;
    }

    try {
      await cancelAppointment(id);
      setMessage({ 
        type: 'success', 
        text: 'Cita cancelada exitosamente' 
      });
      fetchAppointments();
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.error || 'Error al cancelar cita' 
      });
    }
  };

  const formatDate = (dateString) => {
  if (!dateString) return 'Fecha no disponible';
  
  try {
    // La fecha viene como "2025-12-10" desde PostgreSQL
    const parts = dateString.split('T')[0].split('-');
    const year = parseInt(parts[0]);
    const month = parseInt(parts[1]) - 1; // Los meses en JS son 0-11
    const day = parseInt(parts[2]);
    
    const date = new Date(year, month, day);
    
    // Verificar si la fecha es válida
    if (isNaN(date.getTime())) {
      console.error('Invalid date:', dateString);
      return dateString;
    }
    
    return date.toLocaleDateString('es-ES', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  } catch (error) {
    console.error('Error formatting date:', error, dateString);
    return dateString;
  }
};

  const formatTime = (timeString) => {
    if (!timeString) return 'Hora no disponible';
    return timeString.substring(0, 5);
  };

  if (loading) {
    return <div className="loading">Cargando citas</div>;
  }

  return (
    <div className="fade-in">
      <h2 style={{ textAlign: 'center', marginBottom: '30px', color: '#333' }}>
        Citas Agendadas
      </h2>

      {message.text && (
        <div className={message.type === 'success' ? 'success-message' : 'error-alert'}>
          {message.text}
        </div>
      )}

      {appointments.length === 0 ? (
  <div className="empty-state">
    <h3>No hay citas agendadas</h3>
    <p>Las citas que agendes aparecerán aquí</p>
  </div>
      ) : (
        <div className="cards-grid">
          {appointments.map(appointment => (
            <div key={appointment.id} className="card" data-testid={`appointment-card-${appointment.id}`}>
              <div className="card-header">
                <div className="card-title">
                  Cita #{appointment.id}
                </div>
                <span className={`status-badge status-${appointment.status}`}>
                  {appointment.status === 'scheduled' ? 'Agendada' : 'Cancelada'}
                </span>
              </div>
              
              <div className="card-content">
                <p><strong>Paciente:</strong> {appointment.patient_name}</p>
                <p><strong>Email:</strong> {appointment.patient_email}</p>
                <p><strong>Teléfono:</strong> {appointment.patient_phone}</p>
                <p><strong>Doctor:</strong> {appointment.doctor_name}</p>
                <p><strong>Especialidad:</strong> {appointment.doctor_specialty}</p>
                <p><strong>Fecha:</strong> {formatDate(appointment.appointment_date)}</p>
                <p><strong>Hora:</strong> {formatTime(appointment.appointment_time)}</p>
              </div>

              {appointment.status === 'scheduled' && (
                <div className="card-footer">
                  <button 
                    className="btn btn-danger"
                    onClick={() => handleCancel(appointment.id)}
                    data-testid={`cancel-button-${appointment.id}`}
                  >
                    Cancelar Cita
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AppointmentsList;