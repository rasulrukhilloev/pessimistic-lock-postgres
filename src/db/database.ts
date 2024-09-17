import "reflect-metadata";
import { DataSource } from "typeorm";
import dotenv from "dotenv";

import { UserEntity } from "../entities/user.entity";
import { EndpointEntity } from "../entities/endpoint.entity";

dotenv.config();
export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.POSTGRES_HOST || "localhost",
  port: parseInt(process.env.POSTGRES_PORT ?? "5432", 10),
  username: process.env.POSTGRES_USER || "postgres",
  password: process.env.POSTGRES_PASSWORD || "password",
  database: process.env.POSTGRES_DB || "auth_service",
  synchronize: true,
  entities: [UserEntity, EndpointEntity],
});
