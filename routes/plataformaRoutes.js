const express = require('express');
const { getAllPlataformas } = require('../controllers/plataformaController');

const router = express.Router();

router.get('/plataformas', getAllPlataformas);

module.exports = router;