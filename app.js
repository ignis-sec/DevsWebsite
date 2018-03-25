//Check if modules are loaded and save them in variables
const express = require('express');
const exphbs = require('express-handlebars')
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const sha256 = require('js-sha256');

//Port number for server
const port = 5000;

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
app.use(bodyParser.urlencoded({ extended:false}));
app.use(bodyParser.json());




//listener
app.listen(port, () =>{
	console.log(`Server started on port ${port}`);
});



///ROUTES
//index route 
app.get('/', (req,res) => {
	res.render('index');

});

//temporary add project request
app.get('/addProject', (req,res) => {
	const newProject = {
		Title: "Kerbal Space Program Mode",
		Description:"Why not",
		permalink:"testsite",
		gitRepoLink:"nogit",
		date: new Date("June 13, 2018 11:13:00"),
		active:true
	};
	new Project(newProject)
	.save()
	.then(() => {
	res.send(`Added ${newProject}`)
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

app.get('/newRegister', (req,res) => {
	res.send('register complete');
});

app.get('/about', (req,res) => {
	res.send('About');
});

app.get('/kayit', (req,res) => {
	res.render('kayit');
});

app.get('/login', (req,res) => {
	res.render('login');
});

app.get('/style/index', (req,res) => {
	res.sendFile('views/style/index.css', {root: __dirname })
});

app.get('/style/kayit', (req,res) => {
	res.sendFile('views/style/kayit.css', {root: __dirname })
});

app.get('/Images/Event1', (req,res) => {
	res.sendFile('views/Images/Event.png', {root: __dirname })
});







