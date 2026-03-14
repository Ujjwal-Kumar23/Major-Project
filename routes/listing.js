const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const {
  isLoggedIn,
  isOwner,
  isOwnerDelete,
  validateListing,
} = require("../middleware.js");

const listingController = require("../controllers/listings.js");

const multer = require("multer");
const {storage} = require("../cloudConfig.js");
const upload = multer({storage});

router
  .route("/")
  .get(wrapAsync(listingController.index))
  .post(
    isLoggedIn,
    upload.single("listing[image]"),
     validateListing,
    wrapAsync(listingController.createListing),
  );

 

//New Route
router.get("/new", isLoggedIn, listingController.renderNewForm);



router
  .route("/:id")
  .get(wrapAsync(listingController.showListing))
  .put(
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.updateListing),
  )
  .delete(
    isLoggedIn,
    isOwnerDelete,
    wrapAsync(listingController.destroyListing),
  );

   router.get("/category/:category", async (req, res) => {
    const { category } = req.params;

    const allListings = await Listing.find({ category: category });

    res.render("listings/index.ejs", { allListings });
});

// EDIT ROUTE
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.renderEditForm),
);

module.exports = router;
