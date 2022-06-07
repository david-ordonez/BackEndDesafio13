import express from "express";
import session from "express-session";
import passport from "passport";
import LocalStrategy from "passport-local";
import MongoStore from "connect-mongo";
import { Server as HttpServer } from "http";
import { Server as Socket } from "socket.io";

import authWebRouter from "./routers/web/auth.js";
import homeWebRouter from "./routers/web/home.js";
import productosApiRouter from "./routers/api/productos.js";
//import productosWebRouter from "./routers/web/home.js";

import addProductosHandlers from "./routers/ws/productos.js";
import addMensajesHandlers from "./routers/ws/mensajes.js";

import { conectarDB } from "./controllerdb.js";
import config from "./config.js";
//--------------------------------------------
// instancio servidor, socket y api

const app = express();
const httpServer = new HttpServer(app);
const io = new Socket(httpServer);

//--------------------------------------------
// configuro el socket

io.on("connection", async (socket) => {
  console.log("========== Cliente conectado ==========");
  await addProductosHandlers(socket, io.sockets);
  await addMensajesHandlers(socket, io.sockets);
});

//--------------------------------------------
// configuro el servidor

passport.use('login', new LocalStrategy(
  (username, password, done) => {
      User.findOne({ username }, (err, user) => {
          if (err)
              return done(err);
          if (!user) {
              console.log('User not found ' + username);
              return done(null, false);
          }
          if (!isValidPassword(user, password)) {
              return done(null, false);
          }

          return done(null, user);
      });
  }
));

passport.use('signup', new LocalStrategy({
  passReqToCallback: true
}, (req, username, password, done) => {
  User.findOne({ 'username': username }, (err, user) => {
      if (err) {
          return done(err);
      }
      if (user) {
          return done(null, false);
      }

      const newUser = {
          username: username,
          password: createHash(password)
      }

      User.create(newUser, (err, userWithId) => {
          if (err) {
              return done(err);
          }
          return done(null, userWithId);
      })
  })
}));

passport.serializeUser((user, done) => {
  done(null, user._id);
})

passport.deserializeUser((id, done) => {
  User.findById(id, done);
});

function isValidPassword(user, password) {
  return bCrypt.compareSync(password, user.password);
}

function createHash(password) {
  return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
}

app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.set("view engine", "ejs");

app.use(
  session({
    store: MongoStore.create(config.mongoRemote),
    secret: "secreto",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 60000,
    },
  })
);

//--------------------------------------------
// rutas del servidor API REST
app.use("/", productosApiRouter);
//--------------------------------------------
// rutas del servidor web
app.use("/", homeWebRouter);
app.use("/", authWebRouter);

//--------------------------------------------
// inicio el servidor

conectarDB(config.mongoRemote.mongoUrl, (err) => {
  if (err) return console.log("error bdd");
  console.log("Base de datos conectada");

  const connectedServer = httpServer.listen(config.PORT, () => {
    console.log(
      `Servidor http escuchando en el puerto ${connectedServer.address().port}`
    );
  });
  connectedServer.on("error", (error) =>
    console.log(`Error en servidor ${error}`)
  );
});
