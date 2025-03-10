const express= require("express");
const wrapAsync = require("../utils/wrapAsync");
const router= express.Router();
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware");

const userController= require("../controller/user");

router.route("/signup")
    .get(userController.signupRenderForm)
    .post(wrapAsync(userController.signupRoute));

router.route("/login")
    .get(userController.loginRenderForm)
    .post(saveRedirectUrl, passport.authenticate("local",{
    failureRedirect:"/login",
    failureFlash: true }), userController.login
);

router.get("/logout",userController.logout);

module.exports= router;
