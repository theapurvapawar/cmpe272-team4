

# CMPE272



## Usage



## Developing

Exposed JSON Object(s) / data via REST.

GET -

1. '/api/stops/stopId/[stop_id]' returns a single JSON object.

2. '/api/stops/geoRange?lat1=[Latitude-1]&longt1=[Longitude-1]&lat2=[Latitude-2]&long2=[Longitude-2]' returns set of JSON Objects existing between the given range.

3. '/api/apartments/apartmentId/[apartment-place-id]' returns a sing Apartment JSON.

4. '/api/apartments/geoRange?lat1=[Latitude-1]&longt1=[Longitude-1]&lat2=[Latitude-2]&long2=[Longitude-2]' works like point 2.

5. '/api/universities?q=[Query+String]' will return an array of JSON Objects. Partial Matches supported.

6. '/api/user/logout' destroys session and responds with HTTP status 200 for true. Responds with status 400 for false/error

POST -

1. '/api/user/auth' post new user info and get back json object (returns existing object if user exists)

Post Format -

{
			email: String,
			accessToken: String,
			fName: String,
			lName: String,
			fb_picture: String
			
}

2. '/api/forwardRequest' forwards request to specified URL and forwards response back to requesting service.

Post Format -

{
	url: String
}


Uploaded Data to Blumix MongoLab service. (updated Blumix app to test API online.) Above APIs work live on app URLs.

Uploaded Sample Apartment data to MongoLab

Uploaded University data to MongoLab

Basic Session management implemented.

### Tools

Created with [Nodeclipse](https://github.com/Nodeclipse/nodeclipse-1)
 ([Eclipse Marketplace](http://marketplace.eclipse.org/content/nodeclipse), [site](http://www.nodeclipse.org))   

Nodeclipse is free open-source project that grows with your contributions.
