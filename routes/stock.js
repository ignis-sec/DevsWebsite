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
require('../models/Request');
const Request = mongoose.model('Request');


router.get('/',ensureAuthenticated, (req,res) => {
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
			", Item: "+ req.body.name + " ("+ req.body.id +")" +" >>>IP: "+ req.connection.remoteAddress +"\r\n",(err)=>{if(err) console.log(err);});
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
			Item:Item 	
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
				", Item: "+ req.body.name + " ("+ req.body.id +")" +" >>>IP: "+ req.connection.remoteAddress +"\r\n",(err)=>{if(err) console.log(err);});
			//LOG
			req.flash('success_msg', 'Item properties updated.')
			res.redirect('/stock/');

		})
	})	
})

router.delete('/:id',ensureAuthenticated,  ensureAdmin,  (req,res) => {	//DELETE request 
	
	Item.findOne({
		_id:req.params.id
	}).then(Item =>{
		//LOG
		fs.appendFile(log, "[" + moment().format('YYYY-MM-DD: HH:mm:ss') + "] " + 
		"ITEM REMOVED: by "+ req.user.userID +" "+req.user.name +" "+req.user.surname+", Item: "+ Item.name + " ("+ Item.itemID +")"+ " >>>IP: "+ req.connection.remoteAddress +"\r\n",(err)=>{if(err) console.log(err);});
		//LOG
	})

	Item.remove({
		_id:req.params.id
	})
	.then(() =>{
		req.flash('success_msg', 'Item deleted.')
		res.redirect('/stock/')
			})
});











///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////STOCK REQUESTS AND REQUEST FORMS

router.get('/request/:id',ensureAuthenticated,  (req,res) => { 
	Item.findOne({//returns only 1 result
		_id: req.params.id
	})
	.then(Item =>{
			res.render('stock/requestItem',{Item:Item});	
	})
});



router.post('/request/:id',ensureAuthenticated, (req,res) =>{
	Item.findOne({
		_id: req.params.id
	})
	.then(Item =>{
		const newRequest = {
			Item: req.params.id,
			ItemName: (Item.itemID)? Item.name + " (" +Item.itemID+")" : Item.name,
			Quantity: req.body.quantity,
			Time: req.body.return,
			Info: (req.body.project)? req.body.info + "\r\nProject Name: " + req.body.project : req.body.info,
			User: req.user.userID,
			Pending: true,
			Date: Date.now()	
		};
		new Request(newRequest)
		.save()
		.then(() => {
			//LOG
			fs.appendFile(log, "[" + moment().format('YYYY-MM-DD: HH:mm:ss') + "] " + 
				"ITEM REQUEST:   by "+ req.user.userID +
				", Item: "+ Item.name + " ("+ Item.itemID +")\r\n",(err)=>{if(err) console.log(err);});
			//LOG
			req.flash('success_msg', 'Request Form Sent.');
			res.redirect('/stock');
		})
	});
})

router.get('/requests',ensureAuthenticated, ensureAdmin, (req,res) => {
	Request.find({})
	.sort({Pending: -1})
	.then(Requests =>{
		res.render('stock/requests',{ 	//pass Projects to the page into tag with the name "Projects"
			Requests: Requests
		})
	})
});

router.get('/requests/approve/:id',ensureAuthenticated, ensureAdmin,  (req,res) =>{
	Request.findOne({
		_id: req.params.id
	})
	.then(Request =>{ //set new values to the db index

		Request.Pending = false;
		Request.Approved = true;
		Request.DADate = Date.now();

		Request.save()	//save index state and redirect
		.then(() => {
			//LOG
			fs.appendFile(log, "[" + moment().format('YYYY-MM-DD: HH:mm:ss') + "] " + 
				"REQUEST APPROVED: by "+ req.user.userID +" "+req.user.name +" "+req.user.surname+
				", Item: "+ Request.ItemName +" >>>IP: "+ req.connection.remoteAddress +"\r\n",(err)=>{if(err) console.log(err);});
			//LOG
			//req.flash('success_msg', 'Request Approved.');
			res.redirect('/stock/requests');

		})
	})	
})

router.get('/requests/revoke/:id',ensureAuthenticated, ensureAdmin,  (req,res) =>{
	Request.findOne({
		_id: req.params.id
	})
	.then(Request =>{ //set new values to the db index

		Request.Pending = true;
		Request.Approved = false;
		Request.Declined = false;
		Request.DADate = Date.now();

		Request.save()	//save index state and redirect
		.then(() => {
			//LOG
			fs.appendFile(log, "[" + moment().format('YYYY-MM-DD: HH:mm:ss') + "] " + 
				"REQUEST REVOKED: by "+ req.user.userID +" "+req.user.name +" "+req.user.surname+
				", Item: "+ Request.ItemName +" >>>IP: "+ req.connection.remoteAddress +"\r\n",(err)=>{if(err) console.log(err);});
			//LOG
			//req.flash('success_msg', 'Request Revoked.');
			res.redirect('/stock/requests');

		})
	})	
})



router.post('/requests/decline/:id',ensureAuthenticated, ensureAdmin,  (req,res) =>{
	Request.findOne({
		_id: req.params.id
	})
	.then(Request =>{ //set new values to the db index

		Request.Pending = false;
		Request.Declined = true;
		Request.DADate = Date.now();

		Request.save()	//save index state and redirect
		.then(() => {
			//LOG
			fs.appendFile(log, "[" + moment().format('YYYY-MM-DD: HH:mm:ss') + "] " + 
				"REQUEST DECLINED: by "+ req.user.userID +" "+req.user.name +" "+req.user.surname+
				", Item: "+ Request.ItemName +" >>>IP: "+ req.connection.remoteAddress +"\r\n",(err)=>{if(err) console.log(err);});
			//LOG
			//req.flash('success_msg', 'Request Declined.');
			res.redirect('/stock/requests');

		})
	})	
})