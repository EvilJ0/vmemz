import {Injectable, Input, Output} from '@angular/core';
import {action, observable}        from 'mobx-angular';
import {RootStore}                 from '../root.store';
import {Router}                    from '@angular/router';
import {autorun}                   from 'mobx';
import {IUser}                     from "../../../../../shared/types/Entities/iUser";


export interface ILoginData {
  username: string,
  password: string
}

@Injectable({
              providedIn: 'root'
            })
export class LoginStore {
  @observable public currentUser: IUser;
  @observable loginEr: string = '';
  emptyUser: IUser = {
    avatar  : '',
    posts   : [],
    postsLiked: [],
    likes   : [],
    likesGet:[],
    dislikes:[],
    dislikesGet:[],
    password: '',
    name    : '',
    _id     : ''
  };

  constructor(
    public  root: RootStore,
    public route: Router
  ) {
    this.root.lgs = this;
    autorun(() => {
      this.getCurrentUser().then(r => r);
    });
  }

  @action
  async getCurrentUser() {
    if (JSON.parse(<string>localStorage.getItem('userInfo'))) {
      console.log(`getting current user`);
      const userInMemory = JSON.parse(<string>localStorage.getItem('userInfo')).currentUser.user,
            foundUser    = this.root.userAdapter.getUser(userInMemory._id).then()
      if (this.root.us.users) {
        foundUser.then((res: IUser) => {
          this.currentUser = res

          return res
        })
      }
      // console.log(userInMemory)


      this.currentUser = userInMemory;
    } else {
      this.currentUser = this.emptyUser;
    }

  }

  @action
  async login(iLoginData: ILoginData) {
    await this.root.authService.validateUser(iLoginData)
              .then((response) => {
                this.root.authService.setUserInfo({'currentUser': response});
                this.route.navigateByUrl('feed');
              });


    // this.root.userAdapter.getUsers().then((users: IUser[]) => {
    //   const foundUser = users.find(user => user.name === iLoginData.name);
    //   if (!foundUser) {
    //     alert('User not found');
    //     return;
    //   }
    //   if (foundUser) {
    //     console.log(foundUser)
    //     if (iLoginData.password === foundUser.password) {
    //       this.route.navigateByUrl('feed')
    //         .then();
    //       this.currentUser = foundUser;
    //       console.log(`${this.currentUser.name} is signed`);
    //     } else {
    //       alert('User or data not valid');
    //       return;
    //     }
    //
    //   }
    // });
// return  this.root.loginAdapter.login(iLoginData)
  }


  async unsigned() {
    console.log(`${this.currentUser.name} is logout`);
    await this.root.authService.logout();
    this.currentUser = this.emptyUser;
  }

  signedTest(): any {
    if (this.currentUser._id != '') {
      return true;
    } else {
      if (this.currentUser._id == undefined && (this.currentUser._id = '')) {
        return false;
      }
    }
  }


}
