const Listing = require('../models/listing.js');
const Review = require('../models/review.js');


module.exports.createReview = async (req, res) => {
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
};

module.exports.deleteReview = async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { review: reviewId } });  //pull operator to remove review from listing array
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Review Deleted!');//flash message
    res.redirect(`/listing/${id}`);

}