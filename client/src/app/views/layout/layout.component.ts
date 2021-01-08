import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {RootStore}                                      from "../../stores/root.store";
import {FeedStore}           from "../../stores/entities/feed.store";
import {UserStore}           from "../../stores/entities/user.store";
import {LoginStore}          from "../../stores/entities/login.store";
import {LikeStore}           from "../../stores/entities/like.store";
import {AuthService}         from "../../services/auth.service";
import {AuthGuardService}    from "../../services/authGuard.service";
import {Router}              from "@angular/router";
import {autorun}             from "mobx";
import {SocketAdapter}       from "../../adapters/socket.adapter";

@Component({
  selector: 'mem-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit {
  @Input() animateRight = new EventEmitter();

  constructor(
    public root:RootStore,
    public fs:FeedStore,
    public us:UserStore,
    public lgs:LoginStore,
    public lks:LikeStore,
    public authService: AuthService,
    public authGuardService: AuthGuardService,
    public socketAdapter:SocketAdapter,
    private router:Router

  ) {

    autorun (async ()=>{
      await this.us.getUsers().then(r => r);
      await this.fs.getPosts().then(r => r);
      await this.lks.getLikes().then(r => r);
     await this.lgs.getCurrentUser().then(r => r);


    })();
  }

  ngOnInit(): void {
    if(!this.root.lgs.signedTest()){
      this.router.navigateByUrl('login')
          .then(r=>r);
    }
    //
    // this.root.socketAdapter.listen(`getPosts`).subscribe((data)=>{console.log(data)})
  }



}
