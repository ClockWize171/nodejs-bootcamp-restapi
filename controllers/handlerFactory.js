const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.deleteOne = Model => catchAsync(async (req, res, next) => {
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
        const doc = await Model.findByIdAndDelete(req.params.id)
        res.status(204).json({
            status: 'success',
            data: {
                doc
            }
        })
    } catch (error) {
        return next(new AppError('No document found with that ID', 404));

    }
})