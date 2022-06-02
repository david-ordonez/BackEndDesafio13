import knex from 'knex';
import config from '../src/config.js';

//------------------------------------------
// productos en SQLite
(async () => {
    const knexSQL = knex(config.sqlite3);
try {
    await knexSQL.schema.dropTableIfExists('productos')
    .then(() => {
        return knexSQL.schema.createTableIfNotExists('productos', table => {
            table.increments('id').primary();
            table.string('title',50).notNullable();
            table.float('price');
            table.string('thumbnail',254);
        });
    })
    .finally(() => {
        knexSQL.destroy();
    });
} catch (error) {
    console.log(`error al crear la tabla en SQLite ${error}`);
}
})()
