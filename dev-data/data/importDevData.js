const fs = require('fs');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const Tour = require('./../../models/tourModel');
const Review = require('./../../models/reviewModel');
const User = require('./../../models/userModel');
const { dirname } = require('path');

dotenv.config({ path: './config.env' });
const DB = process.env.MONGO_URL.replace(
    '<PASSWORD>',
    process.env.MONGO_PASSWORD
);

mongoose
    // .connect(process.env.MONGO_LOCAL, {
    .connect(DB, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
    }).then(con => console.log('DB connection established'));

// READ JSON FILE
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf-8'));
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'));
const reviews = JSON.parse(fs.readFileSync(`${__dirname}/reviews.json`, 'utf-8'));

// IMPORT DATA INTO DATABASE
const importData = async () => {
    try {
        await Tour.create(tours)
        await Review.create(reviews, { validateBeforeSave: false })
        await User.create(users)
        console.log('Data successfully created')
        process.exit();
    } catch (error) {
        console.log(error)
    }
}

// DELETE ALL DATA FOROM DATABASE
const deleteData = async () => {
    try {
        await Tour.deleteMany()
        await Review.deleteMany()
        await User.deleteMany()
        console.log('Data successfully deleted')
        process.exit();
    } catch (error) {
        console.log(error)
    }
}

if (process.argv[2] === '--import') {
    importData()
} else if (process.argv[2] === '--delete') {
    deleteData()
}

console.log(process.argv)