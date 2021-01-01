import {BaseController, IBaseController}                                       from './base.controller';
import {IHttpController}                                                       from './http.controller';
import {ILikeController}                                                       from './like.controller';
import {IDBController}                                                         from './mongo.controller';
import {createUserHandler, getUserHandler, getUsersHandler}                    from '../hendlers/user.handler';
import {createLikeHandler, getLikesHandler, unlikePost}                        from '../hendlers/like.handler';
import {createPostHandler, deletePostHandler, getPostHandler, getPostsHandler} from '../hendlers/post.handler';
import {IUserController}                                                       from './user.controller';
import {IPostController}                                                       from './post.controller';
import {IAuthController}                                                       from './auth.controller';

export interface IMainController extends IBaseController {
  userController: IUserController
  postController: IPostController
  likeController: ILikeController
  httpController: IHttpController
  mongoController: IDBController
  authController: IAuthController
}

export class MainController extends BaseController implements IMainController {

  constructor(
    public userController: IUserController,
    public likeController: ILikeController,
    public postController: IPostController,
    public httpController: IHttpController,
    public mongoController: IDBController,
    public authController: IAuthController
  ) {
    super();

    this.userController.main = this;
    this.likeController.main = this;
    this.postController.main = this;
    this.httpController.main = this;
    this.mongoController.main = this;
    this.authController.main = this;
  }

  async init(): Promise<void> {
    await this.httpController.init();
    await this.mongoController.init();

    this.addEventListeners();
  }

  addEventListeners() {

    this.httpController.events.addListener('create_user', createUserHandler.bind(this));

    this.httpController.events.addListener('all_users', getUsersHandler.bind(this));

    this.httpController.events.addListener('get_user', getUserHandler.bind(this));

    this.httpController.events.addListener('create_like', createLikeHandler.bind(this));

    this.httpController.events.addListener('all_likes', getLikesHandler.bind(this));

    this.httpController.events.addListener('delete_like', unlikePost.bind(this));

    this.httpController.events.addListener('all_posts', getPostsHandler.bind(this));

    this.httpController.events.addListener('post', getPostHandler.bind(this));

    this.httpController.events.addListener('upload_post', createPostHandler.bind(this));

    this.httpController.events.addListener('delete_post', deletePostHandler.bind(this));
  }
}



