use school
db.students.findOne()
//{
//	"_id" : 0,
//	"name" : "aimee Zank",
//	"scores" : [
//		{
//			"type" : "exam",
//			"score" : 1.463179736705023
//		},
//		{
//			"type" : "quiz",
//			"score" : 11.78273309957772
//		},
//		{
//			"type" : "homework",
//			"score" : 6.676176060654615
//		},
//		{
//			"type" : "homework",
//			"score" : 35.8740349954354
//		}
//	]
//}

// un-nested
db.students.aggregate({$unwind: '$scores'})
//{ "_id" : 0, "name" : "aimee Zank", "scores" : { "type" : "exam", "score" : 1.463179736705023 } }
//{ "_id" : 0, "name" : "aimee Zank", "scores" : { "type" : "quiz", "score" : 11.78273309957772 } }
//{ "_id" : 0, "name" : "aimee Zank", "scores" : { "type" : "homework", "score" : 6.676176060654615 } }
//{ "_id" : 0, "name" : "aimee Zank", "scores" : { "type" : "homework", "score" : 35.8740349954354 } }
//{ "_id" : 1, "name" : "Aurelia Menendez", "scores" : { "type" : "exam", "score" : 60.06045071030959 } }
//{ "_id" : 1, "name" : "Aurelia Menendez", "scores" : { "type" : "quiz", "score" : 52.79790691903873 } }
//{ "_id" : 1, "name" : "Aurelia Menendez", "scores" : { "type" : "homework", "score" : 71.76133439165544 } }
//{ "_id" : 1, "name" : "Aurelia Menendez", "scores" : { "type" : "homework", "score" : 34.85718117893772 } }
//{ "_id" : 2, "name" : "Corliss Zuk", "scores" : { "type" : "exam", "score" : 67.03077096065002 } }
//{ "_id" : 2, "name" : "Corliss Zuk", "scores" : { "type" : "quiz", "score" : 6.301851677835235 } }
//{ "_id" : 2, "name" : "Corliss Zuk", "scores" : { "type" : "homework", "score" : 20.18160621941858 } }
//{ "_id" : 2, "name" : "Corliss Zuk", "scores" : { "type" : "homework", "score" : 66.28344683278382 } }
//{ "_id" : 3, "name" : "Bao Ziglar", "scores" : { "type" : "exam", "score" : 71.64343899778332 } }
//{ "_id" : 3, "name" : "Bao Ziglar", "scores" : { "type" : "quiz", "score" : 24.80221293650313 } }
//{ "_id" : 3, "name" : "Bao Ziglar", "scores" : { "type" : "homework", "score" : 1.694720653897219 } }
//{ "_id" : 3, "name" : "Bao Ziglar", "scores" : { "type" : "homework", "score" : 42.26147058804812 } }
//{ "_id" : 4, "name" : "Zachary Langlais", "scores" : { "type" : "exam", "score" : 78.68385091304332 } }
//{ "_id" : 4, "name" : "Zachary Langlais", "scores" : { "type" : "quiz", "score" : 90.2963101368042 } }
//{ "_id" : 4, "name" : "Zachary Langlais", "scores" : { "type" : "homework", "score" : 34.41620148042529 } }
//{ "_id" : 4, "name" : "Zachary Langlais", "scores" : { "type" : "homework", "score" : 19.21886443577987 } }
//Type "it" for more

