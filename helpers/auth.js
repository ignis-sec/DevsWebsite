module.exports = {
	ensureAuthenticated: function(req,res,next){
		if(req.isAuthenticated()){
			return next();
		}
		req.flash('error_msg', 'That stuff is not for you!');
		res.redirect('/user/login');
	},

	ensureAdmin: function(req,res,next){
		if(req.user.admin==true){
			return next();
		}
		req.flash('error_msg', 'That stuff is not for you!');
		res.redirect('/');
	}

}