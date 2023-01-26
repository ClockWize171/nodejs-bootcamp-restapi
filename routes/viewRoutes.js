const express = require('express');
const { getTour, getOverviews } = require('../controllers/viewsController')

const router = express.Router();


router.get('/', getOverviews)
router.get('/tour/:slug', getTour)

module.exports = router;