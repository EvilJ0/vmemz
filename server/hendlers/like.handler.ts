import {IMainController} from '../controllers/main.controller';
import {Request, Response} from 'express';
import {ILike} from '../../Shared/types/Entities/iLike';
import * as dayjs from 'dayjs';
import {IUser} from '../../Shared/types/Entities/iUser';
import {IPost} from '../../Shared/types/Entities/iPost';



export const getLikesHandler = async function (this: IMainController, req: Request, res:Response){
  try{

    return res.send( await this.likeController.getLikes())
  }
  catch (e){
    return res.status(404).json({msg: 'no still Likes'});
  }
}

export const createLikeHandler = async function(this: IMainController, req: Request, res: Response) {
  const
    like: ILike = {
      timeStamp: dayjs().format('DD.MM.YY'),
      userId: req.body.userId,
      postId: req.body.postId,
      userName: req.body.userName,
      type: req.body.type

    };
  try {
    const
      newLike=await this.likeController.saveLike(like);

    return res.json(newLike).end();

  } catch (e) {
    return res.status(404).json({msg: 'No like added'});
  }
};

export async function unlikePost(this:IMainController,req: Request,res: Response){
  try{
    const
      deletedLike=await this.likeController.unLike(req.params.id);

    res.json(deletedLike).end()
  }catch (e){
    res.status(404).json({msg: 'like to delete not found' + e})
  }
}
