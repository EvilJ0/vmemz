import {IMainController} from '../controllers/main.controller';
import {Request, Response} from 'express';
import {IPost} from '../../Shared/types/Entities/iPost';
import * as dayjs from 'dayjs';



export const getPostsHandler = async function(this: IMainController, req: Request, res: Response) {
  try {
    const
      posts = await this.postController.getPosts(),
      postRes: IPost[] =
        await Promise.all(
          posts.map(async (post: IPost | any) => {

            post.likes = await this.likeController.getPostLikes(post._id.toString());
            return post;
          })
        )
    ;

    return res.send(postRes);


  } catch (e) {
    return res.status(404).json({msg: `posts not found ${e}`});
  }
};

export async function createPostHandler(this: IMainController, req: Request, res: Response) {
  const
    post: IPost = {
      createdByUserId: req.body.createdByUserId,
      createdByUserName: req.body.createdByUserName,
      likes: [],
      time: dayjs().format(`HH:mm`),
      date: dayjs().format(`DD.MM.YY`),
      content: req.body.content
    };

  try {
    const
      newPost = await this.postController.savePost(post);

    return res.json(newPost).end();

  } catch (e) {
    return res.status(404).json({msg: `new post was not created ${e}`});
  }
}

export async function deletePostHandler(this: IMainController, req: Request, res: Response) {
  console.log(`delete post handler working`)
  try {

    const
      likesToDelete = await this.likeController.deletePostLikes(req.params.id),
      postToDelete = await  this.postController.deletePost(req.params.id);

    return res.json([postToDelete, `likes deleted ${likesToDelete}`]).end()
  } catch (e) {
    return res.status(404).json({msg: `post was not deleted ${e}`});
  }


}

export  async function getPostHandler(this: IMainController, req: Request, res: Response) {
  try {
    const post = await this.postController.getPost(req.params.id);
    return res.json(post).end();
  } catch (e) {
    return res.status(404).json({msg: 'no user not found' + e});
  }
}
