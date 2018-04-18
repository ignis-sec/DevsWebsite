const express = require('express')
const router = express.Router();
const mongoose = require('mongoose');
const {ensureAuthenticated, ensureAdmin} = require('../helpers/auth') //this is called destructuring
const fs = require('fs');
const moment = require('moment');
const path = require('path')
const favicon = require('serve-favicon');

var log = path.dirname(require.main.filename) + '/logs/contacts.log';

const mailman = require('../config/mailman');

module.exports = router;
//icon
router.use(favicon('./public/Images/favicon.ico'));

var log = path.dirname(require.main.filename) + '/logs/contacts.log';

require('../models/Contact');
const Contact = mongoose.model('Contact');



router.get('/new',  ensureAdmin,  (req,res) => {
	res.render('contact/addContact', {title: 'Add Contact - Metu Developers',
      layout: res.locals.bMobile ? 'mobile' : 'main'})
});


router.get('/list', ensureAdmin, (req,res) => {
	Contact.find({})
	.sort({userID: -1})
	.then(Contacts =>{
		res.render('contact/contacts',{ 	//pass Projects to the page into tag with the name "Projects"
			Contacts:Contacts,
			title: 'Contact List - Metu Developers',
      layout: res.locals.bMobile ? 'mobile' : 'main'
		})
	})
});



router.post('/new',  ensureAdmin,  (req,res) => {
	const newContact = new Contact({
		Name: req.body.name,
		Phone:req.body.phone,
		Mail: req.body.mail,
		Info: req.body.info
	});
	newContact.save();
		//LOG
		fs.appendFile(log, "[" + moment().format('YYYY-MM-DD: HH:mm:ss') + "] " + 
			"NEW CONTACT ADDED:   by "+ req.user.userID +" "+req.user.name +" "+req.user.surname+", Name: "+ req.body.name +" >>>IP: "+ req.connection.remoteAddress +"\r\n",(err)=>{if(err) console.log(err);});
		//LOG
	req.flash('success_msg', 'Contact added.')
	res.redirect('/contact/list');

});

router.get('/:id',  ensureAdmin,  (req,res) => {
	Contact.findOne({_id:req.params.id}).then((Contact)=>{
		res.render('contact/editContact', {Contact:Contact,title: 'Edit Contact - Metu Developers',
      layout: res.locals.bMobile ? 'mobile' : 'main'})
	})
	
});

router.delete('/:id',  ensureAdmin,  (req,res) => {
	Contact.findOne({_id:req.params.id}).then((Contact)=>{
		Contact.remove();
		//LOG
		fs.appendFile(log, "[" + moment().format('YYYY-MM-DD: HH:mm:ss') + "] " + 
			"CONTACT REMOVED:   by "+ req.user.userID +" "+req.user.name +" "+req.user.surname+", Name: "+ req.body.name +" >>>IP: "+ req.connection.remoteAddress +"\r\n",(err)=>{if(err) console.log(err);});
		//LOG
		res.redirect('/contact/list');
	})
	
});


router.put('/:id',  ensureAdmin,  (req,res) => {
	Contact.findOne({
		_id: req.params.id
	})
	.then(Contact =>{ //set new values to the db index
		Contact.Name = req.body.name;
		Contact.Phone =req.body.phone;
		Contact.Mail = req.body.mail;
		Contact.Info = req.body.info;
		Contact.save();
		//LOG
		fs.appendFile(log, "[" + moment().format('YYYY-MM-DD: HH:mm:ss') + "] " + 
			"CONTACT EDITED:  by "+ req.user.userID +" "+req.user.name +" "+req.user.surname+", Contact: "+ Contact.Name +" >>>IP: "+ req.connection.remoteAddress +"\r\n",(err)=>{if(err) console.log(err);});
		//LOG

		Contact.save()	//save index state and redirect
		.then(() => {
			req.flash('success_msg', 'Contact properties updated.')
			res.redirect('/contact/list');

		})
	})	
	
});