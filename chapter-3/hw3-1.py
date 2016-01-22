# Homework: Homework 3.1
# 
# Write a program in the language of your choice that will remove the lowest homework score for 
# each student. Since there is a single document for each student containing an array of scores, 
# you will need to update the scores array and remove the homework.
# 
# Remember, just remove a homework score. Don't remove a quiz or an exam!
# 
# Hint/spoiler: With the new schema, this problem is a lot harder and that is sort of the point. One 
# way is to find the lowest homework in code and then update the scores array with the low 
# homework pruned.

import pymongo
import sys

connection = pymongo.MongoClient("mongodb://localhost")
db = connection.school
students = db.students

def remove_lowest_score():
    try:
        # db.students.aggregate({$unwind: '$scores'}, {$match: {'scores.type':'homework'}}, {$group:{'_id':{ _id: '$_id', name: '$name'}, 'min_score': {$min: '$scores.score' }}}, {$sort: {'_id._id': 1}})

        cursor = students.aggregate([
            {'$unwind': '$scores'}, 
            {'$match': {'scores.type': 'homework'}},
            {'$group': {'_id': {'_id': '$_id', 'name': '$name', 'type': '$scores.type'}, 'min_score': {'$min': '$scores.score'}}},
            {'$sort': {'_id._id' : 1}}
        ])
    except Exception as e:
        print "Unexpected error:", type(e), e

#    for doc in cursor:
#        query = {'_id': doc['_id']['_id'], 'name': doc['_id']['name'], 'scores.type': doc['_id']['type'], 'scores.score': doc[#'min_score']}
#        s = students.find_one(query)
#        print (s)

    for doc in cursor:
        query = {'_id': doc['_id']['_id'], 'name': doc['_id']['name']}
        update = {'$pull': {'scores': {'type': doc['_id']['type'], 'score': doc['min_score']}}}
        update_result = students.update_one(query, update)
        print update_result.matched_count, update_result.modified_count

remove_lowest_score()
