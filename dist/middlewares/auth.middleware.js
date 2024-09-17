"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const database_1 = require("../db/database");
const user_entity_1 = require("../entities/user.entity");
const errors_1 = require("../utils/errors");
const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            throw new errors_1.UnauthorizedError('No token provided');
        }
        const token = authHeader.split(' ')[1];
        const secret = process.env.JWT_SECRET || 'jwt_some_secret';
        const decoded = jsonwebtoken_1.default.verify(token, secret);
        if (typeof decoded === 'string' || !('id' in decoded)) {
            throw new errors_1.UnauthorizedError('Invalid token');
        }
        const userRepository = database_1.AppDataSource.getRepository(user_entity_1.UserEntity);
        const user = await userRepository.findOneBy({ id: decoded.id });
        if (!user) {
            throw new errors_1.UnauthorizedError('User not found');
        }
        req.user = user;
        next();
    }
    catch (error) {
        if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
            next(new errors_1.UnauthorizedError('Invalid token'));
        }
        else {
            next(error);
        }
    }
};
exports.authMiddleware = authMiddleware;
