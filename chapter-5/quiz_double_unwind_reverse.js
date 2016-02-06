use agg;
db.inventory.drop();
db.inventory.insert({'name':"Polo Shirt", 'sizes':["Small", "Medium", "Large"], 'colors':['navy', 'white', 'orange', 'red']})
db.inventory.insert({'name':"T-Shirt", 'sizes':["Small", "Medium", "Large", "X-Large"], 'colors':['navy', "black",  'orange', 'red']})
db.inventory.insert({'name':"Chino Pants", 'sizes':["32x32", "31x30", "36x32"], 'colors':['navy', 'white', 'orange', 'violet']})
db.inventory.aggregate([
    {$unwind: "$sizes"},
    {$unwind: "$colors"},
])

print()
print('phase 1: group colors into array')

db.inventory.aggregate([
    {$unwind: "$sizes"},
    {$unwind: "$colors"},
    {$group: 
	{_id: {name: "$name", sizes: "$sizes"}, "colors": {$push: "$colors"}}
    }
])

print()
print('phase 2: group sizes into array')

db.inventory.aggregate([
    {$unwind: "$sizes"},
    {$unwind: "$colors"},
    {$group: 
	{_id: {name: "$name", sizes: "$sizes"}, "colors": {$push: "$colors"}}
    },
    {$group: 
	{_id: {name: "$_id.name", colors: "$colors"}, "sizes": {$push: "$_id.sizes"}}
    }
])

print()
print('phase 3: pretty')

db.inventory.aggregate([
    {$unwind: "$sizes"},
    {$unwind: "$colors"},
    {$group: 
	{_id: {name: "$name", sizes: "$sizes"}, "colors": {$push: "$colors"}}
    },
    {$group: 
	{_id: {name: "$_id.name", colors: "$colors"}, "sizes": {$push: "$_id.sizes"}}
    },
    {$project:
	{_id:0, name: "$_id.name", colors: "$_id.colors", sizes: 1}
    }
])

print()
print('reverse in one stage by using $addToSet if unique')

db.inventory.aggregate([
    {$unwind: "$sizes"},
    {$unwind: "$colors"},
    {$group:
	{_id: "$name", sizes: {$addToSet: "$sizes"}, colors: {$addToSet: "$colors"}}
    }
])

print()
print('$push in one stage does not work')

db.inventory.aggregate([
    {$unwind: "$sizes"},
    {$unwind: "$colors"},
    {$group: 
	{_id: "$name", "size": {$push: "$sizes"}, "color": {$push: "$colors"}}
    }
])

