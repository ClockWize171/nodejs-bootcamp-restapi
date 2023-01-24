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
    getMontlyPlan } = require('./../controllers/tourController');
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
    .route('/top-5-cheap')
    .get(aliasTopTours, getAllTours)

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
