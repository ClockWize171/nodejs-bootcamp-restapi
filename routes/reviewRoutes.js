const express = require('express')
const {
    getAllReview,
    createReview,
    deleteReview } = require('../controllers/reviewController')
const { routeProtect, routeRestrictTo } = require('../controllers/authController')

const router = express.Router({ mergeParams: true });

router
    .route('/')
    .get(getAllReview)
    .post(routeProtect, routeRestrictTo('user'), createReview);

router
    .route('/:id')
    .delete(deleteReview);

module.exports = router;