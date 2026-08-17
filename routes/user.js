const express = require('express');
const {handleUserSignUp, handleLogin} = require('../controllers/user')

const router = express.Router();

router.post('/signup', handleUserSignUp)

router.post('/login', handleLogin)

module.exports = router;