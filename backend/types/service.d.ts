import { User } from '../domains/user/types';

export type RequestContext = {
  requestId: string;
};

export type AuthedRequestContext = RequestContext & {
  auth: User;
};
