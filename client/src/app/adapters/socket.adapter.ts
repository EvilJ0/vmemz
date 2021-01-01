import {Injectable} from '@angular/core';

import {Socket, io} from 'socket.io-client';
import {IUser}      from "../../../../shared/types/Entities/iUser";


export type APIEvent = 'ping' | 'getUsers' | 'getLikes';


const URL = 'http://localhost:5000';


@Injectable({
              providedIn: 'root'
            })
export class SocketAdapter {
  socket: Socket;
  user;

  constructor() {

    this.socket = io(URL, {transports: ['websocket'], upgrade: false});

    this.socket.on('connect', () => {
                     console.log('SOCKET CONNECTED!!');
                   }
    );

    this.socket.on('getUsers', async (users:IUser[]) => {
      console.log('getUsers request received !', users);
    });


    this.socket.on('getPosts', (post: any) => {
      alert(`post content : ${post.content}, posted by : ${post.postedBy.name}  `);
    });


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

  protected async request(event_name: APIEvent, data) {
    if (this.socket && this.socket.connected) {
      console.log(`client: sendMessage emitting event_name ${event_name} with data`, data);
      this.socket.emit(`${event_name}`);
    } else {
      console.log('SocketAPI: no sockets connected...');
    }
  }


}
