import {LikeController} from './controllers/like.controller';
import {PostController} from './controllers/post.controller';
import {UserController} from './controllers/user.controller';
import {HttpController} from './controllers/http.controller';
import {MongoController} from './controllers/mongo.controller';
import {MainController} from './controllers/main.controller';
import {AuthController} from './controllers/auth.controller';

(async () => {
    const
        likeController = new LikeController(),
        postController = new PostController(),
        userController = new UserController(),
        httpController = new HttpController(),
        mongoController = new MongoController(),
        authController = new AuthController(),
        mainController = new MainController(
            userController,
            likeController,
            postController,
            httpController,
            mongoController,
            authController

        );


    try {
        await mainController.init()
        console.log('main controller has initialized')
    } catch (e) {
        console.log(`failed to initialize main controller ${e} `);
    }
})();

