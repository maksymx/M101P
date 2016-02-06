use agg
db.small_zips.aggregate([{$group:{_id:"$state",pop:{$avg:"$pop"}}}]);
