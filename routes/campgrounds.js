const express = require("express");
const asyncCatch = require("../utils/asyncCatch.js");
const AppError = require("../utils/ExpressError.js");
const Review = require("../models/review");
const Campground = require("../models/campgrounds")
const {campgroundJoiSchema, reviewJoiSchema} = require("../schemas.js")

const router = express.Router();

function validateCampground(req, res, next)
{
    const {error} = campgroundJoiSchema.validate(req.body);
    if(error)
    {
        const msg = error.details.map(el => el.message).join(',');
        throw new AppError(400, msg);
    }
    else{next()}
}

function ensureLogin(req, res, next){
    if(!req.isAuthenticated())
    {
        req.flash("error", "You must login first");
        return res.redirect("/auth/login");
    }
    next();
}


function validateReview(req, res, next)
{
    const {error} = reviewJoiSchema.validate(req.body);
    if(error)
    {
        const msg = error.details.map(el => el.message).join(',');
        throw new AppError(400, msg);
    }
    else{next()}
}

router.get("/new", ensureLogin, (req, res)=>{
    res.render('campgrounds/new.ejs')
})

router.post("/", ensureLogin, validateCampground, asyncCatch(async(req, res)=>{
    const campground = new Campground(req.body.campground);
    await campground.save()
    req.flash("success", "Successfully made a new campground");
    res.redirect(`/campgrounds/${campground._id}`);
}))

router.get("/", asyncCatch(async (req, res)=>
{
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index.ejs', {campgrounds})
}))

router.get("/:id/edit", asyncCatch(async (req, res)=>
{
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/edit.ejs', {campground})
}))

router.post("/:id/reviews", validateReview, asyncCatch(async (req, res)=>
{
    const campground = await Campground.findById(req.params.id)
    const review = new Review(req.body.review)
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash("success", "Successfully posted review");
    res.redirect(`/campgrounds/${req.params.id}`)
}))

router.delete("/:id/reviews/:reviewid", asyncCatch(async(req, res)=>{
    const {id, reviewId} = req.params;
    await Campground.findByIdAndUpdate(id, {$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId)
    req.flash("success", "Successfully deleted review");
    res.redirect(`/campgrounds/${id}`);
}))

router.put("/:id", validateCampground, asyncCatch(async (req, res, next)=>
{
    if(!req.body.campground){throw new AppError("Invalid Campground Data", 400)}
    const {id} = req.params;
    await Campground.findByIdAndUpdate(id, {...req.body.campground})
    req.flash("success", "Successfully updated campground");
    res.redirect(`/campgrounds/${id}`);
    next(e);
}))

router.delete("/:id", asyncCatch(async (req, res)=>
{
    const {id} = req.params;
    await Campground.findByIdAndDelete(id, {...req.body.campground})
    req.flash("success", "Successfully deleted campground");
    res.redirect("/campgrounds/");
}))

router.get("/:id", asyncCatch(async (req, res)=>
{
    const campground = await Campground.findById(req.params.id).populate("reviews");
    if(!campground){
        req.flash("error", "Can not find that campground :(");
        //if we dont return if comes backs and executes the rest
        return res.redirect("/campgrounds/");
    }
    res.render('campgrounds/detail.ejs', {campground})
}))

module.exports = router;