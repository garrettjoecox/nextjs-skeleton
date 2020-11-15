import Joi from 'joi';
import { AuthedRequestContext } from '../../types/service';
import { ErrorCode, UserError } from '../../utils/errors';
import { Logger } from '../../utils/logger';
import userModel from '../user/model';
import { SerializedUser, User } from '../user/types';
import { serializeUser } from '../user/utils';
import { LoginInput } from './types';
import { comparePassword } from './utils';

export class AuthService {
  private logger = new Logger('AuthService');

  public async login(context: AuthedRequestContext, input: LoginInput): Promise<SerializedUser> {
    this.logger.verbose('login(', input, ')');

    await this.validateLogin(context, input);

    const user = (await userModel.getUserByEmail(input.email)) as User;
    const serializedUser = serializeUser(user);

    return serializedUser;
  }

  private async validateLogin(context: AuthedRequestContext, input: LoginInput) {
    try {
      Joi.assert(
        input,
        Joi.object({
          email: Joi.string().required(),
          password: Joi.string().required(),
        }),
        {
          abortEarly: false,
          errors: {
            label: false,
          },
        },
      );
    } catch (error) {
      throw new UserError({ errorCode: ErrorCode.E_40002, message: 'Validation Error', data: error });
    }

    const user = await userModel.getUserByEmail(input.email);
    if (!user) throw new UserError({ errorCode: ErrorCode.E_40003, message: 'Invalid auth credentials' });

    if (!(await comparePassword(input.password, user.password))) {
      throw new UserError({ errorCode: ErrorCode.E_40004, message: 'Invalid auth credentials' });
    }
  }

  public async getAuthenticated(context: AuthedRequestContext): Promise<SerializedUser> {
    return serializeUser(context.auth);
  }
}

export default new AuthService();
