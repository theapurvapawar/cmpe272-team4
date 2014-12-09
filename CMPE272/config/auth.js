var passport = require("passport");
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var mongoose = require('mongoose');
var hash=require('../util/hash.js');

var express = require('express');
var router = express.Router();


mongoose.connect('ec2user@ec2-54-183-68-182.us-west-1.compute.amazonaws.com:27017/cmpe272');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {});

passport.userExist = function(req, res, next) {
	Users.count({
        email: req.body.email
    }, function (err, count) {
        if (count === 0) {
            next();
        } else {
        	
            //res.redirect("/");
            res.json({"error":"User already exists"});
        }
    });
}

passport.saveUser = function(req, res, next) {
	passport.signup(req.body.email, req.body.password, req.body.name, function(err, user){
		if(err) throw err;
		req.login(user, function(err){
			if(err) return next(err);
			return res.send({user:req.user});
		});
	});
}


passport.signup = function(email, password, name, done){
	hash(password, function(err, salt, hash){
		if(err) throw err;
		// if (err) return done(err);
		Users.create({
			email : email,
			fname : name,
			salt : salt,
			hash : hash
		}, function(err, user){
			if(err) throw err;
			// if (err) return done(err);
			done(null, user);
		});
	});
}


//Passport - Local Strategy 
passport.use(new LocalStrategy({
		usernameField: 'email',
		passwordField: 'password'
	},
	function(email, password, done){

	Users.findOne({ email : email},function(err,user){
      if(err) { return done(err); }
      if(!user){
          return done(null, false, { message: 'Incorrect username.' });
      }
      
      hash( password, user.salt, function (err, hash) {
          if (err) { return done(err); }
          if (hash == user.hash) return done(null, user);
          done(null, false, { message: 'Incorrect password.' });
      });
  });
}));



//Passport - Facebook Strategy
passport.use(new FacebookStrategy({
	  clientID: "1575662755980271",
	  clientSecret: "2a1c9af8cd42dab912533d4d8f9e91f3",
	  callbackURL: "/authApi/auth/facebook/callback",
	   profileFields: ['id', 'name','picture.type(large)', 'emails', 'displayName', 'about', 'gender'], 
	},
	function(accessToken, refreshToken, profile, done) {
		try {
			FbUsers.findOne({fbId : profile.id}, function(err, oldUser){
			      if(oldUser){
			          done(null,oldUser);
			      }else{
			          var newUser = new FbUsers({
			              fbId : profile.id ,
		                  fname: profile.displayName,
		                  email: profile.emails[0].value,
		                  provider: 'facebook',
		                  facebook: profile._json,
		                  fb_picture: "https://graph.facebook.com/" + profile.id + "/picture" + "?width=200&height=200" + "&access_token=" + accessToken
			          }).save(function(err,newUser){
			              if(err) throw err;
			              done(null, newUser);
			          });
			      }
			  });
		}
		catch(err) {
		    console.log("Error:" + err);
		}
	}
));





//serialize User and deserialize
//User which basically set the user to req.user and establish a session via a cookie set in the user’s browser
passport.serializeUser(function(user, done) {
  done(null, user.id);
});


passport.deserializeUser(function(id, done) {
  FbUsers.findById(id,function(err,user){
      if(err) done(err);
      if(user){
          done(null,user);
      }else{
          Users.findById(id, function(err,user){
              if(err) done(err);
              done(null,user);
          });
      }
  });
});





/*-----Required for passport- Users Table------*/
var LocalUserSchema = new mongoose.Schema({
	email: { type : String , lowercase : true},
	fname: String,
	salt: String,
	hash: String
	});

var Users = mongoose.model('userauths', LocalUserSchema);

/*-----Required for passport- Facebook Table------*/
var FacebookUserSchema = new mongoose.Schema({
    fbId: String,
    email: { type : String , lowercase : true},
    fname : String,
    provider: String,
    facebook: String,
    fb_picture:String
});
var FbUsers = mongoose.model('fbs',FacebookUserSchema);

/*-----Passport calls------*/

module.exports = passport;
