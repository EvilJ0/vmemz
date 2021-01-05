import {Component, Input, OnInit} from '@angular/core';
import {RootStore}                from '../../stores/root.store';
import {Router}                    from '@angular/router';
import {autorun, observable, toJS} from "mobx";
import {js}                        from "../../../main";

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

  }


  ngOnInit(): void {
    if (!this.root.lgs.signedTest()) {
      this.router.navigateByUrl('login')
          .then(r => r);
    }


  }
}
