const Redis = require('redis');

const DEFAULT_EXPIRATION = 3600;

const redisClient = Redis.createClient();

module.exports.getOrSetCache = function (key, cb) {
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
};



