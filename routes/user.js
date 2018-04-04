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
const favicon = require('serve-favicon');

var log = path.dirname(require.main.filename) + '/logs/users.log';

module.exports = router;

//icon
router.use(favicon('./public/Images/favicon.ico'));

require('../models/User');
const User = mongoose.model('User');

require('../models/Request');
const Request = mongoose.model('Request');

router.get('/register', (req,res) => {
	res.render('user/register',{title:'Register - Metu Developers'});
});

router.get('/login', (req,res) => {
	res.render('user/login',{title:'Login - Metu Developers'});
});

router.get('/logout', (req,res) => {
	req.logout();
	req.flash('success_msg', 'You are now logged out');
	res.redirect('/');
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
							"USER REGISTERED. Username:"+ newUser.userID +", "+ newUser.name +" "+ newUser.surname +"\r\n",(err)=>{if(err) console.log(err);});
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
		passport.authenticate('local', (err, user, info) =>{
			
			if(err){
				//LOG
				fs.appendFile(log, "[" + moment().format('YYYY-MM-DD: HH:mm:ss') + "] " + 
				"ERROR: to account "+ err +"\r\n",(err)=>{
			if(err) console.log(err);
			});
				//LOG
			}
			if(!user) //if no user was returned, it means login failed
			{
			//LOG
			fs.appendFile(log, "[" + moment().format('YYYY-MM-DD: HH:mm:ss') + "] " + 
				"FAILED LOGIN: to account "+ req.body.ID + " >>>IP: "+ req.connection.remoteAddress +"\r\n",(err)=>{if(err) console.log(err);});
			//LOG

			req.flash('error_msg', info.message);
			res.redirect('/user/login');	
			}else{//if authenticate was successfull
				fs.appendFile(log, "[" + moment().format('YYYY-MM-DD: HH:mm:ss') + "] " + 
				"LOGIN: to account "+ req.body.ID +" >>>IP: "+ req.connection.remoteAddress +"\r\n",(err)=>{if(err) console.log(err);});

			req.flash('success_msg', 'Logged in succesfully');

			//login function from passport
			req.logIn(user, function(err) {
     			if (err) { return next(err); }
     			return res.redirect('/');
    			});
			
			}

		})(req, res, next);
	}

});


router.get('/userlist',ensureAuthenticated, ensureAdmin, (req,res) => {
	User.find({})
	.sort({userID: -1})
	.then(Users =>{
		res.render('user/userlist',{ 	//pass Projects to the page into tag with the name "Projects"
			Users: Users,
			title: 'User List - Metu Developers'
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
				"USER RESTORED: "+ User.userID +", "+ User.name +" "+ User.surname +" by: "+ req.user.userID+ " " +req.user.name+" "+ req.user.surname +" >>>IP: "+ req.connection.remoteAddress +"\r\n",(err)=>{if(err) console.log(err);});
			//LOG

			User.Removed=false;
			User.save();
			req.flash('success_msg', 'User Restored');
		}else{
			//LOG
			fs.appendFile(log, "[" + moment().format('YYYY-MM-DD: HH:mm:ss') + "] " + 
				"USER REMOVED:  "+ User.userID +", "+ User.name +" "+ User.surname +" by: "+ req.user.userID+ " " +req.user.name+" "+ req.user.surname +" >>>IP: "+ req.connection.remoteAddress +"\r\n",(err)=>{if(err) console.log(err);});
			//LOG

			User.Removed=true;
			User.save();
			req.flash('success_msg', 'User removed');
		}
		
		res.redirect('/user/userlist');

	})
});



router.get('/:id',ensureAuthenticated, (req,res) => {
	User.findOne({
		userID:req.params.id
	}).then(User =>{
		Request.find({User: User.userID}).sort({Pending:-1}).then((Requests)=>{
			for(i=0;i<Requests.length;i++)
		{
			if(Requests[i].Pending)
			{
				Requests[i].timeago = moment(Requests[i].Date).fromNow(true);
			}else{
				Requests[i].timeago = moment(Requests[i].DADate).fromNow();
			}	
		}
			if(req.user.id == User.id || req.user.admin)
			{
				res.render('user/profile', { //if it is your profile
				ThisUser:User,
				Requests:Requests,
				My:1,
				title:User.name + ' - Metu Developers'
			})
			}else{
				res.render('user/profile', { //if it is not your profile
				ThisUser:User,
				Requests:Requests,
				My:0,
				title:User.name + ' - Metu Developers'
			})	
			}
		})

	})
});



					