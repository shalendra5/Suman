const express= require("express");
const router = express.Router({mergeParams:true});
const wrapAsync= require("../utils/wrapAsync");
const {validateReview, isReviewAuthor, isLoggedIn} = require("../middleware");


const reviewController = require("../controller/review")

//Post review route
router.post("/", validateReview,wrapAsync(reviewController.reviewRoute));

//Delete review route
router.delete("/:reviewId",isLoggedIn,isReviewAuthor, wrapAsync(reviewController.deleteReview));


module.exports= router;