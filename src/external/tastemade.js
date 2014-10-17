var request = require('request'),
	log = require('npmlog'),
	mocks = require('./mocks.json');


var API_KEY = process.env['TASTEMADE_API_KEY'];


var API = function(){
	this.baseUrl = 'https://api.tmade.co/v1';
};

API.prototype.getUser = function(userName, done){
	var url = this.baseUrl+'/users/'+userName;

	this.request('GET', url, false, function(err, status, data){
		if(err || status != 200) { return done(err || status);}

		done(null, data);
	});
};

API.prototype.auth = function(user, pass, done){
	var url = this.baseUrl+'/auth/login';

	done(null, mocks.user);

//	this.request('POST', url, {username: user, password: pass}, function(err, status, data){
//		if(err || status != 200) { return done(err || status);}
//
//		done(null, data);
//	});

};

API.prototype.getAllVenues = function(done){
	var url = this.baseUrl+'/venues';

	this.request('GET', url, false, function(err, status, data){
		if(err || status != 200) { return done(err || status);}

		done(null, data);
	});
};

API.prototype.getVenue = function(venueID, done){
	var url = this.baseUrl+'/venues/'+venueID;

	this.request('GET', url, false, function(err, status, data){
		if(err || status != 200) { return done(err || status);}

		done(null, data);
	});
};

API.prototype.getWishersForVenueID = function(venueID, done){
	var url= this.baseUrl+'/venues/'+venueID+'/wishers';

	this.request('GET', url, false, function(err, status, data){
		if(err || status != 200) { return done(err || status);}

		done(null, data);
	});
}

API.prototype.getCloseNearLocationIDs = function(lat, long, done){
	var url = this.baseUrl+'/closest/locations';

	this.request('GET', url, false, function(err, status, data){
		if(err || status != 200) { return done(err || status);}

		done(null, data);
	}, {qs: { lat: lat, long: long }});
};

API.prototype.getVenuesAroundLocation = function(locationID, done){
	var url = this.baseUrl+'/locations/'+locationID+'/venues';

	this.request('GET', url, false, function(err, status, data){
		if(err || status != 200) { return done(err || status);}

		done(null, data);
	});
}

API.prototype.request = function(method, url, json, cb, opt){
	var options = opt || {};
	options.url = url;
	options.method = method;
	if(json) options.json = json;

	options.headers = {
		'X-Api-Key': API_KEY,
		'X-Visitor-ID': 'antonio-bot'
	};

	request(options, function(err, rsp, body){
		if(err){
			log.error('error talking to tastemade', {err: err, url: url, method: method, body: body});
			cb(err);
			return
		}

		if(options.json) cb(null, rsp.statusCode, body);
		else cb(null, rsp.statusCode, JSON.parse(body));
	})
};


module.exports = new API();