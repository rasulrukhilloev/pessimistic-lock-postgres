import { inject, injectable } from 'inversify';
import { EndpointRepository } from '../repositories/endpoint.repository';
import {TYPES} from "../types/symbols";
import {RedisClientType} from "redis";

@injectable()
export class EndpointService {

  constructor(@inject(EndpointRepository) private endpointRepository: EndpointRepository,
              @inject(TYPES.RedisClient) private redisClient: RedisClientType
  ) {
  }

  async setValue(userId: string, value: number, expiresAt: Date): Promise<void> {
    if (expiresAt.getTime() <= Date.now()) {
      throw new Error('Expiration date must be in the future');
    }
    await this.endpointRepository.setValue(userId, value, expiresAt);
    await this.redisClient.set(`endpoint:${userId}`, value.toString(), {
      EX: Math.floor((expiresAt.getTime() - Date.now()) / 1000)
    });
  }

  async getValue(userId: string): Promise<number | null> {
    const cachedValue = await this.redisClient.get(`endpoint:${userId}`);
    if (cachedValue !== null) {
      return parseInt(cachedValue, 10);
    }

    const endpoint = await this.endpointRepository.getValue(userId);
    if (!endpoint) {
      return null;
    }

    if (endpoint.expires_at < new Date()) {
      await this.endpointRepository.deleteValue(userId);
      await this.redisClient.del(`endpoint:${userId}`);
      return null;
    }

    await this.redisClient.set(`endpoint:${userId}`, endpoint.value.toString(), {
      EX: Math.floor((endpoint.expires_at.getTime() - Date.now()) / 1000)
    });    return endpoint.value;
  }
}