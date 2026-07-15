const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

// Database Connection
async function main() {
  await mongoose.connect(MONGO_URL);
  console.log("Connected to MongoDB");
}

main().catch((err) => console.log(err));

// Middlewares
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);

// Home Route
app.get("/", (req, res) => {
  res.send("Hi, I am Root");
});

// Index route
app.get("/listings", async (req, res) => {
  try {
    const allListings = await Listing.find({});
    res.render("listings/index", { allListings });
  } catch (err) {
    console.log(err);
    res.send(err.message);
  }
});

// New route
app.get("/listings/new", (req, res) => {
  res.render("listings/new");
});

// Show riute
app.get("/listings/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const listing = await Listing.findById(id);

    res.render("listings/show", { listing });
  } catch (err) {
    console.log(err);
    res.send(err.message);
  }
});

// Create route
app.post("/listings", async (req, res) => {
  try {
    const newListing = new Listing(req.body.listing);
    await newListing.save();

    res.redirect("/listings");
  } catch (err) {
    console.log(err);
    res.send(err.message);
  }
});

// edit route
app.get("/listings/:id/edit", async (req, res) => {
  try {
    const { id } = req.params;
    const listing = await Listing.findById(id);

    res.render("listings/edit", { listing });
  } catch (err) {
    console.log(err);
    res.send(err.message);
  }
});

// update route
app.put("/listings/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await Listing.findByIdAndUpdate(id, {
      ...req.body.listing,
    });

    res.redirect(`/listings/${id}`);
  } catch (err) {
    console.log(err);
    res.send(err.message);
  }
});

// Delete route
app.delete("/listings/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await Listing.findByIdAndDelete(id);

    res.redirect("/listings");
  } catch (err) {
    console.log(err);
    res.send(err.message);
  }
});

// Server
app.listen(8080, () => {
  console.log("Server is listening on port 8080");
});