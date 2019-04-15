import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

import * as io from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SocketService {


  private url = `${environment.baseUrl}chat`;

  private socket;
  private authToken;

  constructor() {
    console.log(this.url)
    this.socket = io(this.url);
    // console.log(this.socket)
  }



  /*
    events to be listened
  */
  public verifyUser = () => {
    return Observable.create((observer: any) => {
      this.socket.on('verifyUser', (data: any) => {
        observer.next(data);
      }); //end socket
    }); //end Observable
  }
  /*
    end of events to be listened
  */


  /*
    events to be emitted
  */

  public disconnectedSocket = () => {
    return Observable.create((observer: any) => {
      this.socket.on('disconnect', () => {
        observer.next();
      });//end of socket
    })//end of Observable
  } // end of disconnectSocket

  public registerForNotification = () => {
    this.socket.removeAllListeners("multi-todo-transaction");
    return Observable.create((observer) => {
      this.socket.on('multi-todo-transaction', (data) => {
        observer.next(data);
      }); //end Socket
    }); //end Observable
  }; //end of chatByUserId


  public setUser = (apiKey) => {
    this.socket.emit("set-user", apiKey);
  } //end of setUser


  /*
    end of events to be emitted
  */

}