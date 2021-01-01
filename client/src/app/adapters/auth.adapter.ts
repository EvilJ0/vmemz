import {Injectable} from '@angular/core';

import {HttpClient, HttpHeaders} from '@angular/common/http';
import {BaseAjaxAdapter} from './base-ajax.adapter';
import {ILoginData}      from '../stores/entities/login.store';


@Injectable({
              providedIn: 'root'
            })
export class AuthAdapter extends BaseAjaxAdapter {
  private authUrl=`api/auth`
  httpOptions = {
    headers: new HttpHeaders({
                               'Content-Type': 'application/json'
                             })
  };

  constructor(http: HttpClient) {
    super(http);

    window['authAdapter'] = this;
  }


  // async login(user: IUser) {
  //   return await this.post('login', user);
  // }

  // async logout() {
  //   return this.request('logout');
  // }

  async validate(iLoginData:ILoginData) {
    return await this.post(`${this.authUrl}/login`, iLoginData);
  }

  async signup(userName: string, password: string) {
    return await this.post('auth/signup', {'userName': userName, 'password': password},);
  }




}
