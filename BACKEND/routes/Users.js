const express = require('express');
const router = express.Router();
const usersCtrl = require('../controllers/Users');

//TO BE IMPLEMENTED - LOGIN IS WITH VERIFICATION OF THE PASSWORD

router.post('/login', usersCtrl.loginUser)

//CRYPTAGE OF THE PASSWORD - Middleware POST - Signup 

router.post('/signup', usersCtrl.signupUser)

module.exports = router;


