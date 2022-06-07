import { Router } from 'express';
import path from 'path';
import passport from "passport";
import { fileURLToPath } from 'url';

const __dirname = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../views/');
const authWebRouter = new Router()

authWebRouter.get('/', (req, res) => {
    res.redirect('/login');
});

authWebRouter.get('/login', (req, res) => {
    res.sendFile('login.html', { root: __dirname});
});

authWebRouter.get('/logout', (req, res) => {
    const nombre = req.session.nombre;
    req.session.destroy(err => {
        if (err) {
            res.json({ status: 'Logout error', body: err });
        } else {
            res.render('pages/logout', { nombre: nombre });
        }
    });
});

authWebRouter.post('/login', passport.authenticate('login', {failureRedirect: '/faillogin'}) ,(req, res) => {
    const { nombre } = req.body;
    if(!nombre){
        return res.redirect('/login');
    }
    req.session.nombre = nombre;
    return res.redirect('/home');
});

authWebRouter.get('/register', (req,res) => {
    res.sendFile('register.html', { root: __dirname });
});

authWebRouter.post('/register',  passport.authenticate('signup', {failureRedirect: '/failsignup'}) ,(req,res) => {
    res.redirect('/home');
});

authWebRouter.get('/faillogin', (req, res) => {
    res.render('pages/login-error');
});

authWebRouter.get('/failsignup', (req, res) => {
    res.render('pages/register-error');
});


export default authWebRouter