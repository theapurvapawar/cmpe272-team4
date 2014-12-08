var passport = require("passport");
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var mongoose = require('mongoose');

var express = require('express');
var router = express.Router();




mongoose.connect('mongodb://IbmCloud_tquh43sj_t83fg534_4jq4ihh5:D_ShaT44kapjLq0Urn3czn6yJqAIr6j5@ds055210.mongolab.com:55210/IbmCloud_tquh43sj_t83fg534');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {});




//Passport - Local Strategy 
passport.use(new LocalStrategy(function(username, password,done){
  Users.findOne({ username : username},function(err,user){
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
			console.log("Inside");
			FbUsers.findOne({fbId : profile.id}, function(err, oldUser){
			      if(oldUser){
			    	  console.log(oldUser + "OLD");
			          done(null,oldUser);
			      }else{
			    	  console.log(oldUser + "NEW");
			          var newUser = new FbUsers({
			              fbId : profile.id ,
		                  fname: profile.displayName,
		                  email: profile.emails[0].value,
		                  provider: 'facebook',
		                  facebook: profile._json,
		                  fb_picture: "https://graph.facebook.com/" + profile.username + "/picture" + "?width=200&height=200" + "&access_token=" + accessToken
			          }).save(function(err,newUser){
			              if(err) throw err;
			              done(null, newUser);
			          });
			      }
			  });
			console.log("no error");
		}
		catch(err) {
		    console.log("Error:" + err);
		}
	}
));






//serialize User and deserialize
//User which basically set the user to req.user and establish a session via a cookie set in the user’s browser
passport.serializeUser(function(user, done) {
	console.log("serializeUser");
  done(null, user);
});


passport.deserializeUser(function(id, done) {
	console.log("deserializeUser");
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
	username: String,
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
