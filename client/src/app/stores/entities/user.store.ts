import {Injectable}         from '@angular/core';
import {action, observable} from 'mobx-angular';
import {RootStore}          from '../root.store';
import {autorun}            from 'mobx';
import {MOCK_USERS}         from '../../mockData/mockData';
import {ILoginData}         from './login.store';
import {IUser}              from "../../../../../shared/types/Entities/iUser";


@Injectable({
              providedIn: 'root'
            })
export class UserStore {
  @observable public users: IUser[] = [];
  @observable public user: IUser = this.users[0];

  constructor(
    public root: RootStore,
  ) {
    this.root.us = this;
    autorun(() => {
      // console.log(`users array has changed to ${this.users.map(user => user.name)}`);
    });
  }

  @action
  async getUsers(): Promise<IUser[]> {
    if (this.root.useMock) {
      this.users = MOCK_USERS;
      return this.users;
    }
    return this.users = await this.root
                                  .userAdapter
                                  .getUsers();
  }

  @action
  verifyUserById(val: any): IUser {
    let foundUser = this.users.find(user => user._id === val);
    if (foundUser) {
      this.user = foundUser;
    }
    return this.user;
  }


  @action
  async createNewUser(user: ILoginData) {
    if (this.root.useMock) {
      let newUser: IUser = {
        _id     : '3',
        avatar  : '../../../assets/svg/Trollface.svg',
        name    : user.username,
        likes   : [],
        likesGet:[],
        dislikes:[],
        dislikesGet:[],
        posts   : [],
        postsLiked: [],
        password: user.password
      };
      console.log(newUser);
      this.users.unshift(newUser);
    } else {
      if (user.username == '' || user.password == '') {
        alert(`enter name and password to new user`)
        return
      }
      const
        newUser: IUser = {
          avatar  : '../../../assets/svg/Trollface.svg',
          name    : user.username,
          likes   : [],
          likesGet: [],
          dislikes:[],
          dislikesGet:[],
          password: user.password,
          posts   : [],
          postsLiked: [],
        };
      console.log(newUser);
      await this
        .root
        .userAdapter
        .createNewUser(newUser).then(async () => {
          await this.root.socketAdapter.request('getUsers')
        });

    }

  }

  @action
  getUserIndex(userId: string): number {
    return this.users.findIndex(user => user._id === userId);
  }


  getUserAvatar(userId: String) {

    return this.users[this.users.findIndex(user => user._id === userId)].avatar;
  }


  getUserName(userId: String): string {

    return this.users[this.users.findIndex(user => user._id === userId)].name;
  }

}
