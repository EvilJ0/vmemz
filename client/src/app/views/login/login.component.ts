import { Component, OnInit }                from '@angular/core';

import {Router}                             from '@angular/router';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {autorun}                            from 'mobx';
import {LoginStore}                         from "../../stores/entities/login.store";

@Component({
             selector: 'mem-login',
             templateUrl: './login.component.html',
             styleUrls: ['./login.component.css']
           })
export class LoginComponent implements OnInit {
  loginForm: FormGroup
  constructor(
    public  ls:LoginStore

  ) {
    // autorun(() => {
    //   this.ls.getCurrentUser().then(r => r);
    // });
  }

  ngOnInit(): void {

    this.loginForm = new FormGroup({
                                     username   : new FormControl('',
                                                                  [Validators.required,
                                                                   Validators.email]),
                                     password: new FormControl('',
                                                               [Validators.required, Validators.minLength(6)])
                                   })
  }

  get userName() {
    return this.loginForm.get('userName')
  }

  get password() {
    return this.loginForm.get('password')
  }

}
