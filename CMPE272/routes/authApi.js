
var express = require('express');
var router = express.Router();
var passport = require('../config/auth');
		
	
	router.get("/auth/facebook", passport.authenticate("facebook",{ scope : "email"}));
	
	router.get("/auth/facebook/callback",
			function(req, res, next) {
		  passport.authenticate('facebook',
				  function(err, user, info) {
		    if (err) { return next(err); }
		    if (!user) { return res.redirect('/'); }
		    req.logIn(user, function(err) {
		      if (err) { return next(err); }
		      //res.send({user : req.user});
		      res.redirect('/');
		    });
		  })(req, res, next);
		});
	
	router.post("/auth/local",
	function(req, res, next) {
		  passport.authenticate('local',
				  function(err, user, info) {
		    if (err) { return next(err); }
		    if (!user) { return res.send({"error":"Invalid email or password"}); }
		    req.logIn(user, function(err) {
		      if (err) { return next(err); }
		      res.send({user : req.user});
		      //res.redirect('/');
		    });
		  })(req, res, next);
		});



	router.post("/signup", passport.userExist, function (req, res, next) {
		passport.saveUser(req, res, next);
	});


	
	router.get('/logout', function(req, res){
		req.logout();
		res.redirect('/');
		//res.status(200).end();
	});
	
	router.get('/authenticatedOrNot', function (req, res, next){
	    if(req.isAuthenticated()){
	    	 res.redirect("/");
	        next();
	    }else{
	        res.redirect("/");
	    }
	});
	
	router.get('/getUser', function (req, res){
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
	});

	module.exports = router;

