const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const AppError = require("./utils/ExpressError.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const user = require("./models/user");
const campgroundsRoutes = require("./routes/campgrounds.js")
const authRoutes = require("./routes/auth");

//req.params accesses the variable (ex: campground/:id, where id would be the variable)
//req.body would access the information sent with the request in the requests body
//req.queray accesses the query strings

mongoose.connect("mongodb://localhost:27017/yelp-camp",{
    useNewUrlParser:true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", ()=>{
    console.log("Database connected");
});

const app = express();
const sessionConfig = {
    secret:"somesecret", 
    resave:false, 
    saveUninitialized:true,
    cookie:{
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
};

app.engine('ejs', ejsMate);
app.set("view engine", "ejs");

app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.use(express.static("public"));

app.use(session(sessionConfig));
app.use(flash());
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
})

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(user.authenticate()));

passport.serializeUser(user.serializeUser());
passport.serializeUser(user.deserializeUser());

app.use("/campgrounds", campgroundsRoutes);
app.use("/auth", authRoutes);

app.all('*', (req, res, next)=>{
    next(new AppError(404, "Page Not Found"))
})

app.use((err, req, res, next)=>{
    const {status = 500, message="Internal Server Error"} = err
    res.status(status)
    res.render("error.ejs",{message:message, status:status, err:err});
})

app.listen(3000, ()=>{
    console.log("Connected")
})