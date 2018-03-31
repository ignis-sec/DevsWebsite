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
	Removed:{
		type:Boolean,
		required:false
	}
});

mongoose.model('User',UserSchema);
