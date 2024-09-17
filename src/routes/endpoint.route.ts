import express from 'express';
import { container } from '../di-container';
import { EndpointController } from '../controllers/endpoint.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = express.Router();
const endpointController = container.get<EndpointController>(EndpointController);

router.post('/', authMiddleware, (req, res, next) => endpointController.setValue(req, res, next));
router.get('/', authMiddleware, (req, res, next) => endpointController.getValue(req, res, next));

export const endpointRouter = router;