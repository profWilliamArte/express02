const db = require('../config/db');

const getAllJuegos = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM juegos');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getAllJuegos };