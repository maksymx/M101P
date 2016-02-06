use agg
db.zips.aggregate([{$group:{_id:"$city",postal_codes:{$addToSet:"$_id"}}}])
db.zips.aggregate([{$group:{_id:"$city",postal_codes:{$addToSet:"$_id"}}},{$match:{_id:"CENTREVILLE"}}])

