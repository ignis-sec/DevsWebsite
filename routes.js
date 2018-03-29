

//For temporary or single non categorized routes only.

exports.addRoutes = function(app)
{

//index route 
app.get('/', (req,res) => {
	res.render('index');

});

app.get('/style/index', (req,res) => {
	res.sendFile('views/style/index.css', {root: __dirname })
});

app.get('/Images/Event1', (req,res) => {
	res.sendFile('views/Images/Event.png', {root: __dirname })
});

app.get('/duckduckgoose', (req,res) => {
	res.render('Scavenger')
});








}





