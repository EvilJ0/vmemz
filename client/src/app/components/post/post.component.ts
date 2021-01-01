import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {IPost}                                          from "../../../../../shared/types/Entities/iPost";
import {RootStore}                                      from "../../stores/root.store";

@Component({
  selector: 'mem-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {
  @Input() post!: IPost;
  @Output() postDeleted = new EventEmitter();


  constructor(public root: RootStore) {

  }

  ngOnInit(): void {
  }

  onPostDeleted(val: any) {
    this.postDeleted.emit(val);
  }
}
