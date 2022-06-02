import config from '../config.js'

import ContenedorSQL from '../contenedores/ContenedorSQL.js'

const productosApi = new ContenedorSQL(config.sqlite3,'productos');

export default productosApi