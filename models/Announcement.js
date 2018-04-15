const mongoose = require('mongoose');

const Schema = mongoose.Schema;


//create schema
const AnnouncementSchema = new Schema({
	Title:{
		type:String,
		required:true
	},
	Body:{
		type:String,
		required:true
	},
	permalink:{
		type:String,
	},
	Date:{
		type:Date

	},
	Sticky:{
		type:Boolean
	}
});

mongoose.model('Announcement',AnnouncementSchema);