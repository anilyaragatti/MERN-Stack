const Listing = require('./models/listing');
const ExpressError = require('./utils/ExpressError.js');
const { listingSchema } = require('./schema.js');  //Joi schema 51 validation for schema
const { reviewSchema } = require('./schema.js');  //Joi schema 51 validation for schema




//jio validation middleware in schema.js file 
module.exports.validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};

//jio validation middleware in schema.js file

module.exports.validateReview = (req, res, next) => {

    let { error } = reviewSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(',');
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
}


//middleware to check if user is logged in
module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl; //to store the url user wanted to access before login 
        req.flash('error', 'You must be signed in first!');
        return res.redirect('/login');
    }
    next();
};

//middleware to save the url user wanted to access
module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};


module.exports.isOwner = async (req, res, next) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);//
    if (!listing.owner._id.equals(res.locals.currentUser._id)) {     //authorization check
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/listing/${id}`);
    }
    next();

}