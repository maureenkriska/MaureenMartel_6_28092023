const express = require('express')
const router = express.Router()
const userCtrl = require('../controllers/user')
const pwdControl = require('../middleware/password')


router.post('/signup', pwdControl, userCtrl.signup)
router.post('/login', userCtrl.login)

module.exports = router