const axios = require('axios');
const Redis = require('redis');
const { Router } = require('express');

const { getOrSetCache } = require('./redisCache');

const userRouter = Router();

userRouter.get('/', async (req, res) => {
    try {
        const users = await getOrSetCache('users', async () => {
            const { data } = await axios.get('https://jsonplaceholder.typicode.com/users');
            return data;
        });

        res.json(users);
    } catch (e) {
        console.log(e)
    }
})

userRouter.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const user = await getOrSetCache(`users/${id}`, async () => {
            const { data } = await axios.get(`https://jsonplaceholder.typicode.com/users/${id}`);
            return data;
        });

        res.json(user);
    } catch (e) {
        console.log(e)
    }
})

module.exports = userRouter;