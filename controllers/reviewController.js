const Review = require('../models/reviewModel');
const factory = require('./handlerFactory');

exports.setTourUserIds = (req, res, next) => {
    // Allow nested route
    if (!req.body.tour) req.body.tour = req.params.tourId;
    if (!req.body.user) req.body.user = req.user.id;
    next();
}


exports.getAllReview = factory.getAll(Review)

// IMPORTED CREATE FUNCTION BY FACTORY HANDLER
exports.createReview = factory.createOne(Review)
// exports.createReview = catchAsync(async (req, res, next) => {
//     // Allow nested route
//     if (!req.body.tour) req.body.tour = req.params.tourId;
//     if (!req.body.user) req.body.user = req.user.id;
//     const newReview = await Review.create(req.body);

//     res.status(201).json({
//         status: 'sucess',
//         data: {
//             review: newReview
//         }
//     })
// })

exports.getReview = factory.getOne(Review);

// IMPORTED DELETE FUNCTION BY FACTORY HANDLER
exports.deleteReview = factory.deleteOne(Review);

// IMPORTED UPDATE FUNCTION BY FACTORY HANDLER
exports.updateReview = factory.updateOne(Review);