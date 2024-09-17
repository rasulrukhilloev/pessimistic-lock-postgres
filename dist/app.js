"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const error_middleware_1 = require("./middlewares/error.middleware");
const swagger_1 = require("./utils/swagger");
const auth_route_1 = require("./routes/auth.route");
const endpoint_route_1 = require("./routes/endpoint.route");
const app = (0, express_1.default)();
exports.app = app;
app.use(express_1.default.json());
(0, swagger_1.setupSwagger)(app);
app.use('/v1/auth', auth_route_1.authRouter);
app.use('/v1/endpoint', endpoint_route_1.endpointRouter);
app.use(error_middleware_1.errorHandler);
