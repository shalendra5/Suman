const express= require("express");
const router = express.Router();
const wrapAsync= require("../utils/wrapAsync");
const { isLoggedIn, isOwner,validateListing } = require("../middleware");
const multer = require("multer");
const {storage}= require("../cloudConfig");
const upload = multer({storage});

const listingController= require("../controller/listing");



router.route("/")
    .get(wrapAsync(listingController.index)) //Index Route
    .post(isLoggedIn,upload.single("listing[image]"),validateListing, wrapAsync(listingController.createRoute));//Create Route

//New Route
router.get("/new",isLoggedIn,listingController.renderNewForm);
 
 
 //Edit Route
router.get("/:id/edit",isLoggedIn,isOwner, wrapAsync(listingController.editRoute)); 
 
 
router.route("/:id")
    .put(isLoggedIn,isOwner,upload.single("listing[image]"),validateListing, wrapAsync(listingController.updateRoute)) //Update Route
    .get( wrapAsync(listingController.showRoute)) //Show Route
    .delete(isLoggedIn,isOwner,wrapAsync(listingController.deleteRoute));  //Delete Route
 

module.exports=router;