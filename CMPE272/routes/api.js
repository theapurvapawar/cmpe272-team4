var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {  
	  res.send('CMPE 272 API Base. Nothing to be seen here. API page works.');  
});

module.exports = router;

