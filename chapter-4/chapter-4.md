### Chapter 4: Performance

#### Latency & Throughput
1. Indexes
2. Sharding


#### Portable Storage Engines
* interface between disks and MongoDB Server
* cannot change once a db is created
* affect format of data file and indexes

##### 1. MMAPv1
* based on MMAP system call, map files into memory (virtual memory)
* memory management is handled by system
* page size; block size = 4K / 16K; swap from disk
* characteristics:
  * collection-level locking
  * inplace update
    * if cannot update, move as a whole to another block
  * power-of-two size allocation
    * e.g. 3 bytes -> 4 bytes, 19 bytes -> 32 bytes
    * mininum record space = 32 bytes (since 3.0)

##### 2. WiredTiger (Since 3.0)
* characteristics:
  * document-level _concurrency_
    * lock-free implementation
    * optimistic assume 2 writes are not the same document; if same, one is unwound and retry
  * compression: data & indexed
    * memory managed by WiredTiger; brought in pages of varying sizes 
    * data in memory is decompressed; compressed before write out to disk
  * No inplace update
    * update a document: mark a block as no longer in used, allocate another block and write
    * reclaim no longer used space later
    * write more but faster without locking on document
```
killall mongod
mongod --dbpath <path> --storageEngine wiredTiger
```
* path is at `/data/lib` by default 
* will not work if the data files was originally run with MMAPv1
```
db.foo.stats()
```
* size, storage engine, etc


#### Indexes
* faster read, slower read
* btree for MMAPv1, b+tree for WiredTiger

##### Creating Indexes
```
db.students.explain().find({student_id:5});
db.students.explain(true).find({student_id:5});
```
* `winningPlan` section
* `COLLSCAN` = Collection Scan
* `IXSCAN` = Index Scan
* `indexName: student_id_1`
* `explain(true)` execute query and show number of documents examined
```
db.students.createIndex({student_id: 1})
```
* 1 = ascending, -1 = descending
* scan entire collection to create index
* Compound Index
```
db.students.createIndex({student_id: 1, class_id: -1})
```
* `findOne` is faster than `find`: quit looking once a record is returned

##### Discovering (and Deleting) Indexes 
```
db.students.getIndexed()
```
* `getIndexed()` Since 3.0, work on both MMAPv1 & WiredTiger
* `system.indexes` Before 3.0, special collection, not work in WiredTiger
```
db.students.dropIndex({student_id: 1})
```
* provide same signature as index was created
* `_id_` exists on all collection, cannot be deleted

##### Multikey Indexes
* when there is _one_ document with an array as one of the key of the index
* `{color: 'red', tags: ['photography, 'hiking', 'golf']}`
  * index on {tags:-1} will create index points: `photography`, `hiking`, `golf`
  * index on {tags:-1, color:1} will create index points: `photography|red`, `hiking|red`, `golf|red`
* cannot have a document with both items of a compound index are arrays
  * cannot create index points for the Cartesian product of the items in the array 
* index only becomes multikey when the 1st document added with one of the keys an array
```
db.foo.insert({a:1, b:2});
db.foo.createIndex({a:1, b:1});
db.foo.explain().find({a:1, b:1});	// isMultiKey: false
db.foo.insert({a:3, b:[3,5,7]});	// isMultiKey: true
db.foo.explain().find({a:3 b:5});	// use index a_1_b_1
db.foo.insert({a:[3,4,6], b:[7,8,9]});	// error:  cannot index parallel arrays [b] [a]
db.foo.insert({a:[3,4,6], b:[8]});	// success
```
* multikey index allow any combinations:
  * {scalar, array} or {array, scalar} but not {array, array}
* once an index is upgraded to multikey, it remains even if all documents are dropped

##### Dot Notation and Multikey
```
db.students.createIndex({'scores.score':1});	// scores.score_1
db.students.explain().find({'scores.score':{'$gt':99}});
```
```
db.students.explain().find({'scores': {'$elemMatch': {type: 'exam', score: {'$gt':99.8}}}});
```
* `$elemMatch`: match documents that contain an array field with at least one element that matches _all_ the specified criteria
* explain()
  1. IXSCAN: runs a query on scores.score: [99.8, inf.0] using index scores.score_1
  2. FETCH: find all documents satifies _both_ criteria (`$elemMatch`) by iterating all documents from step 1
    * `executiionStats.nReturned` & `executionStats.docsExamined` using `explain(true)`
