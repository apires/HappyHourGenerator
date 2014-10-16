create table users(
	id integer primary key not null,
	foreignId text, -- ID from TasteMade
	name text
);

create table happyHours(
  id integer primary key not null,
  venueId text,
  date integer -- date
);

create table confirmations(
  happyHourId integer,
  userId integer,

  foreign key(happyHourId) references happyHours(id),
  foreign key(userId) references users(id)
);
create unique index combined on confirmations(happyHourId, userId);