const mongoose = require('mongoose')
const catchAsync = require('./../utils/catchAsync')
const Users = require('../models/userModel')

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

exports.updateUser = (req, res) => {
    res.status(500).json({
        status: 'Internal Server Error',
        message: 'Not Defined Yet!'
    })
}

exports.deleteUser = (req, res) => {
    res.status(500).json({
        status: 'Internal Server Error',
        message: 'Not Defined Yet!'
    })
}