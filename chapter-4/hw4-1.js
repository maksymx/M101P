
use hw4_1;

db.products.drop();

var arr_products = [
{
	sku: "SKU0001",
	price: 40,
	description: "Product SKU0001",
	category: "Category A",
	brand: "GE",
	reviews: [{
		author: "John Smith",
		ratings: 4
	}]
},
{
	sku: "SKU0002",
	price: 45,
	description: "Product SKU0002",
	category: "Category B",
	brand: "GC",
	reviews: [{
		author: "Jane Smith",
		ratings: 2.5
	}]
}
];
for (var i = 0; i < arr_products.length; i++) {
	db.products.insert(arr_products[i]);
}

db.products.createIndex({sku:1});
db.products.createIndex({price:-1});
db.products.createIndex({description:1});
db.products.createIndex({category:1, brand:1});
db.products.createIndex({"reviews.author":1});

db.products.getIndexes();

var exp = db.products.explain();

exp.find( { 'brand' : "GE" } );
exp.find( { brand : 'GE' } ).sort( { category : 1, brand : -1 } );
exp.find( { 'brand' : "GE" } ).sort( { price : 1 } );
exp.find( { $and : [ { price : { $gt : 30 } },{ price : { $lt : 50 } } ] } ).sort( { brand : 1 } );

