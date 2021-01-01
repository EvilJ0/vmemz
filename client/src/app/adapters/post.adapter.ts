import {Injectable}      from '@angular/core';
import {BaseAjaxAdapter} from './base-ajax.adapter';
import {HttpClient}      from '@angular/common/http';
import {observable}      from 'mobx';
import {Observable}      from 'rxjs';
import {IPost}           from "../../../../shared/types/Entities/iPost";


@Injectable({
              providedIn: 'root'
            })
export class PostAdapter extends BaseAjaxAdapter {

  url: string = 'api/posts';

  constructor(public http: HttpClient) {
    super(http);
    // window['PostAdapter'] = this;
  }

  @observable
  async getPots(): Promise<IPost[]> {
    return this.request<IPost[]>(`${this.url}`);
  }

  // getPosts2(): Observable<IPost[]> {
  //   let allPosts = this.requestAll(`${this.url}`);
  //   return allPosts;
  // }
  //
  // subscribeAllPosts() {
  //   let allPosts = this.getPosts2();
  //   allPosts.subscribe(post => {
  //     console.log(post);
  //   });
  // }

  async createPost(post: IPost): Promise<IPost> {
    // console.log(`post adapter work`);
    return this.post(`${this.url}`, post);
  }

  async deletePost(post_id: string): Promise<IPost> {
    console.log(`post adapter delete post id: ${post_id}`);
    return this.delete(`${this.url}/${post_id}`);
  }

}
