import { normalize, schema, } from 'normalizr'

const authorSchema = new schema.Entity('author', { }, { idAttribute:'email' });
const mensajeSchema = new schema.Entity('post', { author: authorSchema }, { idAttribute: 'id' });
const postsSchema = new schema.Entity('posts',{ mensajes: [mensajeSchema] }, { idAttribute: 'id' });

const normalizarMensajes = (listaMensajes) => {
    if(listaMensajes.lenght === 0)
        return {};

    return normalize({id:'mensajes', mensajes: listaMensajes }, postsSchema)
}

export { normalizarMensajes }