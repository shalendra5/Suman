const User = require("../models/user");

module.exports.signupRenderForm= (req,res)=>{
    res.render("users/signup.ejs");
};

module.exports.signupRoute= async(req, res)=>{
    
    let {username, email, password}= req.body;
    const newUser = new User ({email, username});
    const registedUser = await User.register(newUser,password);
    console.log(registedUser);
    try{
        req.login(registedUser,(err)=>{
            if(err){
                return next(err);
            }
            req.flash("success","Welcome to Tourist");
            res.redirect("/listings");
        })
    }catch(err){
        req.flash("error",err.message);
        res.redirect("/signup");
    }

};

module.exports.loginRenderForm=(req, res)=>{
    res.render("users/login.ejs")
};

module.exports.login =async(req,res)=>{
    req.flash("success","Welcome back to Tourist");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};

module.exports.logout=(req, res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","You are logged out!");
        res.redirect("/listings"); 
    });
};