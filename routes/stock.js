const express = require('express')
const router = express.Router();
const mongoose = require('mongoose');
const {ensureAuthenticated, ensureAdmin} = require('../helpers/auth') //this is called destructuring
const fs = require('fs');
const moment = require('moment');
const path = require('path')

var log = path.dirname(require.main.filename) + '/logs/stock.log';

module.exports = router;


require('../models/Item');
const Item = mongoose.model('Item');


router.get('/',ensureAuthenticated, ensureAdmin, (req,res) => {
	Item.find({})
	.sort({dateAdded: -1})
	.then(Items =>{
		res.render('stock/Items',{ 	//pass Projects to the page into tag with the name "Projects"
			Items: Items
		})
	})
});

router.get('/new',ensureAuthenticated,  ensureAdmin,  (req,res) => {
	res.render('stock/addItem')
});

router.post('/new',ensureAuthenticated,  ensureAdmin,  (req,res) => {
	const newItem = {
		name: req.body.name,
		ItemID:req.body.id,
		quantity:req.body.quantity,
		category:req.body.category,
		dateAdded: Date.now()	
	};
	new Item(newItem)
	.save()
	.then(() => {
		//LOG
		fs.appendFile(log, "[" + moment().format('YYYY-MM-DD: HH:mm:ss') + "] " + 
			"ITEM ADDED:   by "+ req.user.userID +" "+req.user.name +" "+req.user.surname+
			", Item: "+ req.body.name + " ("+ req.body.id +")" +" >>>IP: "+ req.connection.remoteAddress +"\r\n",(err)=>{
		if(err) console.log(err);
		});
		//LOG
		req.flash('success_msg', 'New Item added.');
		res.redirect('/stock');
	})
});


router.get('/edit/:id',ensureAuthenticated, ensureAdmin,  (req,res) => { 
	Item.findOne({//returns only 1 result
		_id: req.params.id
	})
	.then(Item =>{
			res.render('stock/editItem',{
			Item:Item 	//pass Project to the page into tag with the name "Project"
		});	
	})
});


router.put('/:id',ensureAuthenticated, ensureAdmin,  (req,res) =>{
	Item.findOne({
		_id: req.params.id
	})
	.then(Item =>{ //set new values to the db index
		Item.name = req.body.name,
		Item.itemID = req.body.id,
		Item.quantity = req.body.quantity,
		Item.category = req.body.category,

		Item.save()	//save index state and redirect
		.then(() => {
			//LOG
			fs.appendFile(log, "[" + moment().format('YYYY-MM-DD: HH:mm:ss') + "] " + 
				"ITEM UPDATED: by "+ req.user.userID +" "+req.user.name +" "+req.user.surname+
				", Item: "+ req.body.name + " ("+ req.body.id +")" +" >>>IP: "+ req.connection.remoteAddress +"\r\n",(err)=>{
			if(err) console.log(err);
			});
			//LOG
			req.flash('success_msg', 'Item properties updated.')
			res.redirect('/stock/');

		})
	})	
})

router.delete('/:id',ensureAuthenticated,  ensureAdmin,  (req,res) => {	//DELETE request 
	//LOG
	Item.findOne({
		_id:req.params.id
	}).then(Item =>{
		fs.appendFile(log, "[" + moment().format('YYYY-MM-DD: HH:mm:ss') + "] " + 
		"ITEM REMOVED: by "+ req.user.userID +" "+req.user.name +" "+req.user.surname+", Item: "+ Item.name + " ("+ Item.itemID +")"+ " >>>IP: "+ req.connection.remoteAddress +"\r\n",(err)=>{
	if(err) console.log(err);
	});
	})
	//LOG


	Item.remove({
		_id:req.params.id
	})
	.then(() =>{
		req.flash('success_msg', 'Item deleted.')
		res.redirect('/stock/')
			})
});