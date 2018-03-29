

//For temporary or single non categorized routes only.

exports.addRoutes = function(app)
{

//index route 
app.get('/', (req,res) => {
	res.render('index');

});

app.get('/duckduckgoose', (req,res) => {
	res.render('Scavenger')
});








}





