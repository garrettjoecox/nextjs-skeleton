import Chance from 'chance';
import _ from 'lodash';
import { v4 as uuid } from 'uuid';
import { SerializedUser, User, UserStatus } from './types';

const chance = new Chance();

export function serializeUser(user: User): SerializedUser {
  return _.pick(user, ['id', 'name', 'email', 'status']);
}

export function randomUser(overrides = {}): User {
  return {
    id: uuid(),
    name: chance.word({ length: 6 }),
    email: chance.email(),
    password: chance.word({ length: 8 }),
    status: UserStatus.ACTIVE,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  };
}
