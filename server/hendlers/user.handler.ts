import {IMainController}   from '../controllers/main.controller';
import {IUser}             from '../../Shared/types/Entities/iUser';
import {Request, Response} from 'express';
import * as bcrypt         from 'bcrypt';
import {IPost}             from "../../shared/types/Entities/iPost";

export const getUsersHandler = async function (this: IMainController, req: Request, res: Response) {
    try {
        const users             = await this.userController.getUsers(),
              usersRes: IUser[] =
                  await Promise.all(
                      users.map(async (user: IUser | any) => {
                          user.likes = await this.likeController.getUserLikes(user._id.toString());
                          user.posts = await this.postController.getUserPosts(user._id.toString());
                          for (let post of user.posts) {
                              await this.likeController.getPostLikes(post._id.toString()).then(response => {
                                  for (let like of response) {
                                      if (like.type) {
                                          post.likes.push(like)
                                          user.likesGet.push(like)
                                      } else {
                                          post.disLikes.push(like)
                                          user.dislikesGet.push(like)
                                      }
                                  }
                              });
                          }

                          // await this.postController.getPosts().then(async posts => {
                          //     posts.map(async post => {
                          //         await this.likeController.getPostLikes(post._id.toString()).then(response => {
                          //             for (let like of response) {
                          //                 if (like.userId == user._id) {
                          //                     console.log(`${user.name} have liked post ${post._id}`)
                          //                     user.postsLiked.concat(post)
                          //                 }
                          //             }
                          //         })
                          //     })
                          // })

                          await  this.likeController.getLikes().then(async likes=>{
                              likes.map(async like=>{
                                  if(like.userId==user._id){
                                      await this.postController.getPost(like.postId).then(post=>{
                                          // console.log(post)
                                          user.postsLiked.push(post)
                                      })
                                      // user.postsLiked.push(like.postId)
                                  }
                              })
                          })
                          return user;
                      })
                  );

        return res.json(usersRes).end();

    } catch (e) {
        return res.status(404).send('error' + e);
    }
};

export const createUserHandler = async function (this: IMainController, req: Request, res: Response) {
    const This = this
    await bcrypt.hash(req.body.password, 10, function (err, hashed) {
        console.log(hashed);
        const newUserContent: IUser = {
            name       : req.body.name,
            likes      : [],
            posts      : [],
            postsLiked : [],
            likesGet   : [],
            dislikesGet: [],
            dislikes   : [],
            avatar     : req.body.avatar,
            password   : hashed
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

export const getUserHandler = async function (this: IMainController, req: Request, res: Response) {
    try {
        let user = await this.userController.getUser(req.params.id).then(
            async userRes => {
                userRes.likes = await this.likeController.getUserLikes(userRes._id.toString());
                userRes.posts = await this.postController.getUserPosts(userRes._id.toString());
                for (let post of userRes.posts) {
                    await this.likeController.getPostLikes(post._id.toString()).then(response => {
                        for (let like of response) {
                            if (like.type) {
                                post.likes.push(like)
                                userRes.likesGet.push(like)
                            } else {
                                post.disLikes.push(like)
                                userRes.dislikesGet.push(like)
                            }

                        }
                    });
                }

                // await this.postController.getPosts().then(async posts => {
                //
                //     posts.map(async post => {
                //
                //         await this.likeController.getPostLikes(post._id.toString()).then(response => {
                //
                //             for (let like of response) {
                //                 if (like.userId == user._id) {
                //
                //                     console.log(`${user.name} have liked post ${post._id}`)
                //
                //                     user.postsLiked.push(post)
                //                 }
                //             }
                //         })
                //     })
                // })

                //
                await  this.likeController.getLikes().then(async likes=>{
                    likes.map(async like=>{
                        if(like.userId==userRes._id){
                            await this.postController.getPost(like.postId).then(post=>{
                                // console.log(post)
                                userRes.postsLiked.push(post)
                            })
                            // user.postsLiked.push(like.postId)
                        }
                    })
                })
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
        const users             = await this.userController.getUsers(),
              usersRes: IUser[] =
                  await Promise.all(
                      users.map(async (user: IUser | any) => {
                          user.likes = await this.likeController.getUserLikes(user._id.toString());
                          user.posts = await this.postController.getUserPosts(user._id.toString());
                          for (let post of user.posts) {
                              await this.likeController.getPostLikes(post._id.toString()).then(response => {
                                  for (let like of response) {
                                      post.likes.push(like)
                                      user.likesGet.push(like)
                                  }
                              });
                          }
                          await this.postController.getPosts().then(async posts => {

                              posts.map(async post => {

                                  await this.likeController.getPostLikes(post._id.toString()).then(response => {

                                      for (let like of response) {
                                          if (like.userId == user._id) {

                                              console.log(`${user.name} have liked post ${post._id}`)

                                              user.postsLiked.push(post)
                                          }
                                      }
                                  })
                              })
                          })
                          return user;
                      })
                  );

        return users

    } catch (e) {
        return 'no Users';
    }

}
