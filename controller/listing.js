
const Listing= require("../models/listings");

const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({accessToken: mapToken});

module.exports.index=async (req, res)=>{
    let allListings= await Listing.find({});
 //    console.log(allListings);
     res.render("listings/index.ejs",{allListings});
 };

 module.exports.renderNewForm= (req,res)=>{
    res.render("listings/new.ejs");
};

module.exports.createRoute = async (req, res, next)=>{
    let response = await geocodingClient
    .forwardGeocode({
        query: req.body.listing.location,
        limit: 1
      })
    .send()
        
    let url = req.file.path;
    let filename = req.file.filename;
    const newListing= new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image={url, filename};
    
    newListing.geometry = response.body.features[0].geometry;
    let savedListing=await newListing.save();
    console.log(savedListing);
    req.flash("success","Listing Created!");
    res.redirect("/listings");    
 };

 module.exports.editRoute= async (req, res)=>{
      let {id}=req.params;
      const listing= await Listing.findById(id);
      if(!listing){
        res.flash("error","Listing You request for does not exit.")
        res.redirect("/listings");
      }
      let originalImageUrl = listing.image.url;
      originalImageUrl= originalImageUrl.replace("/upload","/upload/w_250/");
      res.render("listings/edit.ejs",{listing, originalImageUrl}); 
};

module.exports.updateRoute = async (req, res)=>{
    let {id}=req.params;
    let listing=await Listing.findByIdAndUpdate(id, {...req.body.listing});

    if(typeof req.file != "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image={url, filename};
        await listing.save();
    }
    let response = await geocodingClient
    .forwardGeocode({
        query: req.body.listing.location,
        limit: 1
      })
    .send()

    if(response){
    listing.geometry = response.body.features[0].geometry;
    await listing.save();
    }
    
    req.flash("success","Listing Updated!");
    res.redirect(`/listings/${id}`);
};

module.exports.showRoute = async(req,res)=>{
     let {id}= req.params;
     const listing = await Listing.findById(id)
     .populate({path:"reviews",
        populate:{
            path: "author",
        },
    }).populate("owner");
     
     if(!listing){
        req.flash("error","Listing You requested for does not exists!")
        res.redirect("/listings")
     }
     res.render("listings/show.ejs",{listing});
};

module.exports.deleteRoute = async (req, res)=>{
     let {id}= req.params;
     await Listing.findByIdAndDelete(id);
     req.flash("success","Listing Deleted!");
     res.redirect("/listings");
};