const express = require('express');
const {RegisterUser,UserLogin,GetProfile} = require('../controller/userController');
const router = express.Router();


router.post('/register',RegisterUser);
router.post('/login',UserLogin)
router.get('/profile', GetProfile)



module.exports = router;