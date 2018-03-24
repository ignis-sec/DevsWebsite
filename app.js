const express = require('express');

const exphbs = require('express-handlebars')

const app = express();

const port = 5000;

 
//Handlebars Middleware
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

//index route 
app.get('/', (req,res) => {
	res.render('index');  
});
 
//about route
app.get('/about', (req,res) => {
	res.send('About');
});
app.get('/kayit', (req,res) => {
	res.render('kayit');
});

//listener
app.listen(port, () =>{
	console.log(`Server started on port ${port}`);
});