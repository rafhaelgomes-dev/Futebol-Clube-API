import { Request, Response } from 'express';
import LoginServices from '../services/login.services';
import { loginType } from '../types/Login.type';

export default class Login {
  static async realizarLogin(req: Request, res: Response): Promise<Response> {
    try {
      const services = new LoginServices();

      const data:loginType = {
        email: req.body.email,
        password: req.body.password,
      };

      const result = await services.realizarLogin(data);

      if (result.type) {
        return res.status(result.statusCode).send({ message: result.message });
      }

      return res.status(result.statusCode).send({ token: result.message });
    } catch (error) {
      return res.status(400).send(error);
    }
  }
}
