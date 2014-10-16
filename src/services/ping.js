/**
 * Created by antonio on 10/11/14.
 */
var Ping = function(){};

Ping.prototype.get = function(req, res, next){
	res.status(200).json({req: 'PONG'});
};

module.exports = new Ping();