```
db.students.explain().find({'$and': [{'scores.type': 'exam', 'scores.score': {'$gt':99.8}}]});
```
* incorrect solution: return documents with a score > 99.8% but not neccesary for the exam
* explain()
  1. IXSCAN: runs a query on scores.score: [99.8, inf.0] using index scores.score_1
  2. FETCH: find all documents with {'scores.type': {'$eq': 'exam'}} (which is essentially all documents from 1)

##### Index Creation Option, Unique
```
db.stuff.insert({'thing':'apple'});
db.stuff.insert({'thing':'pear'});
db.stuff.insert({'thing':'apple'});
db.stuff.createIndex({thing:1});
db.stuff.dropIndex({thing:1});
db.stuff.createIndex({thing:1}, {unique:true});	// Error: duplicate key error
db.stuff.remove({'thing':'apple'}, {justOne: true});
db.stuff.createIndex({thing:1}, {unique:true});	// success
db.stuff.insert({'thing':'pear'});	// Error: duplicate key error
db.stuff.getIndexed();	// unique: true
```
* _id_ is unique but it does not show it

##### Index Creation, Sparse
* sparse index: when some of the key values is missing
* e.g. > 1 documents with a unique field c = null (still ok if one 1 documents with c = null)
```
db.employees.createIndex({cell:1},{unique:true});	//error: more than 1 employee without values for cell
db.employees.createIndex({cell:1},{unique:true, sparse:true});	// success
db.employees.explain().find().sort({employee_id:1});	// IXSCAN (not sparse index)
db.employees.explain().find().sort({cell:1});	// COLLSCAN (sparse index)
```
* *sparse index cannot be used for sorting*
  * documents with missing values not indexed, will be omitted
  * reverted to COLLSCAN to return all documents 
* less space
* unique index even if some values are missing

##### Index Creation, Background
Foreground | Background
--- | --- 
Default |
Fast | Slow
Block all writers and readers (per database) | Only One background index creation at a time; the next one will queue and wait (per database)
* replica set: take one out of the set temporarily for index creation and take turns
```
db.students.createIndex({'scores.score':1}, {background:true"});
```
* 2.4+: can create multiple background indexes in parallel on the same database
* 2.6+: The secondaries will begin index creation when the primary completes building its index
* Although the database server will continue to take requests, a background index creation still blocks the mongo shell that you are using to create the index.
* Creating an index in the background takes longer than creating it in the foreground

#### Explain
##### Using Explain
```
db.foo.find().explain()
```
* Prior 3.0
* operate on cursor object, `count()`, `remove()` will not work

```
db.foo.explain().find()
```
* Since 3.0
* `explain()` returns an explainable object
* works on the `find()` portion of
  * find()
  * update()
  * remove()
  * aggregate()
  * count()
* do not work on `insert()` as there is no `find()` portion

```
for (i=0; i<100; i++) { for (j=0; j<100; j++) { x = []; for (k=0; k<100; k++) { x.push( { a: i, b: j, c: k, _id: (100 * 100 * i + 100 * j + k) } ) }; db.example.insert(x) } }
db.example.createIndex({b:1});
var exp = db.example.explain();
exp.help();
```
* `queryPlanner.parsedQuery` : how the query would be executed
* `direction` : order of the index key would be used
```
db.example.find({a:17, b:55}).sort({b:-1}).explain();	// ok
db.example.find({a:17, b:55}).sort({b:-1}).count().explain();	// error, count() does not return a cursor
exp.find({a:17, b:55}).sort({b:-1}).count();	// ok

exp.find({c:200});	// no rejected plan because no other plans other than COLLSCAN

var cursor = db.example.find({a:99});
cursor.explain();
cursor.next();	// do not iterate cursor if assigned to variable, allow to explain
```

##### Explain: Verbosity
```
db.example.explain("executionStats");
db.example.explain("allPlansExecution");
```
* increasing level of verbosity: 
  1. queryPlanner (default)
    * show what indexes the database would use
    * winning plan, rejected plans
  2. executionStats
    * result of using the indexes
    * stats of using the winning plan
      * `nReturned`: no of doc returned
      * `executionTimeMillis`
      * `totalKeysExamined`
      * `totalDOcsexamined`
      * `executionTimeMillisEstimate` of intermediate stages
  3. allPlansExecution
    * what the query optimizer does periodically
    * runs all possible indexes in parallel and determine which is faster
    * examine just enough number of documents to eliminate a plan
      * e.g. plan A returns 0 document after examining 101 documents, plan B returns 100 documents after examining 100 documents; plan A stopped at 101 instead of, as in executionStats, examining 10000 documents to return 100 documents, and is abaondoned as soon as it knows the execution is not the best way

