import * as Knex from 'knex';
import { UserStatus } from '../../domains/user/types';

export async function up(knex: Knex) {
  await knex.schema.createTable('user', (table) => {
    table.uuid('id').primary().notNullable();
    table.string('name');
    table.string('email').unique().notNullable();
    table.string('password').notNullable();
    table.timestamp('createdAt').defaultTo(knex.fn.now());
    table.timestamp('updatedAt').defaultTo(knex.fn.now());
    table
      .enum('status', [UserStatus.PENDING, UserStatus.ACTIVE, UserStatus.DISABLED])
      .notNullable()
      .defaultTo(UserStatus.PENDING);
  });
}

export async function down(knex: Knex) {
  await knex.schema.dropTable('user');
}
