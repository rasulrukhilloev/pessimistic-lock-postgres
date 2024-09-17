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
Object.defineProperty(exports, "__esModule", { value: true });
exports.EndpointRepository = void 0;
const inversify_1 = require("inversify");
const typeorm_1 = require("typeorm");
const endpoint_entity_1 = require("../entities/endpoint.entity");
let EndpointRepository = class EndpointRepository {
    constructor(dataSource) {
        this.dataSource = dataSource;
        this.repository = this.dataSource.getRepository(endpoint_entity_1.EndpointEntity);
    }
    async setValue(userId, value, expiresAt) {
        return this.dataSource.transaction(async (transactionalEntityManager) => {
            const existingEndpoint = await transactionalEntityManager.findOne(endpoint_entity_1.EndpointEntity, {
                where: { user: { id: userId } },
                lock: { mode: 'pessimistic_write' }
            });
            if (existingEndpoint) {
                existingEndpoint.value = value;
                existingEndpoint.expires_at = expiresAt;
                return transactionalEntityManager.save(endpoint_entity_1.EndpointEntity, existingEndpoint);
            }
            else {
                const endpoint = transactionalEntityManager.create(endpoint_entity_1.EndpointEntity, {
                    user: { id: userId },
                    value,
                    expires_at: expiresAt
                });
                return transactionalEntityManager.save(endpoint_entity_1.EndpointEntity, endpoint);
            }
        });
    }
    async getValue(userId) {
        return this.dataSource.transaction(async (transactionalEntityManager) => {
            return transactionalEntityManager.findOne(endpoint_entity_1.EndpointEntity, {
                where: { user: { id: userId } },
                lock: { mode: 'pessimistic_read' }
            });
        });
    }
    async deleteValue(userId) {
        await this.dataSource.transaction(async (transactionalEntityManager) => {
            const endpoint = await transactionalEntityManager.findOne(endpoint_entity_1.EndpointEntity, {
                where: { user: { id: userId } },
                lock: { mode: 'pessimistic_write' }
            });
            if (endpoint) {
                await transactionalEntityManager.remove(endpoint);
            }
        });
    }
    async getExpiredEndpoints() {
        return this.repository.find({
            where: { expires_at: (0, typeorm_1.LessThan)(new Date()) },
            relations: ['user']
        });
    }
};
exports.EndpointRepository = EndpointRepository;
exports.EndpointRepository = EndpointRepository = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], EndpointRepository);
