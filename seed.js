var mongoose = require("mongoose");
var Recipe = require("./models/recipes");
var Comment   = require("./models/comment");

var data = [
    {
        name: "Creamy Shrimp Scampi with Half-and-Half", 
        image: "https://images.media-allrecipes.com/userphotos/560x315/5860407.jpg",
        description: "Dinner doesn't have to take forever -- prove it with this fast and delicious shrimp scampi recipe."
    },
    {
        name: "Million-Dollar Spaghetti", 
        image: "https://images.media-allrecipes.com/userphotos/720x405/7036238.jpg",
        description: "The perfect combination of pasta, ground beef, and cream cheese mixture. Unbelievably good! Serve with garlic bread and salad. Enjoy!"
    },
    {
        name: "The Best Thai Coconut Soupr", 
        image: "https://images.media-allrecipes.com/userphotos/560x315/2319909.jpg",
        description: "Authentic, bold, and delicious Thai flavors make this soup irresistible! This is the best Thai coconut soup I've had. You won't be disappointed with this one! Serve over steamed rice."
    }
]

function seedDB(){
   //Remove all recipes
   Recipe.remove({}, function(err){
        if(err){
            console.log(err);
        }
        console.log("removed recipes!");
         //add a few recipes
        data.forEach(function(seed){
            Recipe.create(seed, function(err, recipe){
                if(err){
                    console.log(err)
                } else {
                    console.log("added a recipe");
                    //create a comment
                    Comment.create(
                        {
                            text: "This place is great, but I wish there was internet",
                            author: "Homer"
                        }, function(err, comment){
                            if(err){
                                console.log(err);
                            } else {
                                recipe.comments.push(comment);
                                recipe.save();
                                console.log("Created new comment");
                            }
                        });
                }
            });
        });
    }); 
    //add a few comments
}

module.exports = seedDB;