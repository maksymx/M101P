#!/bin/bash
curl -o zips.json http://media.mongodb.org/zips.json
mongoimport --db agg --collection zips zips.json
