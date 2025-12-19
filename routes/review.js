const express = require('express');
const router = express.Router({mergeParams: true});
const wrapAsync = require('../utils/wrapAsync.js');
const ExpressError = require('../utils/ExpressError.js');
const { reviewSchema } = require('../schema.js');  //Joi schema 51 validation for schema
const Listing = require('../models/listing.js');
const Review = require('../models/review.js');


//jio validation middleware in schema.js file

const validateReview = (req,res,next)=>{   

    let {error} =  reviewSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=>el.message).join(',');
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
}   



//Review Create Route
router.post("/", validateReview, wrapAsync(async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);

    listing.review.push(newReview);

    await newReview.save();
    await listing.save();
    // console.log("New Review Added");
    // res.send("Review added successfully");
    res.redirect(`/listing/${listing._id}`);
}));

//Review Delete Route
router.delete("/:reviewId", wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { review: reviewId } });  //pull operator to remove review from listing array
    await Review.findByIdAndDelete(reviewId);

    res.redirect(`/listing/${id}`);

}));

module.exports = router;