const express = require('express')
const {
    getAllReview,
    createReview,
    deleteReview,
    updateReview,
    setTourUserIds,
    getReview } = require('../controllers/reviewController')
const { routeProtect, routeRestrictTo } = require('../controllers/authController')

const router = express.Router({ mergeParams: true });

router.use(routeProtect);

router
    .route('/')
    .get(getAllReview)
    .post(routeRestrictTo('user'), setTourUserIds, createReview);

router
    .route('/:id')
    .get(getReview)
    .patch(routeRestrictTo('user', 'admin'), updateReview)
    .delete(routeRestrictTo('user', 'admin'), deleteReview);

module.exports = router;