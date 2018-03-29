const express = require('express')
const router = express.Router();
const mongoose = require('mongoose');

module.exports = router;


require('../models/User');
const User = mongoose.model('User');
 

router.get('/register', (req,res) => {
	res.render('register');
});

router.get('/login', (req,res) => {
	res.render('login');
});

router.get('/register', (req,res) => {
	res.sendFile('views/style/register.css', {root: __dirname })
});



router.post('/Submit', (req,res) => {
	let errors = [];
	//this part is protection against attacker skipping clientside form check and posting custom json file

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

	if(errors.length>0){ //if there are any errors re-ask
		res.render('register',{
			errors:errors,
			ID:req.body.ID,
			name:req.body.name,
			surname:req.body.surname,
			password:req.body.password 
		})
	}else{//if there are no errors
		const newUser = {
			userID: req.body.ID,
			name:req.body.name,
			surname:req.body.surname,
			password:sha256(req.body.password)
		};
		new User(newUser,( error, result) =>{
		})
		.save()
		.then(User => {
			res.redirect('/newUser');
		})
		.catch(err => {  //if db responds with unique key repeat
			errors.push({text:'That username is already registered'});
			res.render('kayit',{
			errors:errors,
			ID:req.body.ID,
			name:req.body.name,
			surname:req.body.surname,
			password:req.body.password 
			})
		});
	}

});

router.post('/loginAttempt', (req,res) => {
	let errors = [];
	//this part is protection against attacker skipping clientside form check and posting custom json file

	if(!req.body.ID){
		errors.push({text:'Please enter user ID'});
	}
	if(!req.body.password){
		errors.push({text:'Please enter a password'});
	}

	if(errors.length>0){
		res.render('login',{
			errors:errors,
			ID:req.body.ID,
			password:req.body.password 
		})
	}else{//if there are no errors
		User.find({userID: req.body.ID})
		.then(User =>{
			if(User.length!=0)
			{
				if(!(User[0].password.localeCompare(sha256(req.body.password))))
				{
					res.render('index',{userID:User[0].userID})
				}
				else {
				errors.push({text:'Incorrect username or password.'})
				res.render('login',{errors:errors})
				}
			}else{
				errors.push({text:'Incorrect username or password.'})
				res.render('login',{errors:errors})
			}
			})
	}

});
