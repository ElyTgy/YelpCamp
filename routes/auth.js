const User = require("../models/user");
const express = require("express");
const router = express.Router();
const asyncCatch = require("../utils/asyncCatch.js");
const passport = require("passport");


router.get("/register", (req, res) => {
    if(req.isAuthenticated())
    {
        req.flash("error", "You are already logged in");
        return res.redirect("/campgrounds");
    }
    res.render("./auth/register.ejs");
})

router.post("/register", asyncCatch(async(req, res)=>{
    try{
        const {email, username, password} = req.body;
        const user = new User({email, username});
        const registeredUser = await User.register(user, password);
        req.flash("success", "Welcome to Yelp Camp!");
        res.redirect("/campgrounds");
    }
    catch(e){
        req.flash("error", e.message);
        res.redirect("register");
    }
}))

router.get("/login", (req, res)=>{
    res.render("./auth/login.ejs")
})

router.post("/login", passport.authenticate("local", {failutrFlash: true, failureRedirect:"/auth/login"}),(req, res)=>{
    req.flash("success", "Welcome back")
    res.redirect("/campgrounds");
})

router.get("/logout", (req, res) => {
    req.logout();
    req.flash("success", "Successfully logged out");
    res.redirect("/campgrounds");
})

module.exports = router;