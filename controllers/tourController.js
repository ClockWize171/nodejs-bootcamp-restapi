const AppError = require('../utils/appError')
const Tour = require('./../models/tourModel.js')
const catchAsync = require('../utils/catchAsync')
const factory = require('./handlerFactory')


// const tours = JSON.parse(
//     fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
// )
exports.aliasTopTours = async (req, res, next) => {
    req.query.limit = '5';
    req.query.sort = '-ratingsAverage,price';
    req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
    next();
}

exports.getAllTours = factory.getAll(Tour)

// IMPORTED GET One FUNCTION BY FACTORY HANDLER
exports.getTourById = factory.getOne(Tour, { path: 'reviews' });

// IMPORTED UPDATE FUNCTION BY FACTORY HANDLER
exports.createTour = factory.createOne(Tour);
// exports.createTour = catchAsync(async (req, res, next) => {
//     const newTour = await Tour.create(req.body);
//     res.status(201).send({
//         status: 'success',
//         data: {
//             tour: newTour
//         }
//     });
// })

// IMPORTED UPDATE FUNCTION BY FACTORY HANDLER
exports.updateTour = factory.updateOne(Tour);
// exports.updateTour = catchAsync(async (req, res, next) => {
//     const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
//         new: true,
//         runValidators: true
//     })
//     res.status(200).json({
//         status: 'success',
//         data: {
//             tour
//         },
//     })
// })

// IMPORTED DELETE FUNCTION BY FACTORY HANDLER
exports.deleteTour = factory.deleteOne(Tour);
// exports.deleteTour = catchAsync(async (req, res, next) => {
//     // const tour = await Tour.findByIdAndDelete(req.params.id)
//     // if (!tour) {
//     //     return next(new AppError('No tour found with that ID', 404));
//     // }
//     // res.status(204).json({
//     //     status: 'success',
//     //     data: {
//     //         tour
//     //     }
//     // })
//     try {
//         const tour = await Tour.findByIdAndDelete(req.params.id)
//         res.status(204).json({
//             status: 'success',
//             data: {
//                 tour
//             }
//         })
//     } catch (error) {
//         return next(new AppError('No tour found with that ID', 404));

//     }
// })

exports.getTourStats = catchAsync(async (req, res, next) => {
    const stats = await Tour.aggregate([
        {
            $match: { ratingsAverage: { $gte: 4.5 } }
        },
        {
            $group: {
                // _id: '$ratingsAverage',
                _id: { $toUpper: '$difficulty' },
                totalTours: { $sum: 1 },
                numRatings: { $sum: '$ratingsQuantity' },
                avgRating: { $avg: '$ratingsAverage' },
                avgPrice: { $avg: '$price' },
                minPrice: { $min: '$price' },
                maxPrice: { $max: '$price' },
            }
        },
        {
            $sort: { avgPrice: 1 }
        },
        // {
        //     $match: { _id: { $ne: 'EASY' } }
        // }
    ]);
    res.status(200).json({
        status: 'success',
        data: {
            stats
        },
    })
})

exports.getMontlyPlan = catchAsync(async (req, res, next) => {
    const year = req.params.year * 1;
    const plan = await Tour.aggregate([
        {
            $unwind: '$startDates'
        },
        {
            $match: {
                startDates: {
                    $gte: new Date(`${year}-01-01`),
                    $lte: new Date(`${year}-12-31`)
                }
            }
        },
        {
            $group: {
                _id: { $month: '$startDates' },
                totalTourStarts: { $sum: 1 },
                tours: { $push: '$name' }
            }
        },
        {
            $addFields: { month: '$_id' }
        },
        {
            $project: {
                _id: 0
            }
        },
        {
            $sort: { totalTourStarts: -1 }
        },
        // {
        //     $limit: 6
        // }
    ])
    res.status(200).json({
        status: 'success',
        total: plan.length,
        data: {
            plan
        },
    })
})

// /tour-within/:distance/center/:latlng/unit/:unit
// tour-within?distance=223&center=-40,455&unit=mi
// tour-within/distance/223/center/16.877354, 96.185070/unit/mi
exports.getTourWithin = catchAsync(async (req, res, next) => {
    const { distance, latlng, unit } = req.params;
    const [lat, lng] = latlng.split(',');

    const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;

    if (!lat || !lng) {
        next(new AppError('Please provide latitute and longtitude in the format lat,lng', 400))
    }

    const tours = await Tour.find({
        startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } }
    });

    res.status(200).json({
        status: 'success',
        result: tours.length,
        data: {
            data: tours
        }
    })
})

exports.getDistances = catchAsync(async (req, res, next) => {
    const { latlng, unit } = req.params;
    const [lat, lng] = latlng.split(',');

    const multiplier = unit === 'mi' ? 0.000621371 : 0.001;

    if (!lat || !lng) {
        next(new AppError('Please provide latitute and longtitude in the format lat,lng', 400))
    }
    const distances = await Tour.aggregate([
        {
            $geoNear: {
                near: {
                    type: 'Point',
                    coordinates: [lng * 1, lat * 1]
                },
                distanceField: 'distance',
                distanceMultiplier: multiplier,
            }
        },
        {
            $project: {
                distance: 1,
                name: 1
            }
        }
    ]);
    res.status(200).json({
        status: 'success',
        data: {
            data: distances
        }
    })
})