import {Injectable}              from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Router}                  from '@angular/router';
import {RootStore}               from '../stores/root.store';
import {autorun}    from 'mobx';
import {ILoginData} from '../stores/entities/login.store';


@Injectable({
              providedIn: 'root'
            })

export class AuthService {

  // authUrl = `api/auth`;
  // httpOptions = {
  //   headers: new HttpHeaders({
  //                              'Content-Type': 'application/json'
  //                            })
  // };


  constructor(
    public root: RootStore,
    public router: Router,
    public http: HttpClient
  ) {
    this.root.authService = this;
    autorun(() => {
      // console.log(`auth service work`);
    });

    window['auth'] = this;
  }

  isAuthenticated() {
    let userData = localStorage.getItem('userInfo');
    if (userData && JSON.parse(userData)) {
      return true;
    }
    return false;
  }

  async logout() {
    localStorage.removeItem(`userInfo`)
    await this.router.navigate(['login']);
  }

  setUserInfo(user: object) {
    localStorage.setItem('userInfo', JSON.stringify(user));
  }

  async validateUser(iLoginData:ILoginData) {
    return await this.root.authAdapter.validate(iLoginData);
  }

  // public async signup(userName: string, password: string) {
  //   return await this.root.authAdapter.signup(userName, password);
  // }
}
