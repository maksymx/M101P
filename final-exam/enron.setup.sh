#!/bin/bash
mongorestore --db enron --collection messages --drop enron/dump/enron/messages.bson --batchSize=1
