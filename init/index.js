const mongoose= require("mongoose");
const initData= require("./data");
const Listing= require("../models/listings");

main().then(()=>{
    console.log("Connection successful.")
}).catch(err=>{console.log(err)});

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/tourist")
}

const initDB= async ()=>{
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj)=>(
        {
        ...obj,
        owner: '67c83b0c0d3e479ef55ffa5d',
        }
    ));
    await Listing.insertMany(initData.data);
    console.log("data was initialized!");
};

initDB();