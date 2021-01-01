import {Component, OnInit} from '@angular/core';
import {RootStore}         from '../../stores/root.store';
import {Router}            from '@angular/router';
import {autorun}           from "mobx";

@Component({
             selector: 'mem-user-profile',
             templateUrl: './user-profile.component.html',
             styleUrls: ['./user-profile.component.css']
           })
export class UserProfileComponent implements OnInit {

  constructor(
    public root: RootStore,
    private router: Router
  ) {
    autorun(() => {
      this.root.lgs.getCurrentUser().then(r => r);
    });
  }

  ngOnInit(): void {
    if (!this.root.lgs.signedTest()) {
      this.router.navigateByUrl('login')
          .then(r => r);
    }
  }
}
