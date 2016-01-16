// hw 1.2

use m101;

db.funnynumbers.find({value : {$mod : [3, 0]} })
// { "_id" : ObjectId("50778ce69331a280cf4bcf7d"), "value" : 87 }
// { "_id" : ObjectId("50778ce69331a280cf4bcf84"), "value" : 99 }
// { "_id" : ObjectId("50778ce69331a280cf4bcf87"), "value" : 69 }
// { "_id" : ObjectId("50778ce69331a280cf4bcf89"), "value" : 90 }
// { "_id" : ObjectId("50778ce69331a280cf4bcf8a"), "value" : 39 }
// { "_id" : ObjectId("50778ce69331a280cf4bcf93"), "value" : 93 }
// { "_id" : ObjectId("50778ce69331a280cf4bcf95"), "value" : 81 }
// { "_id" : ObjectId("50778ce69331a280cf4bcf97"), "value" : 99 }
// { "_id" : ObjectId("50778ce69331a280cf4bcf9e"), "value" : 90 }
// { "_id" : ObjectId("50778ce69331a280cf4bcfa0"), "value" : 12 }
// { "_id" : ObjectId("50778ce69331a280cf4bcfa2"), "value" : 0 }
// { "_id" : ObjectId("50778ce69331a280cf4bcfa4"), "value" : 81 }
// { "_id" : ObjectId("50778ce69331a280cf4bcfa9"), "value" : 15 }
// { "_id" : ObjectId("50778ce69331a280cf4bcfaa"), "value" : 57 }
// { "_id" : ObjectId("50778ce69331a280cf4bcfab"), "value" : 84 }
// { "_id" : ObjectId("50778ce69331a280cf4bcfb1"), "value" : 54 }
// { "_id" : ObjectId("50778ce69331a280cf4bcfb4"), "value" : 48 }
// { "_id" : ObjectId("50778ce69331a280cf4bcfb7"), "value" : 33 }
// { "_id" : ObjectId("50778ce69331a280cf4bcfbe"), "value" : 0 }
// { "_id" : ObjectId("50778ce69331a280cf4bcfbf"), "value" : 99 }
// Type "it" for more

db.funnynumbers.aggregate({ $match: {value : {$mod : [3, 0]} }})
//{ "_id" : ObjectId("50778ce69331a280cf4bcf7d"), "value" : 87 }
//{ "_id" : ObjectId("50778ce69331a280cf4bcf84"), "value" : 99 }
//{ "_id" : ObjectId("50778ce69331a280cf4bcf87"), "value" : 69 }
//{ "_id" : ObjectId("50778ce69331a280cf4bcf89"), "value" : 90 }
//{ "_id" : ObjectId("50778ce69331a280cf4bcf8a"), "value" : 39 }
//{ "_id" : ObjectId("50778ce69331a280cf4bcf93"), "value" : 93 }
//{ "_id" : ObjectId("50778ce69331a280cf4bcf95"), "value" : 81 }
//{ "_id" : ObjectId("50778ce69331a280cf4bcf97"), "value" : 99 }
//{ "_id" : ObjectId("50778ce69331a280cf4bcf9e"), "value" : 90 }
//{ "_id" : ObjectId("50778ce69331a280cf4bcfa0"), "value" : 12 }
//{ "_id" : ObjectId("50778ce69331a280cf4bcfa2"), "value" : 0 }
//{ "_id" : ObjectId("50778ce69331a280cf4bcfa4"), "value" : 81 }
//{ "_id" : ObjectId("50778ce69331a280cf4bcfa9"), "value" : 15 }
//{ "_id" : ObjectId("50778ce69331a280cf4bcfaa"), "value" : 57 }
//{ "_id" : ObjectId("50778ce69331a280cf4bcfab"), "value" : 84 }
//{ "_id" : ObjectId("50778ce69331a280cf4bcfb1"), "value" : 54 }
//{ "_id" : ObjectId("50778ce69331a280cf4bcfb4"), "value" : 48 }
//{ "_id" : ObjectId("50778ce69331a280cf4bcfb7"), "value" : 33 }
//{ "_id" : ObjectId("50778ce69331a280cf4bcfbe"), "value" : 0 }
//{ "_id" : ObjectId("50778ce69331a280cf4bcfbf"), "value" : 99 }
//Type "it" for more


db.funnynumbers.aggregate({ $match: {value : {$mod : [3, 0]} }}, { $group : { _id: null, sum : { $sum : "$value" } }} )
//{ "_id" : null, "sum" : 1815 }
