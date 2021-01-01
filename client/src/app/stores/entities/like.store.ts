import {Injectable}                   from '@angular/core';
import {action, computed, observable} from 'mobx-angular';
import {RootStore}                    from '../root.store';
import {autorun}                      from 'mobx';
import {MOCK_LIKES}                   from '../../mockData/mockData';
import * as dayjs                     from 'dayjs';
import {ILike}                        from "../../../../../shared/types/Entities/iLike";
import {IUser}                        from "../../../../../shared/types/Entities/iUser";


@Injectable({
              providedIn: 'root'
            })
export class LikeStore {
  @observable likes: ILike[] = [];
  @observable currentUserLikes: ILike[] = [];


  constructor(
    public root: RootStore
  ) {
    this.root.lks = this;
    autorun(() => {
      // console.log(`likes array changed to ${this.likes.map(like => like._id)}`);
    });

    window['likes'] = this;
  }

  @action
  async getLikes(): Promise<ILike[]> {
    if (this.root.useMock) {
      return this.likes = MOCK_LIKES;
    } else {
      return this.likes = await this.root
                                    .likeAdapter
                                    .getLikes();
    }
  }

  @action
  async like(postId: string | any, currentUser: IUser) {
    if (this.root.useMock) {
      if (!this.root.fs.testPostLike(postId, currentUser._id)) {
        this.likes.unshift({
                             _id      : 'new',
                             postId   : postId,
                             timeStamp: dayjs().format('DD.MM.YY'),
                             type     : true,
                             userId   : currentUser._id,
                             userName : this.root.us.users[this.root.us.users.findIndex(user => user._id === currentUser._id)].name
                             // userName: this.root.us.users[this.root.us.users.findIndex(user=>user._id===currentUser)]
                           });
        const newLike = this.likes.findIndex(like => like.postId === postId);
        const postIdLikeUpdate = this.root.fs.getPostIndex(postId);
        const userIdLikeUpdate = this.root.us.getUserIndex(currentUser._id);
        this.addLike(this.likes[newLike], postIdLikeUpdate, this.root.fs.posts[postIdLikeUpdate].likes);
        this.addLike(this.likes[newLike], userIdLikeUpdate, this.root.us.users[postIdLikeUpdate].likes);
      }
    } else {
      if (!this.root.fs.testPostLike(postId, currentUser._id)) {
        const newLike: ILike = {
          postId   : postId,
          timeStamp: dayjs().format('DD.MM.YY'),
          type     : true,
          userId   : currentUser._id,
          userName : currentUser.name
        };
        await this.root.likeAdapter.createLike(newLike);
        this.likes = await this.getLikes();
        await this.root.fs.getPosts();
      }


    }


  }


  addLike(like: ILike, idUpdate: number, model: any) {
    model.unshift(like);
    console.log(this.root.fs.posts[idUpdate]);
  }
}
