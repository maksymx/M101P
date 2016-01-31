use m101;

db.profile.find({ns:"school2.students", op:"query"}).sort({millis:-1}).limit(1);

//{ "_id" : ObjectId("56acc129093f385d539dcc72"), "ts" : ISODate("2012-11-20T20:09:49.862Z"), "op" : "query", "ns" : "school2.students", "query" : { "student_id" : 80 }, "ntoreturn" : 0, "ntoskip" : 0, "nscanned" : 10000000, "keyUpdates" : 0, "numYield" : 5, "lockStats" : { "timeLockedMicros" : { "r" : 19776550, "w" : 0 }, "timeAcquiringMicros" : { "r" : 4134067, "w" : 5 } }, "nreturned" : 10, "responseLength" : 2350, "millis" : 15820, "client" : "127.0.0.1", "user" : "" }
