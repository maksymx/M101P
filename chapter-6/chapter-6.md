### Chapter 6: Application Engineering

Engineering Solutions:

1. Durability of writes
  * persisted on disk
2. Replication
  * fault tolerance and availability
3. Sharding
  * distribute a collection across multiple servers to gain greater throughput


#### Write Concern

Memory Structures:

1. Pages
  * periodically write to disk depending on memory pressure
  * MMAPv1: memory mapped address correspond to pags on the disk
2. Journal
  * log of every write the database processes
  * also in memory

* every write simultaneously write to pages and journal
* by default, when perform an update, the driver waits for a response
* "acknowledged update"/"acknowledged insert"

* `w`: flag to indicate whether to wait for server response
  * `w=1` (default): wait for server to response write
* `j`: flag to indicate whether to wait for the journal to be written to disk
  * `j=false` (default): do NOT wait for journal to be wrtiten to disk

w|j|notes
---|---|---
1|false|fast, window of vulnerability: if server crashes before written to disk (default)
1|true|slow, greater level of security (recover from journal)
o||not recommended "unacknowledged write"


#### Network Errors
* insert with _id, redo at most get duplicated key error
* update is not idempotent, especially with `$inc`, `$push`
* avoid at all cost: turn all updates into insert
  * read full value, delete and insert
* Reasons why an application may receive an error back even if the write was successful:
  * The network TCP connection between the application and the server was reset after the server received a write but before a response could be sent.
  * The MongoDB server terminates between receiving the write and responding to it.
  * The network fails between the time of the write and the time the client receives a response to the write.


#### Introduction to Replication
* availability
* fault tolerance
* replica set: set of mongo nodes
* one primary, others are secondary
* driver connect to primary, only writes to primary
* in case primary goes down, the secondaries  will perform an election to elect a new primary
* require strict majority of the original number of nodes for an elcetion
  * e.g. original 3 nodes, requires 2 nodes to elect a new primary
* app reconnect to the new primary
* when the nodes comes back up, it will rejoin the group as a secondary
* mininum number of nodes: 3
  * < 3 no election
 

#### Replica Set Elections
* regular
  * can be primary, secondary
* arbiter
  * for voting purposes
  * e.g. even number of replica set nodes
  * e.g. 3 nodes = 2 regular + 1 arbiter (only 2 machine)
  * vote as regular node
* delayed node
  * disaster recovery
  * vote as regular node
  * cannot be primary node (priority = 0)
* hidden node
  * for analytics
  * cannot be primary (priority = 0)
  * vote as regular node


#### Write Consistency
* writes always on the primary
* read on the primary
  * strong consistency of reads with respect to writes
  * will not read stale data
* read on the secondaries
  * may read stale data, relative to what wrote on the primary 
* lag between 2 nodes is not guaranteed
* replication is asynchronous
* read scaling through all the nodes
* when primary failed and new primary is yet elected, write cannot be completed
* in contrast to other systems: "eventual consistency"
  * eventually read == write, but timeframe is not guaranteed

#### Creating a Replica Set
```shell
#!/usr/bin/env bash
mkdir -p /data/rs1 /data/rs2 /data/rs3
mongod --replSet m101 --logpath "1.log" --dbpath /data/rs1 --port 27017 --oplogSize 64 --fork --smallfiles
mongod --replSet m101 --logpath "2.log" --dbpath /data/rs2 --port 27018 --oplogSize 64 --smallfiles --fork
mongod --replSet m101 --logpath "3.log" --dbpath /data/rs3 --port 27019 --oplogSize 64 --smallfiles --fork
```
```javascript
config = { _id: "m101", members:[
          { _id : 0, host : "localhost:27017", priority:0, slaveDelay:5},
          { _id : 1, host : "localhost:27018"},
          { _id : 2, host : "localhost:27019"} ]
};

rs.initiate(config);
rs.status();
```
```javascript
m101:SECONDARY> db.people.insert({'name' : 'Andrew'})
WriteResult({ "writeError" : { "code" : 10107, "errmsg" : "not master" } })

m101:PRIMARY> db.people.insert({'name' : 'Andrew'})
WriteResult({ "nInserted" : 1 })

m101:SECONDARY> db.people.find()
Error: error: { "ok" : 0, "errmsg" : "not master and slaveOk=false", "code" : 13435 }

m101:SECONDARY> rs.slaveOk()
m101:SECONDARY> db.people.find()
{ "_id" : ObjectId("56baf66040d36e1b85116a42"), "name" : "Andrew" }
```

