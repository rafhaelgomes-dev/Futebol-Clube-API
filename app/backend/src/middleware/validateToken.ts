import { Response, Request, NextFunction } from 'express';
import Auth from '../auth/jwt.auth';

export default class validateToken {
  private _auth;

  constructor() {
    this._auth = new Auth();
  }

  public validateToken = (req: Request, res: Response, next: NextFunction): void | Response => {
    const token = req.header('authorization');

    const validate = this._auth.validateToken(token as string);

    if (!validate) {
      return res.status(401).send({ message: 'Token must be a valid token' });
    }

    return next();
  };
}
