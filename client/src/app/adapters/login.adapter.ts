import {Injectable}      from '@angular/core';
import {BaseAjaxAdapter} from './base-ajax.adapter';
import {HttpClient}      from '@angular/common/http';
import {RootStore} from '../stores/root.store';

import {Router} from '@angular/router';


@Injectable({
              providedIn: 'root'
            })
export class LoginAdapter extends BaseAjaxAdapter {

  constructor(
    http: HttpClient
  ) {
    super(http);

    // @ts-ignore
    window['loginAdapter'] = this;
  }

  async login(loginData:any) {


    // this.root.userAdapter.getUsers().then((users: IUser[]) => {
    //   const foundUser = users.find(user => user.name === loginData);
    //   if (!foundUser) {
    //     alert('User not found');
    //     return;
    //   }
    //   if (foundUser) {
    //     this.route.navigateByUrl('feed')
    //       .then();
    //     this.root.lgs.currentUser = foundUser;
    //     console.log(`${this.root.lgs.currentUser.name} is signed`);
    //   }
    // });
    // return this.post('login', loginData)
  }

  async logout() {
    // return this.request('logout');
  }


}