//  list only homework
db.students.aggregate({$unwind: '$scores'}, {$match: {'scores.type':'homework'}})
//{ "_id" : 0, "name" : "aimee Zank", "scores" : { "type" : "homework", "score" : 6.676176060654615 } }
//{ "_id" : 0, "name" : "aimee Zank", "scores" : { "type" : "homework", "score" : 35.8740349954354 } }
//{ "_id" : 1, "name" : "Aurelia Menendez", "scores" : { "type" : "homework", "score" : 71.76133439165544 } }
//{ "_id" : 1, "name" : "Aurelia Menendez", "scores" : { "type" : "homework", "score" : 34.85718117893772 } }
//{ "_id" : 2, "name" : "Corliss Zuk", "scores" : { "type" : "homework", "score" : 20.18160621941858 } }
//{ "_id" : 2, "name" : "Corliss Zuk", "scores" : { "type" : "homework", "score" : 66.28344683278382 } }
//{ "_id" : 3, "name" : "Bao Ziglar", "scores" : { "type" : "homework", "score" : 1.694720653897219 } }
//{ "_id" : 3, "name" : "Bao Ziglar", "scores" : { "type" : "homework", "score" : 42.26147058804812 } }
//{ "_id" : 4, "name" : "Zachary Langlais", "scores" : { "type" : "homework", "score" : 34.41620148042529 } }
//{ "_id" : 4, "name" : "Zachary Langlais", "scores" : { "type" : "homework", "score" : 19.21886443577987 } }
//{ "_id" : 5, "name" : "Wilburn Spiess", "scores" : { "type" : "homework", "score" : 10.53058536508186 } }
//{ "_id" : 5, "name" : "Wilburn Spiess", "scores" : { "type" : "homework", "score" : 63.42288310628662 } }
//{ "_id" : 6, "name" : "Jenette Flanders", "scores" : { "type" : "homework", "score" : 16.58341639738951 } }
//{ "_id" : 6, "name" : "Jenette Flanders", "scores" : { "type" : "homework", "score" : 81.57115318686338 } }
//{ "_id" : 7, "name" : "Salena Olmos", "scores" : { "type" : "homework", "score" : 67.18328596625217 } }
//{ "_id" : 7, "name" : "Salena Olmos", "scores" : { "type" : "homework", "score" : 96.52986171633331 } }
//{ "_id" : 8, "name" : "Daphne Zheng", "scores" : { "type" : "homework", "score" : 75.94123677556644 } }
//{ "_id" : 8, "name" : "Daphne Zheng", "scores" : { "type" : "homework", "score" : 73.2975330340769 } }
//{ "_id" : 9, "name" : "Sanda Ryba", "scores" : { "type" : "homework", "score" : 12.47568017314781 } }
//{ "_id" : 9, "name" : "Sanda Ryba", "scores" : { "type" : "homework", "score" : 25.27368532432955 } }
//Type "it" for more

// group by id
db.students.aggregate({$unwind: '$scores'}, {$match: {'scores.type':'homework'}}, {$group:{'_id':'$_id', 'min': {$min: '$scores.score' }}})
//{ "_id" : 199, "min" : 5.861613903793295 }
//{ "_id" : 198, "min" : 55.85952928204192 }
//{ "_id" : 95, "min" : 23.73786528217532 }
//{ "_id" : 11, "min" : 15.81264595052612 }
//{ "_id" : 94, "min" : 26.82623527074511 }
//{ "_id" : 92, "min" : 31.70116444848026 }
//{ "_id" : 91, "min" : 18.65883614099724 }
//{ "_id" : 88, "min" : 92.99045377889979 }
//{ "_id" : 87, "min" : 18.96368757115227 }
//{ "_id" : 10, "min" : 19.31113429145131 }
//{ "_id" : 86, "min" : 63.74658824265818 }
//{ "_id" : 84, "min" : 43.46258375716373 }
//{ "_id" : 83, "min" : 20.04018866516366 }
//{ "_id" : 80, "min" : 75.62132497619177 }
//{ "_id" : 79, "min" : 63.95107452142731 }
//{ "_id" : 9, "min" : 12.47568017314781 }
//{ "_id" : 78, "min" : 16.68695227176766 }
//{ "_id" : 76, "min" : 59.50508603413107 }
//{ "_id" : 75, "min" : 27.51843538237827 }
//{ "_id" : 72, "min" : 38.22914395140913 }
//Type "it" for more

