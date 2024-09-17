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
exports.EndpointController = void 0;
const inversify_1 = require("inversify");
const endpoint_service_1 = require("../services/endpoint.service");
const errors_1 = require("../utils/errors");
let EndpointController = class EndpointController {
    constructor(endpointService) {
        this.endpointService = endpointService;
    }
    async setValue(req, res, next) {
        const { value, expires_at } = req.body;
        const userId = req.user.id;
        try {
            await this.endpointService.setValue(userId, value, new Date(expires_at));
            res.sendStatus(200);
        }
        catch (error) {
            if (error instanceof Error) {
                next(new errors_1.BadRequestError(error.message));
            }
            else {
                next(new errors_1.BadRequestError('An unknown error occurred'));
            }
        }
    }
    async getValue(req, res, next) {
        const userId = req.user.id;
        try {
            const value = await this.endpointService.getValue(userId);
            res.json(value);
        }
        catch (error) {
            if (error instanceof Error) {
                next(new errors_1.NotFoundError(error.message));
            }
            else {
                next(new errors_1.NotFoundError('An unknown error occurred'));
            }
        }
    }
};
exports.EndpointController = EndpointController;
exports.EndpointController = EndpointController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(endpoint_service_1.EndpointService)),
    __metadata("design:paramtypes", [endpoint_service_1.EndpointService])
], EndpointController);
