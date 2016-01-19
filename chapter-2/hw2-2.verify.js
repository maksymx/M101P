// hw 2.1

use students

db.grades.count()
//600

db.grades.find().sort( { 'score' : -1 } ).skip( 100 ).limit( 1 )
//{ "_id" : ObjectId("50906d7fa3c412bb040eb709"), "student_id" : 100, "type" : "homework", "score" : 88.50425479139126 }

db.grades.find( { }, { 'student_id' : 1, 'type' : 1, 'score' : 1, '_id' : 0 } ).sort( { 'student_id' : 1, 'score' : 1, } ).limit( 5 )
//{ "student_id" : 0, "type" : "quiz", "score" : 31.95004496742112 }
//{ "student_id" : 0, "type" : "exam", "score" : 54.6535436362647 }
//{ "student_id" : 0, "type" : "homework", "score" : 63.98402553675503 }
//{ "student_id" : 1, "type" : "homework", "score" : 44.31667452616328 }
//{ "student_id" : 1, "type" : "exam", "score" : 74.20010837299897 }

db.grades.aggregate( { '$group' : { '_id' : '$student_id', 'average' : { $avg : '$score' } } }, { '$sort' : { 'average' : -1 } }, { '$limit' : 1 } )
//{ "_id" : 54, "average" : 96.19488173037341 }
