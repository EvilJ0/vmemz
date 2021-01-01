import {Component, OnInit} from '@angular/core';
import {Router}            from '@angular/router';
import {RootStore}         from '../../stores/root.store';
import {IPost}             from "../../../../../shared/types/Entities/iPost";
import {FeedStore}         from "../../stores/entities/feed.store";


@Component({
             selector   : 'mem-feed',
             templateUrl: './feed.component.html',
             styleUrls  : ['./feed.component.css']
           })
export class FeedComponent implements OnInit {
  posts1!: IPost[]

  constructor(
    public fs: FeedStore,
    private router: Router,
    public root: RootStore) {
  }

  ngOnInit(): void {
    if (!this.root.lgs.signedTest()) {
      this.router.navigateByUrl('login')
          .then(r => r);
    }

    // this.root.postAdapter.getPosts2()
    //     .subscribe((posts2: IPost[]) => {
    //       if (posts2) {
    //         this.posts1 = posts2
    //       }
    //     });
    this.root.us.getUsers()

  }


}
