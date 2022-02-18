
import { Injectable } from '@angular/core';
import { webSocket, WebSocketSubject } from "rxjs/webSocket";

@Injectable({
  providedIn: 'root'
})
export class HomeService {
  serverUrl: string = "ws://20.127.66.79:7681"

  socket: WebSocketSubject<any> = webSocket({url: this.serverUrl, deserializer: ({data}) => data});

  constructor() { 
    this.socket.subscribe({
     next: (message) => console.log(message),
     error: (err) => console.log(err),
     complete: () => console.log('complete')
    })
  }
  sendWsMessage(msg: string): void{
    this.socket.next({message: msg});
    console.log(msg)
  }
}
