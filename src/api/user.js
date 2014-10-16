/**
 * Created by antonio on 10/11/14.
 */
var services = require('../services'),
	h = require('./helpers');

var User = function(){};

User.prototype.create = function(req, res, next){
	var u = req.param('tmuuid');

	services.user.create(u, function(err, user){

		if(err){
			if(err == 'user-does-not-exist'){
				h.done(404, {error: 'invalid-tastemade-uid'}, req, res, next);
			} else {
				h.done(500, err, req, res, next);
			}
			return
		}
		h.done(200, user, req, res, next);
	})
};

module.exports = new User();