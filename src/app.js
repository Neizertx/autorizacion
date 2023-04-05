import express from 'express';
import { __dirname } from './utils.js';
import handlebars from 'express-handlebars';
import cookieParser from 'cookie-parser';  
import FileStore from 'session-file-store'; 
import session from 'express-session';
import mongoStore from 'connect-mongo';
// views
import productsRouter from './routes/products.router.js';
import cartRouter from './routes/cart.router.js';
import usersRouter from './routes/users.router.js';
import chatRouter from './routes/chat.router.js';
import viewsRouter from './routes/views.router.js';
// conecto a BD
import './persistencia/dbConfig.js'
// chat
import {Server} from 'socket.io';
// passport
import passport from 'passport';
import './passport/passportStrategies.js'; 


const app = express();
const PORT = 8080;


// const cookieKey = 'cookiePASS';
// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
app.use(cookieParser(/* cookieKey */));

// handlebars
app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');

// mongo Sessions
const fileStore = FileStore( session )
app.use(session({
    secret: 'seccionKey',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 30000}, 
    store: new mongoStore({ // store: para guardar en BD
        mongoUrl: 'mongodb+srv://Mateo:123@cluster0.1bo5lan.mongodb.net/?retryWrites=true&w=majority', 
    }),
}));

// passport
app.use(passport.initialize()); 
app.use(passport.session()); 

// routes
app.use('/', viewsRouter);
app.use('/products', productsRouter);
app.use('/cart', cartRouter);
app.use('/users', usersRouter);
app.use('/chat', chatRouter);
// app.use('/views' , viewsRouter);


const httpServer = app.listen(PORT, () => {
    console.log(`Escuchando puerto: ${PORT}`);
})

// websocket:
export const socketServer = new Server(httpServer);

const infoMessages = []; // vuelco mensajes

socketServer.on('connection', (socket) => {
    console.log(`# Conected User: ${socket.id}`);

    socket.on('disconnected', (msg) => {
        console.log('# Desconnected User.');
    })

    socket.on('newUser', (usuario) => {
        socket.broadcast.emit('broadcast', usuario); // emite a todos menos al nuevo
    })

    socket.on('mensaje', (info) => {
        infoMessages.push(info);
        socketServer.emit('chat', infoMessages)
    })

    socket.on('userFile', esto => {
        console.log(esto);
    })

})
