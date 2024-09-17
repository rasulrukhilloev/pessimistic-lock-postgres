"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.endpointRouter = void 0;
const express_1 = __importDefault(require("express"));
const di_container_1 = require("../di-container");
const endpoint_controller_1 = require("../controllers/endpoint.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = express_1.default.Router();
const endpointController = di_container_1.container.get(endpoint_controller_1.EndpointController);
router.post('/', auth_middleware_1.authMiddleware, (req, res, next) => endpointController.setValue(req, res, next));
router.get('/', auth_middleware_1.authMiddleware, (req, res, next) => endpointController.getValue(req, res, next));
exports.endpointRouter = router;
