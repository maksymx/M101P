// hw 1.1

use m101

db.hw1.find()
// { "_id" : ObjectId("50773061bf44c220307d8514"), "answer" : 42, "question" : "The Ultimate Question of Life, The Universe and Everything" }

db.funnynumbers.find()
// { "_id" : ObjectId("50778ce69331a280cf4bcf7d"), "value" : 87 }
// { "_id" : ObjectId("50778ce69331a280cf4bcf7e"), "value" : 34 }
// { "_id" : ObjectId("50778ce69331a280cf4bcf7f"), "value" : 23 }
// { "_id" : ObjectId("50778ce69331a280cf4bcf80"), "value" : 71 }
// { "_id" : ObjectId("50778ce69331a280cf4bcf81"), "value" : 26 }
// { "_id" : ObjectId("50778ce69331a280cf4bcf82"), "value" : 8 }
// { "_id" : ObjectId("50778ce69331a280cf4bcf83"), "value" : 91 }
// { "_id" : ObjectId("50778ce69331a280cf4bcf84"), "value" : 99 }
// { "_id" : ObjectId("50778ce69331a280cf4bcf85"), "value" : 49 }
// { "_id" : ObjectId("50778ce69331a280cf4bcf86"), "value" : 25 }
// { "_id" : ObjectId("50778ce69331a280cf4bcf87"), "value" : 69 }
// { "_id" : ObjectId("50778ce69331a280cf4bcf88"), "value" : 4 }
// { "_id" : ObjectId("50778ce69331a280cf4bcf89"), "value" : 90 }
// { "_id" : ObjectId("50778ce69331a280cf4bcf8a"), "value" : 39 }
// { "_id" : ObjectId("50778ce69331a280cf4bcf8b"), "value" : 41 }
// { "_id" : ObjectId("50778ce69331a280cf4bcf8c"), "value" : 17 }
// { "_id" : ObjectId("50778ce69331a280cf4bcf8d"), "value" : 95 }
// { "_id" : ObjectId("50778ce69331a280cf4bcf8e"), "value" : 14 }
// { "_id" : ObjectId("50778ce69331a280cf4bcf8f"), "value" : 1 }
// { "_id" : ObjectId("50778ce69331a280cf4bcf90"), "value" : 62 }
// Type "it" for more

db.hw1.findOne()
// {
// 	"_id" : ObjectId("50773061bf44c220307d8514"),
// 	"answer" : 42,
// 	"question" : "The Ultimate Question of Life, The Universe and Everything"
// }

db.hw1.find().pretty()
// {
// 	"_id" : ObjectId("50773061bf44c220307d8514"),
// 	"answer" : 42,
// 	"question" : "The Ultimate Question of Life, The Universe and Everything"
// }
