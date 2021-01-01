import {BaseController, IBaseController} from './base.controller';
import {ILike} from '../../Shared/types/Entities/iLike';
import {IPost} from '../../Shared/types/Entities/iPost';
import {IUser} from '../../Shared/types/Entities/iUser';
import {Collection, Db, MongoClient} from 'mongodb';
import {config} from '../config/config';

const ObjectID = require('mongodb').ObjectID;


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
}

export class MongoController extends BaseController implements IDBController {
  private db!: Db;
  private client: MongoClient;
  likesCollection!: Collection;
  postsCollection!: Collection;
  usersCollection!: Collection;

  constructor() {
    super();
    this.client = new MongoClient(config.URL, {
      useUnifiedTopology: true
    });
  }

  async init(): Promise<void> {
    const This = this;

    return new Promise((resolve, reject) => {
      this.client.connect(function(err) {
        if (err) {
          console.error(`Mongodb error: ${err}`);
          return reject();
        }
        console.log(`Connected successfully to Mongodb`);
        This.db = This.client.db(config.dbName);

        This.likesCollection = This.db.collection('likes');
        This.postsCollection = This.db.collection('posts');
        This.usersCollection = This.db.collection('users');

        resolve();

      });

    });

  }

  async getUsers(): Promise<IUser[]> {
    return this.usersCollection.find().toArray();
  }

  async getUser(user_id: string): Promise<IUser | any> {
    const
      userId = ObjectID(user_id);
    console.log(`mongo get user work`);
    console.log(userId);
    return this.usersCollection.findOne({_id: userId});

  }

  async getUserByName(userName: string): Promise<IUser | any> {
console.log(`getting user`)
    return this.usersCollection.findOne({name: userName});

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

  async saveUser(user: IUser): Promise<any> {
    try {
      return this.usersCollection.insertOne(user);
    } catch (e) {
      console.log(e);
    }
  }

  async getUserLikes(user_id: string): Promise<ILike[]>{
    // console.log(`searching likes of user_id: ${user_id}`);
    return this.likesCollection.find({userId: user_id}).toArray();
  }



  async getUserPosts(user_id: string): Promise<IPost[]> {
    // console.log(`get user posts work`);
    // console.log(`searching posts of user_id: ${user_id}`);
    await this.getLikes();
    return  this.postsCollection.find({createdByUserId: user_id}).toArray();
  }

  async getPosts(): Promise<IPost[]> {
    return this.postsCollection.find().toArray();
  }

  async getPost(post_id: string): Promise<IPost | any> {
    const
      postId = new ObjectID(post_id);
    console.log(`mongo get user work`);
    console.log(post_id);
    return this.postsCollection.findOne({_id: postId});

  }

  async savePost(post: IPost): Promise<any> {
    try {
      console.log(`mongo save post work`);
      console.log(post);
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
    return await this.likesCollection.deleteOne({_id: ObjectID(like_id)});
  }

  close(): Promise<any> {
    return this.client.close();
  }

}
