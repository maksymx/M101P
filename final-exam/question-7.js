use m101;

db.images.count({tags:'kittens'});
//49932

db.albums.createIndex({images: 1});
//{
//        "createdCollectionAutomatically" : false,
//        "numIndexesBefore" : 1,
//        "numIndexesAfter" : 2,
//        "ok" : 1
//}

var cursor = db.images.find();

while (cursor.hasNext()) {
	var image = cursor.next();
	var album = db.albums.findOne({images: image._id});
	if (album == null) {
		print('remove image: ', image._id);
		db.images.remove({_id: image._id});
	}
}

db.images.count();

db.images.count({tags:'kittens'});
