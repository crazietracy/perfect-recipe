var express = require("express");
var router  = express.Router();
var Recipe = require("../models/recipes");
var middleware = require("../middleware");

//INDEX - show all recipes
router.get("/", function(req, res){
    // Get all recipes from DB
    Recipe.find({}, function(err, allRecipes){
       if(err){
           console.log(err);
       } else {
          res.render("recipes/index",{recipes:allRecipes});
       }
    });
});

//CREATE - add new recipe to DB
router.post("/", middleware.isLoggedIn, function(req, res){
    // get data from form and add to recipes array
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newRecipe = {name: name, image: image, description: desc, author:author}
    // Create a new recipe and save to DB
    Recipe.create(newRecipe, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //redirect back to recipes page
            console.log(newlyCreated);
            res.redirect("/recipes");
        }
    });
});


//NEW - show form to create new recipe
router.get("/new", middleware.isLoggedIn, function(req, res){
   res.render("recipes/new"); 
});

// SHOW - shows more info about one recipe
router.get("/:id", function(req, res){
    //find the recipe with provided ID
    Recipe.findById(req.params.id).populate("comments").exec(function(err, foundRecipe){
        if(err){
            console.log(err);
        } else {
            console.log(foundRecipe)
            //render show template with that recipe
            res.render("recipes/show", {recipe: foundRecipe});
        }
    });
});


// EDIT RECIPE ROUTE
router.get("/:id/edit", middleware.checkRecipeOwnership, function(req, res){
    Recipe.findById(req.params.id, function(err, foundRecipe){
        res.render("recipes/edit", {recipe: foundRecipe});
    });
});

// UPDATE RECIPE ROUTE
router.put("/:id",middleware.checkRecipeOwnership, function(req, res){
    // find and update the correct recipe
    Recipe.findByIdAndUpdate(req.params.id, req.body.recipe, function(err, updatedRecipe){
       if(err){
           res.redirect("/recipes");
       } else {
           //redirect somewhere(show page)
           res.redirect("/recipes/" + req.params.id);
       }
    });
});

// DESTROY RECIPE ROUTE
router.delete("/:id",middleware.checkRecipeOwnership, function(req, res){
   Recipe.findByIdAndRemove(req.params.id, function(err){
      if(err){
          res.redirect("/recipes");
      } else {
          res.redirect("/recipes");
      }
   });
});


module.exports = router;

