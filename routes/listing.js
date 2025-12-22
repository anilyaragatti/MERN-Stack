const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync.js');
const ExpressError = require('../utils/ExpressError.js');
const { listingSchema } = require('../schema.js');  //Joi schema 51 validation for schema
const Listing = require('../models/listing.js');
const { isLoggedIn,isOwner,validateListing } = require('../middleware.js');

const listingController = require('../controllers/listing.js');
 
//jio validation middleware in schema.js file 


//index Route
router.get("/", wrapAsync(listingController.index));

//New Route
router.get("/new", isLoggedIn,listingController.renderNewForm);

//Create Route
router.post("/", isLoggedIn, validateListing, wrapAsync(listingController.createListing));

//show route
router.get("/:id", wrapAsync(listingController.showListing));

//edit route
router.get("/:id/edit", isLoggedIn,isOwner,  wrapAsync(listingController.renderEditForm));

//update route
router.put("/:id", isLoggedIn, isOwner, validateListing, wrapAsync(listingController.updateListing));


//Delete Route
router.delete("/:id",isLoggedIn,isOwner,wrapAsync(listingController.deleteListing));

module.exports = router;