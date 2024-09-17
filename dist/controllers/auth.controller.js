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
exports.AuthController = void 0;
const inversify_1 = require("inversify");
const auth_service_1 = require("../services/auth.service");
const errors_1 = require("../utils/errors");
let AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
        this.register = async (req, res, next) => {
            try {
                const { username, password } = req.body;
                const token = await this.authService.register(username, password);
                res.json({ access_token: token });
            }
            catch (error) {
                if (error instanceof Error) {
                    next(new errors_1.BadRequestError(error.message));
                }
                else {
                    next(new errors_1.BadRequestError('An unknown error occurred'));
                }
            }
        };
        this.login = async (req, res, next) => {
            try {
                const { username, password } = req.body;
                const token = await this.authService.login(username, password);
                res.json({ access_token: token });
            }
            catch (error) {
                if (error instanceof Error) {
                    next(new errors_1.UnauthorizedError(error.message));
                }
                else {
                    next(new errors_1.UnauthorizedError('An unknown error occurred'));
                }
            }
        };
        this.me = async (req, res, next) => {
            try {
                const user = req.user;
                if (!user) {
                    throw new errors_1.UnauthorizedError('User not authenticated');
                }
                res.json({
                    username: user.username,
                    id: user.id,
                    registered_at: user.registered_at,
                });
            }
            catch (error) {
                next(error);
            }
        };
    }
};
exports.AuthController = AuthController;
exports.AuthController = AuthController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(auth_service_1.AuthService)),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
