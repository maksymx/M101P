use enron;

// this query does not remove duplicate recipients in the same email
db.messages.aggregate([
	{$project: {_id:0, headers:1}}, 
	{$unwind: '$headers.To'}, 
	{$group: {_id: {from: '$headers.From', to: '$headers.To'}, count: {$sum: 1}}}, 
	{$sort: {count : -1}}, 
	{$limit: 10}
]);
//{ "_id" : { "from" : "veronica.espinoza@enron.com", "to" : "recipients@enron.com" }, "count" : 2181 }
//{ "_id" : { "from" : "susan.mara@enron.com", "to" : "richard.shapiro@enron.com" }, "count" : 974 }
//{ "_id" : { "from" : "susan.mara@enron.com", "to" : "jeff.dasovich@enron.com" }, "count" : 750 }
//{ "_id" : { "from" : "susan.mara@enron.com", "to" : "james.wright@enron.com" }, "count" : 708 }
//{ "_id" : { "from" : "soblander@carrfut.com", "to" : "soblander@carrfut.com" }, "count" : 679 }
//{ "_id" : { "from" : "susan.mara@enron.com", "to" : "james.steffes@enron.com" }, "count" : 648 }
//{ "_id" : { "from" : "evelyn.metoyer@enron.com", "to" : "kate.symes@enron.com" }, "count" : 567 }
//{ "_id" : { "from" : "susan.mara@enron.com", "to" : "karen.denne@enron.com" }, "count" : 552 }
//{ "_id" : { "from" : "susan.mara@enron.com", "to" : "alan.comnes@enron.com" }, "count" : 550 }
//{ "_id" : { "from" : "susan.mara@enron.com", "to" : "paul.kaufman@enron.com" }, "count" : 509 }

// example of email where 'recipients@enron.com' appears multiple times in one email
db.messages.aggregate([
	{$project: {_id:1, headers:1}}, 
	{$match: {'headers.From': 'veronica.espinoza@enron.com', 'headers.To': 'recipients@enron.com'}},
	{$limit: 1}
]);


db.messages.aggregate([
	{$project: {_id:1, headers:1}}, 
	{$unwind: '$headers.To'}, 
	{$group: {_id: {msg: '$_id', from: '$headers.From', to: '$headers.To'}}}, 
	{$group: {_id: {from: '$_id.from', to: '$_id.to'}, count: {$sum: 1}}}, 
	{$sort: {count: -1}}, 
	{$limit: 10}
], {allowDiskUse: true}
);
//{ "_id" : { "from" : "susan.mara@enron.com", "to" : "jeff.dasovich@enron.com" }, "count" : 750 }
//{ "_id" : { "from" : "soblander@carrfut.com", "to" : "soblander@carrfut.com" }, "count" : 679 }
//{ "_id" : { "from" : "susan.mara@enron.com", "to" : "james.steffes@enron.com" }, "count" : 646 }
//{ "_id" : { "from" : "susan.mara@enron.com", "to" : "richard.shapiro@enron.com" }, "count" : 616 }
//{ "_id" : { "from" : "evelyn.metoyer@enron.com", "to" : "kate.symes@enron.com" }, "count" : 567 }
//{ "_id" : { "from" : "susan.mara@enron.com", "to" : "karen.denne@enron.com" }, "count" : 552 }
//{ "_id" : { "from" : "susan.mara@enron.com", "to" : "alan.comnes@enron.com" }, "count" : 550 }
//{ "_id" : { "from" : "susan.mara@enron.com", "to" : "paul.kaufman@enron.com" }, "count" : 506 }
//{ "_id" : { "from" : "susan.mara@enron.com", "to" : "harry.kingerski@enron.com" }, "count" : 489 }
//{ "_id" : { "from" : "sgovenar@govadv.com", "to" : "paul.kaufman@enron.com" }, "count" : 488 }

