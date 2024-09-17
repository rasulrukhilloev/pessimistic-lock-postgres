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
Object.defineProperty(exports, "__esModule", { value: true });
exports.EndpointService = void 0;
const inversify_1 = require("inversify");
const endpoint_repository_1 = require("../repositories/endpoint.repository");
const symbols_1 = require("../types/symbols");
let EndpointService = class EndpointService {
    constructor(endpointRepository, redisClient) {
        this.endpointRepository = endpointRepository;
        this.redisClient = redisClient;
    }
    async setValue(userId, value, expiresAt) {
        if (expiresAt.getTime() <= Date.now()) {
            throw new Error('Expiration date must be in the future');
        }
        await this.endpointRepository.setValue(userId, value, expiresAt);
        await this.redisClient.set(`endpoint:${userId}`, value.toString(), {
            EX: Math.floor((expiresAt.getTime() - Date.now()) / 1000)
        });
    }
    async getValue(userId) {
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
        });
        return endpoint.value;
    }
};
exports.EndpointService = EndpointService;
exports.EndpointService = EndpointService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(endpoint_repository_1.EndpointRepository)),
    __param(1, (0, inversify_1.inject)(symbols_1.TYPES.RedisClient)),
    __metadata("design:paramtypes", [endpoint_repository_1.EndpointRepository, Object])
], EndpointService);
