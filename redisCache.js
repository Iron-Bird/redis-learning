const Redis = require('redis');

const DEFAULT_EXPIRATION = 3600;

const redisClient = Redis.createClient();

module.exports = {
    getOrSetCache: function (key, cb) {
        return new Promise(((resolve, reject) => {
            redisClient.get(key, async (error, data) => {

                if (error) {
                    return reject(error);
                }

                if (data) {
                    data = JSON.parse(data)
                    return resolve(data);
                }

                let freshData = await cb();

                freshData = JSON.stringify(freshData);
                redisClient.setex(key, DEFAULT_EXPIRATION, freshData);
                freshData = JSON.parse(freshData);
                resolve(freshData);
            });
        }));
    },

    deleteCachedData: function (key) {
        redisClient.del(key, function (err, data) {
            if (data === 1) {
                const id = key.split('/')[1];
                console.log(`User with id ${id} was deleted from redis memory`)
            }
        })
    }
};

