const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');


//Load user model from mongoose

require('../models/User');
const User = mongoose.model('User');

module.exports = function(passport){
	passport.use(new LocalStrategy({usernameField: 'ID'}, (ID, password, done)=>{
		User.findOne({userID: ID}).then(user=>{
			if(!user){		
				return done(null, false, {message: 'No user Found'})	//(error, user object, message)
			}
			//match user password with bcrypted hash
			if(user.Removed){
				return done(null, false, {message: 'Your account was removed.'})
			}
			bcrypt.compare(password,user.password, (err, isMatch) =>{
				if(err) throw err;
				if(isMatch){
					return done(null, user);
				}else{
					return done(null, false, {message: 'Incorrect password'})
				}
			})
		})
	}));

//passport cookie sessions middleware:>>>>>>http://www.passportjs.org/docs/ under title Sessions
	passport.serializeUser(function(user, done) {
	  done(null, user.id);
	});

passport.deserializeUser(function(id, done) {
	  User.findById(id, function(err, user) {
	    done(err, user);
	  });
	});

}