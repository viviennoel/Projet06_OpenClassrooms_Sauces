const express = require('express');
const router = express.Router();
const saucesCtrl = require('../controllers/Sauces');
const multer = require('../Middleware/Multer-config');
const auth = require('../Middleware/Auth');

//Middleware POST - Sauces 

router.post('/', auth, multer, saucesCtrl.createSauce)

//Middleware PUT - sauce ID specific

router.put('/:id', auth, multer, saucesCtrl.modifySauce);

//Middleware DELETE - Sauce ID specific

router.delete('/:id', auth, saucesCtrl.deleteSauce);

//Middleware GET all sauces

router.get('/', auth, saucesCtrl.displaySauce);

//Middleware GET one sauce

router.get('/:id', auth, saucesCtrl.findSauce);

//Middleware POST - Like the sauce

router.post('/:id/like', auth, saucesCtrl.likeSauce)

module.exports = router;