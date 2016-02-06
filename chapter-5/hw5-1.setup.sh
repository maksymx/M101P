#!/bin/bash
cd chapter_5_aggregation_framework/homework_5_1/posts/
mongoimport -d blog -c posts --drop posts.json --batchSize 1
