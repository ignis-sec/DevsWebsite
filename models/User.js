const mongoose = require('mongoose');

const Schema = mongoose.Schema;


//create schema
const UserSchema = new Schema({
	userID:{
		type:String,
		required:true,
		unique:true
	},
	name:{
		type:String,
		required:true
	},
	surname:{
		type:String,
		required:true
	},
	password:{
		type:String,
		required:true
	},
	admin:{
		type:Boolean,
		required:false
	},
	dateJoined:{
		type:Date,
		required:false
	},
	Interests:{
		type:String,
		required:false
	},
	Skills:{
		type:String,
		required:false
	},
	Bio:{
		type:String
	},
	Removed:{
		type:Boolean,
		required:false
	},
	GithubName:{
		type:String,
		required:false
	},
	Verified:{
		type:Boolean
	},
	VerifyTime:{
		type:Date
	},
	ResetTime:{
		type:Date
	}
});

mongoose.model('User',UserSchema);
