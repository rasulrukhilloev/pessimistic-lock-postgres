import { injectable } from 'inversify';
import { DataSource, Repository, LessThan, EntityManager } from 'typeorm';
import { EndpointEntity as Endpoint } from '../entities/endpoint.entity';

@injectable()
export class EndpointRepository {
  private repository: Repository<Endpoint>;

  constructor(private dataSource: DataSource) {
    this.repository = this.dataSource.getRepository(Endpoint);
  }

  async setValue(userId: string, value: number, expiresAt: Date): Promise<Endpoint> {
    return this.dataSource.transaction(async (transactionalEntityManager: EntityManager) => {
      const existingEndpoint = await transactionalEntityManager.findOne(Endpoint, {
        where: { user: { id: userId } },
        lock: { mode: 'pessimistic_write' }
      });

      if (existingEndpoint) {
        existingEndpoint.value = value;
        existingEndpoint.expires_at = expiresAt;
        return transactionalEntityManager.save(Endpoint, existingEndpoint);
      } else {
        const endpoint = transactionalEntityManager.create(Endpoint, {
          user: { id: userId },
          value,
          expires_at: expiresAt
        });
        return transactionalEntityManager.save(Endpoint, endpoint);
      }
    });
  }

  async getValue(userId: string): Promise<Endpoint | null> {
    return this.dataSource.transaction(async (transactionalEntityManager: EntityManager) => {
      return transactionalEntityManager.findOne(Endpoint, {
        where: { user: { id: userId } },
        lock: { mode: 'pessimistic_read' }
      });
    });
  }

  async deleteValue(userId: string): Promise<void> {
    await this.dataSource.transaction(async (transactionalEntityManager: EntityManager) => {
      const endpoint = await transactionalEntityManager.findOne(Endpoint, {
        where: { user: { id: userId } },
        lock: { mode: 'pessimistic_write' }
      });

      if (endpoint) {
        await transactionalEntityManager.remove(endpoint);
      }
    });
  }

  async getExpiredEndpoints(): Promise<Endpoint[]> {
    return this.repository.find({
      where: { expires_at: LessThan(new Date()) },
      relations: ['user']
    });
  }
}