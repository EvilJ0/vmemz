import {Injectable} from '@angular/core';
import {BaseAjaxAdapter} from './base-ajax.adapter';
import {HttpClient} from '@angular/common/http';
import {observable} from 'mobx';
import {IUser}      from "../../../../shared/types/Entities/iUser";

@Injectable({
              providedIn: 'root'
            })
export class UserAdapter extends BaseAjaxAdapter {

  constructor(
    http: HttpClient
  ) {
    super(http);

    // window['UserAdapter']=this;
  }
  @observable
  async getUsers(): Promise<IUser[]> {
    return this.request('api/users');
  }

  async getUser(user_id:string):Promise<IUser>{
    return this.request(  `api/users/${user_id}`)
  }

  async createNewUser(user: IUser): Promise<IUser> {
    return this.post(`api/users`, user);
  }

}
