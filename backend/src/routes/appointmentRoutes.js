const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');

// POST /api/appointments - Create new appointment
router.post('/', appointmentController.create);

// GET /api/appointments - Get all appointments
router.get('/', appointmentController.getAll);

// GET /api/appointments/available-slots - Get available time slots
router.get('/available-slots', appointmentController.getAvailableSlots);

// GET /api/appointments/patient/:patientId - Get appointments by patient
router.get('/patient/:patientId', appointmentController.getByPatient);

// GET /api/appointments/:id - Get appointment by ID
router.get('/:id', appointmentController.getById);

// PUT /api/appointments/:id/cancel - Cancel appointment
router.put('/:id/cancel', appointmentController.cancel);

module.exports = router;