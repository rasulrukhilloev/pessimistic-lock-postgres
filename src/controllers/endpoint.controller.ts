import {NextFunction, Request, Response} from 'express';
import {inject, injectable} from 'inversify';
import { EndpointService } from '../services/endpoint.service';
import {BadRequestError, NotFoundError} from "../utils/errors";

@injectable()
export class EndpointController {
  constructor(@inject(EndpointService) private endpointService: EndpointService) {}

  async setValue(req: Request, res: Response, next: NextFunction) {
    const { value, expires_at } = req.body;
    const userId = req.user.id;

    try {
      await this.endpointService.setValue(userId, value, new Date(expires_at));
      res.sendStatus(200);
    } catch (error: unknown) {
      if (error instanceof Error) {
        next(new BadRequestError(error.message));
      } else {
        next(new BadRequestError('An unknown error occurred'));
      }
    }
  }

  async getValue(req: Request, res: Response, next: NextFunction) {
    const userId = req.user.id;

    try {
      const value = await this.endpointService.getValue(userId);
      res.json(value);
    } catch (error: unknown) {
      if (error instanceof Error) {
        next(new NotFoundError(error.message));
      } else {
        next(new NotFoundError('An unknown error occurred'));
      }
    }
  }
}