const express = require('express');
const router = express.Router();
const { protectUser } = require('../jwt/auth')

router.post('/login', require('../controller/userController').login);
router.post('/apply-for-late-coming', require('../controller/userController').applyForLateComing);
router.get('/get-attendance-data', require('../controller/userController').getAttendanceData);
router.post('/checkIn-checkOut', protectUser, require('../controller/userController').checkInCheckOut);


module.exports = router;