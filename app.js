 const express = require('express');
 const app = express();
 const mongoose = require('mongoose');
 const Listing = require('./models/listing');
 const path = require('path');
 const methodOverride = require('method-override');
 const ejsMate = require('ejs-mate');


app.use(methodOverride('_method'));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname, "public")));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, '/public')));

const MONGO_URL = 'mongodb://127.0.0.1:27017/wanderlust'

main().then((res)=>{
    console.log("Connected to MongoDB");
}).catch((err)=>{
    console.log("Error connecting to MongoDB", err);
})
async function main() {
  await mongoose.connect(MONGO_URL);

 }

 //index Route
app.get("/listing", async (req,res)=>{
  const allListings = await Listing.find({});
  res.render("./listing/index.ejs",{allListings});
});


//New Route
app.get("/listing/new",(req,res)=>{
    res.render("listing/new.ejs");
});
//Create Route
app.post("/listing", async(req,res)=>{
    // const{title, description,img,price,location,country} = req.body;
    let listing = req.body.listing;
   const newListing = new Listing(listing);
   await newListing.save();
    res.redirect("/listing");
});

//show route
app.get("/listing/:id", async(req,res)=>{
    const {id} = req.params;
 const listing = await Listing.findById(id)
 res.render("listing/show.ejs",{listing});
});

//edit route
app.get("/listing/:id/edit", async(req,res)=>{
    const {id} = req.params;
 const listing = await Listing.findById(id)
    res.render("listing/edit.ejs",{listing});
})

//
//update route
app.put("/listing/:id", async(req,res)=>{
    const {id} = req.params;
 const listing = await Listing.findByIdAndUpdate(id, {...req.body.listing});
 res.redirect(`/listing/${id}`);
});

//Delete Route
app.delete("/listing/:id", async(req,res)=>{
    const {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listing");

});


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
 let port = 1009;
 app.listen(port,(req, res) => {
     console.log(`Server is running on port ${port}`);
 });
