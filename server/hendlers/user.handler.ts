import {IMainController} from '../controllers/main.controller';
import {IUser} from '../../Shared/types/Entities/iUser';
import {Request, Response} from 'express';
import * as bcrypt from 'bcrypt';

export const getUsersHandler = async function(this: IMainController, req: Request, res: Response) {
  try {
    const users = await this.userController.getUsers(),
      usersRes: IUser[] =
        await Promise.all(
          users.map(async (user: IUser | any) => {
            user.likes = await this.likeController.getUserLikes(user._id.toString());
            user.posts = await this.postController.getUserPosts(user._id.toString());
            for (let post of user.posts) {
              post.likes = await this.likeController.getPostLikes(post._id.toString());
              console.log(post._id);
            }
            return user;
          })
        );

    return res.json(usersRes).end();

  } catch (e) {
    return res.status(404).send('error' + e);
  }
};

export const createUserHandler = async function(this: IMainController, req: Request, res: Response) {
  // const hashedPassword=this.authController.generateHash(req.body.password).then(hashed=>{
  //   console.log(`hashed password`)
  //   console.log(hashed)
  // })
const This=this
  await bcrypt.hash(req.body.password, 10, function(err, hashed) {
    console.log(hashed);
    const newUserContent: IUser = {
      name: req.body.name,
      likes: [],
      posts: [],
      avatar: req.body.avatar,
      password: hashed
    };
    console.log(newUserContent);
    try {

      console.log(This.userController.verifyUser(newUserContent.name));
      const newUser = This.userController.saveUser(newUserContent);
      console.log(`save user work`);
      return res.json(newUser).end();

    } catch (e) {
      return res.status(404).json({msg: 'no user was added' + e});

    }
  });


};

export const getUserHandler = async function(this: IMainController, req: Request, res: Response) {
  try {
    let user = await this.userController.getUser(req.params.id).then(
        async userRes=>{
            userRes.likes= await this.likeController.getUserLikes(userRes._id.toString());
            userRes.posts = await this.postController.getUserPosts(userRes._id.toString());
            for (let post of userRes.posts) {
                post.likes = await this.likeController.getPostLikes(post._id.toString());
                console.log(post._id);
            }
            return userRes;
        }
    )

    return res.json(user).end();
  } catch (e) {
    return res.status(404).json({msg: 'no user not found' + e});
  }

};

export async function getUsersSocketHandler(this: IMainController) {
  try {
    const users = await this.userController.getUsers(),
          usersRes: IUser[] =
              await Promise.all(
                  users.map(async (user: IUser | any) => {
                    user.likes = await this.likeController.getUserLikes(user._id.toString());
                    user.posts = await this.postController.getUserPosts(user._id.toString());
                    for (let post of user.posts) {
                      post.likes = await this.likeController.getPostLikes(post._id.toString());
                      console.log(post._id);
                    }
                    return user;
                  })
              );

    return users

  } catch (e) {
    return 'no Users';
  }

}
