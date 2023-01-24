const mongoose = require('mongoose')
const catchAsync = require('./../utils/catchAsync')
const factory = require('./handlerFactory')
const AppError = require('../utils/appError')
const User = require('../models/userModel')

const filterObj = (obj, ...allowFileds) => {
    const newObj = {};
    Object.keys(obj).forEach(element => {
        if (allowFileds.includes(element)) newObj[element] = obj[element]
    });
    return newObj;
}

exports.createUser = (req, res) => {
    res.status(501).json({
        status: 'Forbidden',
        message: 'Please use /signup instead'
    })
}

exports.getMe = (req, res, next) => {
    req.params.id = req.user.id;
    next();
};

exports.getAllUsers = factory.getAll(User)

exports.getUser = factory.getOne(User);

exports.updateUser = catchAsync(async (req, res, next) => {
    // 1) Create error if user POSTs password data
    if (req.body.password || req.body.passwordConfrim) {
        return next(new AppError('This is not for updating password. Please use /update_password', 400))
    }
    // 2) Filterd out unwanted fields that are not wanted to edit
    const filteredBody = filterObj(req.body, 'name', 'email');
    // 3) Update user documents
    const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, { new: true, runValidators: true });

    res.status(200).json({
        status: 'success',
        data: {
            user: updatedUser
        }
    })
})

exports.deactivateUser = catchAsync(async (req, res, next) => {
    await User.findByIdAndUpdate(req.user.id, { active: false })
    res.status(204).json({
        status: 'success',
        data: null,
    })
})

// IMPORTED UPDATE FUNCTION BY FACTORY HANDLER
// !!!!! DO NOT UPDATE PASSWD WITH THIS !!!!!
exports.forceUpdateUser = factory.updateOne(User)

// IMPORTED DELETE FUNCTION BY FACTORY HANDLER
exports.deleteUser = factory.deleteOne(User)