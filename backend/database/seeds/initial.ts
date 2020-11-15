import * as Knex from 'knex';
import { v4 as uuid } from 'uuid';
import { hashPassword } from '../../domains/auth/utils';
import { UserStatus } from '../../domains/user/types';

export async function seed(knex: Knex) {
  await knex('user').del();

  await knex('user').insert([
    {
      id: uuid(),
      name: 'Garrett',
      email: 'garrett@tailwindapp.com',
      password: await hashPassword('password'),
      status: UserStatus.ACTIVE,
    },
  ]);
}

export default seed;
