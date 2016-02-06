use test

// find all zip codes in the dataset
db.zips.aggregate([{$group:{_id:"$state"}}])
// { "_id" : "NY" }
// { "_id" : "NJ" }
// { "_id" : "CT" }
// { "_id" : "CA" }

// verifying results
// The answer for CT and NJ (using this data set) is 38177.
db.zips.aggregate([
	// sum the population of each city across zip codes
	// city name that appears in more than one state represents two separate cities
	// Different states might have the same city name.
	{$group:
		{
			_id: {state: "$state", city: "$city"},
			pop: {$sum: "$pop"}
		}
	},
	// filter cities with populations over 25,000
	// cities of interest
	{$match:
		{
			$or: [{"_id.state": "CT"}, {"_id.state": "NJ"}],
			pop: {$gt: 25000}
		}
	},
	// calculate average
	{$group:
		{
			_id: 0,
			avg: {$avg: "$pop"}
		}
	}
])
// { "_id" : 0, "avg" : 38176.63636363636 }

// calculate the average population of cities in California (abbreviation CA) and New York (NY) (taken together) with populations over 25,000.
db.zips.aggregate([
	{$group:
		{
			_id: {state: "$state", city: "$city"},
			pop: {$sum: "$pop"}
		}
	},
	{$match:
		{
			$or: [{"_id.state": "CA"}, {"_id.state": "NY"}],
			pop: {$gt: 25000}
		}
	},
	{$group:
		{
			_id: 0,
			avg: {$avg: "$pop"}
		}
	}
])
//{ "_id" : 0, "avg" : 44804.782608695656 }
