/**
 * Created by antonio on 10/14/14.
 */
var db = require('../db'),
	TM = require('../external/tastemade'),
	async = require('async'),
	_ = require('lodash'),
	moment = require('moment'),
	log = require('npmlog');

var hh = module.exports = {};

hh.HHDTO = function(created, when, meta, confirmed, id){
	return{
		id: id || -1,
		created: !!created,
		when: {
			iso: when.toISOString(),
			nice: when.from(moment())
		},
		confirmed: confirmed|0,
		_meta : meta || {}
	}
};

hh.getHappyHour = function(venueID, when, done, venue){
	db.query('select h.id happyID, * from happyHours h left join confirmations c on c.happyHourID = h.id where venueID = ? and date >= ?', [venueID, when.unix()], 'get-happy-hour', function(err, data){
		if(err) {
			log.error("hh: error checking if there's a pending HH", {err: err});
			done(err);
			return;
		}

		if(!data.length){
			done(null, false);
			return
		}

		var confirmations = data.length && data[0].userId ? data.length : 0;
		if(venue){
			done(null, hh.HHDTO(false, when, venue, confirmations, data[0].happyID ));
			return
		}

		TM.getVenue(venueID, function(err, meta){
			if(err){
				log.error('hh:getHappyHour: error hydrating venues for get', {err: err});
				done(err);
				return
			}
			done(null, hh.HHDTO(false, when, meta, confirmations, data[0].happyID ));
		});

	});
};

hh.createHappyHour = function(venueID, when, done){
	db.run('insert into happyHours(venueID, date) values(?,?)', [venueID, when.unix()], 'create-happy-hour', function(err, r){
		if(err){ done(err); return }
		done(null, this.lastID);
	});
};


hh.getOrCreateHappyHour = function(lat, long, done){
	var thisFriday = moment().endOf('week');

	hh.getHighestWishedLocation(lat, long, function(err, venue){
		if(err){ done(err); return}

		hh.getHappyHour(venue._id, thisFriday, function(err, existing){
			if(err){ done(err); return}

			if(existing) { done(null, existing); return}

			hh.createHappyHour(venue._id, thisFriday, function(err, id){
				if(err){ done(err); return}

				done(null, hh.HHDTO(true, thisFriday, venue, [], id));

			});

		}, venue);

	});

};

hh.getHighestWishedLocation = function(lat, long, done){
	TM.getCloseNearLocationIDs(lat, long, function(err, data){
		if(err){
			log.error('hh:get nearby location error', {lat: lat, long: long, err: err});
			done(err);
			return
		}

//		var locationID = data._id; TODO replace with real data since the service is returning bad stuff
		var locationID = 'a3e6aad5-12ff-4712-93ed-b2abb6fdb628'; // ATX

		TM.getVenuesAroundLocation(locationID, function(err, venues){
			if(err){
				log.error('hh:get venues error', {lat: lat, long: long, err: err});
				done(err);
				return
			}

			var jobs = _.chain(venues)
						.map(function(venue){
							var venueID = venue['_id'];
							return [venueID, TM.getWishersForVenueID.bind(TM, venueID)];
						})
						.object()
						.value();

			async.parallelLimit(jobs, 10, function(err, data){
				var highestWished;

				if(err){
					log.error('hh:get venues error', {lat: lat, long: long, err: err});
					done(err);
					return
				}

				highestWished = _.chain(data)
 								 .map(function(followers, locationID){
							 		 return [locationID, followers.length];  // [ [ locationID, 3 ], [locationID, 1], ...]
								 })
								 .max(function(tuple){ // [ locationID, 3 ]
									 return tuple[1]
								 })
								 .first() // locationID
								 .value();

				done(null, _.find(venues, {_id: highestWished}));
			});

		});

	});
};

hh.confirmPresence = function(happyHourID, userID, done){
	db.run('insert into confirmations(happyHourId, userId) values(?,?)', [happyHourID, userID], 'err-confirming-presence', done);
}