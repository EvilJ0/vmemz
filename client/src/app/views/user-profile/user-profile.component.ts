import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {RootStore}                                      from '../../stores/root.store';
import {Router}                    from '@angular/router';
import {autorun, observable, toJS} from "mobx";
import {js}                        from "../../../main";
import {IPost}                     from "../../../../../shared/types/Entities/iPost";

@Component({
             selector: 'mem-user-profile',
             templateUrl: './user-profile.component.html',
             styleUrls: ['./user-profile.component.css']
           })
export class UserProfileComponent implements OnInit {
  @observable currentUser=this.root.lgs.currentUser
  @Output() postDeleted = new EventEmitter();
  @observable post:IPost
  viewModePost = 'empty';
  viewModeDislikes='empty'
  viewModeLikes='empty'
  constructor(
    public root: RootStore,
    private router: Router
  ) {
    autorun (async ()=>{

      await this.root.lgs.getCurrentUser().then(r => r);

    })();
  }


  ngOnInit(): void {
    if (!this.root.lgs.signedTest()) {
      this.router.navigateByUrl('login')
          .then(r => r);
    }


  }
  clickOn(post:IPost){
    this.viewModePost='add'
    console.log(`click on work`)
    console.log(post._id)
    this.post=post

  }
  clickOof(){
    this.viewModePost='empty'
    console.log(`click oof work`)
  }

  onPostDeleted(val: any) {
    this.postDeleted.emit(val);
  }
}
