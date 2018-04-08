const express = require('express')
const router = express.Router();
const mongoose = require('mongoose');
const {ensureAuthenticated, ensureAdmin} = require('../helpers/auth') //this is called destructuring
const fs = require('fs');
const moment = require('moment');
const path = require('path');
const favicon = require('serve-favicon');

var log = path.dirname(require.main.filename) + '/logs/projects.log';

module.exports = router;
//For temporary or single non categorized routes only.

require('../models/Announcement');
const Announcement = mongoose.model('Announcement');

//index route 
router.get('/', (req,res) => {
	Announcement.find({})
	.sort({Date:'asc'})
	.then(Announcements =>{
		res.render('index',{ 	//pass Projects to the page into tag with the name "Projects"
			announcements:Announcements,
			title: 'Metu Developers'
		})
	})
});

router.get('/duckduckgoose', (req,res) => {
	res.render('scavenger')
});









