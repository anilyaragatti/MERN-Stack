const mongoose = require('mongoose');
const initdata = require('./data.js');
const Listing = require('../models/listing.js');
 

const MONGO_URL = 'mongodb://127.0.0.1:27017/wanderlust'

main().then((res)=>{
    console.log("Connected to MongoDB");
}).catch((err)=>{
    console.log("Error connecting to MongoDB", err);
})
async function main() {
  await mongoose.connect(MONGO_URL);
}
 

 const initDB = async()=>{
    await Listing.deleteMany({});
    initdata.data = initdata.data.map((obj)=>({...obj,owner:"6947cb531fe51833ff6ec246"})) // Assigning a default owner ID to each listing
    await Listing.insertMany(initdata.data);
    console.log("Deleted all existing listings");
};


initDB();