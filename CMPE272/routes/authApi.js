
var express = require('express');
var router = express.Router();
var passport = require('../config/auth');
		
	
	router.get("/auth/facebook", passport.authenticate("facebook",{ scope : "email"}));
	
	router.get("/auth/facebook/callback",
			function(req, res, next) {
		  passport.authenticate('facebook',
				  function(err, user, info) {
		    if (err) { return next(err); }
		    if (!user) { return res.redirect('/login'); }
		    req.logIn(user, function(err) {
		      if (err) { return next(err); }
		      //res.send({user : req.user});
		      res.redirect('/');
		    });
		  })(req, res, next);
		});



	router.post('/userExist',function(req, res, next) {
	    Users.count({
	        username: req.body.username
	        
	    }, function (err, count) {
	        if (count === 0) {
	        	
	            next();
	            
	        } else {
	            // req.session.error = "User Exist"
	            //res.redirect("/");
	        	res.status(200).end();
	        }
	    });
	});
	
	router.get('/logout', function(req, res){
		req.logout();
		res.redirect('/');
		//res.status(200).end();
	});
	
	router.get('/authenticatedOrNot', function (req, res, next){
	    if(req.isAuthenticated()){
	    	console.log("yes");
	    	 res.redirect("/");
	        next();
	    }else{
	    	console.log("not");
	        res.redirect("/");
	    }
	});
	
	router.get('/getUser', function (req, res){
		console.log('============');
		console.log(req.user);
		try {
			if(req.user== undefined)
				res.send("nothing");
			else
				res.send(req.user);
		}
		catch(e)
		{
			res.send(e);
		}
		return null;
	    	//return res.send(req.session.passport.user);
	
	});
	
	
	
	/*
	var ApartmentsNewTestSchema = new mongoose.Schema(
			{},
			{
				collection: 'test'
			}
	);
	
	var ApartmentsNewTest = db.model('test', ApartmentsNewTestSchema);
	
	router.get('/apartment', function (req, res){
		return ApartmentsNewTest.find({},function (err, apartmentsList) {
			if (!err) {
			
				return res.send(apartmentsList);
			} else {
				
				return console.log(err);
			}
		});
	});
	*/

	module.exports = router;

