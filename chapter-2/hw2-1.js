// hw 2.1

use students

db.grades.count()
//800

db.grades.aggregate({'$group':{'_id':'$student_id', 'average':{$avg:'$score'}}}, {'$sort':{'average':-1}}, {'$limit':1})
//{ "_id" : 164, "average" : 89.29771818263372 }

db.grades.find({type:'exam', score:{$gte:65}}).sort({score:1}).limit(1)
//{ "_id" : ObjectId("50906d7fa3c412bb040eb5cf"), "student_id" : 22, "type" : "exam", "score" : 65.02518811936324 }

db.grades.find({type:'exam', score:{$gte:65}},{student_id:true,_id:false}).sort({score:1}).limit(1)
//{ "student_id" : 22 }
