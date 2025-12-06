const Appointment = require('../models/Appointment');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');

const appointmentController = {
  // Create a new appointment
  async create(req, res) {
    try {
      const { patientId, doctorId, appointmentDate, appointmentTime } = req.body;

      // Validation
      if (!patientId || !doctorId || !appointmentDate || !appointmentTime) {
        return res.status(400).json({ 
          error: 'Todos los campos son obligatorios' 
        });
      }

      // Verify patient exists
      const patient = await Patient.findById(patientId);
      if (!patient) {
        return res.status(404).json({ 
          error: 'Paciente no encontrado' 
        });
      }

      // Verify doctor exists
      const doctor = await Doctor.findById(doctorId);
      if (!doctor) {
        return res.status(404).json({ 
          error: 'Doctor no encontrado' 
        });
      }

      // Validate date is not in the past
      const appointmentDateTime = new Date(`${appointmentDate}T${appointmentTime}`);
      const now = new Date();
      
      if (appointmentDateTime < now) {
        return res.status(400).json({ 
          error: 'No se pueden agendar citas en el pasado' 
        });
      }

      const appointment = await Appointment.create(
        patientId, 
        doctorId, 
        appointmentDate, 
        appointmentTime
      );

      const fullAppointment = await Appointment.findById(appointment.id);
      
      res.status(201).json({
        message: 'Cita agendada exitosamente',
        appointment: fullAppointment
      });
    } catch (error) {
      console.error('Error creating appointment:', error);
      res.status(400).json({ 
        error: error.message || 'Error al agendar cita' 
      });
    }
  },

  // Get all appointments
  async getAll(req, res) {
    try {
      const appointments = await Appointment.findAll();
      res.json({ appointments });
    } catch (error) {
      console.error('Error fetching appointments:', error);
      res.status(500).json({ 
        error: 'Error al obtener citas' 
      });
    }
  },

  // Get appointment by ID
  async getById(req, res) {
    try {
      const { id } = req.params;
      const appointment = await Appointment.findById(id);
      
      if (!appointment) {
        return res.status(404).json({ 
          error: 'Cita no encontrada' 
        });
      }
      
      res.json({ appointment });
    } catch (error) {
      console.error('Error fetching appointment:', error);
      res.status(500).json({ 
        error: 'Error al obtener cita' 
      });
    }
  },

  // Get appointments by patient
  async getByPatient(req, res) {
    try {
      const { patientId } = req.params;
      const appointments = await Appointment.findByPatient(patientId);
      res.json({ appointments });
    } catch (error) {
      console.error('Error fetching appointments:', error);
      res.status(500).json({ 
        error: 'Error al obtener citas del paciente' 
      });
    }
  },

  // Get available slots
  async getAvailableSlots(req, res) {
    try {
      const { doctorId, date } = req.query;

      if (!doctorId || !date) {
        return res.status(400).json({ 
          error: 'doctorId y date son requeridos' 
        });
      }

      const availableSlots = await Appointment.getAvailableSlots(doctorId, date);
      res.json({ availableSlots });
    } catch (error) {
      console.error('Error fetching available slots:', error);
      res.status(500).json({ 
        error: 'Error al obtener horarios disponibles' 
      });
    }
  },

  // Cancel appointment
  async cancel(req, res) {
    try {
      const { id } = req.params;
      
      const appointment = await Appointment.findById(id);
      if (!appointment) {
        return res.status(404).json({ 
          error: 'Cita no encontrada' 
        });
      }

      if (appointment.status === 'cancelled') {
        return res.status(400).json({ 
          error: 'La cita ya está cancelada' 
        });
      }

      const cancelledAppointment = await Appointment.cancel(id);
      
      res.json({
        message: 'Cita cancelada exitosamente',
        appointment: cancelledAppointment
      });
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      res.status(500).json({ 
        error: 'Error al cancelar cita' 
      });
    }
  }
};

module.exports = appointmentController;