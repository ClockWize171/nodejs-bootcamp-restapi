const { promisify } = require('util')
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const signToken = id => {
    return jwt.sign({ id: id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
}

exports.signUp = catchAsync(async (req, res, next) => {
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
        passwordChangedAt: req.body.passwordChangedAt,
        role: req.body.role
    });
    const token = signToken(newUser._id)

    res.status(200).json({
        success: 'success',
        token,
        data: {
            user: newUser
        }
    })
});


exports.login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    // 1) check if email and password exist
    if (!email || !password) {
        return next(new AppError('Please provide email and password', 400))
    }

    // 2) check if user exist and password is correct
    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.correctPassword(password, user.password))) {
        return next(new AppError('Invalid Email or Password', 401))
    }

    // 3) Is everything ok, send toke to client
    const token = signToken(user._id);
    res.status(200).json({
        status: 'success',
        token
    })
})

exports.tourRouteProtect = catchAsync(async (req, res, next) => {
    // 1) Getting token and check if it's there
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    // console.log(token)
    if (!token) {
        return next(new AppError('You are not logged in!', 401))
    }
    // 2) Verify token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET,)

    // 3) Check if user still exists
    const currentUser = await User.findById(decoded.id)
    if (!currentUser) {
        return next(new AppError('Your belonged token is no longer exits', 401))
    }

    // 4) Check if user changed password after token was issue
    if (!currentUser.changedPasswordAfter(decoded.iat)) {
        return next(new AppError('User recently changed password!', 401))
    };

    // GRANT ACCESS TO PROTECTED ROUTE
    req.user = currentUser;

    next();
});

exports.tourRouteRestrictTo = (...roles) => {
    return (req, res, next) => {
        // roles ['admin', 'lead-guide']. role=user
        if (!roles.includes(req.user.role)) {
            return next(new AppError('You do not have permission', 403))
        }
        next();
    }
}

exports.forgetPassword = catchAsync(async (req, res, next) => {
    // 1) Get a user based on POSTed email
    const user = await User.findOne({ email: req.body.email })
    if(!user){
        return next(new AppError('There is no user with email address', 404))
    }

    // 2) Generate the random reset token
    
    // 3) Send it to user's email
});

exports.resetPassword = (req, res, next) => {

}