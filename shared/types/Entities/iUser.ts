import {IPost} from './iPost';
import {ILike} from './iLike';


export interface IUser {
    _id?: any
    name: string
    posts: IPost[]
    postsLiked: IPost[]
    likes: ILike[]
    likesGet: ILike[]
    dislikes: ILike[]
    dislikesGet: ILike[]
    avatar: string
    password?: any
}
