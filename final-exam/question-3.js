use enron;

// check the explain plan with search criteria
// collection scan
db.messages.explain().find({'headers.Message-ID': '<8147308.1075851042335.JavaMail.evans@thyme>'});
//{
//        "queryPlanner" : {
//                "plannerVersion" : 1,
//                "namespace" : "enron.messages",
//                "indexFilterSet" : false,
//                "parsedQuery" : {
//                        "headers.Message-ID" : {
//                                "$eq" : "<8147308.1075851042335.JavaMail.evans@thyme>"
//                        }
//                },
//                "winningPlan" : {
//                        "stage" : "COLLSCAN",
//                        "filter" : {
//                                "headers.Message-ID" : {
//                                        "$eq" : "<8147308.1075851042335.JavaMail.evans@thyme>"
//                                }
//                        },
//                        "direction" : "forward"
//                },
//                "rejectedPlans" : [ ]
//        },
//        "serverInfo" : {
//                "host" : "vagrant-ubuntu-trusty-64",
//                "port" : 27017,
//                "version" : "3.2.0",
//                "gitVersion" : "45d947729a0315accb6d4f15a6b06be6d9c19fe7"
//        },
//        "ok" : 1
//}

// create index
db.messages.createIndex({'headers.Message-ID': 1});

// verify index is created
db.messages.getIndexes();
//[
//        {
//                "v" : 1,
//                "key" : {
//                        "_id" : 1
//                },
//                "name" : "_id_",
//                "ns" : "enron.messages"
//        },
//        {
//                "v" : 1,
//                "key" : {
//                        "headers.Message-ID" : 1
//                },
//                "name" : "headers.Message-ID_1",
//                "ns" : "enron.messages"
//        }
//]

// now the query will be using the index
db.messages.explain().find({'headers.Message-ID': '<8147308.1075851042335.JavaMail.evans@thyme>'});
//{
//        "queryPlanner" : {
//                "plannerVersion" : 1,
//                "namespace" : "enron.messages",
//                "indexFilterSet" : false,
//                "parsedQuery" : {
//                        "headers.Message-ID" : {
//                                "$eq" : "<8147308.1075851042335.JavaMail.evans@thyme>"
//                        }
//                },
//                "winningPlan" : {
//                        "stage" : "FETCH",
//                        "inputStage" : {
//                                "stage" : "IXSCAN",
//                                "keyPattern" : {
//                                        "headers.Message-ID" : 1
//                                },
//                                "indexName" : "headers.Message-ID_1",
//                                "isMultiKey" : false,
//                                "isUnique" : false,
//                                "isSparse" : false,
//                                "isPartial" : false,
//                                "indexVersion" : 1,
//                                "direction" : "forward",
//                                "indexBounds" : {
//                                        "headers.Message-ID" : [
//                                                "[\"<8147308.1075851042335.JavaMail.evans@thyme>\", \"<8147308.1075851042335.JavaMail.evans@thyme>\"]"
//                                        ]
//                                }
//                        }
//                },
//                "rejectedPlans" : [ ]
//        },
//        "serverInfo" : {
//                "host" : "vagrant-ubuntu-trusty-64",
//                "port" : 27017,
//                "version" : "3.2.0",
//                "gitVersion" : "45d947729a0315accb6d4f15a6b06be6d9c19fe7"
//        },
//        "ok" : 1
//}

// find the record to be updated
db.messages.find({'headers.Message-ID': '<8147308.1075851042335.JavaMail.evans@thyme>'});

// show only neccessary keys
db.messages.find({'headers.Message-ID': '<8147308.1075851042335.JavaMail.evans@thyme>'}, {_id: 0, 'headers.Message-ID': 1, 'headers.To': 1});
//{ "headers" : { "Message-ID" : "<8147308.1075851042335.JavaMail.evans@thyme>", "To" : [ "steven.kean@enron.com", "richard.shapiro@enron.com", "james.steffes@enron.com", "christi.nicolay@enron.com", "sarah.novosel@enron.com", "ray.alvarez@enron.com", "sscott3@enron.com", "joe.connor@enron.com", "dan.staines@enron.com", "steve.montovano@enron.com", "kevin.presto@enron.com", "rogers.herndon@enron.com", "mike.carson@enron.com", "john.forney@enron.com", "laura.podurgiel@enron.com", "gretchen.lotz@enron.com", "juan.hernandez@enron.com", "miguel.garcia@enron.com", "rudy.acevedo@enron.com", "heather.kroll@enron.com", "david.fairley@enron.com", "elizabeth.johnston@enron.com", "bill.rust@enron.com", "edward.baughman@enron.com", "terri.clynes@enron.com", "oscar.dalton@enron.com", "doug.sewell@enron.com", "larry.valderrama@enron.com", "nick.politis@enron.com", "fletcher.sturm@enron.com", "chris.dorland@enron.com", "jeff.king@enron.com", "john.kinser@enron.com", "matt.lorenz@enron.com", "patrick.hansen@enron.com", "lloyd.will@enron.com", "dduaran@enron.com", "john.lavorato@enron.com", "louise.kitchen@enron.com", "greg.whalley@enron.com" ] } }

// question-3: update
db.messages.update({'headers.Message-ID': '<8147308.1075851042335.JavaMail.evans@thyme>'}, {$push: {'headers.To': 'mrpotatohead@mongodb.com'}});
//WriteResult({ "nMatched" : 1, "nUpserted" : 0, "nModified" : 1 })

// verify the result
db.messages.find({'headers.Message-ID': '<8147308.1075851042335.JavaMail.evans@thyme>'}, {_id: 0, 'headers.Message-ID': 1, 'headers.To': 1});
//{ "headers" : { "Message-ID" : "<8147308.1075851042335.JavaMail.evans@thyme>", "To" : [ "steven.kean@enron.com", "richard.shapiro@enron.com", "james.steffes@enron.com", "christi.nicolay@enron.com", "sarah.novosel@enron.com", "ray.alvarez@enron.com", "sscott3@enron.com", "joe.connor@enron.com", "dan.staines@enron.com", "steve.montovano@enron.com", "kevin.presto@enron.com", "rogers.herndon@enron.com", "mike.carson@enron.com", "john.forney@enron.com", "laura.podurgiel@enron.com", "gretchen.lotz@enron.com", "juan.hernandez@enron.com", "miguel.garcia@enron.com", "rudy.acevedo@enron.com", "heather.kroll@enron.com", "david.fairley@enron.com", "elizabeth.johnston@enron.com", "bill.rust@enron.com", "edward.baughman@enron.com", "terri.clynes@enron.com", "oscar.dalton@enron.com", "doug.sewell@enron.com", "larry.valderrama@enron.com", "nick.politis@enron.com", "fletcher.sturm@enron.com", "chris.dorland@enron.com", "jeff.king@enron.com", "john.kinser@enron.com", "matt.lorenz@enron.com", "patrick.hansen@enron.com", "lloyd.will@enron.com", "dduaran@enron.com", "john.lavorato@enron.com", "louise.kitchen@enron.com", "greg.whalley@enron.com", "mrpotatohead@mongodb.com" ] } }