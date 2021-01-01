//<editor-fold desc="import">
import * as express                      from 'express';
import {Express, Request, Response}      from 'express';
import * as events                       from 'events';
import {BaseController, IBaseController} from './base.controller';
import {config}                          from '../config/config';
import * as bodyParser                   from 'body-parser';
import * as cors                         from 'cors';
import {requestLoggerMiddleware}         from './logger.controller';

//<editor-fold desc="import passport">
import * as passport     from 'passport';
import * as cookieParser from 'cookie-parser';
import * as session      from 'express-session';
import {IMainController} from './main.controller';
import {IUser}           from '../../Shared/types/Entities/iUser';

const LocalStrategy = require('passport-local').Strategy;
//</editor-fold>

//<editor-fold desc="import socket">
import {Server as IOServer, Socket as SocketIO_Socket} from 'socket.io';
import * as http                                       from 'http';
import * as socketio                                   from 'socket.io';
import {getUsersSocketHandler}                         from '../hendlers/user.handler';
//</editor-fold>


//</editor-fold>


export interface IHttpController extends IBaseController {
    events: events.EventEmitter
    http_server: http.Server;

}

export class HttpController extends BaseController implements IHttpController {
    private sockets: SocketIO_Socket[] = [];
    private io_server: IOServer;
    public http_server: http.Server;

    express_app: Express = express();
    events: events.EventEmitter = new events.EventEmitter();


    constructor() {
        super();
    }


    async init() {
        const This = this;
        //region middlewares
        this.express_app.use(bodyParser.json());
        this.express_app.use(cors({origin: 'http://localhost:4200', credentials: true}));
        this.express_app.use(requestLoggerMiddleware);

        this.express_app.use(session({
                                         secret           : 'secretCode',
                                         resave           : true,
                                         saveUninitialized: true
                                     }));
        this.express_app.use(cookieParser());
        this.express_app.use(passport.initialize());
        this.express_app.use(passport.session());


        //<editor-fold desc="passport">
        passport.use(new LocalStrategy(
            async function (this: IMainController, userName: string, password: string, done: any) {
                console.log('strategy');
                const
                    users: IUser[] = await This.main.userController.getUsers(),
                    user           = users.find(user => user.name === userName);

                console.log('checking username: ' + userName);

                if (!user) {
                    console.log('ERROR: no user found');
                    return done('unauthorized access', false);
                }


                This.main.authController.validatePassword(userName, password)
                    .then((isValid) => {
                        console.log('Response of validatePassword: ' + isValid);
                        if (!isValid) {
                            return done('unauthorized access: password problem', false);
                        } else {
                            // all is well, return successful user

                            return done(null, user);
                        }
                    });

            }
        ));

        passport.serializeUser(function (user, done) {

            if (user) {

                done(null, user);
            }
        });

        passport.deserializeUser(function (id, done) {

            done(null, id);

        });
        //</editor-fold>


        //endregion


        this.registerEndpoints();

        //turn server on

        this.http_server = await this.runServer();
        this.initSocketIO()
    }


    //<editor-fold desc="Socket IO">
    initSocketIO() {
        const This = this;
        // @ts-ignore
        this.io_server = socketio(this.http_server);

        this.io_server.on('connection', function (socket: SocketIO_Socket) {
            This.sockets.push(socket);
            const idx = This.sockets.indexOf(socket)
            socket.send('hello world')
            console.log(`SOCKET CONNECTED to slot ${idx}. Total ${This.sockets.length} clients connected.  `);

            console.log(socket.connected, 'socket.connected');


            socket.on('disconnected', () => {
                This.sockets.splice(idx, 1);
                console.log(`SOCKET CLOSED in slot ${idx}. Total ${This.sockets.length} clients connected `)
            })

            socket.on('getUsers', async () => {
                console.log('getUsers');
                const users = await getUsersSocketHandler.call(This.main)
                socket.emit('getUsers', users)
            })
            socket.on('getPosts', () => {
                console.log(' GET USERS !!!!');
            })
        })

    }

    //</editor-fold>

    async runServer() {
        return this.express_app.listen(config.port, () => {
            console.log(`server is up on port ${config.port} `);
        });
    }

    registerEndpoints() {
        //region user http operations
        //get all users
        this.express_app.get('/api/users', (req, res) => {
            console.log(`all users get`);
            this.events.emit('all_users', req, res);
        });
        // get specific user
        this.express_app.get('/api/users/:id', (req: Request, res: Response) => {
            console.log(`http get user work`);
            this.events.emit('get_user', req, res);
        });
        //create new user
        this.express_app.post('/api/users', (req, res) => {
            // console.log('Meow')
            this.events.emit('create_user', req, res);
        });
        //endregion

        //region post http operations

        //get all posts
        this.express_app.get('/api/posts', this.main.authController.isLoggedIn,(req: Request, res: Response) => {
            this.events.emit('all_posts', req, res);
        });
        //get specific post
        this.express_app.get('/api/posts/:id', (req: Request, res: Response) => {
            this.events.emit('post', req, res);
        });
        //upload new post
        this.express_app.post('/api/posts', (req: Request, res: Response) => {
            this.events.emit('upload_post', req, res);
        });
        //delete post
        this.express_app.delete('/api/posts/:id', (req: Request, res: Response) => {
            console.log(`http delete post work`);
            this.events.emit('delete_post', req, res);
        });
        //endregion

        //region like http operations
        //get all likes
        this.express_app.get('/api/likes', (req: Request, res: Response) => {
            this.events.emit('all_likes', req, res);
        });
        //get specific like
        this.express_app.get('/api/likes/:id', (req: Request, res: Response) => {
            this.events.emit('like', req, res);
        });
        //create new like
        this.express_app.post('/api/likes', (req: Request, res: Response) => {
            this.events.emit('create_like', req, res);
        });
        //unlike
        this.express_app.delete('/api/likes/:id', (req: Request, res: Response) => {
            this.events.emit('delete_like', req, res);
        });
        //get likes from post
        this.express_app.get('/api/posts/likes/:post_id', (req: Request, res: Response) => {
            this.events.emit('post_likes', req, res);
        });

        //login
        this.express_app.post('/api/auth/login', this.main.authController.auth(), (req: Request, res: Response) => {
            // this.events.emit('login', req, res);

            res.status(200).json({'statusCode': 200, 'user': req.user});

        });
        //endregion


    }

}
