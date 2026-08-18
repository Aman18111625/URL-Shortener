const express = require('express');
const {handleUserSignUp, handleLogin} = require('../controllers/user')

const router = express.Router();

// Public routes (no auth required)
router.get('/login', async (req, res) => {
    return res.render("login")
})

router.get('/signup', async (req, res) => {
    return res.render("signup")
})

router.post('/signup', handleUserSignUp)

router.post('/login', handleLogin)

module.exports = router;