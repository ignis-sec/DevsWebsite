const mongoose = require('mongoose');

const Schema = mongoose.Schema;


//create schema
const UserSchema = new Schema({
	category:{
		type:String
	},
	name:{
		type:String,
		required:true,
	},
	quantity:{
		type:Number,
		required:true
	},
	itemID:{
		type:String
	},
	dateAdded:{
		type:Date,
		required:true
	},
	holdDetails:{
		type:Object
	}
});

mongoose.model('Item',UserSchema);