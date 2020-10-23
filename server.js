const express = require("express");
const PORT = 4000;
const moment = require("moment")
const path = require("path");
const ejs = require("ejs");
const mongoose = require("mongoose");
//auth
const session = require("express-session");
const bodyParser = require("body-parser");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const Blog = require("./models/blog")
const app = express();

//middlewares
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);
app.use(
    session({
        secret: "keyboard cat",
        resave: false,
        saveUninitialized: false,
    })
);
app.use(passport.initialize());
app.use(passport.session());
//for the mongodb
const mongoURI =
    "mongodb+srv://admin-Abhinav:admin-Abhinav@cluster0-fz1t0.mongodb.net/ecurrency";
mongoose
    .connect(mongoURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log("database has been connected");
    });
mongoose.set("useCreateIndex", true);

//user schema
const userSchema = new mongoose.Schema({
    access: {
        type: Boolean,
        default: true
    },
    username: {
        type: String,
        
    },
    contact_number: {
        type: Number,
    },
    date: {
        type: Date,
        default: Date.now()
    }

});
userSchema.plugin(passportLocalMongoose);
const User =  new mongoose.model("User", userSchema);
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//Get requests for the various pages
app.get("/", (req, res) => { 
    req.session.returnTo = req.originalUrl
    res.render("index", {
        user:req.user
    });
});
app.get("/contact", function (req, res) {
    req.session.returnTo = req.originalUrl
    res.render("contact", {
        user:req.user
    })
});

app.get("/blog", async function (req, res) {
    try {
        req.session.returnTo = req.originalUrl    
        let blogs = await Blog.find();
        res.render("blog", { blogData: blogs, user: req.user });
        
    } catch (error) {
        res.json(error)
    }
    
});
app.get("/singleBlog/:id", async function (req, res) {
    try {
        req.session.returnTo = req.originalUrl   
        let blog = await Blog.findById(req.params.id); 
        res.render("singleBlog", {
            blog,
            user:req.user
         })
    } catch (error) {
        console.log(error);
    }
   
});
app.get("/neteller", function (req, res) {
    req.session.returnTo = req.originalUrl
    res.render("neteller", {
        user: req.user
    })
});
app.get("/skrill", function (req, res) {
    req.session.returnTo = req.originalUrl
    res.render("skrill", {
        user: req.user
    })
});
app.get("/entropay", function (req, res) {
    req.session.returnTo = req.originalUrl
    res.render("entropay", {
        user: req.user
    })
});
//get request for auth
app.get("/register", (req, res) => {
    res.render("register")
});
app.get("/logout", function (req, res) {
    req.logOut();
    res.render("index", {
        user:null
    })
})
//post requests for authentication
app.post("/register", async function (req, res) {
    const { username, password, contact_number } = req.body;

    User.register({ username: username }, password, function (err, user) {
        if (err) {
            console.log(err);
            res.redirect("/register");
        } else {
            passport.authenticate("local")(req, res, async function () {
                user.contact_number = contact_number
                await user.save();
                res.redirect(req.session.returnTo || '/');
                delete req.session.returnTo;

            });
        }
    });
});

//login user
app.post("/login", async function (req, res) {
   
    const user = new User({
        username: req.body.username,
        password: req.body.password,
    });

    req.login(user, function (err) {
        if (err) {
            console.log(err);
        } else {
            passport.authenticate("local")(req, res, function () {
                res.redirect(req.session.returnTo || '/');
                delete req.session.returnTo;
            });
        }
    });
})
//for the listening port
app.listen(PORT, () => {
    console.log(`server started on port ${PORT}`);
});
