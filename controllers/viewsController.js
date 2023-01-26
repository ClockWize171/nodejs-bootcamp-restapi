const Tour = require('../models/tourModel')
const catchAsync = require('../utils/catchAsync')

exports.getOverviews = catchAsync(async (req, res, next) => {
    // 1) Get tour data from collection
    const tours = await Tour.find();
    // 2) Build template
    // 3) Render thant template using tour date form 1)
    res.status(200).render('overview', {
        title: 'All Tours',
        tours
    })
})


exports.getTour = catchAsync(async (req, res, next) => {
    // 1) get the data, for requested tour (including reviews and guides)
    const slug = req.params.slug
    const tour = await Tour.findOne({ slug }).populate({
        path: 'reviews',
        field: 'review rating user'
    })
    // 2) Build template
    // console.log(tours)
    // 3) Render tamplate using data from 1)
    res.status(200).render('tour', {
        title: "Tour Details",
        tour
    })
})