import * as dotenv from 'dotenv';
import * as jwtToken from 'jsonwebtoken';
import { IUsers } from '../interfaces/IUsers';

dotenv.config();

type validateToken = {
  data: {
    id?:number;
    email:string;
    password:string;
    role:string;
  }
};

export default class JwtAuth {
  public jwtScrete: string;

  constructor() {
    this.jwtScrete = process.env.JWT_SECRET || '123456789';
  }

  public createToken(user: IUsers): string {
    const token = jwtToken.sign(
      { data: user },
      this.jwtScrete,
      { expiresIn: '30m', algorithm: 'HS256' },
    );
    return token;
  }

  public validateToken(token: string) {
    try {
      const { data } = jwtToken.verify(token, this.jwtScrete) as validateToken;
      return data;
    } catch (error) {
      return false;
    }
  }
}
