const express = require('express')
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const {ensureAuthenticated, ensureAdmin} = require('../helpers/auth') //this is called destructuring
const fs = require('fs');
const moment = require('moment');
const path = require('path')
const ExpressBrute = require('express-brute');
var store = new ExpressBrute.MemoryStore(); // stores state locally, don't use this in production 
var bruteforce = new ExpressBrute(store);

var log = path.dirname(require.main.filename) + '/logs/users.log';

module.exports = router;


require('../models/User');
const User = mongoose.model('User');

router.get('/register', (req,res) => {
	res.render('user/register');
});

router.get('/login', (req,res) => {
	res.render('user/login');
});

router.get('/logout', (req,res) => {
	req.logout();
	req.flash('success_msg', 'You are now logged out');
	res.redirect('/');
});

router.get('/register', (req,res) => {
	res.sendFile('views/style/register.css', {root: __dirname })
});



router.post('/register', (req,res) => {
	let errors = [];
	//this part is protection against attacker skipping clientside form check and posting custom json file

	if(req.body.ID.length!=7){
		errors.push({text:'Please enter your 7 digit metu student number.'});
	}
	if(req.body.password!=req.body.confirm){
		errors.push({text:'Your password confirmation doesnt match your password'});
	}
	if(req.body.password.length<8){
		errors.push({text:'Password must be longer than 8 characters'});
	}
	if(!req.body.ID){
		errors.push({text:'Please enter user ID'});
	}
	if(!req.body.name){
		errors.push({text:'Please enter your name'});
	}
	if(!req.body.surname){
		errors.push({text:'Please enter surname'});
	}
	if(!req.body.password){
		errors.push({text:'Please enter a password'});
	}
	User.findOne({userID: req.body.ID})
	.then(User => {
		if(User) errors.push({text:'That username is already registered'});
	})


	if(errors.length>0){ //if there are any errors re-ask
		res.render('user/register',{
			errors: errors,
			ID: req.body.ID,
			name: req.body.name,
			surname: req.body.surname,
			password: req.body.password,
			confirm: req.body.confirm
		})
	}else{//if there are no errors
		const newUser = new User({
			userID: req.body.ID,
			name:req.body.name,
			surname:req.body.surname,
			password:req.body.password,
			dateJoined:Date.now()
		});
		bcrypt.genSalt(10, (err,salt) =>{
			bcrypt.hash(newUser.password, salt, (err,hash)=>{
				if(err) throw err;
				newUser.password=hash;
				newUser.save()
				.then(user =>{
					req.flash('success_msg,', 'Registeration successfull');
						//LOG
						fs.appendFile(log, "[" + moment().format('YYYY-MM-DD: HH:mm:ss') + "] " + 
							"USER REGISTERED. Username:"+ newUser.userID +", "+ newUser.name +" "+ newUser.surname +"\r\n",(err)=>{
						if(err) console.log(err);
						});
						//LOG
					res.redirect('/user/login');
				})
				.catch(err =>{
					//LOG
					fs.appendFile(log, "[" + moment().format('YYYY-MM-DD: HH:mm:ss') + "] " + 
						"ERROR accured at bcrypt.hash"+ err +"\r\n",(err)=>{
					if(err) console.log(err);
					});
					//LOG
				})
			});
		});

	}
});

router.post('/login',bruteforce.prevent, (req,res,next) => {
	let errors = [];
	//this part is protection against attacker skipping clientside form check and posting custom json file

	if(!req.body.ID){
		errors.push({text:'Please enter user ID'});
	}
	if(!req.body.password){
		errors.push({text:'Please enter a password'});
	}

	if(errors.length>0){
		res.render('user/login',{
			errors:errors,
			ID:req.body.ID,
			password:req.body.password 
		})
	}else{//if there are no errors
		passport.authenticate('local', {
			successRedirect: '/',
			failureRedirect: '/user/login',
			failureFlash: true
		})(req, res, next);
	}

});


router.get('/userlist',ensureAuthenticated, ensureAdmin, (req,res) => {
	User.find({})
	.sort({userID: -1})
	.then(Users =>{
		res.render('user/userlist',{ 	//pass Projects to the page into tag with the name "Projects"
			Users: Users
		})
	})
});


router.delete('/:id',ensureAuthenticated,  ensureAdmin,  (req,res) => {	//DELETE request 
	User.findOne({
		_id:req.params.id
	}).then(User =>{
		if(User.Removed)
		{
			//LOG
			fs.appendFile(log, "[" + moment().format('YYYY-MM-DD: HH:mm:ss') + "] " + 
				"USER RESTORED: "+ User.userID +", "+ User.name +" "+ User.surname +" by: "+ req.user.userID+ " " +req.user.name+" "+ req.user.surname +" >>>IP: "+ req.connection.remoteAddress +"\r\n",(err)=>{
			if(err) console.log(err);
			});
			//LOG

			User.Removed=false;
			User.save();
			req.flash('success_msg', 'User Restored');
		}else{
			//LOG
			fs.appendFile(log, "[" + moment().format('YYYY-MM-DD: HH:mm:ss') + "] " + 
				"USER REMOVED:  "+ User.userID +", "+ User.name +" "+ User.surname +" by: "+ req.user.userID+ " " +req.user.name+" "+ req.user.surname +" >>>IP: "+ req.connection.remoteAddress +"\r\n",(err)=>{
			if(err) console.log(err);
			});
			//LOG

			User.Removed=true;
			User.save();
			req.flash('success_msg', 'User removed');
		}
		
		res.redirect('/user/userlist');

	})
});



					