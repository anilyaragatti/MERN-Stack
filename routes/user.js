const express = require('express');
const router = express.Router({ mergeParams: true });
const User = require('../models/user.js');
const wrapAsync = require('../utils/wrapAsync.js');
const passport = require('passport');
const { saveRedirectUrl } = require('../middleware.js');

//signup routes

router.get("/signup", (req, res) => {
    res.render("user/signup.ejs");
});

router.post("/signup", wrapAsync(async (req, res) => {

    try {
        const { username, email, password } = req.body;
        // Add logic to save user to database
        const newUser = new User({ username, email });
        const registeredUser = await User.register(newUser, password);
        console.log(registeredUser);
        await req.login(registeredUser, (err) => { //passport login method for auto login after signup
            if (err) {
                return next(err);
            }
            req.flash('success', 'Welcome to Wanderlust!');//flash message 4 processing
            res.redirect("/listing");
        });
    } catch (e) {
        req.flash('error', e.message);
        res.redirect("/signup");
    }
}));

router.get("/login", (req, res) => {
    res.render("user/login.ejs");
});

router.post("/login", saveRedirectUrl,passport.authenticate("local",{failureRedirect: "/login",failureRedirect: "/login",failureFlash: true, }), wrapAsync(async (req, res) => {//passport authenticate middleware
            req.flash('success', 'Welcome back to wondeLust!');
            res.redirect(res.locals.redirectUrl || "/listing");//redirect to the url user wanted to access before login
        }));

//logout route
router.get("/logout", (req, res, next) => {
    req.logout((err) => {   //passport logout method
        if (err) {
            return next(err);
        }
        req.flash('success', 'you have logged out!');
        res.redirect("/listing");//redirect to listings after logout
    });
});

module.exports = router;