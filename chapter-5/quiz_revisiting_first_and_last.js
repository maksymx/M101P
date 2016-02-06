use agg
db.fun.drop();
db.fun.insert({ "_id" : 0, "a" : 0, "b" : 0, "c" : 21 });
db.fun.insert({ "_id" : 1, "a" : 0, "b" : 0, "c" : 54 });
db.fun.insert({ "_id" : 2, "a" : 0, "b" : 1, "c" : 52 });
db.fun.insert({ "_id" : 3, "a" : 0, "b" : 1, "c" : 17 });
db.fun.insert({ "_id" : 4, "a" : 1, "b" : 0, "c" : 22 });
db.fun.insert({ "_id" : 5, "a" : 1, "b" : 0, "c" : 5 });
db.fun.insert({ "_id" : 6, "a" : 1, "b" : 1, "c" : 87 });
db.fun.insert({ "_id" : 7, "a" : 1, "b" : 1, "c" : 97 });
db.fun.find()
db.fun.aggregate([
    {$match:{a:0}},
    {$sort:{c:-1}}, 
    {$group:{_id:"$a", c:{$first:"$c"}}}
])

