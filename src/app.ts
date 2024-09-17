import 'reflect-metadata';
import express from 'express';
import { errorHandler } from './middlewares/error.middleware';
import { setupSwagger } from './utils/swagger';
import { authRouter } from './routes/auth.route';
import { endpointRouter } from './routes/endpoint.route';

const app = express();

app.use(express.json());
setupSwagger(app);

app.use('/v1/auth', authRouter);
app.use('/v1/endpoint', endpointRouter);

app.use(errorHandler);

export { app };