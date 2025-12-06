import React, { useState } from 'react';
import { createPatient } from '../services/api';

function PatientForm({ onSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es obligatorio';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'El email es obligatorio';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    const phoneRegex = /^\d{10}$/;
    const cleanPhone = formData.phone.replace(/[\s\-\(\)]/g, '');
    if (!formData.phone.trim()) {
      newErrors.phone = 'El teléfono es obligatorio';
    } else if (!phoneRegex.test(cleanPhone)) {
      newErrors.phone = 'El teléfono debe tener 10 dígitos';
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
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
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
      const response = await createPatient(formData);
      setMessage({ 
        type: 'success', 
        text: '¡Paciente registrado exitosamente!' 
      });
      setFormData({ name: '', email: '', phone: '' });
      
      if (onSuccess) {
        onSuccess(response.data.patient);
      }
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.error || 'Error al registrar paciente' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container fade-in">
      <h2 style={{ textAlign: 'center', marginBottom: '30px', color: '#333' }}>
        Registrar Paciente
      </h2>

      {message.text && (
        <div className={message.type === 'success' ? 'success-message' : 'error-alert'}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Nombre Completo *</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={errors.name ? 'error' : ''}
            placeholder="Ej: Juan Pérez"
            data-testid="patient-name-input"
          />
          {errors.name && <span className="error-message">{errors.name}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="email">Email *</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={errors.email ? 'error' : ''}
            placeholder="Ej: juan@example.com"
            data-testid="patient-email-input"
          />
          {errors.email && <span className="error-message">{errors.email}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="phone">Teléfono (10 dígitos) *</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className={errors.phone ? 'error' : ''}
            placeholder="Ej: 3001234567"
            maxLength="10"
            data-testid="patient-phone-input"
          />
          {errors.phone && <span className="error-message">{errors.phone}</span>}
        </div>

        <button 
          type="submit" 
          className="btn btn-primary btn-block"
          disabled={loading}
          data-testid="submit-patient-button"
        >
          {loading ? 'Registrando...' : 'Registrar Paciente'}
        </button>
      </form>
    </div>
  );
}

export default PatientForm;