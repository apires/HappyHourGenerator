var log = require('npmlog');

var done = function(status, rsp, req, res){
	res.status(status);

	if(status >= 500){
		log.error('error processing handler', {err: rsp} );
		res.json({err: 'internal_server_error'}).end();
		return
	}
	if(status >= 400){
		log.info('user input error', {rsp: rsp});
	}

	res.json(rsp || "").end();
};

module.exports.done = done;