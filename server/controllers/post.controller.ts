
import {BaseController, IBaseController} from "./base.controller";
import {IPost} from '../../Shared/types/Entities/iPost';
import {ILike} from '../../Shared/types/Entities/iLike';



export interface IPostController extends IBaseController {
  savePost(post: IPost): Promise<any>

  getPosts(): Promise<IPost[]>

  getPost(post_Id: string): Promise<IPost>

  getUserPosts(user_Id: string): Promise<IPost[]>

  deletePost(post_id: string): Promise<any>;
}

export class PostController extends BaseController implements IPostController {

  constructor() {
    super();
  }

  async savePost(post: IPost): Promise<any> {
    return this.main.mongoController.savePost(post)
  }

  async getPosts(): Promise<IPost[]> {
    return this.main.mongoController.getPosts()
  }

  async getPost(post_id: string): Promise<IPost>{
    return this.main.mongoController.getPost(post_id)
  }

  async getUserPosts(user_Id:string): Promise<IPost[]>{
    let userPosts=this.main.mongoController.getUserPosts(user_Id);
    return userPosts;
  }

  async deletePost(post_id: string): Promise<any> {
    // console.log(`deleting post ${post_id}`)
    return this.main.mongoController.deletePost(post_id);
  }

}

