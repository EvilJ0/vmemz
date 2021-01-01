import {BaseController, IBaseController} from './base.controller';
import {ILike} from '../../Shared/types/Entities/iLike';


export interface ILikeController extends IBaseController {
  getLikes(): Promise<ILike[]>

  saveLike(like: ILike): Promise<any>

  getPostLikes(post_id: string): Promise<ILike[]>


  getUserLikes(user_id: string): Promise<ILike[]>;

  deletePostLikes(post_id: string): Promise<any>;

  unLike(like_id: string): Promise<any>;
}

export class LikeController extends BaseController implements ILikeController {
  constructor() {
    super();
  }

  async getLikes(): Promise<ILike[]> {
    return this.main.mongoController.getLikes();

  }

  async getPostLikes(post_id: string): Promise<ILike[]> {
    return this.main.mongoController.getPostLikes(post_id);
  }

  async getUserLikes(user_id: string): Promise<ILike[]> {
    return this.main.mongoController.getUserLikes(user_id);
  }

  async saveLike(like: ILike): Promise<any> {
    return this.main.mongoController.saveLike(like);
  }

  async deletePostLikes(post_id: string): Promise<any> {
    // console.log(`deleting likes of post ${post_id}`)
    return this.main.mongoController.deletePostLikes(post_id);
  }

  async unLike(like_id: string): Promise<any> {
    return this.main.mongoController.unLike(like_id);
  }


}
