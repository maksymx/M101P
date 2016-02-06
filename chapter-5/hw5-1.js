use blog
db.posts.aggregate([
	{$unwind: "$comments"},
//	{$project: {comments:1}},
	{$group: {
		_id: "$comments.author",
		count: {$sum:1}
	}},
	{$sort: {count: 1}},
])

// { "_id" : "Mariela Sherer", "count" : 387 }
// { "_id" : "Tawana Oberg", "count" : 396 }
// { "_id" : "Kayce Kenyon", "count" : 400 }
// { "_id" : "Maren Scheider", "count" : 401 }
// { "_id" : "Tamika Schildgen", "count" : 404 }

db.posts.aggregate([
	{$unwind: "$comments"},
//	{$project: {comments:1}},
	{$group: {
		_id: "$comments.author",
		count: {$sum:1}
	}},
	{$sort: {count: -1}},
])

// { "_id" : "Elizabet Kleine", "count" : 503 }
// { "_id" : "Carli Belvins", "count" : 480 }
// { "_id" : "Mariette Batdorf", "count" : 478 }
// { "_id" : "Gwyneth Garling", "count" : 477 }
// { "_id" : "Eugene Magdaleno", "count" : 475 }
