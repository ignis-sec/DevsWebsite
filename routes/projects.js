const express = require('express')
const router = express.Router();
const mongoose = require('mongoose');

module.exports = router;


require('../models/Project');
const Project = mongoose.model('Project');


router.get('/', (req,res) => {
	Project.find({})
	.sort({date:'desc'})
	.then(Projects =>{
		res.render('projects/Projects',{ 	//pass Projects to the page into tag with the name "Projects"
			Projects:Projects
		})
	})
});

router.get('/edit/:id', (req,res) => { 
	Project.findOne({//returns only 1 result
		_id: req.params.id
	})
	.then(Project =>{
			res.render('projects/editProject',{
			Project:Project 	//pass Project to the page into tag with the name "Project"
		});	
	})
});

router.put('/:id', (req,res) =>{
	Project.findOne({
		_id: req.params.id
	})
	.then(Project =>{ //set new values to the db index
		Project.Title=req.body.title;
		Project.Description = req.body.Description;
		Project.gitRepoLink = req.body.github;
		Project.date = req.body.date;

		Project.save()	//save index state and redirect
		.then(() => {
			req.flash('success_msg', 'Project properties updated.')
			res.redirect('/projects/');

		})
	})	
})



router.delete('/:id', (req,res) => {	//DELETE request 
	Project.remove({
		_id:req.params.id
	})
	.then(() =>{
		req.flash('success_msg', 'Project deleted.')
		res.redirect('/projects/')
			})
});

router.post('/Submit', (req,res) => {
	const newProject = {
		Title: req.body.title,
		Description:req.body.desc,
		permalink:"FILL THIS UP",
		gitRepoLink:"THIS TOO",
		date: req.body.date,
		active:true
	};
	new Project(newProject)
	.save()
	.then(() => {
	req.flash('success_msg', 'New project added.')
	res.redirect('/projects')
	})
});

router.get('/new', (req,res) => {
	res.render('projects/addProject')
});