#### Replica Set Internals
* each mongodb has within it an oplog
* secondaries constantly reading oplog of the primary (or sync from other secondary) and apply the same operations  
```javascript
use local
db.oplong.rs.find();
rs.status();
// optimeDate : oplog time
// syncingTo : node get the updates from
```
* oplog is capped collection, roll off after certain time
* rolling upgrade
  * e.g. a 3.0 primary replicating itself to an older secondary
* mixed-mode storage engines
  * e.g. MMAPv1 primary, WiredTiger secondary

#### Failover and Rollback
* primary was taken down before the writes are replicated to other nodes
* elected primary does not have the writes
* when the primary comes back online later, the writes will be rolled back (and placed in a file, can be applied manually)
* set `w` write concern to wait until majority of nodes have the data
* `w=1, j=1` is possible to lose the writes
* If a node comes back up as a secondary after a period of being offline and the oplog has looped on the primary, the entire dataset will be copied from the primary

#### Connecting to a Replica Set from Pymongo
* without specifying any parameter, connect to port 27017, then it discovers 27018 & 27019
```python
c = pymongo.MongoClient()
```
* populate seed list with all the servers in the replica set
* missing node will be discovered as long as one valid node is listed
* specify replica set
* specify `w` & `j`
```python
c = pymongo.MongoClient(host=["mongodb://localhost:27017",
                              "mongodb://localhost:27018",
                              "mongodb://localhost:27019"],
                               replicaSet="m101",
                              w=1,
                              j=True)
```
* driver handles reconnect to primary if failover

#### What Happens When Failover Occurs
* pymongo
  * by default reads go to primary, unless read preference is specified to allow secondary reads
  * exception if failover occurs when there is no primary
```javascript
rs.stepDown();	// to step down as primary
```

#### Detecting Failover
* pymongo: when excpetion is caught
  * insert is lost when failover occurs
  * other inserts continues as pymongo reconnect to primary

#### Proper Handling of Failover for Inserts
```python
for i in range(0,500):
    for retry in range (3):
        try:
            things.insert_one({'_id':i})
            print "Inserted Document: " + str(i)
            time.sleep(.1)
            break
        except pymongo.errors.AutoReconnect as e:
            print "Exception ",type(e), e
            print "Retrying.."
            time.sleep(5)
        except pymongo.errors.DuplicateKeyError as e:
            print "duplicate..but it worked"
            break
```
* retry to re-insert as insert by _id is idempotent
* not work if suffer long failover
  * e.g. tremendous load, low memory
  * e.g. exponential backoff of the amount of time

#### Proper Handling of Failover for Reads
#### Proper Handling of Failover for Updates
* in case when:
  1. send update
  2. update complte
  3. failover occurs
  4. exception return
* retry in this case may end up updating twice

idempotent| non idempotent
---|---
$set|$inc
.|$push

* possible solutions:
  * update has not occurred
  * run the update again
  * check the data to see if it completed
  * do not run it again
  * convert to an idempotent update

* Version 1:
```python
for i in xrange(500):
    for retry in xrange(3):
        try:
            doc = things.find_one({'_id': i})
            votes = doc["votes"] + 1
            things.update_one({'_id': i}, {'$set': {'votes': votes}})
            break
        except pymongo.errors.AutoReconnect as e:
            time.sleep(5)
```
* Version 2:
```python
for i in xrange(500):
    for retry in xrange(3):
        try:
            doc = things.find_one({'_id': i})
            votes = doc["votes"] + 1
            break
        except pymongo.errors.AutoReconnect as e:  # failover!
            time.sleep(5)
   for retry in xrange(3):
        try:
            things.update_one({'_id': i}, {'$set': {'votes': votes}})
            break
        except pymongo.errors.AutoReconnect as e:  # failover!
            time.sleep(5)
```
* Version 2 put read & update in two retry block
* Problem in Version 1: in case operation did uccessfully complete and then failover, retry will reurn new value and increment again

#### Write Concern Revisited
* `w` determines number of nodes to wait for write acknowledgement
  * 1 = wait for primary
  * `w=majority` avoid rollback when failover
* `j (true/false)` detemines whether wait for journal written to disk
  * primary node only
* `wtimeout` determines how long to wait
  * how long to wait for acknowledge from secondaries, i.e. return an error
  * write will not be unwound at the primary
  * write may have completed at the secondaries
* write concern can be set in:
  * driver
    * client level (in connection)
    * databse level
    * collection level
  * configuration in the replica set

#### Read Preferences
* Primary: (default) read from primary only
* Primary Preferred: read from primary; if primary is not available, read from secondary
* Secondary: read from secondary only
* Secondary Preferred: read from secondary; if secondary is not available, read from primary
* Nearest: closest mongod in terms of ping time, anything within 15ms
* Tag Set: data center awareness

