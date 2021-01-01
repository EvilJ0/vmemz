import {Injectable}  from '@angular/core';
import {UserStore}   from './entities/user.store';
import {FeedStore}   from './entities/feed.store';
import {LoginStore}  from './entities/login.store';
import {LikeStore}   from './entities/like.store';
import {PostAdapter} from '../adapters/post.adapter';
import {UserAdapter}      from '../adapters/user.adapter';
import {LikeAdapter}      from '../adapters/like.adapter';
import {AuthService}      from '../services/auth.service';
import {AuthGuardService} from "../services/authGuard.service";
import {SocketAdapter}    from '../adapters/socket.adapter';
import {AuthAdapter}      from "../adapters/auth.adapter";


@Injectable({
              providedIn: 'root'
            })
export class RootStore {
  public authGuardService: AuthGuardService;
  public authService: AuthService;
  public lks: LikeStore;
  public fs: FeedStore;
  public us: UserStore;
  public lgs: LoginStore;

  useMock: boolean = false;

  constructor(
    public postAdapter: PostAdapter,
    public userAdapter: UserAdapter,
    public likeAdapter: LikeAdapter,
    public authAdapter: AuthAdapter,
    public socketAdapter: SocketAdapter
  ) {

    window['root'] = this;
  }

}
