import React, { useState, useEffect } from 'react';
import { getDoctors, getAvailableSlots, createAppointment, getPatientByEmail } from '../services/api';

function AppointmentForm({ onSuccess }) {
  const [doctors, setDoctors] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [formData, setFormData] = useState({
    patientEmail: '',
    doctorId: '',
    appointmentDate: '',
    appointmentTime: ''
  });
  const [patientId, setPatientId] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loadingSlots, setLoadingSlots] = useState(false);

  useEffect(() => {
    fetchDoctors();
  }, []);

  useEffect(() => {
    if (formData.doctorId && formData.appointmentDate) {
      fetchAvailableSlots();
    }
  }, [formData.doctorId, formData.appointmentDate]);

  const fetchDoctors = async () => {
    try {
      const response = await getDoctors();
      setDoctors(response.data.doctors);
    } catch (error) {
      console.error('Error fetching doctors:', error);
    }
  };

  const fetchAvailableSlots = async () => {
    setLoadingSlots(true);
    try {
      const response = await getAvailableSlots(formData.doctorId, formData.appointmentDate);
      setAvailableSlots(response.data.availableSlots);
    } catch (error) {
      console.error('Error fetching slots:', error);
      setAvailableSlots([]);
    } finally {
      setLoadingSlots(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.patientEmail.trim()) {
      newErrors.patientEmail = 'El email es obligatorio';
    }

    if (!formData.doctorId) {
      newErrors.doctorId = 'Seleccione un doctor';
    }

    if (!formData.appointmentDate) {
      newErrors.appointmentDate = 'Seleccione una fecha';
    }

    if (!formData.appointmentTime) {
      newErrors.appointmentTime = 'Seleccione un horario';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    // Reset time when doctor or date changes
    if (name === 'doctorId' || name === 'appointmentDate') {
      setFormData(prev => ({
        ...prev,
        appointmentTime: ''
      }));
    }
  };

  const handleTimeSelect = (time) => {
    setFormData(prev => ({
      ...prev,
      appointmentTime: time
    }));
    if (errors.appointmentTime) {
      setErrors(prev => ({
        ...prev,
        appointmentTime: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // First, find patient by email
      const patientResponse = await getPatientByEmail(formData.patientEmail);
      const patient = patientResponse.data.patient;

      // Then create appointment
      const appointmentData = {
        patientId: patient.id,
        doctorId: parseInt(formData.doctorId),
        appointmentDate: formData.appointmentDate,
        appointmentTime: formData.appointmentTime
      };

      await createAppointment(appointmentData);
      
      setMessage({ 
        type: 'success', 
        text: '¡Cita agendada exitosamente!' 
      });
      
      setFormData({
        patientEmail: '',
        doctorId: '',
        appointmentDate: '',
        appointmentTime: ''
      });
      setAvailableSlots([]);
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.error || 'Error al agendar cita' 
      });
    } finally {
      setLoading(false);
    }
  };

  // Get minimum date (today)
  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  return (
    <div className="form-container fade-in">
      <h2 style={{ textAlign: 'center', marginBottom: '30px', color: '#333' }}>
        Agendar Cita Médica
      </h2>

      {message.text && (
        <div className={message.type === 'success' ? 'success-message' : 'error-alert'}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="patientEmail">Email del Paciente *</label>
          <input
            type="email"
            id="patientEmail"
            name="patientEmail"
            value={formData.patientEmail}
            onChange={handleChange}
            className={errors.patientEmail ? 'error' : ''}
            placeholder="Email registrado previamente"
            data-testid="appointment-email-input"
          />
          {errors.patientEmail && <span className="error-message">{errors.patientEmail}</span>}
          <small style={{ color: '#666', fontSize: '0.85rem' }}>
            Debe estar registrado previamente
          </small>
        </div>

        <div className="form-group">
          <label htmlFor="doctorId">Doctor *</label>
          <select
            id="doctorId"
            name="doctorId"
            value={formData.doctorId}
            onChange={handleChange}
            className={errors.doctorId ? 'error' : ''}
            data-testid="appointment-doctor-select"
          >
            <option value="">Seleccione un doctor</option>
            {doctors.map(doctor => (
              <option key={doctor.id} value={doctor.id}>
                {doctor.name} - {doctor.specialty}
              </option>
            ))}
          </select>
          {errors.doctorId && <span className="error-message">{errors.doctorId}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="appointmentDate">Fecha *</label>
          <input
            type="date"
            id="appointmentDate"
            name="appointmentDate"
            value={formData.appointmentDate}
            onChange={handleChange}
            min={getMinDate()}
            className={errors.appointmentDate ? 'error' : ''}
            data-testid="appointment-date-input"
          />
          {errors.appointmentDate && <span className="error-message">{errors.appointmentDate}</span>}
        </div>

        {formData.doctorId && formData.appointmentDate && (
          <div className="form-group">
            <label>Horarios Disponibles *</label>
            {loadingSlots ? (
              <div className="loading">Cargando horarios disponibles</div>
            ) : availableSlots.length > 0 ? (
              <div className="time-slots">
                {availableSlots.map(slot => (
                  <button
                    key={slot}
                    type="button"
                    className={`time-slot ${formData.appointmentTime === slot ? 'selected' : ''}`}
                    onClick={() => handleTimeSelect(slot)}
                    data-testid={`time-slot-${slot}`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            ) : (
              <div className="error-alert">
                No hay horarios disponibles para esta fecha
              </div>
            )}
            {errors.appointmentTime && <span className="error-message">{errors.appointmentTime}</span>}
          </div>
        )}

        <button 
          type="submit" 
          className="btn btn-primary btn-block"
          disabled={loading || !formData.appointmentTime}
          data-testid="submit-appointment-button"
        >
          {loading ? 'Agendando...' : 'Agendar Cita'}
        </button>
      </form>
    </div>
  );
}

export default AppointmentForm;