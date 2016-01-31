### Chapter 3: Schema Design


#### MongoDB Schema Design
* application-driven design (match data access patterns of the application)
* (relational database schema design - agnostic to the application)
* features of mongodb
  * rich document (array, doument instead of tabular data)
  * pre-join data/embed data
  * no joins (scalability)
  * no constraints 
  * atomic operations (no transactions)
  * no declared schema

#### Relational Normalization
* 3rd normal form: every non-key attrivute in the table must provide a fact about the key, the whole key and nothing but the key
* goals of normalization
  * free the database of modification anomalies
    * inconsistency e.g. update email address for the same author in one row but not in another row 
  * minimize redesign when extending 
  * avoid bias toward any particular access pattern
    * equally bad at all of them
    * mongodb is to tune up the database to the application

#### Mongo Design for Blog
* e.g. embed comments into post collection 
  * denormalize collection in a way embedded data do not create anomalies
  * retrieve post only need to read from one collection 

#### Alternative Schema for Blog
* alternatively, separate comments, tags into another collection
  * no locality of data
  * different collection on different files on disk
  * separate disk read for displaying one post

#### Living Without Constraints
* up to application ensure data is consistent
* embed data, foreign key constraint not needed (pre-join)

#### Living Without Transactions
* transactions in relatonal database: atomicity, consistency, isolation, durability (ACID)
  * multiple table updates
* atomic operation in mongodb
  * embedded data in pre-joinned documents, hierarchy
  * update at once
* approaches to overcome lack of transaction in mongodb:
  1. restructure
    * work with single document with embedded data
  2. implement locking in software
    * create a critical section, semaphores 
  3. tolerate
    * tolerate a little bit inconsistency, a few beats behind

#### One to One Relations
* e.g.
  * employee : resume
  * builing : floorplan
  * patent : medical history
```
Employee { _id: 20, name: "Andrew", resume: 30 }
Resume { _id: 30, jobs: [], education: [] }

// or link in the other direction

Employee { _id: 20, name: "Andrew" }
Resume { _id: 30, jobs: [], education: [], employee: 20 }

// or embed

Employee { _id: 20, name: "Andrew", resume: {jobs: [], education: []} }

// or vice versa

Resume { _id: 30, jobs: [], education: [], employee: {} }

```
* considerations:
  * frequency of access
    * e.g. frequency access of employee but raraly for resume => separate collections 
  * size of items
    * e.g. update resume but not the employee part => separate collections to avoid overhead
    * size > 16 MB for a document => separate collections
  * atomicity of data
    * inconsistency is unwithstandable => embed
  * if both items exist together
    * e.g. if resume exist but not employee, i.e.g get a resume first before they become an employy => separate collections

#### One to Many Relations
##### One to Many
* e.g.
  * city : person (1 : 7m)
```
People { name: "Andrew", city: { name: "NY", area: ... }}
// duplicate of city datai n multiple documents
// open up to inconsistency
```
* use true linking
* 2 collections
```
People { name: "Andrew", city: 'NYC" }	// NYC being unique
City { _id: "NYC", ... }
```
* note: no foreign key constraints

##### One to Few
* special case of One to Many
* e.g. 
  * blog post : comments (1 : 10)
```
Post { name: ..., comments: [] }
```
* no duplication of data problem as every comment is only within a single post
* 1 collections 
* embed the many into the one

#### Many to Many Relations
* e.g.
  * books : authors
  * students : teachers

books : authors
```
// each book has a small number of authors, and each author has a small number of books

Books { _id: 12, title: "Gone with the Wind" }
Authors { _id: 27, author_name: "Margaret Mitchell", books: [ 12, 7, 8 ] }

// or in the other direction

Books { _id: 12, title: "Gone with the Wind", authors: [ 27 ]  }
Authors { _id: 27, author_name: "Margaret Mitchell" }
```
* having links in both directions may lead to inconistency but for better performance depening on access pattern
```
Books { _id: 12, title: "Gone with the Wind  }
Authors { _id: 27, author_name: "Margaret Mitchell", books: [ {...} ] }
```
* instead of _id, embed entire books in the authors.book array
* may duplicate multiple times if a book has multiple authors 
* open up to update anomalies, modification anomalies
* for performance reason 
* note: no foreign key constraints

students : teacher
* not a good idea to embed : may insert a teacher into the system before he has students, and vice versa 


#### Benefits of Embedding
* improved read performace
  * spinning disk
    * high latency: take long time to reach the first byte: > 1ms
    * high bandwidth: additional byte comes quickly
  * co-locate data used togehter in the same document by embedding
* one round trip to the db
  * one document instead of in two collecetions or in several relational tables 
* caveat: write is slowed down if a document winds up getting moved a lot more often


#### Trees
* e.g. Categories on e-commerce websites:
  * Home : Outdoor : Winter : Snow
```
Products { category: 7, product_name: "Leaf Blower" }
Category { _id: 7, category_name: "outdoors", parent: 6 }
// need to iterate the queries to find all the parents until get to the top
```
* list all the children
```
Products { category: 7, product_name: "Leaf Blower" }
Category { _id: 7, category_name: "outdoors", children: [3, 5, 7, 9] }
// limiting to find the entire sub-tree  
```
* best approach: list ancestors
```
Products { category: 7, product_name: "Leaf Blower" }
Category { _id: 7, category_name: "outdoors", ancestors: [3, 5, 7, 8, 9] }
// list all parents categories of this category for the breadcrumb
```
```
{
  _id: 34,
  name : "Snorkeling",
  parent_id: 12,
  ancestors: [12, 35, 90]
}
// to find all descendants of the snorkeling category:
db.categories.find({ancestors:34})
```

#### When to Denormalize
* as long as data is not duplicated, no modification anomalies
  * 1:1
    * Embed
    * no data duplcation: folding what normally in   a separate table into another table
  * 1:Many
    * Embed (from the many to the one)
    * if one to many, linking would avoid   duplication of data 
  * Many:Many
    * Link


#### Handling Blobs
* max document size: 16 MB
* GRIDFS
  * break up large files into chunks and store in the collection
  * store meta data about the chunks in a secondary collection
```
import gridfs
...
db = connection.test
videos_meta = db.videos_meta
grid = gridfs.GridFS(db, "videos")	#name of the collection = "videos"
fin = open("video.mp4", "r")
_id = grid.put(fin)
fin.close()
 ```
```
> show collections
videos.chunks
videos.files
videos_meta

> db.videos_meta.find()
{ "_id" : ObjectID(), "filename" : "video.mp4", "grid_id" : ObjectID() }

> db.videos.files.find()
{ "_id" : ObjectID(), "uploadDate" : ISODate(), "length" : 109705014, "chunkSize" : 262144, "md5" : ""}

> db.videos.chunks.count()
419

> db.videos.chunks.findOne().pretty()
```














