var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var session = require('express-session');


router.use(session({
secret: 'thisKeyIsSupposedToBeSecret',
resave: false,
saveUninitialized: true
}));

var sess = null;


router.get('/', function (req, res) {  
	res.send('CMPE 272 API Base. Nothing to be seen here. API page works.');  
});


mongoose.connect('ec2user@ec2-54-67-9-17.us-west-1.compute.amazonaws.com:27017/cmpe272');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {});

var VTAStopsSchema = new mongoose.Schema(
		{},
		{
			collection: 'bayAreaStops'
		}
);

var Stops = db.model('bayAreaStops', VTAStopsSchema);

router.get('/stops/stopId/:id', function (req, res){
	return Stops.findOne({'_id':req.params.id}, function (err, singleStop) {
		if (!err) {
			return res.send(singleStop);
		} else {
			return console.log(err);
		}
	});
});


router.get('/stops/geoRange', function (req, res){
	return Stops.find(
			{
				'LONG_':
				{
					'$gt': parseFloat(req.query.long1),
					'$lt': parseFloat(req.query.long2)
				},
				'LAT':
				{
					'$gt': parseFloat(req.query.lat1),
					'$lt': parseFloat(req.query.lat2)
				}
			}
			, function (err, Stops) {
				if (!err) {
					return res.send(Stops);
				} else {
					return console.log(err);
				}
			});
});


var ApartmentsSchema = new mongoose.Schema(
		{},
		{
			collection: 'apartments'
		}
		);

var Apartments = db.model('apartments', ApartmentsSchema);

router.get('/apartments/apartmentId/:id', function (req, res){
	  return Apartments.findOne({'place_id':req.params.id}, function (err, singleApartment) {
	    if (!err) {
	      return res.send(singleApartment);
	    } else {
	      return console.log(err);
	    }
	  });
	});

router.get('/apartments/geoRange', function (req, res){
	return Apartments.find(
			{
				'geometry.location.lng':{
							'$gt': parseFloat(req.query.long1),
							'$lt': parseFloat(req.query.long2)
						},
				'geometry.location.lat':{
							'$gt': parseFloat(req.query.lat1),
							'$lt': parseFloat(req.query.lat2)
						}	
								
			}
			, function (err, apartmentsList) {
				if (!err) {
					return res.send(apartmentsList);
				} else {
					return console.log(err);
				}
			});
});

var UniversitiesSchema = new mongoose.Schema(
		{},
		{
			collection: 'universities'
		}
		);

var Universities = db.model('universities', UniversitiesSchema);

router.get('/universities', function (req, res){
	return Universities.find(
			{
				'name': new RegExp(req.query.q, "i")
			}
			, function (err, universitiesList) {
				if (!err) {
					return res.send(universitiesList);
				} else {
					return console.log(err);
				}
			});
});


var UserSchema = new mongoose.Schema(
		{
			email: String,
			accessToken: String,
			fName: String,
			lName: String,
			fb_picture: String
		},
		{
			collection: 'user'
		}
		);

var User = db.model('user', UserSchema);

var ListingsSchema = new mongoose.Schema(
		{
			noOfBedrooms: String,
			noOfBathrooms: String,
			rent: String,
			amenities: String,
			desc: String,
			contact: String,
			placeId: String,
			userId: String
		},
		{
			collection: 'listings'
		}
		);

var Listings = db.model('listing', ListingsSchema);

router.get('/listings/:id', function(req, res){
	return Listings.find({"placeId":req.params.id}, function (err, listOfListings) {
	    if (!err) {
		      return res.send(listOfListings);
		    } else {
		      return console.log(err);
		    }
		  });
});

router.post('/listings', function(req, res){
	var listing = new Listings({
		noOfBedrooms: req.body.noOfBedrooms,
		noOfBathrooms: req.body.noOfBathrooms,
		rent: req.body.rent,
		amenities: req.body.amenities,
		desc: req.body.desc,
		contact: req.body.contact,
		placeId: req.body.placeId,
		userId: req.user._userid
	});
	listing.save(function(err, response, body){
		if(!err){
			return res.status(200).end();
		} else {
			return console.log(err);
		}
	});
});

router.post('/listings/:id', function(req, res){
	Listings.remove({"_id":req.param.id}, function(err, response, body){
		if(!err){
			return response.status(200).end();
		} else {
			return console.log(err);
		}
	});
});


router.post('/forwardRequest',function(req, res){
	var request = require('request');
	request(req.body.url, function (error, response, body) {
	  if (!error && response.statusCode === 200) {
	    //console.log(body); // Print the body of response.
	    res.send(body);
	  }
	});
});

module.exports = router;

