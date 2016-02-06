use test

db.zips.count()
// 29467

db.zips.aggregate([
	{$project: 
		{
			first_char: {$substr: ["$city",0,1]}
		}
	}
])
// { "_id" : "35004", "first_char" : "A" }
// { "_id" : "35005", "first_char" : "A" }
// { "_id" : "35006", "first_char" : "A" }
// { "_id" : "35007", "first_char" : "K" }
// { "_id" : "35010", "first_char" : "N" }

db.zips.aggregate([
	{$group: 
		{
			_id: {$substr: ["$city",0,1]},
			cities: {$addToSet: "$city"}
		}
	},
	{$match: {_id: {$not: /[A-Z]/}}}
])

// calculate the sum total of people who are living in a zip code where the city starts with a digit
db.zips.aggregate([
	{$match: {city: {$not: /^[A-Z]/}}},
	{$group: {
		_id: 0,
		pop: {$sum: "$pop"}
	}}
])
// { "_id" : 0, "pop" : 298015 }

// alternative
db.zips.aggregate([
	{$project: 
		{
			pop: 1,
			first_char: {$substr: ["$city",0,1]}
		}
	},
	{$match: {first_char: {$regex: "[0-9]"}}},
	{$group: {
		_id: 0,
		pop: {$sum: "$pop"}
	}}
])
// { "_id" : 0, "pop" : 298015 }
