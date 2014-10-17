/**
 * Created by antonio on 10/15/14.
 */
var services = require('../services'),
	hlp = require('./helpers');

var HHAPI = module.exports = {};

HHAPI.getOrCreate = function(req, res, next){
	var lat = req.query['lat'],
		long = req.query['long'];

	if(!lat || !long) { hlp.done(400, {err: "invalid lat or long"}, req, res); return}

	services.hh.getOrCreateHappyHour(lat, long, function(err, data){
		if(err) { return hlp.done(500, {}, req, res); }
		if(data.created) { return hlp.done(201, data, req, res) }
		hlp.done(200, data, res, res);
	});

};

HHAPI.confirmPresence = function(req, res, next){
	var uid = req.params.uid,
		happyHourID = req.params.hhid;

	services.hh.confirmPresence(uid, happyHourID, function(err){
		if(err) {
			if(err instanceof Error && err.message.indexOf('FOREIGN KEY') !== -1 ){
				hlp.done(400, {err: 'invalid user id or event id'}, req, res);
			} else {
				hlp.done(500, err, req, res);
			}
			return
		}
		hlp.done(204, null, res, res);
	});
};

HHAPI.cancelPresence = function(req, res, next){
	var uid = req.params.uid,
		happyHourID = req.params.hhid;

	services.hh.cancelPresence(uid, happyHourID, function(err){
		if(err) {
			if(err instanceof Error && err.message.indexOf('FOREIGN KEY') !== -1 ){
				hlp.done(400, {err: 'invalid user id or event id'}, req, res);
			} else {
				hlp.done(500, err, req, res);
			}
			return
		}
		hlp.done(204, null, res, res);
	});
};

