import mensajesApi from '../../api/mensajes.js'
import { normalizarMensajes } from '../../normalizacion/index.js'

export default async function configurarSocket(socket, sockets) {
    socket.emit('listaMensajes',await mensajesApi.listarAll());
    socket.on('nuevoMensaje', async nuevoMensaje => {
        await mensajesApi.guardar(nuevoMensaje);

        const listaMensajes = await mensajesApi.listarAll();  
        const normalizedData = normalizarMensajes(listaMensajes);
        const porcentaje = calculaPorcentaje(listaMensajes, normalizedData) 

        sockets.emit('listaMensajes',{ normalizedData, porcentaje } );
    });    
}

function calculaPorcentaje(originalData, normalizedData){
    if(originalData.length == 0 || Object.keys(normalizedData).length === 0) return 0;

    const tamanio = JSON.stringify(originalData).length;
    const tamanioNormalized = JSON.stringify(normalizedData).length;
    const porc = (tamanioNormalized * 100) / tamanio;

    return porc.toFixed(2);
}
