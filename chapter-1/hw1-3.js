// hw 1.3

use m101;

// sort ascending
db.funnynumbers.find({},limit=1, skip=50).sort({value:1})

// sort descending
db.funnynumbers.find({},limit=1, skip=50).sort({value:-1})
