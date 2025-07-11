const db = require('../config/db');

const getAllPlataformas = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM plataformas');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getAllPlataformas };