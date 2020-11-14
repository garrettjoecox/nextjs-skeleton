import * as Knex from 'knex';

export async function seed(knex: Knex) {
  await knex('user').del();

  await knex('user').insert([
    {
      id: 1,
      name: 'Garrett',
      email: 'garrett@tailwindapp.com',
      password: 'blah',
    },
  ]);
}

export default seed;
