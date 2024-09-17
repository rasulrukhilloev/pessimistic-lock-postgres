import { Container } from 'inversify';
import { DataSource } from 'typeorm';
import { UserRepository } from './repositories/user.repository';
import { EndpointRepository } from './repositories/endpoint.repository';
import { AuthService } from './services/auth.service';
import { EndpointService } from './services/endpoint.service';
import { AuthController } from './controllers/auth.controller';
import { EndpointController } from './controllers/endpoint.controller';
import { CleanupJob } from './jobs/cron';
import { TYPES } from './types/symbols';
import { AppDataSource } from './db/database';
import { redisClient } from './db/redis';

const container = new Container();

container.bind<DataSource>(DataSource).toConstantValue(AppDataSource);
container.bind(TYPES.RedisClient).toConstantValue(redisClient);

container.bind(UserRepository).toSelf();
container.bind(EndpointRepository).toSelf();
container.bind(AuthService).toSelf();
container.bind(EndpointService).toSelf();
container.bind(AuthController).toSelf();
container.bind(EndpointController).toSelf();
container.bind(CleanupJob).toSelf();

export { container };