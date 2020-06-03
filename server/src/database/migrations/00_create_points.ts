import Knex from 'knex';

export async function up(knex: Knex) {
  // criar a tabela
  return knex.schema.createTable('points', table => {
    table.increments('id').primary();
    table.string('image').notNullable();
    table.string('name').notNullable();
    table.string('email').notNullable();
    table.string('whatsapp').notNullable();
    table.string('latitude').notNullable();
    table.string('longitude').notNullable();
    table.string('city').notNullable();
    table.string('uf', 2).notNullable();
  });
}

export async function down(knex: Knex) {
  // voltar atrás (deletar a tabela)
  return knex.schema.dropTable('point');
}