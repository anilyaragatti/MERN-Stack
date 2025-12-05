 const mongoose = require('mongoose');
 const Schema = mongoose.Schema;

 const listingSchema = new Schema({
    title: {
        type:String,
        required: true,
    },
    description: String,
    image: {
        type: String,
        default: "https://unsplash.com/photos/silhouette-of-trees-during-sunset-AbicQtsFWUk link",
        set: (v)=> v===" "? "https://unsplash.com/photos/silhouette-of-trees-during-sunset-AbicQtsFWUk link": v,
    
    },
    price: Number,
    location: String,
    cointry: String,
 });

 const Listing = mongoose.model('Listing', listingSchema);
 module.exports = Listing;