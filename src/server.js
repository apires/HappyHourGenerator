/**
 * Created by antonio on 10/11/14.
 */
var express = require('express'),
	bodyParser = require('body-parser'),
	log = require('npmlog'),
	morgan = require('morgan');


var SantaServer = function(options){
	this.port = options.port || 3000;
	this.server = express();

	this.server.use(bodyParser.json());
	this.server.use(morgan('combined'));
	this.server.use(express.static(__dirname+"/../static"))
};

SantaServer.prototype.newRoute = function(prefix){
	var router = express.Router();

	log.info("Attaching route to server:", prefix);
	this.server.use(prefix, router);

	return router;
};

SantaServer.prototype.start = function(){
	log.info("Starting server on port", this.port);
	this.server.listen(this.port);
};


module.exports = SantaServer;