* reasons NOT to read from the secondaries:
  * may not read the write because of lag
  * slow it down if insufficient memory
  * secondary must process the writes and the reads, results in replication lag

#### Review of Implications of Replication
* seed lists
  * replica set is transparent to developers
  * in case of failover, driver needs to know at lease one valid 
* write concern
  * `w`, `j`, `wtimeout`
  * drivers will check if valid
    * e.g. w=4 but 3 data-bearing replica set members will return errors
* read preferences
  * potential stale data
  * driver will return errors if invalid
* errors handling

#### Introduction to Sharding
* scaling out
* each shard can be a replica set
* mongos keeps connection pool to all hosts (shards)
* prior 2.4: range-based approach to distribute data
* since 2.4: hash-based sharding
  * more even distribution of data as a function of shard key
  * worse performance for range-based queries
* break up collection into chunks
* each chunks live in a different shard
* shard key
  * mongos maps shard key to chunk to shards and gather back the results
  * if shard key is not provided, the request is scattered to all the shards
    * only 1 member of each replica set (default the primary) to handle the find
  * shard key must be included for an insert
* database level or collection level
  * collections not sharded will reside in Shard 0
* mongos
 * stateless
 * can be more than 1

#### Building a Sharded 
* config servers
  * typically 3 config servers
  * info about how data is distrbuted across the shards
  * 2-phase commit to make any changes of the chunks
  * keep track of documents maps the shards
* `--smallfiles`: not to allocate very large files at the outset
* configure replica set:
  * load the config to initiate the replica set
  * no primary because before creeate replica set configuration, so any one will do

* create a node of a replica set of a shard
```shell
mongod --replSet s0 --logpath "s0-r0.log" --dbpath /data/shard0/rs0 --port 37017 --fork --shardsvr --smallfiles
```
* create a config server
```shell
mongod --logpath "cfg-a.log" --dbpath /data/config/config-a --port 57040 --fork --configsvr --smallfiles
```
* connect mongos to the config servers
* seed list of the mongos is the config servers
```shell
# mongos
mongos --logpath "mongos-1.log" --configdb localhost:57040,localhost:57041,localhost:57042 --fork
```
* connect to 27017 which is the post mongos is listening on
* create index on the shard key if the collection is brand new
```shell
mongo <<'EOF'
db.adminCommand( { addshard : "s0/"+"localhost:37017" } );
db.adminCommand( { addshard : "s1/"+"localhost:47017" } );
db.adminCommand( { addshard : "s2/"+"localhost:57017" } );
db.adminCommand({enableSharding: "school"})
db.adminCommand({shardCollection: "school.students", key: {student_id:1}});
EOF
```
* status of the shards
```javascript
mongos> sh.status()
```
```javascript
db.students.explain().find({}).limit(10)
```
* `SHARED_MERGE`
* reaching all shards

```javascript
db.students.explain().find({student_id: 100}).limit(10)
```
* `SINGLE_SHARD`

* 2 shards, each with 3 nodes => 9 mongods (3 config servers recommended for production)

#### Implications of Sharding
* every document includes shard key
* shard key is immutable
* index that starts with the shard key
  * e.g. shard key = student_id, index = (student_id, class)
  * index for shard key cannot be multikey index
    * if needed create separate index on the shard key
* for update, specify shard key, or 'multi = true'
* no shard key => scatter gather 
* no unique index, unless starts with shard key
  * no way to enforce uniqueness of any index without shard key
  * do not know whether the copies ecist on different shards

#### Sharding + Replication
* mongos acts as driver
  * connection to primary in each shard, and possible connections to the secondaries, if secondary reads allowed
  * when failover within a shard, mongos will reconnect
  * seed list: knows which nodes to connect to 
* write concern
  * pass through to shards
  * relected in the final write
* multiple mongos
  * pymongo driver reconnect to another mongos

#### Choosing a Shard Key
* sufficient cardinality
  * e.g. 3 values cannot be spread acorss >3 shards
  * may put in a secondary part of the key
* avoid hotspotting in writes
  * i.e. avoid monotonically increaseing
  * sh.status: $minkey,...$maxkey
  * e.g. BSON ID: part is timestamp
    * always assigned to the highest chunk
* case: order_id, order_date, vendor
  * shard on order_id/order_date: monotonically increasing
  * shard on vendor: lack cardinality
  * shard on (vendor,order_date): split across different shard
* case: username, albums
  * shard on username: parallelism
