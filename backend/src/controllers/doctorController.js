const Doctor = require('../models/Doctor');

const doctorController = {
  // Get all doctors
  async getAll(req, res) {
    try {
      const doctors = await Doctor.findAll();
      res.json({ doctors });
    } catch (error) {
      console.error('Error fetching doctors:', error);
      res.status(500).json({ 
        error: 'Error al obtener doctores' 
      });
    }
  },

  // Get doctor by ID
  async getById(req, res) {
    try {
      const { id } = req.params;
      const doctor = await Doctor.findById(id);
      
      if (!doctor) {
        return res.status(404).json({ 
          error: 'Doctor no encontrado' 
        });
      }
      
      res.json({ doctor });
    } catch (error) {
      console.error('Error fetching doctor:', error);
      res.status(500).json({ 
        error: 'Error al obtener doctor' 
      });
    }
  }
};

module.exports = doctorController;