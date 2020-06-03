import knex from 'knex';

// path é uma lib do node que serve para padronizar caminhos de arquivos
import path from 'path';

const connection = knex({
  client: 'sqlite3',
  connection: {
    filename: path.resolve(__dirname, 'database.sqlite'),
  },
  useNullAsDefault: true,
});

export default connection;