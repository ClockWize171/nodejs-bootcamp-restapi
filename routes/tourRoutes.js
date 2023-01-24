const express = require('express');
const {
    getAllTours,
    createTour,
    getTourById,
    updateTour,
    deleteTour,
    checkId,
    aliasTopTours,
    getTourStats,
    getMontlyPlan,
    getTourWithin,
    getDistances } = require('./../controllers/tourController');
const { routeProtect, routeRestrictTo } = require('./../controllers/authController')
const reviewRouter = require('../routes/reviewRoutes')

const router = express.Router();

// router.param('id', checkId);

router.use('/:tourId/reviews', reviewRouter)

router
    .route('/tour-stats')
    .get(getTourStats)

router
    .route('/monthly-plan/:year')
    .get(
        routeProtect,
        routeRestrictTo('admin', 'lead-guide', 'guide'),
        getMontlyPlan
    );

router
    .route('/tour-within/:distance/center/:latlng/unit/:unit')
    .get(getTourWithin)
// tour-within?distance=223&center=-40,455&unit=mi
// tour-within/distance/223/center/-40,45/unit/mi

router
    .route('/top-5-cheap')
    .get(aliasTopTours, getAllTours)

router
    .route('/distances/:latlng/unit/:unit')
    .get(getDistances)

router
    .route('/')
    .get(routeProtect, getAllTours)
    .post(
        routeProtect,
        routeRestrictTo('admin', 'lead-guide'),
        createTour
    );

router
    .route('/:id')
    .get(getTourById)
    .patch(
        routeProtect,
        routeRestrictTo('admin', 'lead-guide'),
        updateTour
    )
    .delete(
        routeProtect,
        routeRestrictTo('admin', 'lead-guide'),
        deleteTour
    );

module.exports = router;
