# Homework: Homework 2.2
#
# Write a program in the language of your choice that will remove the grade of type "homework"
# with the lowest score for each student from the dataset in the handout. Since each document is
# one grade, it should remove one document per student. This will use the same data set as the
# last problem, but if you don't have it, you can download and re-import.

# Hint/spoiler: If you select homework grade-documents, sort by student and then by score, you
# can iterate through and find the lowest score for each student by noticing a change in student
# id. As you notice that change of student_id, remove the document.

import pymongo
import sys

connection = pymongo.MongoClient("mongodb://localhost")
db = connection.students
grades = db.grades

def remove_lowest_score():
    try:
        # db.grades.find({type:'homework'}).sort({student_id:1,score:-1})
        cursor = grades.find({'type':'homework'}).sort([('student_id',pymongo.ASCENDING),('score',pymongo.ASCENDING)])
    except Exception as e:
        print "Unexpected error:", type(e), e

    prev_student_id = None
    for student in cursor:
        cur_student_id = student['student_id']
        if prev_student_id != cur_student_id:
            print(prev_student_id, student)
            grades.delete_one(student)
            prev_student_id = cur_student_id

remove_lowest_score()