##### Covered Queries
* Covered Queries: a query that canbe satified entirely with an index; no documents needed to be inspected
```
// sample objects: {_id:ObjectId(""), i:0, j: 0, k:0}
// index i_1_j_1_k_1: {i:1,j:1,k:1}
var exp = db.numbers.explain("exeuctionStats");
exp.find({i:45, j:23});	// return 100 docs, examined 100 keys, 100 docs
// document is examined because _id is returned

exp.find({i:45, j:23}, {_id:0, i:1, j:1, k:1});	// return 100 docs, examined 100 keys, 0 docs; "covered query"

exp.find({i:45, j:23}, {_id:0});	// same output, but still examine 100 documents; not "covered query"
// still need to inspect the element to check what fields to return
```
* only if project exactly the subset of the index

##### When is an Index Used?
* shape of a query: e.g. fields to be searched on, sort
1. identifies a set of candidate indexes that match the shape of a query
2. determine which return results fastest in parallel threads
  * either return all result, or 
  * return a threshold of results in sorted order
3. cache the query plan for subsequent queries with same query shape
* a query plan is evicted from cache if
  * threshold of writes (1000)
  * rebuild hte index
  * any index is added or dropped from collection
  * mongod restart (all plan!)

##### How Large is Your Index?
* indexes are in "working set"
* important to fit entire working set into memory (disk paging for index? not efficient!)
```
db.students.stats()
```
* `totalIndexSize`
* `indexSizes` of individual index
```
db.students.totalIndexSize()
```
* WiredTiger supports prefix compression, index size is smaller at the cost of CPU

##### Number of Index Entries
* Index cardinality: no of index points for each type
  * Regular Index: 1:1
    * an index point for each document
    * if no document, index point under null entry
  * Sparse Index: <= number of documents
    * null is not indexed 
  * Multikey Index: significantly > number of documents
    * index point for every keys in the array
* when a document moves, every index point points to the document needs to be updated
* This cost is only for MMAPv1
* For WiredtTiger, index entries contains _id instead of pointers to actual disk locations. When document moves, indexes do not change. Only the index that translates _id and disk location is updated.

##### Geospatial Indexes
* 2D
* `location: [x, y]`
* `createIndex({location: '2d', type: 1})`
* `find({location: {$near: [x,y]}})`
* $near sort results by shortest distance by default

