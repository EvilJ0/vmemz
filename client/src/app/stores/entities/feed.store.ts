import {Injectable}         from '@angular/core';
import {action, observable} from 'mobx-angular';

import {RootStore}  from '../root.store';
import {autorun}    from 'mobx';
import {MOCK_POSTS} from '../../mockData/mockData';
import * as dayjs   from 'dayjs';

import {IPost} from "../../../../../shared/types/Entities/iPost";
import {IUser} from "../../../../../shared/types/Entities/iUser";

@Injectable({
              providedIn: 'root'
            })
export class FeedStore {
  @observable posts: IPost[] = [];


  constructor(
    public root: RootStore
  ) {
    this.root.fs = this;

    autorun(async () => {
      // this.posts = await this.getPosts();
      // console.log(this.posts.map(post => post.content));
    });
  }


  async getPosts(): Promise<IPost[]> {
    if (this.root.useMock) {
      return this.posts = MOCK_POSTS;
    } else {
      return this.posts = await this.root
                                    .postAdapter
                                    .getPots();
    }
  }

  @action
  async post(str: string) {
    if (this.root.useMock) {

      this.posts.unshift({
                           _id              : '1',
                           createdByUserId  : this.root.lgs.currentUser._id,
                           content          : str,
                           date             : dayjs().format('DD.MM.YY'),
                           time             : dayjs().format('HH:mm'),
                           likes            : [],
                           disLikes         : [],
                           createdByUserName: this.root.lgs.currentUser.name
                         });
      console.log(this.posts);
    } else {
      const newPost: IPost = {
        createdByUserId  : this.root.lgs.currentUser._id,
        content          : str,
        date             : dayjs().format('DD.MM.YY'),
        time             : dayjs().format('HH:mm'),
        likes            : [],
        disLikes         : [],
        createdByUserName: this.root.lgs.currentUser.name
      };
      console.log(newPost)
      await this.root
                .postAdapter
                .createPost(newPost).then(async ()=>{
          await this.root.socketAdapter.request('getPosts')
        })


      // await this.root.us.getUsers();


    }

  }

  @action
  async deletePost(post_id: string) {
    if (this.root.useMock) {
      const index = this.posts.findIndex(postToDelete => postToDelete._id === post_id);
      this.posts.splice(index, 1);
    } else {
      await
        this.root
            .postAdapter
            .deletePost(post_id).then(async ()=>{
              await this.root.socketAdapter.request('getPosts')
        })


    }
  }

  createdBy(id: string): IUser {
    return this.root.us.verifyUserById(id);
  }

  getPostIndex(postId: string): number {
    return this.posts.findIndex(post => post._id === postId);
  }





}
