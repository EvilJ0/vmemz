import {BrowserModule}        from '@angular/platform-browser';
import {NgModule}             from '@angular/core';
import {AppRoutingModule}     from './app-routing.module';
import {AppComponent}         from './app.component';
import {LayoutComponent}      from './views/layout/layout.component';
import {FeedComponent}        from './views/feed/feed.component';
import {LoginComponent}       from './views/login/login.component';
import {UserProfileComponent} from './views/user-profile/user-profile.component';
import {NavbarComponent}      from './components/navbar/navbar.component';
import {PostBoxComponent}     from './components/post-box/post-box.component';
import {PostComponent}        from './components/post/post.component';
import {MobxAngularModule}    from "mobx-angular";
import {HttpClientModule}     from "@angular/common/http";
import {ReactiveFormsModule}  from "@angular/forms";

@NgModule({
            declarations: [
              AppComponent,
              LayoutComponent,
              FeedComponent,
              UserProfileComponent,
              NavbarComponent,
              PostBoxComponent,
              PostComponent,
              LoginComponent,

            ],
            imports     : [
              BrowserModule,
              AppRoutingModule,
              MobxAngularModule,
              HttpClientModule,
              ReactiveFormsModule,

            ],
            providers   : [],
            bootstrap   : [LayoutComponent]
          })
export class AppModule {
}
