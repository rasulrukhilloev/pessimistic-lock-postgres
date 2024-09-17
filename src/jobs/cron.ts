import { inject, injectable } from 'inversify';
import cron from 'node-cron';
import { EndpointRepository } from '../repositories/endpoint.repository';
import { TYPES } from '../types/symbols';
import { RedisClientType } from 'redis';
import logger from '../utils/logger';

@injectable()
export class CleanupJob {
  constructor(
      @inject(EndpointRepository) private endpointRepository: EndpointRepository,
      @inject(TYPES.RedisClient) private redisClient: RedisClientType
  ) {}

  start() {
    cron.schedule('*/1 * * * *', async () => {
      try {
        const expiredEndpoints = await this.endpointRepository.getExpiredEndpoints();
        for (const endpoint of expiredEndpoints) {
          await this.endpointRepository.deleteValue(endpoint.user.id);
          await this.redisClient.del(`endpoint:${endpoint.user.id}`);
        }
        logger.info(`Cleaned up ${expiredEndpoints.length} expired endpoints`);
      } catch (error) {
        logger.error('Error in cleanup job', error);
      }
    });
  }
}