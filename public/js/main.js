const socket = io.connect();

//------------------------------------------------------------------------------------

const formAgregarProducto = document.getElementById('formAgregarProducto')
formAgregarProducto.addEventListener('submit', e => {
    e.preventDefault()
    const producto = {
        title: formAgregarProducto[0].value,
        price: formAgregarProducto[1].value,
        thumbnail: formAgregarProducto[2].value
    }
    socket.emit('nuevoProducto', producto);
    formAgregarProducto.reset()
    return false;
})

socket.on('listaProductos', productos => {
    makeHtmlTable(productos).then(html => {
        document.getElementById('productos').innerHTML = html
    })
});

function makeHtmlTable(productos) {
    return fetch('plantillas/tabla-productos.hbs')
        .then(respuesta => respuesta.text())
        .then(plantilla => {
            const template = Handlebars.compile(plantilla);
            const html = template({ productos })
            return html
        })
}

//-------------------------------------------------------------------------------------

// MENSAJES

/* --------------------- DESNORMALIZACIÓN DE MENSAJES ---------------------------- */
// Definimos un esquema de autor
const authorSchema = new normalizr.schema.Entity('author', {}, { idAttribute: 'email' });
const mensajeSchema = new normalizr.schema.Entity('post', {
    author: authorSchema
}, { idAttribute: 'id' });

const postsSchema = new normalizr.schema.Entity('posts', {
    mensajes: [mensajeSchema]
}, { idAttribute: 'id' });
/* ----------------------------------------------------------------------------- */

const inputUsername = document.getElementById('username')
const inputMensaje = document.getElementById('inputMensaje')
const btnEnviar = document.getElementById('btnEnviar')

const formPublicarMensaje = document.getElementById('formPublicarMensaje')
formPublicarMensaje.addEventListener('submit', e => {
    e.preventDefault()
    const fecha = new Date();
    const mensaje = {
        author: {
            email: inputUsername.value,
            nombre: document.getElementById('firstname').value,
            apellido: document.getElementById('lastname').value,
            edad: document.getElementById('age').value,
            alias: document.getElementById('alias').value,
            avatar: document.getElementById('avatar').value
        },
        text: inputMensaje.value,
        fecha: `${fecha.toLocaleDateString('es-MX')} ${fecha.toLocaleTimeString('es-MX')}`
    }

    socket.emit('nuevoMensaje', mensaje);
    formPublicarMensaje.reset()
    inputMensaje.focus();
    return false;
})

socket.on('listaMensajes', async listaMensajes => {    
    const denormalizedData = normalizr.denormalize(listaMensajes.normalizedData?.result, postsSchema, listaMensajes.normalizedData?.entities);
    console.log('desnormalizado =>' + JSON.stringify(denormalizedData));
    if(denormalizedData){
        const html = await makeHtmlList(denormalizedData.mensajes);
        document.getElementById('mensajes').innerHTML = html;
        document.getElementById('compresion-info').innerText = listaMensajes.porcentaje !== 0 ? `${listaMensajes.porcentaje}`: '';
    }
});

function makeHtmlList(mensajes) {
    return mensajes.map(mensaje => {
        return (`
        <div>
            <b style="color:blue;">${mensaje.author.email}</b>
            [<span style="color:brown;">${mensaje.fecha}</span>] :
            <i style="color:green;">${mensaje.text}</i>
            <img width="50" src="${mensaje.author.avatar}" alt=" ">
        </div>
    `)
    }).join(" ");
}

inputUsername.addEventListener('input', () => {
    const hayEmail = inputUsername.value.length
    const hayTexto = inputMensaje.value.length
    inputMensaje.disabled = !hayEmail
    btnEnviar.disabled = !hayEmail || !hayTexto
})

inputMensaje.addEventListener('input', () => {
    const hayTexto = inputMensaje.value.length
    btnEnviar.disabled = !hayTexto
})
