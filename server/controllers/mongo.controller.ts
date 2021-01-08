import {BaseController, IBaseController}           from './base.controller';
import {ILike}                                     from '../../Shared/types/Entities/iLike';
import {IPost}                                     from '../../Shared/types/Entities/iPost';
import {IUser}                                     from '../../Shared/types/Entities/iUser';
import {Collection, Db, GridFSBucket, MongoClient} from 'mongodb';
import {config}                                    from '../config/config';
import * as Grid                                   from 'gridfs-stream'

const
    mongo    = require('mongodb'),
    ObjectID = mongo.ObjectID;


export interface IDBController extends IBaseController {
    saveLike(like: ILike): Promise<any>

    savePost(post: IPost): Promise<any>

    saveUser(user: IUser): Promise<any>

    getLikes(): Promise<ILike[]>

    getPosts(): Promise<IPost[]>

    getPost(post_id: string): Promise<any>

    getPostLikes(post_id: string): Promise<ILike[]>

    getUsers(): Promise<IUser[]>

    getUser(user_id: string): Promise<any>

    getUserLikes(user_id: string): Promise<ILike[]>

    close(): Promise<any>

    getUserPosts(user_id: string): Promise<IPost[]>;

    deletePost(post_id: string): Promise<any>;

    deletePostLikes(post_id: string): Promise<any>;

    unLike(like_id: string): Promise<any>;

    verifyUser(userName: string): boolean;


    getUserByName(userName: string): Promise<IUser | any>;


    getUserLikedPosts(user_id: string): Promise<IPost[]>;


    updateUserAvatar(id: string, avatar: string): Promise<any>;

    getFile(filename): Promise<any>;

    getLastUpload(): Promise<unknown>;
}

export class MongoController extends BaseController implements IDBController {
    private db: Db;
    private client: MongoClient;
    likesCollection: Collection;
    postsCollection: Collection;
    usersCollection: Collection;
    gfs;
    gridFSBucket;

    constructor() {
        super();
        this.client = new MongoClient(config.URL, {
            useUnifiedTopology: true
        });
    }

    async init(): Promise<void> {
        const This = this;

        return new Promise((resolve, reject) => {
            this.client.connect(function (err) {
                if (err) {
                    console.error(`Mongodb error: ${err}`);
                    return reject();
                }
                console.log(`Connected successfully to Mongodb`);
                This.db = This.client.db(config.dbName);

                This.gfs = Grid(This.db, mongo);
                This.gridFSBucket = new GridFSBucket(This.db, {bucketName: 'uploads'});

                This.likesCollection = This.db.collection('likes');
                This.postsCollection = This.db.collection('posts');
                This.usersCollection = This.db.collection('users');

                This.gfs.collection('uploads');

                resolve();

            });

        });

    }

