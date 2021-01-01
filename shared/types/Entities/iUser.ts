import {IPost} from './iPost';
import {ILike} from './iLike';


export interface IUser {
  _id?: any
  name: string
  posts: IPost[]
  likes: ILike[]
  avatar: string
  password?: any
}