// group by id and name
db.students.aggregate({$unwind: '$scores'}, {$match: {'scores.type':'homework'}}, {$group:{'_id':{ _id: '$_id', name: '$name'}, 'min': {$min: '$scores.score' }}})
//{ "_id" : { "_id" : 199, "name" : "Rae Kohout" }, "min" : 5.861613903793295 }
//{ "_id" : { "_id" : 138, "name" : "Jesusa Rickenbacker" }, "min" : 42.60399593657424 }
//{ "_id" : { "_id" : 94, "name" : "Darby Wass" }, "min" : 26.82623527074511 }
//{ "_id" : { "_id" : 92, "name" : "Ta Sikorski" }, "min" : 31.70116444848026 }
//{ "_id" : { "_id" : 85, "name" : "Rae Kohout" }, "min" : 5.956241581565125 }
//{ "_id" : { "_id" : 137, "name" : "Tamika Schildgen" }, "min" : 54.75994689226145 }
//{ "_id" : { "_id" : 84, "name" : "Timothy Harrod" }, "min" : 43.46258375716373 }
//{ "_id" : { "_id" : 83, "name" : "Tonisha Games" }, "min" : 20.04018866516366 }
//{ "_id" : { "_id" : 80, "name" : "Echo Pippins" }, "min" : 75.62132497619177 }
//{ "_id" : { "_id" : 79, "name" : "Mariela Sherer" }, "min" : 63.95107452142731 }
//{ "_id" : { "_id" : 112, "name" : "Myrtle Wolfinger" }, "min" : 71.21962876453497 }
//{ "_id" : { "_id" : 78, "name" : "Len Treiber" }, "min" : 16.68695227176766 }
//{ "_id" : { "_id" : 117, "name" : "Bao Ziglar" }, "min" : 33.15177269905534 }
//{ "_id" : { "_id" : 76, "name" : "Adrien Renda" }, "min" : 59.50508603413107 }
//{ "_id" : { "_id" : 74, "name" : "Leola Lundin" }, "min" : 23.95163257932222 }
//{ "_id" : { "_id" : 82, "name" : "Santiago Dollins" }, "min" : 75.58039801610906 }
//{ "_id" : { "_id" : 42, "name" : "Kayce Kenyon" }, "min" : 56.66014675388287 }
//{ "_id" : { "_id" : 71, "name" : "Kam Senters" }, "min" : 55.4770385973351 }
//{ "_id" : { "_id" : 126, "name" : "Quincy Danaher" }, "min" : 66.99694110405133 }
//{ "_id" : { "_id" : 89, "name" : "Cassi Heal" }, "min" : 14.78122510144431 }
//Type "it" for more

// then sort
// NO! .aggregate().sort()
db.students.aggregate({$unwind: '$scores'}, {$match: {'scores.type':'homework'}}, {$group:{'_id':{ _id: '$_id', name: '$name'}, 'min': {$min: '$scores.score' }}}, {$sort: {'_id._id': 1}})
//{ "_id" : { "_id" : 0, "name" : "aimee Zank" }, "min" : 6.676176060654615 }
//{ "_id" : { "_id" : 1, "name" : "Aurelia Menendez" }, "min" : 34.85718117893772 }
//{ "_id" : { "_id" : 2, "name" : "Corliss Zuk" }, "min" : 20.18160621941858 }
//{ "_id" : { "_id" : 3, "name" : "Bao Ziglar" }, "min" : 1.694720653897219 }
//{ "_id" : { "_id" : 4, "name" : "Zachary Langlais" }, "min" : 19.21886443577987 }
//{ "_id" : { "_id" : 5, "name" : "Wilburn Spiess" }, "min" : 10.53058536508186 }
//{ "_id" : { "_id" : 6, "name" : "Jenette Flanders" }, "min" : 16.58341639738951 }
//{ "_id" : { "_id" : 7, "name" : "Salena Olmos" }, "min" : 67.18328596625217 }
//{ "_id" : { "_id" : 8, "name" : "Daphne Zheng" }, "min" : 73.2975330340769 }
//{ "_id" : { "_id" : 9, "name" : "Sanda Ryba" }, "min" : 12.47568017314781 }
//{ "_id" : { "_id" : 10, "name" : "Denisha Cast" }, "min" : 19.31113429145131 }
//{ "_id" : { "_id" : 11, "name" : "Marcus Blohm" }, "min" : 15.81264595052612 }
//{ "_id" : { "_id" : 12, "name" : "Quincy Danaher" }, "min" : 14.78936520432093 }
//{ "_id" : { "_id" : 13, "name" : "Jessika Dagenais" }, "min" : 78.18795058912879 }
//{ "_id" : { "_id" : 14, "name" : "Alix Sherrill" }, "min" : 13.66179556675781 }
//{ "_id" : { "_id" : 15, "name" : "Tambra Mercure" }, "min" : 42.19409476640781 }
//{ "_id" : { "_id" : 16, "name" : "Dodie Staller" }, "min" : 70.3632405320854 }
//{ "_id" : { "_id" : 17, "name" : "Fletcher Mcconnell" }, "min" : 31.15090466987088 }
//{ "_id" : { "_id" : 18, "name" : "Verdell Sowinski" }, "min" : 69.09840625499065 }
//{ "_id" : { "_id" : 19, "name" : "Gisela Levin" }, "min" : 49.43132782777443 }
//Type "it" for more
