#!/bin/bash
mongo < hw4-3.reset.js
cd chapter_4_performance/homework_4_3/hw4-3/hw4-3/
mongoimport -d blog -c posts < posts.json --batchSize 1
