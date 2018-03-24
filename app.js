//Check if modules are loaded and save them in variables
const express = require('express');
const exphbs = require('express-handlebars')
const app = express();


//Port number for server
const port = 5000;

 
//Handlebars Middleware
//Middlewares have access to specified object params and can alter them between request and response
app.engine('handlebars', exphbs({defaultLayout: 'main'})); //main.handlebars will be loaded on every page
app.set('view engine', 'handlebars');


//js arrow function////// You wont understand whats below if you dont know what this is.
// (params) =>{
//	functionLogic
//}
//
// creates and arbitrary function, meaning a function that is declered on the run 
//bkz lambda function :https://stackoverflow.com/questions/16501/what-is-a-lambda-function
//
//so app.get( 'link', arrow function ) translates to when you see a get request to website.com'/', do this function.




//listener
app.listen(port, () =>{
	console.log(`Server started on port ${port}`);
});


///ROUTES


//index route 
app.get('/', (req,res) => {
	res.render('index');  
});
 
//about route
app.get('/about', (req,res) => {
	res.send('About');
});
//kayıt route
app.get('/kayit', (req,res) => {
	res.render('kayit');
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







