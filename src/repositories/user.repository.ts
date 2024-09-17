import { injectable } from 'inversify';
import { DataSource, Repository } from 'typeorm';
import { UserEntity as User } from '../entities/user.entity';

@injectable()
export class UserRepository {
  private repository: Repository<User>;

  constructor(private dataSource: DataSource) {
    this.repository = this.dataSource.getRepository(User);
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.repository.findOne({ where: { username } });
  }

  async createUser(username: string, hashedPassword: string): Promise<User> {
    const user = this.repository.create({ username, password: hashedPassword });
    return this.repository.save(user);
  }
}