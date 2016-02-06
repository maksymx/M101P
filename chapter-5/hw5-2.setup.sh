#!/bin/bash
cd chapter_5_aggregation_framework/homework_5_2_hands_on/small_zips/
mongoimport -d test -c zips --drop small_zips.json --batchSize 1
