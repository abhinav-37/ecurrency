const express = require("express");
const PORT = 4000;
const path = require("path");
const ejs = require("ejs");
const mongoose = require("mongoose");
const session = require("express-session");
const bodyParser = require("body-parser");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const findOrCreate = require("mongoose-findorcreate");

const app = express();

//middlewares
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);

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

//Get requests for the various pages
app.get("/", (req, res) => {
    res.render("index");
});
app.get("/contact", function (req, res) {
    res.render("contact")
})
app.get("/blog", function (req, res) {
    res.render("blog")
})
app.listen(PORT, () => {
    console.log(`server started on port ${PORT}`);
});
