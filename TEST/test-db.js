

//install node.js
//on cmd
//cd ..directory to this file
//npm init
//name testdb
//ver 1.0.0
//entry point app.js
//enter through everything
//npm install --save mysql express
//npm install -g nodemon
//nodemon
//DOWNLOAD XAMPP AND RUN APACHE + MYSQL SERVER


//check modules
const express = require('express');
const mysql = require('mysql');
 
//create connection
const db = mysql.createConnection({
	host : 'localhost',
	user : 'root',
	database: 'testsql'
});

//connect
db.connect((err) =>{
	if(err){
		throw err;
	}
	console.log("Connected");
})


const app = express();

//create db
app.get('/createdb', () => {
	let sql = 'CREATE DATABASE testsql';
	db.query(sql, (err,result) =>{
		if(err) throw err;
		console.log(result);
		res.send('database created');
	});
});

app.get('/createpoststable', (req,res) => {
	let sql = 'CREATE TABLE posts(id int AUTO_INCREMENT, title VARCHAR(255),body VARCHAR(255), PRIMARY KEY (id))';
	db.query(sql, (err,result) =>{
		if(err) throw err;
		console.log(result);
		res.send('Posts table created')
	});
});

app.get('/addpost',(req,res) =>{
	let post = {title:'Test', body:'IEEE ur mom gay'};
	let sql = 'INSERT INTO posts SET ?';
	let query = db.query(sql,post, (err,result) => {
		if(err) throw err;
		console.log(result);
		res.send('post added');
	});

});

app.get('/getpost/:id', (req,res) =>{
	console.log(req.params.id);
	let sql = 'SELECT * FROM posts WHERE id = ' + req.params.id;
	let query = db.query(sql, (err,result) => {
		if(err) throw err; 
		console.log(result);
		res.send(result);
	});
})



//test port

app.listen('3000',() => {
	console.log('Server started at port 3000');
});