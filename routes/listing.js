const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync.js');
const ExpressError = require('../utils/ExpressError.js');
const { listingSchema } = require('../schema.js');  //Joi schema 51 validation for schema
const Listing = require('../models/listing.js');
const { isLoggedIn,isOwner,validateListing } = require('../middleware.js');
 


//jio validation middleware in schema.js file 
-

//index Route
router.get("/", wrapAsync(async (req, res) => {   // app.get to router.get
    const allListings = await Listing.find({});
    res.render("./listing/index.ejs", { allListings });
}));


//New Route
router.get("/new", isLoggedIn, (req, res) => {
    res.render("listing/new.ejs");
});


//Create Route
router.post("/", isLoggedIn, validateListing, wrapAsync(async (req, res, next) => {
    // const{title, description,img,price,location,country} = req.body;

    //   let result =  listingSchema.validate(req.body);
    //     console.log(result);
    //     if(result.error){
    //         throw new ExpressError(400, result.error);
    //  }
    let listing = req.body.listing;
    const newListing = new Listing(listing);
    newListing.owner = req.user._id; //assigning the logged in user as owner of the listing
    await newListing.save();
    req.flash('success', 'Successfully made a new listing!');//flash message
    res.redirect("/listing");
}

));


//show route
router.get("/:id", wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id).populate('review').populate('owner');
    if (!listing) {
        req.flash('error', 'Cannot find that listing!');//flash message
        return res.redirect('/listing');
    };
    res.render("listing/show.ejs", { listing });
}));

//edit route
router.get("/:id/edit", isLoggedIn,isOwner,  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id)
    if (!listing) {
        req.flash('error', 'Cannot find that listing!');//flash message
        return res.redirect('/listing');
    };
    res.render("listing/edit.ejs", { listing });
}))


//update route
router.put("/:id", isLoggedIn, isOwner, validateListing, wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });//spread operator to get all fields from req.body.listingy
    req.flash('success', 'listing was updated!');//flash message
    res.redirect(`/listing/${id}`);
}));


//Delete Route
router.delete("/:id",isLoggedIn,isOwner,wrapAsync(async (req, res) => {
    const { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    req.flash('success', ' listing was deleted!');//flash message

    // console.log(deletedListing);
    res.redirect("/listing");

}));

module.exports = router;