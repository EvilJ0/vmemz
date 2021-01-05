import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {IPost}                                          from "../../../../../shared/types/Entities/iPost";
import {RootStore}                                      from "../../stores/root.store";
import {IUser}                                          from "../../../../../shared/types/Entities/iUser";
import {ILike}                                          from "../../../../../shared/types/Entities/iLike";
import {js}                                             from "../../../main";

@Component({
  selector: 'mem-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {
  @Input() currentUser:IUser;
  @Input() post: IPost;
  @Output() postDeleted = new EventEmitter();
  viewModeLikes = 'empty';
  viewModeDislikes = 'empty';

  constructor(public root: RootStore) {


  }

  async getPostLikes(post:IPost){

    // for (let like of post.likes){
    //   await this.likes.push(like)
    //   return
    // }
  }
  ngOnInit(): void {
     this.getPostLikes(this.post)
  }

  onPostDeleted(val: any) {
    this.postDeleted.emit(val);
  }
}
