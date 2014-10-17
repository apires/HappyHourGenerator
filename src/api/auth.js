/**
 * Created by antonio on 10/16/14.
 */
var tm = require('../external/tastemade'),
	hlp = require('./helpers');

var AuthProxy = module.exports = {};

AuthProxy.authenticate = function(req, res, next){
	var body = req.body;

	if(!body || !body.user || !body.pass) { hlp.done(400, {err: 'missing user or pass'}, req, res); return}

	tm.auth(body.user, body.pass, function(err, data){
		if(err) {
			if(err == 401){
				hlp.done(401, err, req, res);
				return
			}
			return hlp.done(500, err, req, res);
		}
		// Todo cache for session length...?
		hlp.done(200, {token: data.auth.token, id: data._id}, res, res);
	});

};