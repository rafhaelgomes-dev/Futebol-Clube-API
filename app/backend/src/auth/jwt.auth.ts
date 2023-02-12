import * as dotenv from 'dotenv';
import * as jwtToken from 'jsonwebtoken';
import { loginType } from '../types/Login.type';

dotenv.config();

export default class JwtAuth {
  public jwtScrete: string;

  constructor() {
    this.jwtScrete = process.env.JWT_SECRET || '123456789';
  }

  public createToken(user: loginType): string {
    const token = jwtToken.sign(
      { data: user },
      this.jwtScrete,
      { expiresIn: '30m', algorithm: 'HS256' },
    );
    return token;
  }
}
