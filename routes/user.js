const express = require('express')
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const {ensureAuthenticated, ensureAdmin, ensureVerified} = require('../helpers/auth') //this is called destructuring
const fs = require('fs');
const moment = require('moment');
const path = require('path')
const ExpressBrute = require('express-brute');
var store = new ExpressBrute.MemoryStore(); // stores state locally, don't use this in production 
var bruteforce = new ExpressBrute(store);
const favicon = require('serve-favicon');
const PythonShell = require('python-shell');
const sha256 = require('js-sha256');


var log = path.dirname(require.main.filename) + '/logs/users.log';

module.exports = router;

//icon
router.use(favicon('./public/Images/favicon.ico'));

require('../models/User');
const User = mongoose.model('User');

require('../models/Request');
const Request = mongoose.model('Request');

const mailman = require('../config/mailman');




router.get('/register', (req,res) => {
	res.render('user/register',{title:'Register - Metu Developers'});
});

router.get('/login', (req,res) => {
	req.flash('fromAddr', res.locals.fromAddr[0])
	res.render('user/login',{title:'Login - Metu Developers'});
});

router.get('/logout', (req,res) => {
	req.logout();
	req.flash('success_msg', 'You are now logged out');
	res.redirect('/');
});




router.post('/register',bruteforce.prevent, (req,res) => {
	let errors = [];
	//this part is protection against attacker skipping clientside form check and posting custom json file

	if(isNaN(req.body.ID)){
		errors.push({text:'Your student number can only contain numbers.'});
	}
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
			interests: req.body.interests,
			skills: req.body.skills
		})
	}else{//if there are no errors
		const newUser = new User({
			userID: req.body.ID,
			name:req.body.name,
			surname:req.body.surname,
			password:req.body.password,
			dateJoined:Date.now(),
			Skills:req.body.skills ,
			Interests:req.body.interests
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
     			if(res.locals.fromAddr[0]) return res.redirect(res.locals.fromAddr[0]);
     			else return res.redirect('/');
    			});
			
			}

		})(req, res, next);
	}

});


router.get('/userlist', ensureAdmin, (req,res) => {
	User.find({})
	.sort({userID: -1})
	.then(Users =>{
		res.render('user/userlist',{ 	//pass Projects to the page into tag with the name "Projects"
			Users: Users,
			title: 'User List - Metu Developers'
		})
	})
});


router.delete('/:id', ensureAdmin,  (req,res) => {	//DELETE request 
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
			if(req.user.id == User.id)
			{
				res.render('user/profile', { //if it is your profile
				ThisUser:User,
				Requests:Requests,
				RequestPermission:1,
				My:1,
				title:User.name + ' - Metu Developers'
			})
			}else if(req.user.admin){

				res.render('user/profile', { //if it is your profile
				ThisUser:User,
				Requests:Requests,
				RequestPermission:1,
				My:0,
				title:User.name + ' - Metu Developers'
			})
			}

			else{
				res.render('user/profile', { //if it is not your profile
				ThisUser:User,
				Requests:Requests,
				RequestPermission:0,
				title:User.name + ' - Metu Developers',
				My:1
			})	
			}
		})

	})
});

router.get('/verify/check/:hash', ensureAuthenticated, (req,res)=>{
	if(sha256(req.user.id+String(req.user.VerifyTime)) == req.params.hash)
	{
		if(Date.now() - req.user.VerifyTime >= 5*60*1000)//5 minutes
		{
			req.flash('error_msg', 'That verification code timed out.');
			res.redirect('/'); 
		}else{
			User.findOne({_id: req.user.id})
			.then((User)=>{
				if(User.Verified)
				{
					req.flash('error_msg', 'Account already verified.');
					res.redirect('/');
				}else{
				User.Verified = true;
				User.save();
				fs.appendFile(path.dirname(require.main.filename) + '/python/Mailsender/emails.list', 'e'+req.user.userID.substring(0, 6)+'@metu.edu.tr\r\n', (err)=>{if(err) console.log(err)});
				req.flash('success_msg', 'Account verified.');
				res.redirect('/');	
				}	
			})
		}
		
	}else{
		req.flash('error_msg', 'That is not a valid verification link.');
		res.redirect('/'); 
	}


})

router.get('/verify/verifyme', ensureAuthenticated, bruteforce.prevent, (req,res)=>{

	if(req.user.Verified)
	{
		req.flash('error_msg', 'Your account is already verified');
		res.redirect('/'); 
	}
	User.findOne({_id: req.user.id})
	.then((User)=>{
		User.VerifyTime = Date.now();
		User.save();
		var options = {
			pythonOptions: ['-u'],
	  		args: [mailman.uid, mailman.pwd, mailman.fromAddr, req.headers.host + '/user/verify/check/' + sha256(req.user.id+String(User.VerifyTime)) , '--title', 'Verification Code', '--recipient', 'e'+req.user.userID.substring(0, 6)+'@metu.edu.tr']
		};
		PythonShell.run(path.dirname(require.main.filename) + '/python/MailSender/MailSender.py', options,(err, results) => {
		  if (err) throw err;
		  // results is an array consisting of messages collected during execution
		  console.log('results: %j', results);
		});
		req.flash('success_msg', 'Verification mail sent to your metu mail.');
			res.redirect('/');
	})
	

})					