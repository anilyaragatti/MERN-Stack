 const User = require('../models/user.js');


// Render signup form
module.exports.renderSignupForm = (req, res) => {
    res.render("user/signup.ejs");
};

// Handle user signup
module.exports.signup = async (req, res) => {

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
}

// Render login form
module.exports.renderLoginForm = (req, res) => {
    res.render("user/login.ejs");
};

// Handle user login
module.exports.login = async (req, res) => {
    req.flash('success', 'Welcome back to wondeLust!');
    let redirectUrl = res.locals.redirectUrl || "/listing";
    res.redirect(redirectUrl);//redirect to the url user wanted to access before login
};

// Handle user logout
module.exports.logout = (req, res, next) => {
    req.logout((err) => {   //passport logout method
        if (err) {
            return next(err);
        }
        req.flash('success', 'you have logged out!');
        res.redirect("/listing");//redirect to listings after logout
    });
}