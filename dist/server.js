"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const di_container_1 = require("./di-container");
const database_1 = require("./db/database");
const redis_1 = require("./db/redis");
const config_1 = require("./config/config");
const logger_1 = __importDefault(require("./utils/logger"));
const cron_1 = require("./jobs/cron");
async function startServer() {
    try {
        await database_1.AppDataSource.initialize();
        logger_1.default.info('Database initialized');
        await (0, redis_1.connectRedis)();
        app_1.app.listen(config_1.config.port, () => {
            logger_1.default.info(`Server is running on port ${config_1.config.port}`);
        });
        const cleanupJob = di_container_1.container.get(cron_1.CleanupJob);
        cleanupJob.start();
    }
    catch (error) {
        logger_1.default.error('Error starting server', error);
        process.exit(1);
    }
}
startServer();
