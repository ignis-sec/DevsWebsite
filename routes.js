

exports.addRoutes = function(app)
{

//index route 
app.get('/', (req,res) => {
	res.render('index');

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

app.get('/duckduckgoose', (req,res) => {
	res.render('Scavenger')
});

app.get('/addProject', (req,res) => {
	res.render('addProject')
});






}





