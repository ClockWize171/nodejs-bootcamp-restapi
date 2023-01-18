const AppError = require('../utils/appError')
const Tour = require('./../models/tourModel.js')
const APIFeatures = require('../utils/apiFeatures')
const catchAsync = require('../utils/catchAsync')


// const tours = JSON.parse(
//     fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
// )
exports.aliasTopTours = async (req, res, next) => {
    req.query.limit = '5';
    req.query.sort = '-ratingsAverage,price';
    req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
    next();
}



exports.getAllTours = catchAsync(async (req, res, next) => {
    // EXECUTE QUERY
    const features = new APIFeatures(Tour.find(), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();

    const tours = await features.query;
    // console.log(tours)

    // SEND RESPONSE 
    res.status(200).json({
        status: 'success',
        results: tours.length,
        data: {
            tours
        }
    })
})

exports.getTourById = catchAsync(async (req, res, next) => {
    // const tour = await Tour.findById(req.params.id);
    // if (!tour) {
    //     console.log('hello error')
    //     return next(new AppError('No tour found with that ID', 404));
    // }

    // res.status(200).json({
    //     status: 'success',
    //     data: {
    //         tour
    //     },
    // })
    try {
        const tour = await Tour.findById(req.params.id);
        res.status(200).json({
            status: 'success',
            data: {
                tour
            },
        })
    } catch (error) {
        return next(new AppError('No tour found with that ID', 404));

    }
})

exports.createTour = catchAsync(async (req, res, next) => {
    const newTour = await Tour.create(req.body);
    res.status(201).send({
        status: 'success',
        data: {
            tour: newTour
        }
    });
})

exports.updateTour = catchAsync(async (req, res, next) => {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    })
    res.status(200).json({
        status: 'success',
        data: {
            tour
        },
    })
})

exports.deleteTour = catchAsync(async (req, res, next) => {
    // const tour = await Tour.findByIdAndDelete(req.params.id)
    // if (!tour) {
    //     return next(new AppError('No tour found with that ID', 404));
    // }
    // res.status(204).json({
    //     status: 'success',
    //     data: {
    //         tour
    //     }
    // })
    try {
        const tour = await Tour.findByIdAndDelete(req.params.id)
        res.status(204).json({
            status: 'success',
            data: {
                tour
            }
        })
    } catch (error) {
        return next(new AppError('No tour found with that ID', 404));

    }
})

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