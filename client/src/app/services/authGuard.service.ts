import {Injectable}          from '@angular/core';
import {CanActivate, Router} from '@angular/router';
import {RootStore}           from '../stores/root.store';


@Injectable({
              providedIn: 'root'
            })
export class AuthGuardService implements CanActivate {

  constructor(
    public root : RootStore,
    private route: Router
  ) {
    this.root.authGuardService = this;
  }

  canActivate() {
    if (this.root.authService.isAuthenticated()) {
      return true;
    }
    this.route.navigate(['login']).then()
    return false;
  }
}
