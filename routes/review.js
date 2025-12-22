const express = require('express');
const router = express.Router({ mergeParams: true });//mergeParams to access :id from listing routes
const wrapAsync = require('../utils/wrapAsync.js');
const ExpressError = require('../utils/ExpressError.js');
const { reviewSchema } = require('../schema.js');  //Joi schema 51 validation for schema
const Listing = require('../models/listing.js');
const Review = require('../models/review.js');
const {validateReview, isLoggedIn,isReviewAuthor} = require('../middleware.js');

const reviewController = require('../controllers/reviews.js');



//jio validation middleware in schema.js file
 

//Review Create Route
router.post("/",isLoggedIn ,validateReview, wrapAsync(reviewController.createReview));

//Review Delete Route
router.delete("/:reviewId", isLoggedIn,isReviewAuthor, wrapAsync(reviewController.deleteReview));

module.exports = router;