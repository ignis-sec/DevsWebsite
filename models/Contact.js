const mongoose = require('mongoose');

const Schema = mongoose.Schema;


//create schema
const ContactSchema = new Schema({
	Name:{
		type:String
	},
	Phone:{
		type:String
	},
	Mail:{
		type:String
	},
	Info:{
		type:String
	}
});

mongoose.model('Contact',ContactSchema);
