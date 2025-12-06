const db = require('../config/database');
const validator = require('validator');

class Patient {
  static async create(name, email, phone) {
    // Validate email
    if (!validator.isEmail(email)) {
      throw new Error('Email inválido');
    }

    // Validate phone (basic validation for 10 digits)
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''))) {
      throw new Error('Teléfono inválido. Debe contener 10 dígitos');
    }

    try {
      const result = await db.query(
        'INSERT INTO patients (name, email, phone) VALUES ($1, $2, $3) RETURNING *',
        [name, email, phone]
      );
      return result.rows[0];
    } catch (error) {
      if (error.code === '23505') { // Unique violation
        throw new Error('El email ya está registrado');
      }
      throw error;
    }
  }

  static async findById(id) {
    const result = await db.query('SELECT * FROM patients WHERE id = $1', [id]);
    return result.rows[0];
  }

  static async findByEmail(email) {
    const result = await db.query('SELECT * FROM patients WHERE email = $1', [email]);
    return result.rows[0];
  }

  static async findAll() {
    const result = await db.query('SELECT * FROM patients ORDER BY created_at DESC');
    return result.rows;
  }

  static async delete(id) {
    const result = await db.query('DELETE FROM patients WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];
  }
}

module.exports = Patient;