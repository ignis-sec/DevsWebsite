const mongoose = require('mongoose');

const Schema = mongoose.Schema;


//create schema
const UserSchema = new Schema({
	userID:{
		type:String,
		required:true
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
	}
});

mongoose.model('User',UserSchema);