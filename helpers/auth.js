module.exports = {
	ensureAuthenticated: function(req,res,next){
		if(req.isAuthenticated()){
			return next();
		}
		req.flash('fromAddr', req.originalUrl);
		req.flash('error_msg', 'You need to log in for that stuff');
		res.redirect('/user/login');
	},

	ensureAdmin: function(req,res,next){
		if(req.isAuthenticated() && req.user.admin==true){
			return next();
		}
		req.flash('fromAddr', req.originalUrl);
		req.flash('error_msg', 'That stuff is not for you!');
		res.redirect('/user/login');
	},
	ensureVerified: function(req,res,next){
		if(!req.isAuthenticated())
		{
			req.flash('fromAddr', req.originalUrl);
			req.flash('error_msg', 'You need to log in for that stuff');
			res.redirect('/user/login');
		}else if(req.user.Verified==true){
			return next();
		}else{
			req.flash('error_msg', 'You have to verify your account first.');
			res.redirect('/');
		}
		
	}

}