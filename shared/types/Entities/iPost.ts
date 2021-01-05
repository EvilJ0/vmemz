import {ILike} from './iLike';

export interface IPost {
    _id?: string
    createdByUserName: string
    createdByUserId: string
    content: string
    date: string
    time: string
    likes: ILike[]
    disLikes: ILike[]
}
