import * as bcrypt from 'bcryptjs';
import { loginType } from '../types/Login.type';
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

    if (!user) {
      return { type: 'teste', statusCode: 400, message: 'Não existe usuário com este email' };
    }

    if (user) {
      bcryptCompare = bcrypt.compareSync(data.password, user.password);
    }

    if (bcryptCompare) {
      const token = this.authToken.createToken(data);
      return { type: null, statusCode: 200, message: token };
    }

    return { type: 'teste', statusCode: 400, message: 'senha inválida' };
  }
}
