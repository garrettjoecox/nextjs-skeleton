import { NextApiRequest, NextApiResponse } from 'next';
import { User } from '../domains/user/types';

export interface JsendOpts {
  data?: any;
  httpStatus?: number;
  message?: string;
  stack?: string;
  errorCode?: number;
}

export type ExtendedNextApiResponse = NextApiResponse & {
  success: (jsendOpts?: JsendOpts) => void;
  fail: (jsendOpts?: JsendOpts) => void;
  error: (jsendOpts?: JsendOpts) => void;
};

export type ExtendedNextApiRequest = NextApiRequest & {
  context: {
    requestId: string;
    auth?: User;
  };
};

export type AuthedExtendedNextApiRequest = NextApiRequest & {
  context: {
    requestId: string;
    auth: User;
  };
};
