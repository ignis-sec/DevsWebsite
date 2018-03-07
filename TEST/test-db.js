

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

//test port

app.listen('3000',() => {
	console.log('Server started at port 3000');
});