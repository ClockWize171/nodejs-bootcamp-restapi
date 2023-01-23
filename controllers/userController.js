const mongoose = require('mongoose')
const catchAsync = require('./../utils/catchAsync')
const factory = require('./handlerFactory')
const Users = require('../models/userModel')
const AppError = require('../utils/appError')
const User = require('../models/userModel')

const filterObj = (obj, ...allowFileds) => {
    const newObj = {};
    Object.keys(obj).forEach(element => {
        if (allowFileds.includes(element)) newObj[element] = obj[element]
    });
    return newObj;
}

exports.getAllUsers = catchAsync(async (req, res, next) => {
    const users = await Users.find()
    res.status(200).json({
        status: 'success',
        results: users.length,
        data: {
            users
        }
    })
})

exports.createUser = (req, res) => {
    res.status(500).json({
        status: 'Internal Server Error',
        message: 'Not Defined Yet!'
    })
}

exports.getUser = (req, res) => {
    res.status(500).json({
        status: 'Internal Server Error',
        message: 'Not Defined Yet!'
    })
}

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


// IMPORTED DELETE FUNCTION BY FACTORY HANDLER
exports.deleteUser = factory.deleteOne(User)