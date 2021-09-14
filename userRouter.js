const { Router } = require('express');
const axios = require('axios');
const Redis = require('redis');

const DEFAULT_EXPIRATION = 3600

const redisClient = Redis.createClient();

const userRouter = Router();

userRouter.get('/', async (req, res) => {

    redisClient.get('users', async (err, data) => {

        if (err) {
            console.log(err);
        }

        if (data) {
            data = JSON.parse(data);
            return res.status(200).json(data);

        } else {
            const { data } = await axios.get('https://jsonplaceholder.typicode.com/users');
            redisClient.setex('users', DEFAULT_EXPIRATION, JSON.stringify(data));
            res.json(data);
        }

    });
})

userRouter.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        redisClient.get('users/${id}', async (err, data) => {

            if (err) {
                console.log(err);
            }

            if (data) {
                data = JSON.parse(data);
                return res.status(200).json(data);
            } else {
                const { data } = await axios.get('https://jsonplaceholder.typicode.com/users/${id}');
                redisClient.setex('users/${id}', DEFAULT_EXPIRATION, JSON.stringify(data));
                res.json(data);
            }
        })
    } catch (e) {
        console.log(e)
    }
})

module.exports = userRouter;