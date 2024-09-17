"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CleanupJob = void 0;
const inversify_1 = require("inversify");
const node_cron_1 = __importDefault(require("node-cron"));
const endpoint_repository_1 = require("../repositories/endpoint.repository");
const symbols_1 = require("../types/symbols");
const logger_1 = __importDefault(require("../utils/logger"));
let CleanupJob = class CleanupJob {
    constructor(endpointRepository, redisClient) {
        this.endpointRepository = endpointRepository;
        this.redisClient = redisClient;
    }
    start() {
        node_cron_1.default.schedule('*/1 * * * *', async () => {
            try {
                const expiredEndpoints = await this.endpointRepository.getExpiredEndpoints();
                for (const endpoint of expiredEndpoints) {
                    await this.endpointRepository.deleteValue(endpoint.user.id);
                    await this.redisClient.del(`endpoint:${endpoint.user.id}`);
                }
                logger_1.default.info(`Cleaned up ${expiredEndpoints.length} expired endpoints`);
            }
            catch (error) {
                logger_1.default.error('Error in cleanup job', error);
            }
        });
    }
};
exports.CleanupJob = CleanupJob;
exports.CleanupJob = CleanupJob = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(endpoint_repository_1.EndpointRepository)),
    __param(1, (0, inversify_1.inject)(symbols_1.TYPES.RedisClient)),
    __metadata("design:paramtypes", [endpoint_repository_1.EndpointRepository, Object])
], CleanupJob);
