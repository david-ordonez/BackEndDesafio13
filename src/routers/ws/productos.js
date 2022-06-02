import productosApi from '../../api/productos.js'

export default async function configurarSocket(socket, sockets) {
    const productos = await productosApi.listarAll();
    socket.emit('listaProductos',productos);

    socket.on('nuevoProducto',async nuevoProducto => {
        await productosApi.guardar(nuevoProducto);
        sockets.emit('listaProductos', await productosApi.listarAll());
    });
}