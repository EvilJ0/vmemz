import {Component, EventEmitter, OnInit, Output} from '@angular/core';

@Component({
             selector: 'mem-post-box',
             templateUrl: './post-box.component.html',
             styleUrls: ['./post-box.component.css']
           })
export class PostBoxComponent implements OnInit {
  @Output() newPost = new EventEmitter();
  emptyValue=''

  constructor() {


  }

  ngOnInit(): void {

  }

  postToFeed(val: any) {
    if (!val) {
      return;
    }
    // console.log(`val`)
    this.newPost.emit(val);


  }


}
