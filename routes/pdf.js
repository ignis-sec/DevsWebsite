const express = require('express')
const router = express.Router();
const mongoose = require('mongoose');
const {ensureAuthenticated, ensureAdmin, ensureVerified} = require('../helpers/auth') //this is called destructuring
const fs = require('fs');
const moment = require('moment');
const path = require('path');
const favicon = require('serve-favicon');


module.exports = router;

//icon
router.use(favicon('./public/Images/favicon.ico'));


router.get('/:dir', ensureAdmin, (req,res) =>{
	res.sendFile(path.join(path.dirname(require.main.filename) + '/uploaded/' +  decodeURI(decodeURIComponent(req.params.dir))))

})
