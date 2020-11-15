import Joi from 'joi';
import _ from 'lodash';
import { AuthedRequestContext, RequestContext } from '../../types/service';
import { ConflictError, ErrorCode, NotFoundError, UnauthorizedError, UserError } from '../../utils/errors';
import { Logger } from '../../utils/logger';
import userModel from './model';
import { CreateUserInput, SerializedUser, UpdateUserInput, User, UserStatus } from './types';
import { serializeUser } from './utils';

export class UserService {
  private logger = new Logger('UserService');

  public async listUsers(context: AuthedRequestContext): Promise<SerializedUser[]> {
    this.logger.verbose('listUsers()');

    const users = await userModel.listUsers();
    return users.map(serializeUser);
  }

  public async createUser(context: RequestContext, input: CreateUserInput): Promise<SerializedUser> {
    this.logger.verbose('createUser(', input, ')');
    await this.validateCreateUser(context, input);

    const createUserInput = _.pick(input, ['name', 'email', 'password']);
    const user = await userModel.createUser(createUserInput);

    return serializeUser(user);
  }

  private async validateCreateUser(context: RequestContext, input: CreateUserInput) {
    try {
      Joi.assert(
        input,
        Joi.object({
          name: Joi.string(),
          email: Joi.string().email().required(),
          password: Joi.string().min(8).required(),
        }),
        {
          abortEarly: false,
          errors: {
            label: false,
          },
        },
      );
    } catch (error) {
      throw new UserError({ errorCode: ErrorCode.E_40001, message: 'Validation Error', data: error });
    }

    const conflictingEmailUser = await userModel.getUserByEmail(input.email);
    if (conflictingEmailUser) {
      throw new ConflictError({ errorCode: ErrorCode.E_40901, message: 'Email already in use' });
    }
  }

  public async getUser(context: AuthedRequestContext, userId: string): Promise<SerializedUser> {
    this.logger.verbose('getUser(', userId, ')');
    await this.validateGetUser(context, userId);

    const user = (await userModel.getUser(userId)) as User;

    return serializeUser(user);
  }

  private async validateGetUser(context: AuthedRequestContext, userId: string) {
    // TODO: ACL
    if (userId !== context.auth.id) throw new UnauthorizedError();

    const existingUser = await userModel.getUser(userId);
    if (!existingUser) {
      throw new NotFoundError();
    }
  }

  public async updateUser(context: AuthedRequestContext, userId: string, input: UpdateUserInput) {
    this.logger.verbose('updateUser(', userId, input, ')');
    await this.validateUpdateUser(context, userId, input);

    const payload: { name?: string; email?: string; password?: string; status?: UserStatus } = _.pick(input, [
      'name',
      'email',
      'password',
    ]);
    if (payload.email && payload.email !== context.auth.email) {
      payload.status = UserStatus.PENDING;
    }

    const user = await userModel.updateUser(userId, payload);

    return serializeUser(user);
  }

  private async validateUpdateUser(context: AuthedRequestContext, userId: string, input: UpdateUserInput) {
    try {
      Joi.assert(
        input,
        Joi.object({
          name: Joi.string(),
          email: Joi.string().email(),
          password: Joi.string().min(8),
        }),
        {
          abortEarly: false,
          errors: {
            label: false,
          },
        },
      );
    } catch (error) {
      throw new UserError({ errorCode: ErrorCode.E_40005, message: 'Validation Error', data: error });
    }

    // TODO: ACL
    if (userId !== context.auth.id) {
      throw new UnauthorizedError({ errorCode: ErrorCode.E_40105 });
    }

    const existingUser = await userModel.getUser(userId);
    if (!existingUser) {
      throw new NotFoundError();
    }

    if (input.email && input.email !== existingUser?.email) {
      const conflictingEmailUser = await userModel.getUserByEmail(input.email);
      if (conflictingEmailUser) {
        throw new ConflictError({ errorCode: ErrorCode.E_40902, message: 'Email already in use' });
      }
    }
  }

  public async deleteUser(context: AuthedRequestContext, userId: string): Promise<void> {
    this.logger.verbose('deleteUser(', userId, ')');
    await this.validateDeleteUser(context, userId);

    await userModel.deleteUser(userId);
  }

  private async validateDeleteUser(context: AuthedRequestContext, userId: string) {
    // TODO: ACL
    if (userId !== context.auth.id) {
      throw new UnauthorizedError({ errorCode: ErrorCode.E_40105 });
    }

    const existingUser = await userModel.getUser(userId);
    if (!existingUser) {
      throw new NotFoundError();
    }
  }
}

export default new UserService();
