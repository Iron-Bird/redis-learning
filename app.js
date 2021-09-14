const express = require('express');
const path = require('path');
const mongoose = require('mongoose');

const user_router = require('./userRouter');

const app = express();
_dbConnect();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/users', user_router);

function _dbConnect () {
    mongoose.connect('mongodb://localhost:27017/redis');
    const connection = mongoose.connection;

    connection.on('error', () => {
        console.log('ERROR WITH DATABASE!')
    })
};

app.listen(5000, async () => {
    console.log('The server is running');
});