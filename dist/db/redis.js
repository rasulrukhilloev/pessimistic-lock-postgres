"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectRedis = exports.redisClient = void 0;
const redis_1 = require("redis");
const config_1 = require("../config/config");
const logger_1 = __importDefault(require("../utils/logger"));
exports.redisClient = (0, redis_1.createClient)({
    url: config_1.config.redis.url
});
const connectRedis = async () => {
    if (!exports.redisClient.isOpen) {
        await exports.redisClient.connect();
        logger_1.default.info('Redis connected');
    }
};
exports.connectRedis = connectRedis;
exports.redisClient.on('error', (err) => logger_1.default.error('Redis Client Error', err));
