use agg
db.zips.aggregate([
    /* get the population of every city in every state */
    {$group:
     {
	 _id: {state:"$state", city:"$city"},
	 population: {$sum:"$pop"},
     }
    },
     /* sort by state, population */
    {$sort: 
     {"_id.state":1, "population":-1}
    },

    /* group by state, get the first item in each group */
    {$group: 
     {
	 _id:"$_id.state",
	 city: {$first: "$_id.city"},
	 population: {$first:"$population"}
     }
    },

    /* now sort by state again */
    {$sort:
     {"_id":1}
    }
])
// { "_id" : "AK", "city" : "ANCHORAGE", "population" : 183987 }
// { "_id" : "AL", "city" : "BIRMINGHAM", "population" : 242606 }
// { "_id" : "AR", "city" : "LITTLE ROCK", "population" : 192895 }
// { "_id" : "AZ", "city" : "PHOENIX", "population" : 890853 }
// { "_id" : "CA", "city" : "LOS ANGELES", "population" : 2102295 }

db.zips.aggregate([
    /* get the population of every city in every state */
    {$group:
     {
         _id: {state:"$state", city:"$city"},
         population: {$sum:"$pop"},
     }
    },
     /* sort by state, population */
    {$sort:
     {"_id.state":1, "population":-1}
    },

    /* group by state, get the first item in each group */
    {$group:
     {
         _id:"$_id.state",
         city: {$first: "$_id.city"},
         population: {$last:"$population"}
	// do not make any sense if first & last are used together
     }
    },

    /* now sort by state again */
    {$sort:
     {"_id":1}
    }
])
// { "_id" : "AK", "city" : "ANCHORAGE", "population" : 0 }
// { "_id" : "AL", "city" : "BIRMINGHAM", "population" : 0 }
// { "_id" : "AR", "city" : "LITTLE ROCK", "population" : 0 }
// { "_id" : "AZ", "city" : "PHOENIX", "population" : 2 }
// { "_id" : "CA", "city" : "LOS ANGELES", "population" : 0 }

