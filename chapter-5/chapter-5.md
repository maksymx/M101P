### Chapter 5: Aggregation Framework

#### Aggregation Pipeline
stage|description|---
---|---|---
$project|reshape|1:1
$match|filter|n:1
$group|aggregate|n:1
$sort|sort|1:1
$skip|skips|n:1
$limit|lmits|n:1
$unwind|normalize|1:n
$out|output|1:1
$redact||
$geonear||

* stages can appear multiple times inside the pipeline


#### Simple Example Expandd
* products -> $group -> results
* group phase is doing upsert to the aggregated result set (with _id)
```
> db.stuff.find()
{ "_id" : ObjectId("50b26f9d80a78af03b5163c8"), "a" : 1, "b" : 1, "c" : 1 }
{ "_id" : ObjectId("50b26fb480a78af03b5163c9"), "a" : 2, "b" : 2, "c" : 1 }
{ "_id" : ObjectId("50b26fbf80a78af03b5163ca"), "a" : 3, "b" : 3, "c" : 1 }
{ "_id" : ObjectId("50b26fcd80a78af03b5163cb"), "a" : 3, "b" : 3, "c" : 2 }
{ "_id" : ObjectId("50b26fd380a78af03b5163cc"), "a" : 3, "b" : 5, "c" : 3 }
db.stuff.aggregate([{$group:{_id:'$c'}}])
// returns 3 documents as there are 3 unique values for field c
```

#### Aggregation Expressions Overview
* aggregation expressions used in the group stage
  * `$sum`
  * `$avg`
  * `$min`
  * `$max`
  * `$push`
    * build arrays
  * `$addToSet`
    * build arrays, add uniquely
  * `$first`
    * require to sort first, otherwise arbitrary
  * `$last`
    * require to sort first, otherwise arbitrary

##### $sum

##### $avg
```javascript
db.small_zips.aggregate([{$group:{_id:"$state",pop:{$avg:"$pop"}}}]);
```

##### $addToSet
```javascript
db.products.aggregate([{$group:{_id:{maker:"$manufacturer"},category:{$addToSet:"$category"}}}])
```
combined with `$unwind`
```javascript
db.products.aggregate([{$group:{_id:{maker:"$manufacturer"},category:{$addToSet:"$category"}}},{$unwind:"$category"}])
```

```javascript
db.zips.aggregate([{$group:{_id:"$city",postal_codes:{$addToSet:"$_id"}}}])
// _id refers to group by "$city"
// "$id" in $addToSet refers to the _id values in the source documents

// to find city CENTREVILLE 
db.zips.aggregate([{$group:{_id:"$city",postal_codes:{$addToSet:"$_id"}}},{$match:{_id:"CENTREVILLE"}}])
```

##### $push
* do not guarantee only add each item only once
```javascript
db.zips.aggregate([{"$group":{"_id":"$city", "postal_codes":{"$push":"$_id"}}}])
db.zips.aggregate([{"$group":{"_id":"$city", "postal_codes":{"$push":"$_id"}}}])
// produce same  result as _id in the source document is unique
```

##### $max
* e.g. group by manufacturer, find the max price, but cannot find the corresponding product
* can do so by using `$sort` & `$last`
```javascript
// find max population by state
db.zips.aggregate([{$group:{_id:"$state",pop:{$max:"$pop"}}}])
```

#### Double $group stages
```javascript
db.grades.aggregate([
    {'$group':{_id:{class_id:"$class_id", student_id:"$student_id"}, 'average':{"$avg":"$score"}}},
    {'$group':{_id:"$_id.class_id", 'average':{"$avg":"$average"}}}])
// "$_id.class_id" and "$average" in the second grouping refers to the intermediate result of the previous stage
```

#### Using $project
* `$project` phase reshape the documents
  * remove keys
  * add new keys
  * reshape keys, i.e. put a key into a subdocument with another key
  * simple functions on keys, e.g.
    * `$toUpper`
    * `$toLower`
    * `$add`
    * `$multiply`
