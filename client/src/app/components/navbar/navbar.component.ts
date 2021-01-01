import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {RootStore} from '../../stores/root.store';

@Component({
             selector: 'mem-navbar',
             templateUrl: './navbar.component.html',
             styleUrls: ['./navbar.component.css']
           })
export class NavbarComponent implements OnInit {

  constructor(
    private router:Router,
    public root:RootStore
  ) { }

  ngOnInit(): void {
  }
  routeToProfile(){
    this.router.navigateByUrl('profile')
        .then(r=>r); // ля чего зен?
  }

  routeToFeed(){
    this.router.navigateByUrl('feed')
        .then(r=>r);

  }  routeToLogin(){
    this.router.navigateByUrl('login')
        .then(r=>r);
  }

}
