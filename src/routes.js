var services = require('./services'),
	api = require('./api');

module.exports = function(app){
	app.get('/ping', services.ping.get.bind(services.ping));

	app.put('/v1/user/:tmuuid', api.user.create.bind(api.user));

	app.get('/v1/hh', api.hh.getOrCreate);
	app.put('/v1/hh/:hhid/confirmation/:uid', api.hh.confirmPresence);
	app.delete('/v1/hh/:hhid/confirmation/:uid', api.hh.cancelPresence);


	app.post('/v1/auth', api.auth.authenticate);
};