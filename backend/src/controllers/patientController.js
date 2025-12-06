const Patient = require('../models/Patient');

const patientController = {
  // Create a new patient
  async create(req, res) {
    try {
      const { name, email, phone } = req.body;

      // Validation
      if (!name || !email || !phone) {
        return res.status(400).json({ 
          error: 'Todos los campos son obligatorios' 
        });
      }

      const patient = await Patient.create(name.trim(), email.trim(), phone.trim());
      
      res.status(201).json({
        message: 'Paciente registrado exitosamente',
        patient
      });
    } catch (error) {
      console.error('Error creating patient:', error);
      res.status(400).json({ 
        error: error.message || 'Error al registrar paciente' 
      });
    }
  },

  // Get all patients
  async getAll(req, res) {
    try {
      const patients = await Patient.findAll();
      res.json({ patients });
    } catch (error) {
      console.error('Error fetching patients:', error);
      res.status(500).json({ 
        error: 'Error al obtener pacientes' 
      });
    }
  },

  // Get patient by ID
  async getById(req, res) {
    try {
      const { id } = req.params;
      const patient = await Patient.findById(id);
      
      if (!patient) {
        return res.status(404).json({ 
          error: 'Paciente no encontrado' 
        });
      }
      
      res.json({ patient });
    } catch (error) {
      console.error('Error fetching patient:', error);
      res.status(500).json({ 
        error: 'Error al obtener paciente' 
      });
    }
  },

  // Get patient by email
  async getByEmail(req, res) {
    try {
      const { email } = req.query;
      
      if (!email) {
        return res.status(400).json({ 
          error: 'Email es requerido' 
        });
      }

      const patient = await Patient.findByEmail(email);
      
      if (!patient) {
        return res.status(404).json({ 
          error: 'Paciente no encontrado' 
        });
      }
      
      res.json({ patient });
    } catch (error) {
      console.error('Error fetching patient:', error);
      res.status(500).json({ 
        error: 'Error al obtener paciente' 
      });
    }
  },

  // Delete patient
  async delete(req, res) {
    try {
      const { id } = req.params;
      const patient = await Patient.delete(id);
      
      if (!patient) {
        return res.status(404).json({ 
          error: 'Paciente no encontrado' 
        });
      }
      
      res.json({ 
        message: 'Paciente eliminado exitosamente',
        patient 
      });
    } catch (error) {
      console.error('Error deleting patient:', error);
      res.status(500).json({ 
        error: 'Error al eliminar paciente' 
      });
    }
  }
};

module.exports = patientController;