import { NextApiRequest } from 'next';
import { ExtendedNextApiRequest, ExtendedNextApiResponse } from '../types/NextApi';
import { ErrorCode, NotFoundError, UserError } from '../utils/errors';
import logger from '../utils/logger';

function onError(error: Error, req: NextApiRequest, res: ExtendedNextApiResponse) {
  if (error instanceof UserError) {
    logger.verbose(error.message, error);
    res.fail(error);
  } else {
    logger.error(error.message, error);
    res.error(error);
  }
}

function onNoMatch(req: ExtendedNextApiRequest, res: ExtendedNextApiResponse) {
  return res.fail(new NotFoundError({ errorCode: ErrorCode.E_40401 }));
}

export default {
  onError,
  onNoMatch,
};
