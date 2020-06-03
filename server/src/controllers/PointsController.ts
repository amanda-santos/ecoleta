import { Request, Response } from 'express';
import knex from '../database/connection';

class PointsController {
  async index(request: Request, response: Response) {
    // filtros de cidade, uf, items => Query Params
    const { city, uf, items } = request.query;

    // pega os itens enviados (formato 1,2,3) e converte em um array, dividindo pela , 
    // e pegando cada item sem espaços e convertido em número
    const parsedItems = String(items)
      .split(',')
      .map(item => Number(item.trim()));

    const points = await knex('points')
      .join('point_items', 'points.id', '=', 'point_items.point_id')
      .whereIn('point_items.item_id', parsedItems)
      .where('city', String(city))
      .where('uf', String(uf))
      .distinct()
      .select('points.*');

    return response.json(points);
  }

  async show(request: Request, response: Response) {
    const { id } = request.params;

    const point = await knex('points').where('id', id).first();

    if (!point) {
      return response.status(400).json({ message: 'Point not found.' });
    }

    /**
     * SELECT * FROM items
     *  JOIN point_items ON items.id = point_items.item_id
     *  WHERE point_items.point_id = {id}
     */
    const items = await knex('items')
      .join('point_items', 'items.id', '=', 'point_items.item_id')
      .where('point_items.point_id', id)
      .select('items.title');

    return response.json({point, items });
  }

  async create(request: Request, response: Response) {

    // aqui é usada a desestruturação do JS
    // cada um é gual a ex.: const name = request.body.name
    const {
      name,
      email,
      whatsapp,
      latitude,
      longitude,
      city,
      uf,
      items
    } = request.body;

    // usando uma transaction com o knex
    const trx = await knex.transaction();
    
    // aqui é usada short syntax, porque as variáveis são iguais aos nomes
    // cada um é igual a ex.: name: name
    const point = {
      image: 'https://images.unsplash.com/photo-1556767576-5ec41e3239ea?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=400&q=60',
      name,
      email,
      whatsapp,
      latitude,
      longitude,
      city,
      uf
    };

    // o knex retorna um array de ids (insertedIds) após cada inserção, contendo todos os registros inseridos
    const insertedIds = await trx('points').insert(point);

    // iremos pegar o insertedIds[0], pois somente 1 registro foi inserido na tabela
    const point_id = insertedIds[0];

    // mapeando o array de itens cadastrados no formulário para esse ponto de coleta
    // para cada item, retornar um objeto contendo esse próprio item (o id dele) e o id do ponto 
    // (pegado acima após fazer a inserção no bd)
    const pointItems = items.map((item_id: number) => {
      return {
        item_id,
        point_id,
      }
    });

    // com isso, inserir na tabela point_items cada registro contendo o relacionamento ponto x item
    await trx('point_items').insert(pointItems);

    await trx.commit();

    // retornando o ponto cadastrado + o id criado automaticamente
    return response.json({ 
      id: point_id,
      ...point,
    });
  }
}

export default PointsController;