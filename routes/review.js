const express = require('express');
const router = express.Router({ mergeParams: true });//mergeParams to access :id from listing routes
const wrapAsync = require('../utils/wrapAsync.js');
const ExpressError = require('../utils/ExpressError.js');
const { reviewSchema } = require('../schema.js');  //Joi schema 51 validation for schema
const Listing = require('../models/listing.js');
const Review = require('../models/review.js');
const {validateReview, isLoggedIn,isReviewAuthor} = require('../middleware.js');



//jio validation middleware in schema.js file
 

//Review Create Route
router.post("/",isLoggedIn ,validateReview, wrapAsync(async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id; //assigning the logged in user as author of the review

    listing.review.push(newReview);

    await newReview.save();
    await listing.save();
    req.flash('success', 'new Review added!');//flash message

    // console.log("New Review Added");
    // res.send("Review added successfully");
    res.redirect(`/listing/${listing._id}`);
}));

//Review Delete Route
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { review: reviewId } });  //pull operator to remove review from listing array
    await Review.findByIdAndDelete(reviewId);
        req.flash('success', 'Review Deleted!');//flash message


    res.redirect(`/listing/${id}`);

}));

module.exports = router;