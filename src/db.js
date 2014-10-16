/**
 * Created by antonio on 10/11/14.
 */
var sql = require('sqlite3'),
	fs = require('fs'),
	log = require('npmlog');



var Storage = function(){
	this.filename = __dirname+'/../santa.db';

	this.db = null;
};

Storage.prototype.init = function(cb){
	if(this.db) { cb(); return }

	this.db = new sql.Database(this.filename, function(err){
		if(err){
			log.error('Unable to open database, exiting...', err, this.filename);
			process.exit(-1);
		}

		this.db.exec('PRAGMA foreign_keys = ON;', cb);
	}.bind(this));
};

Storage.prototype.setup = function(cb){
	this.init(function(){

		fs.readFile(__dirname+'/../setup.sql', function(err, data){
			if(err) { cb(err); return }

			this.db.exec(data.toString(), cb);
		}.bind(this));

	}.bind(this));
};

Storage.prototype.teardown = function(cb){
	this.init(function(){

		fs.readFile(__dirname+'/../teardown.sql', function(err, data){
			if(err) { cb(err); return }

			this.db.exec(data.toString(), cb);

		}.bind(this));

	}.bind(this));
};

Storage.prototype.run = function(query, params, errPrefix, done){
	this.db.run(query, params, function(err, data){
		if(err){
			log.error(errPrefix+'query-failed', {err: err, qry: query, params: params});
			done(err);
			return
		}
		done.bind(this, null, data)();
	})
};

Storage.prototype.query = function(query, params, errPrefix, done){
	this.db.all(query, params, function(err, data){
		if(err){
			log.error(errPrefix+'query-failed', {err: err, qry: query, params: params});
			done(err);
			return

		}
		done(null, data);
	})
};

Storage.prototype.queryIterator = function(query, params, errPrefix, done){
	this.db.each(query, params, function(err, data){
		if(err){
			log.error(errPrefix+'query-failed', {err: err, qry: query, params: params});
			done(err);
			return

		}
		done(null, data);
	})
};

Storage.prototype.exec = function(query, params, errPrefix, done){
	this.db.exec(query, params, function(err, data){
		if(err){
			log.error(errPrefix+'exec-query-failed', {err: err, qry: query, params: params});
			done(err);
			return

		}
		done(null, data);
	})
};

module.exports = new Storage();