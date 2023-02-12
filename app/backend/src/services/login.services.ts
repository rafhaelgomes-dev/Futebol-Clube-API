import * as bcrypt from 'bcryptjs';
import { loginType } from '../types/Login.type';
import { IUsers } from '../interfaces/IUsers';
import { ResultTypes } from '../types/ResultTypes';
import User from '../database/models/UserModel';
import TokenAuth from '../auth/jwt.auth';

export default class Login {
  public authToken: TokenAuth;
  public userModel;

  constructor() {
    this.authToken = new TokenAuth();
    this.userModel = User;
  }

  public async realizarLogin(data: loginType): Promise<ResultTypes> {
    const user = await this.userModel.findOne({ where: { email: data.email } });
    let bcryptCompare = false;

    if (!data.email) {
      return { type: 'email_not_found', statusCode: 400, message: 'All fields must be filled' };
    }

    if (!data.password) {
      return { type: 'password_not_found', statusCode: 400, message: 'All fields must be filled' };
    }

    if (user) {
      bcryptCompare = bcrypt.compareSync(data.password, user.password);
    }

    if (bcryptCompare && user) {
      const token = this.authToken.createToken(user);
      return { type: null, statusCode: 200, message: token };
    }

    return { type: 'not_found', statusCode: 401, message: 'Incorrect email or password' };
  }

  public async validateUsers(data: string): Promise<ResultTypes> {
    const validateToken = this.authToken.validateToken(data) as IUsers;
    if (!validateToken) {
      return { type: 'token_Invalid', statusCode: 400, message: 'token_Invalid' };
    }
    return { type: null, statusCode: 200, message: validateToken.role };
  }
}
