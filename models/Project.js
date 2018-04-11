const mongoose = require('mongoose');

const Schema = mongoose.Schema;


//create schema
const ProjectSchema = new Schema({
	Title:{
		type:String,
		required:true
	},
	Description:{
		type:String,
		required:false
	},
	pdfLink:{
		type:String,
		required:true
	},
	gitRepoLink:{
		type:String,
		required:true
	},
	date:{
		type:Date,
		required:false
	},
	active:{
		type:Boolean,
		required:true
	}
});

mongoose.model('Project',ProjectSchema);