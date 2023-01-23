const express = require('express');
const {
    getAllUsers,
    createUser,
    getUser,
    updateUser,
    deactivateUser,
    deleteUser
} = require('./../controllers/userController')
const {
    signUp,
    login,
    forgotPassword,
    resetPassword,
    updatePassword,
    routeProtect } = require('./../controllers/authController')


const router = express.Router();

router.post('/signup', signUp)
router.post('/login', login)
router.patch('/update_password', routeProtect, updatePassword)
router.post('/forgot_password', forgotPassword)
router.patch('/reset_password/:token', resetPassword)
router.patch('/update_user', routeProtect, updateUser)
router.delete('/deactivate', routeProtect, deactivateUser)

router
    .route('/')
    .get(getAllUsers)
    .post(createUser)

router
    .route('/:id')
    .get(getUser)
    .delete(deleteUser)


module.exports = router;