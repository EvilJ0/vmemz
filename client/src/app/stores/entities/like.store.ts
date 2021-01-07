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
  async testPostLike(postId: string, userId: string) {
    // console.log(`test work`)
    const postIdLike = this.root.fs.posts
                           .findIndex(post => post._id === postId);
    // console.log(postIdLike)
    if ((this.root.fs.posts[postIdLike]).createdByUserId === userId) {
      console.log(`User ${userId} cant like post ${this.root.fs.posts[postIdLike]._id}`);
      return true;
    } else {
      const like    = this.root.fs.posts[postIdLike].likes.find(like => like.userId === userId),
            disLike = this.root.fs.posts[postIdLike].disLikes.find(disLike => disLike.userId === userId)
      if (like) {
        console.log(`User ${userId} already liked post ${postId}`);
        await this.root.lks.unlike(like._id);
        return true;
      }
      if (disLike) {
        console.log(`User ${userId} already liked post ${postId}`);
        await this.root.lks.unlike(disLike._id);
        return true;
      }

    }
    return false;
  }


  @action
  async like(postId: string, currentUser: IUser, newLike: ILike) {
    if (this.root.useMock) {
      if (!await this.testPostLike(postId, currentUser._id)) {
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
      if (!await this.testPostLike(postId, currentUser._id)) {
        await this.root.likeAdapter.createLike(newLike).then(async () => {
          await this.root.socketAdapter.request('getLikes');
          await this.root.socketAdapter.request('getPosts');
        })

        // await this.root.fs.getPosts();
      }
    }
  }

  async unlike(like_id: string) {
    console.log(`deleting like ${like_id}`)
    await this.root.likeAdapter.unLike(like_id).then(async () => {
      await this.root.socketAdapter.request('getLikes');
      await this.root.socketAdapter.request('getPosts');
    })
  }

  addLike(like: ILike, idUpdate: number, model: any) {
    model.unshift(like);
    console.log(this.root.fs.posts[idUpdate]);
  }

  async generateLike(postId: string, currentUser: IUser) {
    const newLike: ILike = {
      postId   : postId,
      timeStamp: dayjs().format('DD.MM.YY'),
      type     : true,
      userId   : currentUser._id,
      userName : currentUser.name
    };

    await this.like(postId, currentUser, newLike);
  }

  async generateUnLike(postId: string, currentUser: IUser) {
    const newLike: ILike = {
      postId   : postId,
      timeStamp: dayjs().format('DD.MM.YY'),
      type     : false,
      userId   : currentUser._id,
      userName : currentUser.name
    };
    await this.like(postId, currentUser, newLike);
  }
}
