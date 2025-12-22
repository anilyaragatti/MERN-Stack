 const Listing = require("../models/listing");

//controller function for index route
module.exports.index = async (req, res) => {   // app.get to router.get
    const allListings = await Listing.find({});
    res.render("./listing/index.ejs", { allListings });
};

//controller function for new route
module.exports.renderNewForm = (req, res) => {
    res.render("listing/new.ejs");
}

//controller function for show route
module.exports.showListing = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id).populate({path:'review',populate:{path:'author'}}).populate('owner'); //nested populate to get author of each review
    if (!listing) {
        req.flash('error', 'Cannot find that listing!');//flash message
        return res.redirect('/listing');
    };
    res.render("listing/show.ejs", { listing });
};

//controller function for create route
module.exports.createListing = async (req, res, next) => {
    let listing = req.body.listing;//getting listing data from req.body
    const newListing = new Listing(listing);
    newListing.owner = req.user._id; //assigning the logged in user as owner of the listing
    await newListing.save();
    req.flash('success', 'Successfully made a new listing!');//flash message
    res.redirect("/listing");
}

//controller function for edit route
module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id)
    if (!listing) {
        req.flash('error', 'Cannot find that listing!');//flash message
        return res.redirect('/listing');
    };
    res.render("listing/edit.ejs", { listing })
};

//controller function for update route
module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });//spread operator to get all fields from req.body.listingy
    req.flash('success', 'listing was updated!');//flash message
    res.redirect(`/listing/${id}`);
}   

//controller function for delete route
module.exports.deleteListing = async (req, res) => {
    const { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    req.flash('success', ' listing was deleted!');//flash message

    // console.log(deletedListing);
    res.redirect("/listing");
}