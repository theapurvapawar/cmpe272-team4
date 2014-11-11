var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

router.get('/', function (req, res) {  
	  res.send('CMPE 272 API Base. Nothing to be seen here. API page works.');  
});


mongoose.connect('mongodb://localhost/vta');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
});

var VTAStopsSchema = new mongoose.Schema(
		{},
		{
			collection: 'stops'
		}
		);

var Stops = db.model('stops', VTAStopsSchema);

router.get('/VTAStops/stopId/:id', function (req, res){
	  return Stops.find({'RTI_STOP':parseInt(req.params.id)}, function (err, singleStop) {
	    if (!err) {
	      return res.send(singleStop);
	    } else {
	      return console.log(err);
	    }
	  });
	});


router.get('/VTAStops/geoRange', function (req, res){
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
			  , function (err, singleStop) {
	    if (!err) {
	      return res.send(singleStop);
	    } else {
	      return console.log(err);
	    }
	  });
	});

module.exports = router;