```javascript
db.zips.aggregate([{$project:{_id:0, city:{$toLower:"$city"},pop:1,state:1,zip:"$_id"}}])
// key_name:1 - include a key exactly as it is named in the source document
// _id - must be explicitly suppressed
// other keys - not included if not mentioned 
```
* do not retain the original ordering of the fields

#### Using $match
* pre-agg filter: filter the documents and only aggregate on a subset of them
* filter the results
* `$match` & `$sort` can use indexed but only if at he begining of thre aggregation pipeline

#### Using $text
```javascript
// with full text search index on fields "word"
// reminder: only 1 full text search index for eaach collection'
// no need to specify which field
db.sentences.aggregate([
	{$match:
		{$text: {$search "tree rat"}}
	},
	{$project:
		{words: 1, _id: 0}
	}
])

// sort by textScore, i.e. sentences with both tree & rat first
db.sentences.aggregate([
	{$match:
		{$text: {$search "tree rat"}}
	},
	{$sort:
		{score: {$meta: "textScore"}}
	},
	{$project:
		{words: 1, _id: 0}
	}
])
```
* `$match` phase of full text search must be the first stage in the pipeline as indexes no longer appear in subsequent stages (intermediate results)

#### Using $sort
* aggregation framework supports both disk & in-memory sorting
  * default: in-memory, limit: 100MB for any pipeline stage
* before or after grouping stage

#### Using $limit and $skip
* `sort` first

1. `skip`
2. `limit`

* in the case of `find()`, the driver would reorder as `sort`->`skip`->`limit`, so order given to skip & sort do not matter
* but in aggregation pipeline, ordered list of stages are given as order specified, so order does matter
```javascript
db.zips.aggregate([
	...
	{$sort:
		{
			population:-1
		}
	},
	{$skip: 10},
	{$limit: 5}
])
// skip the first 10 documents then return the next 5 documents

db.zips.aggregate([
	...
	{$sort:
		{
			population:-1
		}
	},
	{$limit: 5},
	{$skip: 10}
])
// first return 5 documents, then skip 10 documents (from the returned document in limit stage), hence return 0 documents
```

#### Revisiting $first and $last
* `$group` operators
* get the first/last values in each group
```javascript
...
{$group:
	{
		_id:"$_id.state",
		city: {$first: "$_id.city"},
		population: {$first:"$population"}
	}
},
...
```

#### Using $unwind
* flatten array in a document
* array = prejoined data, unwind = unjoin the data and rejoin for grouping calculations
* data explosion : number of documents * number of elements in the array

#### $unwind example
* `$push` is the reversed effect of `$unwind`
* `$addToSet` will not recreate the original array if the values are not unique

#### Double $unwind
* two arrays fields, double unwind = create a Cartesian product of the two arrays as well as the rest of the document
```javascript
// reverse double unwind in 2 stages with $push
db.inventory.aggregate([
	{$unwind: "$sizes"},
	{$unwind: "$colors"},
	{$group:
	{_id: {name: "$name", sizes: "$sizes"}, "colors": {$push: "$colors"}}
	},
	{$group:
		{_id: {name: "$_id.name", colors: "$colors"}, "sizes": {$push: "$_id.sizes"}}
	},
	{$project:
		{_id:0, name: "$_id.name", colors: "$_id.colors", sizes: 1}
	}
])

// reverse double unwind in 1 stage with $addToSet if unique
db.inventory.aggregate([
    {$unwind: "$sizes"},
    {$unwind: "$colors"},
    {$group:
        {_id: "$name", sizes: {$addToSet: "$sizes"}, colors: {$addToSet: "$colors"}}
    }
])
```

