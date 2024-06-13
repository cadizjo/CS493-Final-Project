const redis = require('redis');
const { RateLimiterRedis } = require('rate-limiter-flexible');

const redisHost = process.env.REDIS_HOST || "localhost"
const redisPort = process.env.REDIS_PORT || 6379

const redisClient = redis.createClient({
    url: `redis://${redisHost}:${redisPort}`
});

// Rate limiter for requests without a valid authentication token (per IP)
const rateLimiterIp = new RateLimiterRedis({
    storeClient: redisClient,
    keyPrefix: 'rateLimitIp', // Prefix for IP-based rate limiting keys
    points: 10, // Number of requests
    duration: 60, // Per minute
});

// Rate limiter for requests with a valid authentication token (per user)
const rateLimiterUser = new RateLimiterRedis({
    storeClient: redisClient,
    keyPrefix: 'rateLimitUser', // Prefix for user-based rate limiting keys
    points: 30, // Number of requests
    duration: 60, // Per minute
});

const rateLimitByIp = (req, res, next) => {
    const ip = req.ip;
    rateLimiterIp.consume(ip)
        .then(() => {
            next();
        })
        .catch(() => {
            res.status(429).send('Too Many Requests');
        });
};

const rateLimitByUser = (req, res, next) => {
    const userId = req.user;
    rateLimiterUser.consume(userId)
        .then(() => {
            next();
        })
        .catch(() => {
            res.status(429).send('Too Many Requests');
        });
};

module.exports = { redisClient, rateLimitByIp, rateLimitByUser };
