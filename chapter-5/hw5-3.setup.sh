#!/bin/bash
cd chapter_5_aggregation_framework/homework_5_3_hands_on/grades
mongoimport -d test -c grades --drop grades.json --batchSize 1
