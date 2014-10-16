/**
 * Created by antonio on 10/11/14.
 */
var TM = require('../external/tastemade'),
	db = require('../db');

var User = function(){};


User.prototype.create = function(uid, done){

	this.getByForeignID(uid, function(err, user){
		if(err) { done(err); return }
		if(user.length) { done(null, user); return }

		TM.getUser(function(err, data){
			if(err == '404'){ done('user-does-not-exist'); return}
			if(err) { done(err); return }

			db.run('insert into users(foreign_id, name) values (?, ?)', [data._id, data.name], 'user-create', function(err){
				if(err) { done(err); return}
				done(null, {
					id: this.lastId,
					foreignId: data._id,
					name: data.name
				});
			});

		});
	});

};

User.prototype.getByID = function(id, done){
	db.query('select * from users where id =?', [id], 'user-select-by-id', done);
}

User.prototype.getByForeignID = function(id, done){
	db.query('select * from users where foreignId=?', [id], 'user-select-by-id', done);
}

module.exports = new User();