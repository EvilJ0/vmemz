import {NgModule}             from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {FeedComponent}        from './views/feed/feed.component';
import {UserProfileComponent} from './views/user-profile/user-profile.component';
import {LoginComponent}       from './views/login/login.component';
import {AuthGuardService}     from "./services/authGuard.service";


const routes: Routes = [
  {
    path: '',
    component: LoginComponent
  },
  {
    path: 'profile',
    component: UserProfileComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'feed',
    component: FeedComponent,
    canActivate: [AuthGuardService]
  }
];

@NgModule({
            imports: [RouterModule.forRoot(routes)],
            exports: [RouterModule]
          })
export class AppRoutingModule {
}
