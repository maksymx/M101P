
#### Inserting Docs

`doc = { "name" : "Smith", "age" : 30 , "profession" : "hacker" }`

`db.people.insert( doc )`

`db.people.find()`

* _id : primary key, required, immutable
* ObjectID: global unique identifier: current time, identifier for the machine, process ID, counter global to the process consturcting the object

`db.people.insert( { "name" : "Jones" , "age" : 35 , "profession" : "baker" } )`

#### Introduction to findOne

`db.people.findOne()`

`db.people.findOne( { "name" : "Jone" } )`

`db.people.findOne( { "name" : "Jone" } , { "name" : true , "_id" : false } )`

* _id defaults to present, unless explicitly defined to be false
* mongodb is object store

#### Introduction to find

`db.people.find()`

`for (i=0; i<1000; i++) { names=["exam", "essay", "quiz"]; for (j=0;j<3;j++) { db.scores.insert( { "student" : i, "type" : names[j], score : Math.round(Math.random()*100) } ); } }`

* queries return in batches (2 layers of batches), batch size ~20 by default
* server close cursor after 10 minutes by default (hold during shell is open)

`db.scores.find().pretty()`

#### Querying Using field Selection

`db.scores.find( { type : "essay" } );`

`db.scores.find( { student : 19 } );`

* both fields must match the criteria (and)

`db.scores.find( { student : 19 , type : "essay" } );`

`db.scores.find( { student : 19 , type : "essay" } , { "score" : true , "_id" : false } );`

#### Querying Using $gt an $lt

`db.scores.find( { score : { $gt : 95 } } )`

`db.scores.find( { score : { $gt : 95 } , type : "essay" } )`

`db.scores.find( { score : { $gt : 95, $lte : 98 } , type : "essay" } )`

`db.scores.find( { score : { $gte : 95, $lt : 98 } , type : "essay" } )`

#### Inequalities on Strings

`db.people.insert( { name : "Alice" } );`

`db.people.insert( { name : "Bob" } );`

`db.people.insert( { name : "Charlie" } );`

`db.people.insert( { name : "Dave" } );`

`db.people.insert( { name : "Edgar" } );`

`db.people.insert( { name : "Fred" } );`

`db.people.find( { name : { $lt : "D" } } );`

`db.people.find( { name : { $lt : "D" , $gt : "B" } } );`

* lexicographically comparison
* no locale : sort ordering according to UTF-8 code units, Ascii-betically sort (C/POSIX)
* locale-aware sorting, collation

`db.people.insert( { name : 42 } )`

* schemaless
* comparison is strongly typed, dynamically typed
* comparison do not span data types

`db.people.find( { name : { $lt : "D" , $gt : "B" } } );`

* only return documents with name as a string, not numerical value

#### Using regexes, $exists, $type

`db.peopld.find( { profession : { $exists : true } } );`

`db.peopld.find( { profession : { $exists : false } } );`

* type specified in number, defined in BSON documentation

`db.people.find( { name : { $type : 2 } } );`

* Perl-style regex

`db.people.find( { name : { $regex : "a" } } );`

`db.people.find( { name : { $regex : "e$" } } );`

* not as query optimizable as simple string inequalities, except:

`db.people.find( { name : { $regex : "^A" } } );`

* is equivalent to 

`db.people.find( { name : { $gte : "A", $lt : "B" } } );`

#### Using $or
* prefix operator, before subqueries  
* operand : array of document, each as separate query
* match any element in the array 

`db.people.find( { $or : [ name : { $regex : "e$" } } , { age : { $exists : true } } ] } );`

#### Using $and

`db.people.find( { $and : [ { name : { $gt : "C" } } , { name : { $regex : "a" } } ] } ); `

* following expression is more performant:

`db.people.find( { name : { $gt : "C" , $regex : "a" } } );`

`db.scores.find( { score : { $gt : 50 } , score : { $lt : 60 } } );`

* find all documents with score less than 60
* second occurance of the same field will replace the first in a Javascript Object 

#### Querying Inside Arrays

`db.accounts.insert( { name : "George" , favorite : [ "ice cream" , " pretzels" ] } );`

`db.accounts.insert( { name : "Howard" , favorite : [ "pretzels" , "beer" ] } );`

* polymorphic over array and non-array type values

`db.acconts.find( { favorites : "pretzels" } ); `

`db.acconts.find( { favorites : "beer" } ); `

* no generalized recursion, no matching in arbitray depth
* nested content in array would not be matched
* only top level would be matched

`db.acconts.find( { favorites : "pretzels" , name : { $gt : "H" } } ); `

`db.acconts.find( { favorites : "beer" , name : { $gt : "H" } } ); `

#### Using $in and $all

`db.accounts.insert( { name : "Irving" , favorite : [ "bee" , "pretzels" , "cheese" ] } );`

`db.accounts.insert( { name : "John" , favorite : [ "beer" , "cheese" ] } );`

* all of the elements in the specified array, in any order 

`db.accounts.find( { favorites : { $all : [ "pretzels", "beer" ] } } );`

