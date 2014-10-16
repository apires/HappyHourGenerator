/**
 * Created by antonio on 10/15/14.
 */
var hh = require('../src/services/hh'),
	db = require('../src/db'),
	async = require('async'),
	assert = require('assert');

var LAT =30.323319700000003, LONG = -97.74040459999999;

describe("HH", function(){

	beforeEach(function(done){
		async.series([
			db.init.bind(db),
			db.teardown.bind(db),
			db.setup.bind(db)
		], done);
	});

	it('should return a list of happy hour places', function(done){
		hh.getHighestWishedLocation(LAT, LONG, function(err, data){
			assert.ok(!err, err);
			assert.ok(Object.keys(data).length);
			done();
		})
	});

	it('should create a happyHour when one does not exist', function(done){
		hh.getOrCreateHappyHour(LAT, LONG, function(err, hh){
			assert.ok(!err, err);
			assert.ok(hh.created);
			done();
		});
	});
//
	it('should create a happyHour when one does not exist', function(done){
		hh.getOrCreateHappyHour(LAT, LONG, function(){
			hh.getOrCreateHappyHour(LAT, LONG, function(err, hh){
				assert.ok(!err, err);
				assert.ok(!hh.created);
				assert.equal(hh.id, 1);
				done();
			});
		});
	});

});