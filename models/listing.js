 const mongoose = require('mongoose');
 const Schema = mongoose.Schema;
 const Review = require('./review.js');

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
    review:[{
        type:Schema.Types.ObjectId,
        ref:'Review',
    }],
    owner:{
        type:Schema.Types.ObjectId,
        ref:'User',
    },
 });

listingSchema.post('findOneAndDelete',  async (listing)=>{
    if(listing){
      await Review.deleteMany({_id: {$in: listing.review}});

    }});



 const Listing = mongoose.model('Listing', listingSchema);
 module.exports = Listing;