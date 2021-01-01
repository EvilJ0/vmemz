import {Injectable}      from '@angular/core';
import {BaseAjaxAdapter} from './base-ajax.adapter';
import {HttpClient}      from '@angular/common/http';
import {ILike}           from "../../../../shared/types/Entities/iLike";



@Injectable({
              providedIn: 'root'
            })
export class LikeAdapter extends BaseAjaxAdapter {

  url: string = 'api/likes';

  constructor(public http: HttpClient) {
    super(http);
    window['LikeAdapter'] = this;
  }

  async getLikes(): Promise<ILike[]> {
    return this.request<ILike[]>(`${this.url}`);
  }

  async createLike(like: ILike): Promise<ILike> {
    // console.log(`create like work`);
    return this.post(`${this.url}`, like);
  }

  async unLike(like_id: string): Promise<ILike> {
    return this.delete(`${this.url}/${like_id}`);
  }
}
