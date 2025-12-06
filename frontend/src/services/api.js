import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Patients
export const createPatient = (patientData) => api.post('/patients', patientData);
export const getPatients = () => api.get('/patients');
export const getPatientByEmail = (email) => api.get(`/patients/by-email?email=${email}`);
export const deletePatient = (id) => api.delete(`/patients/${id}`);

// Doctors
export const getDoctors = () => api.get('/doctors');
export const getDoctorById = (id) => api.get(`/doctors/${id}`);

// Appointments
export const createAppointment = (appointmentData) => api.post('/appointments', appointmentData);
export const getAppointments = () => api.get('/appointments');
export const getAppointmentsByPatient = (patientId) => api.get(`/appointments/patient/${patientId}`);
export const getAvailableSlots = (doctorId, date) => 
  api.get(`/appointments/available-slots?doctorId=${doctorId}&date=${date}`);
export const cancelAppointment = (id) => api.put(`/appointments/${id}/cancel`);

export default api;