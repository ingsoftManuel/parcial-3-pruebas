const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController');

// POST /api/patients - Create new patient
router.post('/', patientController.create);

// GET /api/patients - Get all patients
router.get('/', patientController.getAll);

// GET /api/patients/by-email?email=xxx - Get patient by email
router.get('/by-email', patientController.getByEmail);

// GET /api/patients/:id - Get patient by ID
router.get('/:id', patientController.getById);

// DELETE /api/patients/:id - Delete patient
router.delete('/:id', patientController.delete);

module.exports = router;