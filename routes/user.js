const express = require('express');
const router = express.Router({ mergeParams: true });
const User = require('../models/user.js');
const wrapAsync = require('../utils/wrapAsync.js');
const passport = require('passport');
const { saveRedirectUrl } = require('../middleware.js');

const userController = require('../controllers/user.js');

//signup routes
router.get("/signup", userController.renderSignupForm);

router.post("/signup", wrapAsync(userController.signup));

router.get("/login",userController.renderLoginForm);

router.post("/login", saveRedirectUrl,passport.authenticate("local",{failureRedirect: "/login",failureFlash: true, }), wrapAsync(userController.login));//login route //passport authenticate middleware

//logout route
router.get("/logout",userController.logout);

module.exports = router;