import dotenv from 'dotenv';

dotenv.config();

const parseRedisUrl = (url: string): { host: string; port: number } => {
  const parsedUrl = new URL(url);
  return {
    host: parsedUrl.hostname,
    port: parseInt(parsedUrl.port || '6379', 10)
  };
};

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
const redisParsed = parseRedisUrl(redisUrl);

export const config = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3000', 10),
  jwtSecret: process.env.JWT_SECRET || 'jwt_some_secret',
  postgres: {
    host: process.env.POSTGRES_HOST || 'localhost',
    port: parseInt(process.env.POSTGRES_PORT || '5432', 10),
    database: process.env.POSTGRES_DB || 'auth_service',
    username: process.env.POSTGRES_USER || 'postgres',
    password: process.env.POSTGRES_PASSWORD || 'password',
  },
  redis: {
    url: redisUrl,
    host: redisParsed.host,
    port: redisParsed.port,
  },
};