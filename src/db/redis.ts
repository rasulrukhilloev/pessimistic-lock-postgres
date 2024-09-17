import { createClient } from 'redis';
import { config } from '../config/config';
import logger from '../utils/logger';

export const redisClient = createClient({
  url: config.redis.url
});

export const connectRedis = async () => {
  if (!redisClient.isOpen) {
    await redisClient.connect();
    logger.info('Redis connected');
  }
};

redisClient.on('error', (err) => logger.error('Redis Client Error', err));