const mongoose = require('mongoose');

const Schema = mongoose.Schema;


//create schema
const RequestSchema = new Schema({
	Item:{
		type:String,
		required:true
	},
	ItemName:{
		type:String,
		required:true
	},
	Quantity:{
		type:String,
		required:true
	},
	Time:{
		type:String,
		required:true
	},
	Date:{
		type:Date,
		required:true
	},
	Info:{
		type:String
	},
	User:{
		type:String,
		required:true
	},
	Pending:{
		type:Boolean
	},
	Declined:{
		type:Boolean
	},
	Returned:{
		type:Boolean
	},
	DeclineReason:{
		type:String
	},
	DADate:{
		type:Date
	},
	DAUser:{
		type:String
	},
	Approved:{
		type:Boolean
	},
	Permanent:{
		type:Boolean
	}
});

mongoose.model('Request',RequestSchema);
