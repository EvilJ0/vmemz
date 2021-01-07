import {Component, Input, OnInit} from '@angular/core';
import {RootStore}                from "../../stores/root.store";

@Component({
             selector   : 'mem-post-list',
             templateUrl: './post-list.component.html',
             styleUrls  : ['./post-list.component.css']
           })
export class PostListComponent implements OnInit {
  @Input() post
  @Input() index

  viewModePost = 'empty';
  constructor(public root: RootStore) {
  }

  ngOnInit(): void {
  }

  clickOn(){
    this.viewModePost='add'
    console.log(`click on work`)
    console.log(this.viewModePost)
  }
  clickOof(){
    this.viewModePost='empty'
    console.log(`click oof work`)
  }

}