#### Using $out
* redirect output of aggregation to a new collection
* destructive: destroy it if collection exists
```javascript
db.games.aggreate([
	{$group:
		{
			_id: {
				first_name: "$first_name",
				last_name: "$last_name"
			},
			points: {
				$sum: "$points"
			}
		}
	},
	${out: 'summary_results'}
])
db.summary_results.find()
```
* be certain _id is unique, otherwise error
* e.g. when unwind, _id:ObjectId() is not unique
* if any insert error, will not destroy previous collection, no partial result
* under the cover, the results are sent to a temporary collection, at the very end renaming and reassignment and update
```javascript
db.games.aggregate([
	{$unwind:"$move"},
	{$out:"summary_results"}
])
// duplicate key errors
/*
{ "_id" : ObjectId("xxx123"), "moves" : 2}
{ "_id" : ObjectId("xxx123"), "moves" : 3}
{ "_id" : ObjectId("xxx123"), "moves" : 5}
*/
```

### Aggregation Options
* explain
* allowDiskUse
  * by default, any stage of aggregation is limited to 100 MB
  * if exceed, aggregration will fail
  * e.g. sort is memory intensive
* cursor
```javascript
db.zips.aggregate(
	[{$group:{_id:"$state", population:{$sum:"$pop"}}}],
	{explain:true}
)
```
```javascript
db.zips.aggregate(
	[{$group:{_id:"$state", population:{$sum:"$pop"}}}],
	{allowDiskUse:true}
)
```
1. aggregate([stage, stage, stage], {options})
2. aggregate(stage, stage, stage)
  * cannot add option to this form

* no dollarSign $

### Python and Aggregation Results
* mongodb
  * prior 2.6, aggregation returns 1 document (limit: 16MB)
  * since 2.6, aggregation returns a cursor
* pymongo
  * prior 2.6, aggregation returns 1 document
  * since 2.6, aggregation returns 1 document, but with option to return as cursor
  * since 3.0, aggregation returns a cursor by default
```python
// returns 1 document
result = db.zips.aggregate([{"$group":{"_id":"$state", "population":{"$sum":"$pop"}}}])

print result
```
```python
// returns a cursor
result = db.zips.aggregate([{"$group":{"_id":"$state", "population":{"$sum":"$pop"}}}], cursor={})

for doc in result:
	print doc
```
* other options (different as in mongo shell)
```python
result = db.zips.aggregate([{"$group":{"_id":"$state", "population":{"$sum":"$pop"}}}], cursor={}, allowDiskUse=True)

```

### Mapping between SQL and Aggregation
[SQL to Aggregation Mapping Chart](https://docs.mongodb.org/manual/reference/sql-aggregation-comparison/)

SQL|MongoDB Aggreation Operators
---|---
WHERE|$match
GROUP BY|$group
HAVING|$match
SELECT|$project
ORDER BY|$sort
LIMIT|$limit
SUM()|$sum
COUNT()|$sum
join|no direct analog, similar to $unwind

* multiple stages in pipeline

#### Some Common SQL examples

#### Limitations of the Aggregation Framework
* by default 100 MB limit for each pipeline stage
  * workaround: `allowDiskUse`
* 16 MB limit if return result in 1 document
  * (prior 2.6) python by default returns 1 document, hence 16 MB limit by default in python
  * workaround: `cursor={}`
* sharded: $group, $sort
  * `$project`, `$match`: go in parallel when query sent by mongos to all shards
  * `$group`, `$sort`: all data will be sent to the primary shard for the database
    * initially distributed, collected at primary shard when `$group`/`$sort` phase started
      * primary shard: where an unsharded collection will live
    * not same level of scability as in Hadoop where there might be greater parallelism for very large Map/Reduce jobs
      * aggregation is an interface to Map/Reduce functionality within MongoDB
      * performance of a large aggregation on a sharded cluster might not be quite as good as running a large Hadoop job
  * alternatives to aggregation
    * Hadoop - Map/Reduce
      * Hadoop connector
      * get data out of mongodb (HDFS)
    * Map/Reduce (not recommended)

---

* `$addToSet` is case sensitive
* "$" is added and quoted to indicate this is a field from the result from last stage, if on the right hand side
(just like dot notation must be quoted)
* how to do a count
```javascript
'count' : {'$sum':1}
```

