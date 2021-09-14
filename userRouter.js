const axios = require('axios');
const { Router } = require('express');

const { getOrSetCache, deleteCachedData } = require('./redisCache');
const User = require('./UserModel');

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

userRouter.post('/:id', async (req, res) => {
    try {
        const { body, params: { id } } = req;

        const user = await getOrSetCache(`users/${id}`, async () => {
            return User.create(body);
        });

        res.json(user);

    } catch (e) {
        console.log(e);
    }
});

userRouter.put('/:id', async (req, res) => {
    try {
        const { body, params: { id } } = req;

        await deleteCachedData(`users/${id}`);
        const updatedUser = await getOrSetCache(`users/${id}`, async () => {
            return User.create(body);
        });

        res.json(updatedUser);

    } catch (e) {
        console.log(e);
    }
});

module.exports = userRouter;