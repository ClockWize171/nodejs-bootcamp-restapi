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
const { routeProtect, tourRouteRestrictTo } = require('./../controllers/authController')

const router = express.Router();

// router.param('id', checkId);

router
    .route('/tour-stats')
    .get(getTourStats)

router
    .route('/monthly-plan/:year')
    .get(getMontlyPlan)

router
    .route('/top-5-cheap')
    .get(aliasTopTours, getAllTours)

router
    .route('/')
    .get(routeProtect, getAllTours)
    .post(createTour)

router
    .route('/:id')
    .get(getTourById)
    .patch(updateTour)
    .delete(
        routeProtect,
        tourRouteRestrictTo('admin', 'lead-guide'),
        deleteTour)

module.exports = router;
