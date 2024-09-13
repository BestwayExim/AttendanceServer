const express = require('express');
const router = express.Router();
const { protectUser } = require('../jwt/auth')

router.post('/login', require('../controller/userController').login);
router.post('/apply-for-late-coming', protectUser, require('../controller/userController').applyForLateComing);


module.exports = router;