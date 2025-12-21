module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()){
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