    //<editor-fold desc="user">
    async getUsers(): Promise<IUser[]> {

        const users             = await this.usersCollection.find().toArray(),
              usersRes: IUser[] =
                  await Promise.all(
                      users.map(async (user: IUser | any) => {
                          for (let like of await this.getUserLikes(user._id.toString())) {
                              if (like.type) {
                                  user.likes.push(like)
                              } else {

                                  user.dislikes.push(like)

                              }
                          }
                          user.posts = await this.getUserPosts(user._id.toString());
                          for (let post of user.posts) {
                              await this.getPostLikes(post._id.toString()).then(response => {
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
                          user.postsLiked = await this.getUserLikedPosts(user._id.toString())
                          return user;
                      })
                  );
        return users
    }

    verifyUser(userName: string): boolean {
        const
            userFound = this.usersCollection.findOne({name: userName});
        if (userFound) {
            return true;
        } else {
            return false;
        }
    }

    async getUser(user_id: string): Promise<IUser | any> {
        let user = this.usersCollection.findOne({_id: ObjectID(user_id)}).then(
            async userRes => {
                for (let like of await this.getUserLikes(userRes._id.toString())) {
                    if (like.type) {
                        userRes.likes.push(like)
                    } else {
                        userRes.dislikes.push(like)
                    }
                }

                userRes.posts = await this.getUserPosts(userRes._id.toString());
                for (let post of userRes.posts) {
                    await this.getPostLikes(post._id.toString()).then(response => {
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
                userRes.postsLiked = await this.getUserLikedPosts(userRes._id.toString())
                return userRes;
            }
        )
        return user

    }

    async getUserByName(userName: string): Promise<IUser | any> {
        console.log(`getting user`)
        return this.usersCollection.findOne({name: userName});

    }

    async saveUser(user: IUser): Promise<any> {
        try {
            return this.usersCollection.insertOne(user);
        } catch (e) {
            console.log(e);
        }
    }

    async getUserLikes(user_id: string): Promise<ILike[]> {
        // console.log(`searching likes of user_id: ${user_id}`);
        return this.likesCollection.find({userId: user_id}).toArray();
    }

    async getUserPosts(user_id: string): Promise<IPost[]> {
        // console.log(`get user posts work`);
        // console.log(`searching posts of user_id: ${user_id}`);
        await this.getLikes();
        return this.postsCollection.find({createdByUserId: user_id}).toArray();
    }

    async getUserLikedPosts(user_id: string): Promise<IPost[]> {
        let userLikes        = await this.getUserLikes(user_id),
            postRes: IPost[] = await Promise.all(
                userLikes.map(async (like) => {
                    return await this.getPost(like.postId)
                })
            )
        return postRes
    }

    async updateUserAvatar(id: string, avatar: string): Promise<any> {
        const _id = new ObjectID(id);
        return await this.usersCollection.updateOne(
            {_id: _id}, {$set: {avatar: avatar}});

    }

    //</editor-fold>


    //<editor-fold desc="post">
    async getPosts(): Promise<IPost[]> {
        const
            posts            = await this.postsCollection.find().toArray(),
            postRes: IPost[] =
                await Promise.all(
                    posts.map(async (post: IPost | any) => {
                        await this.getPostLikes(post._id.toString()).then(response => {
                            for (let like of response) {
                                // console.log(like.type)
                                if (like.type) {
                                    post.likes.push(like)
                                } else {
                                    post.disLikes.push(like)
                                }
                            }
                        });
                        return post;
                    })
                );

        return posts
    }

    async getPost(post_id: string): Promise<IPost | any> {
        const post = this.postsCollection.findOne({_id: new ObjectID(post_id)}).then(async (post: IPost) => {
            await this.getPostLikes(post._id.toString()).then(response => {
                for (let like of response) {
                    // console.log(like.type)
                    if (like.type) {
                        post.likes.push(like)
                    } else {
                        post.disLikes.push(like)
                    }
                }
            });
            return post
        })

        return post

    }

    async savePost(post: IPost): Promise<any> {
        try {
            // console.log(`mongo save post work`);
            // console.log(post);
            return this.postsCollection.insertOne(post);
        } catch (e) {
            console.log(e);
        }
    }

    async getPostLikes(post_id: string): Promise<ILike[]> {
        return this.likesCollection.find({postId: post_id}).toArray();
    }

    async deletePost(post_id: string): Promise<any> {
        console.log(`delete post in mongo work in postId: ${post_id}`)
        return await this.postsCollection.deleteOne({_id: ObjectID(post_id)});
    }
    //</editor-fold>


    //<editor-fold desc="like">
    async saveLike(like: ILike): Promise<any> {
        console.log(`mongo save like work`);
        try {
            return this.likesCollection.insertOne(like);
        } catch (e) {
            console.log(e);
        }
    }


    async getLikes(): Promise<ILike[]> {
        return this.likesCollection.find().toArray();
    }

    async deletePostLikes(post_id: string): Promise<any> {
        console.log(`delete post likes in mongo work on postId: ${post_id}`)
        return this.likesCollection.deleteMany({postId: post_id});
    }

    async unLike(like_id: string): Promise<any> {
        console.log(`deleting like: ${like_id}`)
        return this.likesCollection.deleteMany({_id: ObjectID(like_id)});
    }
    //</editor-fold>

    //<editor-fold desc="upload">
    async getFile(filename): Promise<any> {
        return new Promise((resolve, reject) => {
            this.gfs.files.findOne({filename: filename}, (err, file) => {
                if (file) {
                    const readStream = this.gridFSBucket.openDownloadStream(file._id);
                    resolve(readStream);
                } else {
                    reject();
                }
            });
        });
    }

    async getLastUpload() {
        return new Promise((resolve, reject) => {
            this.gfs.files.find({}).toArray((err, files) => {
                let lastFile = files.reduce((a, b) => (a.uploadDate > b.uploadDate ? a : b));
                const readStream = this.gridFSBucket.openDownloadStream(lastFile._id);
                resolve(readStream);
            });
        });
    }
    //</editor-fold>

    close(): Promise<any> {
        return this.client.close();
    }

}