* only documents with value of corresponding field in the enumeration

`db.accounts.find( { name : { $in : [ "Howard", "John" ] } } );`

`db.accounts.find( { favorites : { $in : [ "beer", "ice cream" ] } } );`

#### Queries with Dot Notation
* nested document

`db.users.insert( { name : "richard" , email : { work : "richard@10gen.com" , personal : "kreuter@example.com" } } );`

`db.users.find( { email : { work : "richard@10gen.com" , personal : "kreuter@example.com" } } );`

* compare exactly byte-by-byte, same order required

`db.users.find( { email : { personal : "kreuter@example.com" , work : "richard@10gen.com" } } );`

* compare exactly byte-by-byte, all keys and elements required

`db.users.find( { email : { work : "richard@10gen.com" } } );`

* note the quotation marks

`db.users.find( { "email.work" : "richard@10gen.com" } );`

* fixed-depth path expression into a BSON document  

#### Querying, Cursors
* avoid printing out the result of the assignemnt

`cur = db.people.find(); null;`

`cur.hasNext()`

`cur.next()`

`while (cur.hasNext()) printjson(cur.next());`

* limit
* no trasnmission is made to the server and query is not executed yet, until retrieving documents (next(), hasNext() 

`cur = db.people.find(); null;`

`cur.limit(5); null;`

* sort
* 1 : asc,  -1 : desc

`cur = db.people.find(); null;`

`cur.sort( { name : -1 } ); null;`

* chained
* operation return cursor itself

`cur = db.people.find(); null;`

`cur.sort( { name : -1 } ).limit(3); null;`

* skip

`cur = db.people.find(); null;`

`cur.sort( { name : -1 } ).limit(3).skip(2); null;`

* modify information transmitted over to the database
* cannot apply to the cursor after bgein retrieving documents or hasNext()
* processed inside db engine,  NOT ordering in memory in client
* sort -> skip -> limit

#### Counting Results

`db.scores.find({ type : "exam" })`

`db.scores.count ({ type : "exam" })`

#### Wholesale Updating of a Document
* replace whole document

`db.people.update( { name : "Smith" } , { name : "Thompson", salary : 50000 } )`

#### Using the $set Command
* create / set field

`db.people.update( { name : "Alice" } , { $set : { age : 30 } } )`

* create / increment field by $inc step

`db.people.update( { name : "Alice" } , { $inc : 1 } )`

#### Using the $unset Command
* remove key & value

`db.people.update( { name : "Jones" } , { $unset : { profession : 1 } } )`

#### Using $push, $pop, $pull, $pullAll, $addToSet

`db.arrays.insert( { _id : 0 , a : [ 1, 2, 3, 4 ] } )`

* dot notation

`db.arrays.update( { _id : 0 } , { $set : { "a.2" : 5 } } )`

* add to the last

`db.arrays.update( { _id : 0 } , { $push : { a : 6 } } )`

* pop last element

`db.arrays.update( { _id : 0 } , { $pop : { a : 1 } } )`

* pop 1st element

`db.arrays.update( { _id : 0 } , { $pop : { a : -1 } } )`

* add all elements

`db.arrays.update( { _id : 0 } , { $pushAll : { a : [ 7, 8, 9 ] } } )`

* remove element regardless of position

`db.arrays.update( { _id : 0 } , { $pull : { a : 5 } } )`

* remove all occurences of elements in array regardless of position

`db.arrays.update( { _id : 0 } , { $pullAll : { a : [ 2, 4, 8 ] } } )`

* single occurence, if exist, do nothing

`db.arrays.update( { _id : 0 } , { $addToSet : { a : 5 } } )`

#### Upserts
* update if exist, otherwise insert

`db.people.update( { name : "George" } , { $set : { age : 40 } } , { upsert : true })`

* leave out field do not have concrete value to insert

`db.poeple.update( { age : { $gt : 50 } } , { $set : { name : "William" } } )`

`db.foo.update({username:'bar'},{'$set':{'interests':['cat','dog']}},{upsert:true})`

#### Multi-update
* update only first document it can find

`db.people.update( { } , { $set : { title : "Dr" } } )`

* update all matching documents

`db.people.update( { } , { $set : { title : "Dr" } } , { multi : true } )`

* NOT isolated transactions, sequence write operations (*yielding*)
* guarantee: individual document manipulation is atomic in respect to any concurrent readers or writers
* locking mechanism: treat a designated document as a shared recourse that writer operations need to acquire (e.g. update it) before performing operation on ordinary data (*sharding*)

#### Removing Data
* multi-remove matching documents

`db.people.remove( { name : "Alice" } )`

`db.people.remove( { name : { $gt : "M" } } )`

* all documents removed one by one [ prior 2.6 ]

`db.people.remove()`

* all documents removed one-by-one 

`db.people.remove( { } )`

* drop collection

`db.people.drop()`

* drop : indexes also dropped
* drop : free up data structure in data file
* drop : faster
* multi-remove : NOT isolated transaction

