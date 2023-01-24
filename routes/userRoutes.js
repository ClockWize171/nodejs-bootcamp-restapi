const express = require('express');
const {
    getAllUsers,
    createUser,
    getUser,
    updateUser,
    deactivateUser,
    deleteUser,
    forceUpdateUser,
    getMe
} = require('./../controllers/userController')
const {
    signUp,
    login,
    forgotPassword,
    resetPassword,
    updatePassword,
    routeProtect, 
    routeRestrictTo} = require('./../controllers/authController')


const router = express.Router();

router.post('/signup', signUp)
router.post('/login', login)
router.post('/forgot_password', forgotPassword)
router.patch('/reset_password/:token', resetPassword)

// Protect all routes after this middleware
router.use(routeProtect);

router.patch('/update_password', updatePassword)
router.patch('/update_user', updateUser)
router.delete('/deactivate', deactivateUser)
router.get('/me', getMe, getUser)

// Protect all routes after this middleware
router.use(routeRestrictTo('admin'));

router
    .route('/')
    .get(getAllUsers)
    .post(createUser)

router
    .route('/:id')
    .patch(forceUpdateUser)
    .get(getUser)
    .delete(deleteUser)


module.exports = router;