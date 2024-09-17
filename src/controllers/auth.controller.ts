import { Request, Response, NextFunction } from 'express';
import { inject, injectable } from 'inversify';
import { AuthService } from '../services/auth.service';
import { BadRequestError, UnauthorizedError } from '../utils/errors';

@injectable()
export class AuthController {
  constructor(@inject(AuthService) private authService: AuthService) {}

  register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { username, password } = req.body;
      const token = await this.authService.register(username, password);
      res.json({ access_token: token });
    } catch (error: unknown) {
      if (error instanceof Error) {
        next(new BadRequestError(error.message));
      } else {
        next(new BadRequestError('An unknown error occurred'));
      }
    }
  };

  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { username, password } = req.body;
      const token = await this.authService.login(username, password);
      res.json({ access_token: token });
    } catch (error: unknown) {
      if (error instanceof Error) {
        next(new UnauthorizedError(error.message));
      } else {
        next(new UnauthorizedError('An unknown error occurred'));
      }
    }
  };

  me = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = req.user;
      if (!user) {
        throw new UnauthorizedError('User not authenticated');
      }
      res.json({
        username: user.username,
        id: user.id,
        registered_at: user.registered_at,
      });
    } catch (error: unknown) {
      next(error);
    }
  };
}