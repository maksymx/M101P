
use blog;
db.posts.createIndex({permalink: 1});
db.posts.createIndex({date: -1});
db.posts.createIndex({tags: 1, date: -1});

var exp = db.posts.explain("executionStats");

var num_posts = 10;
var tag = "dream";
var permalink = "OKORHRdbaOzXmITZJnWn";

// The blog home page
// def get_posts(self, num_posts):
//	cursor = self.posts.find().sort('date', direction=-1).limit(num_posts)

exp.find().sort({date:-1}).limit(num_posts);


// The page that displays blog posts by tag 
//def get_posts_by_tag(self, tag, num_posts):
//	cursor = self.posts.find({'tags':tag}).sort('date', direction=-1).limit(num_posts)

exp.find({tags: tag}).sort({date: -1}).limit(num_posts);


// The page that displays a blog entry by permalink 
// def get_post_by_permalink(self, permalink):
//	post = self.posts.find_one({'permalink': permalink})

exp.find({permalink: permalink});
