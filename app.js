//Check if modules are loaded and save them in variables
const express = require('express');
const exphbs = require('express-handlebars')
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const sha256 = require('js-sha256');
const methodOverride = require('method-override')


//custom module to hide scavenger hunt links from participants
const hunt = require("./scavenger-private/hunt");

const routes = require("./routes");

//Port number for server
const port = 8080;

//js arrow function////// You wont understand whats below if you dont know what this is.
// (params) =>{
//	functionLogic
//}
//
// creates and arbitrary function, meaning a function that is declered on the run 
//bkz lambda function :https://stackoverflow.com/questions/16501/what-is-a-lambda-function
//
//so app.get( 'link', arrow function ) translates to when you see a get request to website.com'/', do this function.


//connect to mongoose
mongoose.connect('mongodb://localhost/BdTest') 
.then(() => console.log('Mongodb connected...'))//this is called promise
.catch(err => console.log(err));				//throw<->catch	

//Load User Model
require('./models/User');
const User = mongoose.model('User');

require('./models/Project');
const Project = mongoose.model('Project');


//Handlebars Middleware
//Middlewares have access to specified object params and can alter them between request and response
app.engine('handlebars', exphbs({defaultLayout: 'main'})); //main.handlebars will be loaded on every page
app.set('view engine', 'handlebars');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(methodOverride('_method'));




//listener
app.listen(port, () =>{
	console.log(`Server started on port ${port}`);
});


//Get routes for Scavenger Hunt levels MUST NOT BE PUBLISHED!
hunt.getlevels(app);

routes.addRoutes(app);





//temporary add project request
app.post('/projectSubmit', (req,res) => {
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
	res.redirect('/Schedule')
	})
});
 

app.post('/registerSubmit', (req,res) => {
	let errors = [];
	//this part is protection against attacker skipping clientside form check and posting custom json file

	if(!req.body.ID){
		errors.push({text:'Please enter user ID'});
	}
	if(!req.body.name){
		errors.push({text:'Please enter your name'});
	}
	if(!req.body.surname){
		errors.push({text:'Please enter surname'});
	}
	if(!req.body.password){
		errors.push({text:'Please enter a password'});
	}

	if(errors.length>0){
		res.render('kayit',{
			errors:errors,
			ID:req.body.ID,
			name:req.body.name,
			surname:req.body.surname,
			password:req.body.password 
		})
	}else{//if there are no errors
		const newUser = {
			userID: req.body.ID,
			name:req.body.name,
			surname:req.body.surname,
			password:sha256(req.body.password)
		};
		new User(newUser,( error, result) =>{
		})
		.save()
		.then(User => {
			res.redirect('/newRegister');
		})
		.catch(err => {
			errors.push({text:'That username is already registered'});
			res.render('kayit',{
			errors:errors,
			ID:req.body.ID,
			name:req.body.name,
			surname:req.body.surname,
			password:req.body.password 
			})
		});
	}

});

app.post('/loginAttempt', (req,res) => {
	let errors = [];
	//this part is protection against attacker skipping clientside form check and posting custom json file

	if(!req.body.ID){
		errors.push({text:'Please enter user ID'});
	}
	if(!req.body.password){
		errors.push({text:'Please enter a password'});
	}

	if(errors.length>0){
		res.render('login',{
			errors:errors,
			ID:req.body.ID,
			password:req.body.password 
		})
	}else{//if there are no errors
		User.find({userID: req.body.ID})
		.then(User =>{
			if(User.length!=0)
			{
				if(!(User[0].password.localeCompare(sha256(req.body.password))))
				{
					res.render('index',{userID:User[0].userID})
				}
				else {
				errors.push({text:'Incorrect username or password.'})
				res.render('login',{errors:errors})
				}
			}else{
				errors.push({text:'Incorrect username or password.'})
				res.render('login',{errors:errors})
			}
			})
	}

});

app.get('/Schedule', (req,res) => {
	Project.find({})
	.sort({date:'desc'})
	.then(Projects =>{
		res.render('Projects',{
			Projects:Projects
		})
	})
});

app.get('/editProject/:id', (req,res) => {
	Project.findOne({
		_id: req.params.id
	})
	.then(Project =>{
			res.render('editProject',{
			Project:Project
		});	
	})
});

app.put('/Projects/:id', (req,res) =>{
	Project.findOne({
		_id: req.params.id
	})
	.then(Project =>{
		console.log(req.body.title)
		Project.Title=req.body.title;
		Project.Description = req.body.Description;
		Project.gitRepoLink = req.body.github;
		Project.date = req.body.date;

		Project.save()
		.then(() => {
			res.redirect('/Schedule');
		})
	})	
})



app.delete('/Projects/:id', (req,res) => {
	Project.remove({
		_id:req.params.id
	})
	.then(Project =>{
		res.redirect('/Schedule')
			})
});