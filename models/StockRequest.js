const mongoose = require('mongoose');

const Schema = mongoose.Schema;


//create schema
const StockRequestSchema = new Schema({
	Name:{
		type:String,
		required:true
	},
	Quantity:{
		type:String,
		required:true
	},
	Date:{
		type:Date,
		required:true
	},
	Info:{
		type:String
	}
});

mongoose.model('StockRequest',StockRequestSchema);
