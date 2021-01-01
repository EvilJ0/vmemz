
// import UserModel, {IUserM} from '../models/user.model';
// import PostModel, {IPostM} from '../models/post.model';
// import LikeModel, {ILikeM} from '../models/like.model';
// import {BaseController, IBaseController} from './base.controller';
//
// import * as dayjs from 'dayjs';
// import * as mongoose from 'mongoose';
// import {Types} from 'mongoose';
//
//
//
//
//
// export interface IDBMController extends IBaseController {
//   run(): Promise<void>;
//
//   getUsers(): Promise<IUserM[]>;
//
//   getUser(id: IUserM['_id']): Promise<IUserM | null>;
//
//   createUser(name: IUserM['name']): Promise<IUserM>;
//
//   getPosts(): Promise<IPostM[]>;
//
//   getPost(id: IPostM['_id']): Promise<IPostM | null>;
//
//   createPost(content: string, user_id: IUserM['_id']): Promise<IPostM>;
//
//   deletePost(post_id: IPostM['_id']): Promise<IPostM | null>; //почему у идата тип ИД стринг?
//
//   getLikes(): Promise<ILikeM[]>;
//
//   getLike(id: ILikeM['_id']): Promise<ILikeM>;
//
//   createLike(user_id: IUserM['_id'], post_id: IPostM['_id']): Promise<ILikeM>;
//
//   unLike(like_id: ILikeM['_id']): Promise<ILikeM>;
//
//   getPostLikes(post_id: IPostM['_id']): Promise<ILikeM[]>;

  // getUserLikes(user_id:IUserM['_id']): Promise<ILikeM[]>;
  //
  // getUserPosts(user_id:IUserM['_id']):Promise<IPostM[]>;
// }

// export class DBController extends BaseController implements IDBMController {
//   url: string = 'mongodb://localhost:27017';
//
//   constructor() {
//     super();
//   }
//
//   async init(): Promise<any> {
//     await this.run();
//   }
//
//   async run() {
//     try {
//       await mongoose
//         .connect(this.url, {
//           useNewUrlParser: true,
//           useUnifiedTopology: true}); //че за нахер?
//       console.log('successfully connected to mongoDB');
//     } catch (e) {
//       console.error(`not connected to mongoDB: ${e}`);
//     }
//   }
//
//   async getUsers(): Promise<IUserM[]> {
//     return await UserModel.find()
//       .exec();
//   }
//
//
//   async getUser(id: IUserM['_id']): Promise<IUserM> {
//     return await UserModel.findById(id)
//       .exec();
//   };
//
//   async createUser(name: IUserM['name']): Promise<IUserM> {
//     return await UserModel.create<IUserM>({
//       name: name
//     });
//   };
//
//   async getPosts(): Promise<IPostM[]> {
//     return await PostModel.find()
//       .populate('postedBy')
//       .exec();
//   };
//
//   async getPost(id: IPostM['_id']): Promise<IPostM> {
//     return await PostModel.findById(id)
//       .populate('postedBy')
//       .exec();
//   }
//
//   async createPost(content: string, user_id: IUserM['_id']): Promise<IPostM> {
//     return await PostModel.create(
//       {
//         content: content,
//         postedBy: user_id,
//         date: dayjs().format(`DD.MM.YY`),
//         time: dayjs().format(`HH.mm`)
//       }
//     );
//   };
//
//   async deletePost(post_id: IPostM['_id']): Promise<IPostM> {
//     return await PostModel.findByIdAndDelete(post_id, {
//       useFindAndModify: false
//     }).exec();
//   }; //почему у идата тип ИД стринг?
//
//   async getLikes(): Promise<ILikeM[]>{
//     return await LikeModel.find()
//       .populate('userLiked')
//       .populate('postLiked')
//       .exec()
//   };
//
//   async getLike(id: ILikeM['_id']): Promise<ILikeM>{
//     return await LikeModel.findById(id)
//       .populate('userLiked')
//       .populate('postLiked')
//       .exec()
//   };
//
//   async createLike(user_id: IUserM['_id'], post_id: IPostM['_id']): Promise<ILikeM>{
//     return await LikeModel.create({
//       timeStamp: dayjs().format(`DD.MM.YY`),
//       userLiked: user_id,
//       postLiked: post_id
//     })
//   };
//
//   async unLike(like_id: ILikeM['_id']): Promise<ILikeM>{
//     return await LikeModel.findByIdAndDelete(like_id,{
//       useFindAndModify:false
//     })
//       .exec()
//   };
//
//   async getPostLikes(post_id: IPostM['_id']): Promise<ILikeM[]>{
//     return await LikeModel.find({
//       postLiked:post_id
//
//     })
//       .exec()
//   };
// }
