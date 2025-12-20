 const express = require('express');
 const app = express();
 const mongoose = require('mongoose');
 const path = require('path');
 const methodOverride = require('method-override');
 const ejsMate = require('ejs-mate');
 const ExpressError = require('./utils/ExpressError.js');
 const session = require('express-session');
 const flash = require('connect-flash');


//BCZ WE MOVED THESE TO ROUTES FILES
 //  const Listing = require('./models/listing');
//  const wrapAsync = require('./utils/wrapAsync.js');
//  const {listingSchema, reviewSchema} = require('./schema.js');  //Joi schema 51 validation for schema
//   const Review = require('./models/review');

//routes require
const listingRoutes = require('./routes/listing.js');
const reviewRoutes = require('./routes/review.js');
 
//middleware-like setups
app.use(methodOverride('_method'));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname, "public")));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, '/public')));

//MongoDB connection
const MONGO_URL = 'mongodb://127.0.0.1:27017/wanderlust'

main().then((res)=>{
    console.log("Connected to MongoDB");
}).catch((err)=>{
    console.log("Error connecting to MongoDB", err);
})
async function main() {
  await mongoose.connect(MONGO_URL);
 }

 //session configuration
const sessionOptions = {
    secret: 'musupersecrecode',
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000, //1 week
        maxAge: 7 * 24 * 60 * 60 * 1000, //1 week
        httpOnly: true
    }
};

app.use(session(sessionOptions));
app.use(flash());


//flash middleware- just before routes
app.use((req, res, next) => {
    res.locals.success = req.flash('success');
     res.locals.error = req.flash('error');
    next();
}); 

//using listing routes
app.use('/listing', listingRoutes);    
//using review routes
app.use('/listing/:id/reviews', reviewRoutes);

 app.get("/",(req,res)=>{
    res.send("Hi, I am root");
 });

// app.get("/testListing", async(req, res)=>{
//     const sampleListing = new Listing({
//         title: "My New Listing",
//         description: "By the beach",
//         price:1200,
//         location:"Gokak, Karnataka",
//         country:"India"
// });
// await sampleListing.save();
// console.log("New Listing Saved");
// res.send("Listing saved successfully");

// });


//error handling middleware
app.use((req,res,next)=>{      //insterd os app.all('*'....)
    next( new ExpressError(404, "Page Not Found!"));
});

 app.use((err,req,res,next)=>{
    let {statusCode=500,message="something went wrong!"} = err;
    res.status(statusCode).render("err.ejs",{message});
    // res.status(statusCode).send(message);
})

 let port = 1009;
 app.listen(port,(req, res) => {
     console.log(`Server is running on port ${port}`);
 });