##### Geospatial Spherical
* 3D
* [GeoJSON](http://geojson.org) location specifcation
* Points, Geometry, Coordinates (longitude, latitude)
* mongodb only support simple structure such as Points and Polygon
```
db.places.createIndex({location: '2dsphere'})
db.places.find({
	location: {
		$near: {
			$geometry: {
				type: "Point",
				coordinates: [-122.166641, 37.4278925]
			},
			$maxDistance: 2000
		}
	}
});
```

##### Text Indexes
```
db.sentences.find({'words':'dog shrub 
ruby.'});	// exact match
// search on strings with standard index, either exact match, or regex (better if begin with ^)

db.sentences.createIndex({'words':'text'});

db.sentences.find({$text: {$search: 'dog'}});	// match all sentences with the word dog, anywhere in the sentence

db.sentences.find({$text: {$search: 'dog moss'}});	// match all sentences with either the word dog or moss, or both, anywhere in the sentence

db.sentences.find({$text: {$search: 'dog moss ruby'}});
db.sentences.find({$text: {$search: 'dog moss ruby'}});	// period, capitalization makes no difference
``` 
* logical OR
* punctuation, capitalization do not affect result
* words not considered significant are ignores e.g. a, the
```
// sort by text score, i.e. how good a match is 
db.sentences.find({$text: {$search: dog tree obsidian}}, {score: {$meta: 'textScore'}}).sort({score:{$meta: 'textScore'}});
```
* textScore: internally computed while runing through the text search 
* only one text index per collection (hence no need to specify which field to search)

##### Efficiency of Index Use 
* goal of designing/using indexes: efficient read/write operation
  * selectivity: minimize record scanned
  * other ops: how sorts are handled
```
db.students.createIndex({class_id:1});
db.students.createIndex({student_id:1, class_id:1});

// ~500 classes, 100000 students
db.students.find({student_id:{$gt:500000}, class_id:54}).sort({student_id:1}).explain("executionstats")
```
* winningPlan: student_id_1_class_id_1 is used: but not very selective (number of documents examined >>> number of documents returned) 
* selective index: number of documents examined is close to number of documents returned
```
rejectedPlans: [{
	"stage": "SORT",	//in-memory sort on student_id
	"sortPattern": { 
		"student_id": 1
	}
	...
}]
```
* SORT stage: unable to sort according to the query; have to do an in-memory sort

* index selected for winninePlan was able to return sorted output above threshold
* the problem is _range query_ specified is not very selective, end up touching every key of student_id
* class_id_1 is more selective in the class as there are only about 500 classes

* `hint(shape)` or `hint(index_name)`
```
db.students.find({student_id:{$gt:500000}, class_id:54}).sort({student_id:1}).hint({class_id:1}).explain("executionstats")
```

##### Efficiency of Index Use Example 
```
db.students.find({student_id:{$gt:500000}, class_id:54}).explain("executionstats");

db.students.createIndex({class_id:1, student_id:1});
```
```
db.students.find({student_id:{$gt:500000}, class_id:54}).sort({final_grade: -1}).hint({class_id:1}).explain("executionstats")

db.students.createIndex({class_id:1, final_grade: 1, student_id:1});
```
* class_id: very selective (equality)
* while walking through the keys in sort order (final_grade), eliminate records not matching student_id
* can walk the index in reverse order (if only one sorting field)
  * if sort on multiple fields, the direction of each field in the query must be the same as the direction of each field in the index 
* a few more keys to examined than number of documents return
* trade off to doing sort in database rather than in-memory sort (which should be avoid at all time)
* field order in compound index:
  1. equality fields
  2. sort fields
  3. range fields


#### Logging and Profiling

##### Logging Slow Queries
* by default mongod logs slow queryes of above 100 mulliseconds

##### Profiling
* profiler write entries to system.profile
  * level 0: default (off)
  * level 1: log slow queries 
  * level 2: log all queries (performacne debugging feature)
```
# run mongod with profiling level 1, logging slow queries that run more than 2 milliseconds
$ mongodb --dbpath /usr/local/var/mongodb --profile 1 --slowms 2
```
```
db.system.profile.find()
```
* cap collection: fixed size, recycle space in collection after it uses up
```
db.system.profile.find({ns:/school.student/}).sort({ts:1})
db.system.profile.find({millis:{$gt:1}}).sort({ts:1})
```
```
db.getProfilingLevel()	// 1
db.getProfilingStatus()	// {was:1, slowms:2}
db.setProfilingLevel(1,4);
db.setProfilingLevel(0);
```

##### Mongotop
* `mongotop`: high level view of where mongo is spending its time
```
$ mongotop 3	# run every 3 seconds
```

##### Mongostat
* `mongostat`: sample database in 1 second, show information such as number of operations e.g. insert, query, update, delete

* MMAPv1 & WiredTIger
  * getmore: get more from a cursor for a large result
  * command: e.g. createIndex, getIndexes
  * flushes: number of times flushing out to disk
  * res: resident memory
  * qr|qw: queue lengths for number of sockets requested / waiting for read and for write
  * ar|aw: number of active readers and writers
  * netIn/netOut: amount sent in and out of the database

* MMAPv1 only
  * mapped: amount of mapped memory (MMAPv1)
  * *faults*: number of page faults -> indicator or amount of  I/O


* WiredTiger
  * %dirty: percentage of WiredTiger cache written and needed to be written back to disk
  * %used: percentage of total cache size using

##### Sharding Overview
* multiple mongod servers
  * usually on different physical servers
  * replica set of servers for each mongod,
  keeps data in sync across different instances
  * logically one replica set as one shard
* mongos server
  * router
  * usually con application server
  * can be multiple mongos instances
* application talks to mongos which talks to mongod
* range-based system
* mongos send the request to the right mongod instance based on the request on the shard key in the query
* choose a shard key e.g. student_id or compund key
* insert: must include entire shard key
* update/remove/find: request is broadcast to all shards if shard key is not given
* update: multi-update is must if shard key is not given
