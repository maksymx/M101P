#!/bin/bash
cd chapter_5_aggregation_framework/homework_5_4/
mongoimport -d test -c zips --drop zips.json --batchSize 1

# vagrant@vagrant-ubuntu-trusty-64:~/projects/M101P/chapter-5$ ./hw5-4.setup.sh
# 2016-02-07T02:03:52.350+0800	connected to: localhost
# 2016-02-07T02:03:52.350+0800	dropping: test.zips
# 2016-02-07T02:03:53.158+0800	error inserting documents: E11000 duplicate key error collection: test.zips index: _id_ dup key: { : "32350" }
# 2016-02-07T02:03:54.478+0800	error inserting documents: E11000 duplicate key error collection: test.zips index: _id_ dup key: { : "63673" }
# 2016-02-07T02:03:55.359+0800	[################........] test.zips	1.9 MB/2.7 MB (68.3%)
# 2016-02-07T02:03:56.030+0800	error inserting documents: E11000 duplicate key error collection: test.zips index: _id_ dup key: { : "42223" }
# 2016-02-07T02:03:56.765+0800	[########################] test.zips	2.7 MB/2.7 MB (100.0%)
# 2016-02-07T02:03:56.767+0800	imported 29467 documents