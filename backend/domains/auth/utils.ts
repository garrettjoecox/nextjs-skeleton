import * as bcrypt from 'bcryptjs';
import Cookies from 'cookies';
import jwt from 'jsonwebtoken';
import { appConfig } from '../../config';
import { ExtendedNextApiRequest, ExtendedNextApiResponse } from '../../types/NextApi';
import { SerializedUser } from '../user/types';

export function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export function comparePassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export function createAuthToken(user: SerializedUser): string {
  return jwt.sign({}, appConfig.jwtSecret, {
    expiresIn: appConfig.jwtExpiration,
    subject: user.id,
  });
}

export function setAuthCookie(req: ExtendedNextApiRequest, res: ExtendedNextApiResponse, authToken?: string) {
  const cookies = new Cookies(req, res, { keys: [appConfig.cookieSigningKey] });

  if (authToken) {
    cookies.set('auth-cookie', authToken, {
      maxAge: appConfig.jwtExpiration,
      expires: new Date(Date.now() + appConfig.jwtExpiration),
      // secure: true,
      httpOnly: true,
      overwrite: true,
      // domain: 'http://localhost:3000',
      // sameSite: 'strict',
      signed: true,
    });
  } else {
    cookies.set('auth-cookie', {
      // secure: true,
      httpOnly: true,
      overwrite: true,
      // domain: 'http://localhost:3000',
      // sameSite: 'strict',
      signed: true,
    });
  }
}
