import { STATUS_CODES } from 'http';
import { v4 as uuid } from 'uuid';
import { appConfig } from '../config';
import { ExtendedNextApiRequest, ExtendedNextApiResponse, JsendOpts } from '../types/NextApi';

export default async function jsend(req: ExtendedNextApiRequest, res: ExtendedNextApiResponse, next: Function) {
  req.context = {
    requestId: uuid(),
  };

  res.success = ({ data, httpStatus }: JsendOpts = {}) => {
    res.status(httpStatus || 200);
    res.json({
      data,
      status: 'success',
    });
  };

  res.fail = ({ message, data, errorCode, httpStatus }: JsendOpts = {}) => {
    res.status(httpStatus || 400);
    res.json({
      data,
      errorCode,
      message: message || STATUS_CODES[res.statusCode],
      status: 'fail',
    });
  };

  res.error = ({ message, data, stack, errorCode, httpStatus }: JsendOpts = {}) => {
    if (appConfig.exposeErrors) {
      res.status(httpStatus || 500);
      res.json({
        data,
        stack,
        errorCode,
        message: message || STATUS_CODES[res.statusCode],
        status: 'error',
      });
    } else {
      res.status(500);
      res.json({
        errorCode,
        message: STATUS_CODES[500],
        status: 'error',
      });
    }
  };

  return next();
}
