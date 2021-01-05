import {Injectable} from '@angular/core';

import {Socket, io} from 'socket.io-client';
import {IUser}      from "../../../../shared/types/Entities/iUser";
import {IPost}      from "../../../../shared/types/Entities/iPost";
import {ILike}      from "../../../../shared/types/Entities/iLike";
import {RootStore}  from "../stores/root.store";
import {Observable} from "rxjs";


export type APIEvent = 'ping' | 'getUsers' | 'getLikes' | 'getPosts';


const URL = 'http://localhost:5000';


@Injectable({
              providedIn: 'root'
            })
export class SocketAdapter {
  socket: Socket;


  constructor(public root: RootStore) {
    this.root.socketAdapter = this

    this.socket = io(URL, {transports: ['websocket'], upgrade: true});

    this.socket.on('connect', () => {
                     console.log('SOCKET CONNECTED!!!');
                   }
    );

    this.socket.on('getUsers', async (users: IUser[]) => {
      console.log('getUsers request received !', users);
      this.root.us.users = users

    });


    this.socket.on('getPosts', async (posts: IPost[]) => {
      console.log('getPosts request received !', posts);
      this.root.fs.posts = posts
      await this.root.lgs.getCurrentUser()
    });

    this.socket.on("getLikes", async (likes: ILike[]) => {
      console.log('getLikes request received !', likes);
      this.root.lks.likes = likes
    });

    this.socket.on(`ping`, function () {
      console.log(`pong`)
    })

    this.socket.on('reconnect', (sock: any) => {
                     console.log('SOCKET RECONNECTED!!');
                   }
    );


    this.socket.on('disconnect', () => {
                     console.log('SOCKET DISCONNECTED :(');
                     // this.socket = null
                   }
    );


  }

  // listen(eventName: APIEvent) {
  //   return new Observable((subscriber => {
  //     this.socket.on(eventName, (data) => {
  //       subscriber.next(data)
  //     })
  //   }))
  // }
  //
  // emit(eventName:string,data){
  //   this.socket.emit(eventName,data)
  // }

  public async request(event_name: APIEvent, data?) {
    if (this.socket && this.socket.connected) {
      console.log(`client: sendMessage emitting event_name ${event_name} with data`, data);
      this.socket.emit(`${event_name}`);
      return
    } else {
      console.log('SocketAPI: no sockets connected...');
    }
  }


}
