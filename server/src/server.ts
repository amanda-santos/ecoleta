import express from 'express';
import cors from 'cors';
import routes from './routes';
// path é uma lib do node que serve para padronizar caminhos de arquivos
import path from 'path';
import { errors } from 'celebrate';

// criando a aplicação
const app = express();

app.use(cors());

app.use(express.json());

app.use(routes);

// diretório de uploads 
app.use('/uploads', express.static(path.resolve(__dirname, '..', 'uploads')));

// para retornar erros automaticamente ao frontend
app.use(errors());

app.listen(3333);

/*
// pesquisa de usuários
app.get('/users', (request, response) => {
  const search = String(request.query.search);
  const filteredUsers = search ? users.filter(user => user.includes(search)) : users;
  return response.json(filteredUsers);
});

// listando um único usuário
app.get('/users/:id', (request, response) => {
  const id = Number(request.params.id);

  const user = users[id];

  return response.json(user);
});

// criando novo usuário
app.post('/users', (request, response) => {
  const data = request.body;
  console.log();
  const user = {
    name: data.name,
    email: data.email
  };
  return response.json(user);
});

*/
