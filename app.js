//Check if modules are loaded and save them in variables
const express = require('express');
const exphbs = require('express-handlebars')
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');
const path = require('path');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const fs = require('fs');
const moment = require('moment');
const favicon = require('serve-favicon');


//Log file directories
var log = __dirname + '/logs/app.log';
 

//custom module to hide scavenger hunt links from participants
const hunt = require("./scavenger-private/hunt");
require('./config/passport')(passport); // i dont entirely understand what is happening here but: https://jsfiddle.net/64j360yp/

//Port number for server
const port = process.env.PORT || 8080;

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


try {
    const db = require('./config/database');
    
    mongoose.connect(db.mongoURI, (err) =>{//if config file which includes database username and password is present, connect
      if(!mongoose.connection.readyState) throw err; //if there is no connection, (wrong credentials, no internet, server down) throw
    })
    .then((err)=> { //if promise proceeds server connected to the remote succesfully
      console.log('mongodb connected at remote server');  
    }).catch(err =>{ //catch of connection error
      mongoose.connect('mongodb://localhost/BdTest');
        console.log('Failed to connect to remote server. Connection returned ' + mongoose.connection.readyState + '. mongodb connected at local server');
    })
    
} catch (ex) {//catch of missing sensitive config appendFile
   mongoose.connect('mongodb://localhost/BdTest');
    console.log('config/database.js is not present. If you want to connect to the remote db, create and export db link to mongoURI. Connecting to local db instead');
}


//Middlewares
//Middlewares have access to specified object params and can alter them between request and response



//Handlebars
app.engine('handlebars', exphbs({defaultLayout: 'main'})); //main.handlebars will be loaded on every page
app.set('view engine', 'handlebars');


//Body parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//method override
app.use(methodOverride('_method'));

//session
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: true,
}));

//passport middleware
app.use(passport.initialize());
app.use(passport.session());

//flash
app.use(flash());


//path
app.use(express.static(path.join(__dirname, 'public')));
//icon
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));


//listener
app.listen(port, () =>{
	//LOG
	fs.appendFile(log, "[" + moment().format('YYYY-MM-DD: HH:mm:ss') + "] " + 
		"Server started. Port:"+ port +"\r\n",(err)=>{if(err) console.log(err);});
	//LOG
	console.log(`Server started on port ${port}`);
});




//THESE ARE ALSO GLOBAL VARIABLES
//custom flash middleware for pop up messages 
app.use(function(req,res,next){
	res.locals.success_msg = req.flash('success_msg');
	res.locals.error_msg = req.flash('error_msg');
	res.locals.error = req.flash('error');
	res.locals.user = req.user || null; //if there is no user passed, set null
	next();
});


//Get routes for Scavenger Hunt levels MUST NOT BE PUBLISHED!
hunt.getlevels(app);
//Get other routes from routes.js module

const projects = require('./routes/projects');
const user = require('./routes/user');
const stock = require('./routes/stock');
const announcement = require('./routes/announcement');
const main = require('./routes/main');

app.use('/projects', projects);
app.use('/user', user);
app.use('/stock', stock);
app.use('/announcement', announcement);



require('./models/Announcement');
const Announcement = mongoose.model('Announcement');

//index route 
app.get('/', (req,res) => {
  Announcement.find({})
  .sort({date:'desc'})
  .then(Announcements =>{
    for(i=0;i<Announcements.length;i++)//add timeago and time tag to all of the announcements
    {
        Announcements[i].timeago = moment(Announcements[i].Date).fromNow();
        Announcements[i].time = moment(Announcements[i].Date).format('MMMM Do YYYY, HH:mm');
    }
    res.render('index',{  //pass Projects to the page into tag with the name "Projects"
      announcements:Announcements,
      title: 'Metu Developers'
    })
  })
});


app.get('/duckduckgoose', (req,res) => {
  res.render('scavenger')
});


