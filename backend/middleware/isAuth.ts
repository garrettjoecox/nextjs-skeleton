import { verify } from 'jsonwebtoken';
import { appConfig } from '../config';
import { createAuthToken, setAuthCookie } from '../domains/auth/utils';
import userModel from '../domains/user/model';
import { ExtendedNextApiRequest, ExtendedNextApiResponse } from '../types/NextApi';
import { ErrorCode, UnauthorizedError } from '../utils/errors';
import { Logger } from '../utils/logger';

const logger = new Logger('Middleware');

function getToken(req: ExtendedNextApiRequest) {
  // Header takes priority over cookie
  if (req.headers.authorization) {
    const header = req.headers.authorization;

    const parts = header.split(' ');
    if (parts.length !== 2) throw new UnauthorizedError({ errorCode: ErrorCode.E_40102 });

    const scheme = parts[0];
    const token = parts[1];
    if (!/^Bearer$/i.test(scheme)) throw new UnauthorizedError({ errorCode: ErrorCode.E_40102 });

    return token;
  }
  if (req.cookies['auth-cookie']) {
    return req.cookies['auth-cookie'];
  }

  throw new UnauthorizedError({ errorCode: ErrorCode.E_40101 });
}

export default async function isAuth(req: ExtendedNextApiRequest, res: ExtendedNextApiResponse, next?: Function) {
  logger.verbose('isAuth()');
  const token = getToken(req);
  let decoded: { sub: string };

  try {
    decoded = verify(token, appConfig.jwtSecret) as { sub: string };
  } catch (error) {
    throw new UnauthorizedError({ errorCode: ErrorCode.E_40103 });
  }

  const user = await userModel.getUser(decoded.sub);
  if (!user) throw new UnauthorizedError({ errorCode: ErrorCode.E_40104 });

  req.context.auth = user;

  // Refresh cookie
  if (req.cookies['auth-cookie']) {
    const authToken = createAuthToken(user);

    setAuthCookie(req, res, authToken);
  }

  return next ? next() : Promise.resolve();
}
