use test

// verifying results
// The class with the lowest average is the class with class_id=2.
// Those students achieved a class average of 37.6 
db.grades.aggregate([
	{$unwind: "$scores"},
	{$match: {"scores.type": {$ne: "quiz"}}},
	{$group: {
		_id: {student_id: "$student_id", class_id: "$class_id"}, 
		grade: {$avg: "$scores.score"}
	}},
	{$group: {
		_id: {class_id: "$_id.class_id"},
		grade: {$avg: "$grade"}
	}},
	{$sort: {grade: 1}}
])
// { "_id" : { "class_id" : 2 }, "grade" : 37.61742117387635 }
// { "_id" : { "class_id" : 12 }, "grade" : 40.62345969481145 }
// { "_id" : { "class_id" : 8 }, "grade" : 41.30388381000019 }
// { "_id" : { "class_id" : 28 }, "grade" : 41.59824801397287 }

// find the class_id which has the highest average student performance
db.grades.aggregate([
	{$unwind: "$scores"},
	{$match: {"scores.type": {$ne: "quiz"}}},
	{$group: {
		_id: {student_id: "$student_id", class_id: "$class_id"}, 
		grade: {$avg: "$scores.score"}
	}},
	{$group: {
		_id: {class_id: "$_id.class_id"},
		grade: {$avg: "$grade"}
	}},
	{$sort: {grade: -1}}
])
// { "_id" : { "class_id" : 1 }, "grade" : 64.50642324269175 }
// { "_id" : { "class_id" : 5 }, "grade" : 58.08448767613548 }
// { "_id" : { "class_id" : 20 }, "grade" : 57.6309834548989 }
// { "_id" : { "class_id" : 26 }, "grade" : 56.06918278769095 }
