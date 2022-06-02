export default {
    PORT: process.env.PORT || 8080,
    mongoLocal: {
        
    },
    mongoRemote: {
        mongoUrl: 'mongodb+srv://dordonez:00Gd801011_@cluster0.thmqy.mongodb.net/ecommerce',
        mongoOptions: { 
            useNewUrlParser: true, 
            useUnifiedTopology: true 
          }
    },
    sqlite3: {
        client: 'sqlite3',
        connection: {
            filename: './DB/ecommerce.sqlite'
        },
        useNullAsDefault: true,
        debug: true        
    },
    mariaDb: {
        client: 'mysql',
        connection: {
            host: '127.0.0.1',
            user: 'root',
            password: 'my-secret-pw',
            database: 'coderhouse'
        }        
    },
    fileSystem: {
        path : './DB'
    }
}
