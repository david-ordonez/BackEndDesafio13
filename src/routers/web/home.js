import { Router } from 'express'
import { webAuth } from '../../auth/index.js'

import path from 'path'
import { fileURLToPath } from 'url';

const __dirname = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../views/');

const productosWebRouter = new Router()

productosWebRouter.get('/home', webAuth, (req, res) => {
    const nom = req.session.nombre;
    res.render('pages/home', {nombre: req.session.nombre});
})

productosWebRouter.get('/productos-test', (req, res) => {
    console.log(__dirname);
    res.sendFile('productos-vista-test.html', { root: __dirname});
})

export default productosWebRouter