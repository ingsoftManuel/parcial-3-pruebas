const db = require('../config/database');

class Doctor {
  static async findAll() {
    const result = await db.query('SELECT * FROM doctors ORDER BY name');
    return result.rows;
  }

  static async findById(id) {
    const result = await db.query('SELECT * FROM doctors WHERE id = $1', [id]);
    return result.rows[0];
  }

  static async create(name, specialty) {
    const result = await db.query(
      'INSERT INTO doctors (name, specialty) VALUES ($1, $2) RETURNING *',
      [name, specialty]
    );
    return result.rows[0];
  }
}

module.exports = Doctor;