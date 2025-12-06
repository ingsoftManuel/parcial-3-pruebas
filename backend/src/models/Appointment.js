const db = require('../config/database');

class Appointment {
  static async create(patientId, doctorId, appointmentDate, appointmentTime) {
    // Check if the time slot is already taken
    const conflict = await this.checkConflict(doctorId, appointmentDate, appointmentTime);
    if (conflict) {
      throw new Error('El horario ya está ocupado para este doctor');
    }

    try {
      const result = await db.query(
        `INSERT INTO appointments (patient_id, doctor_id, appointment_date, appointment_time, status) 
         VALUES ($1, $2, $3, $4, 'scheduled') RETURNING *`,
        [patientId, doctorId, appointmentDate, appointmentTime]
      );
      return result.rows[0];
    } catch (error) {
      if (error.code === '23505') { // Unique violation
        throw new Error('El horario ya está ocupado para este doctor');
      }
      throw error;
    }
  }

  static async checkConflict(doctorId, appointmentDate, appointmentTime) {
    const result = await db.query(
      `SELECT * FROM appointments 
       WHERE doctor_id = $1 
       AND appointment_date = $2 
       AND appointment_time = $3 
       AND status != 'cancelled'`,
      [doctorId, appointmentDate, appointmentTime]
    );
    return result.rows.length > 0;
  }

  static async findAll() {
    const result = await db.query(
      `SELECT 
        a.id,
        a.appointment_date,
        a.appointment_time,
        a.status,
        a.created_at,
        p.id as patient_id,
        p.name as patient_name,
        p.email as patient_email,
        p.phone as patient_phone,
        d.id as doctor_id,
        d.name as doctor_name,
        d.specialty as doctor_specialty
       FROM appointments a
       JOIN patients p ON a.patient_id = p.id
       JOIN doctors d ON a.doctor_id = d.id
       ORDER BY a.appointment_date DESC, a.appointment_time DESC`
    );
    return result.rows;
  }

  static async findById(id) {
    const result = await db.query(
      `SELECT 
        a.id,
        a.appointment_date,
        a.appointment_time,
        a.status,
        a.created_at,
        p.id as patient_id,
        p.name as patient_name,
        p.email as patient_email,
        p.phone as patient_phone,
        d.id as doctor_id,
        d.name as doctor_name,
        d.specialty as doctor_specialty
       FROM appointments a
       JOIN patients p ON a.patient_id = p.id
       JOIN doctors d ON a.doctor_id = d.id
       WHERE a.id = $1`,
      [id]
    );
    return result.rows[0];
  }

  static async findByPatient(patientId) {
    const result = await db.query(
      `SELECT 
        a.id,
        a.appointment_date,
        a.appointment_time,
        a.status,
        a.created_at,
        d.id as doctor_id,
        d.name as doctor_name,
        d.specialty as doctor_specialty
       FROM appointments a
       JOIN doctors d ON a.doctor_id = d.id
       WHERE a.patient_id = $1
       ORDER BY a.appointment_date DESC, a.appointment_time DESC`,
      [patientId]
    );
    return result.rows;
  }

  static async cancel(id) {
    const result = await db.query(
      `UPDATE appointments SET status = 'cancelled' WHERE id = $1 RETURNING *`,
      [id]
    );
    return result.rows[0];
  }

  static async getAvailableSlots(doctorId, date) {
    // Define working hours (9 AM to 5 PM, 1-hour slots)
    const workingHours = [
      '09:00', '10:00', '11:00', '12:00', 
      '13:00', '14:00', '15:00', '16:00', '17:00'
    ];

    // Get occupied slots
    const result = await db.query(
      `SELECT appointment_time FROM appointments 
       WHERE doctor_id = $1 AND appointment_date = $2 AND status != 'cancelled'`,
      [doctorId, date]
    );

    const occupiedSlots = result.rows.map(row => 
      row.appointment_time.substring(0, 5)
    );

    // Return available slots
    return workingHours.filter(slot => !occupiedSlots.includes(slot));
  }
}

module.exports = Appointment;