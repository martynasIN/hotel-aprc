const express = require('express');
const router = express.Router({mergeParams: true})

const reviewController = require("./../controllers/reviewController");

router.route("/")
  .get(reviewController.getAllReview)
  .post(reviewController.createReview)

module.exports = router;