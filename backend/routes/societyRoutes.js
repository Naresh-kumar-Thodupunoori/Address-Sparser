const express = require('express');
const { getSocieties, checkServiceability } = require('../controllers/societyController');
const router = express.Router();

router.get('/', getSocieties);
router.post('/check', checkServiceability);

module.exports = router;
