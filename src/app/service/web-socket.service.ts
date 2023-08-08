import { Injectable } from '@angular/core';
import { Client, CompatClient, IFrame, Message, Stomp, StompHeaders } from '@stomp/stompjs';
import { BehaviorSubject } from 'rxjs';
import * as SockJS from 'sockjs-client';
import { AuthService } from './auth.service';
import { TokenStorageService } from './token-storage.service';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {

 // private stompClient!: CompatClient;
  private stompClient!: Client;
  private notificationSubject = new BehaviorSubject<string>('');

  constructor(
    private authService: AuthService,
    private tokenStorage: TokenStorageService
          ) { }
/** 
  public connectWebSocket(): void {
    const socket = new SockJS('http://localhost:8080/ws');
    this.stompClient = Stomp.over(socket);
    this.stompClient.connect({}, () => {
      this.stompClient.subscribe('/topic/notifications', (message) => {
        this.notificationSubject.next(message.body);
      });
    });
  } */

   public connectWebSocket(): void {
    this.stompClient = new Client();
    this.stompClient.brokerURL = 'ws://localhost:8080/ws';
    console.log(this.stompClient.brokerURL);
  
    // Update the onConnect callback to accept the frame argument of type IFrame
    this.stompClient.onConnect = () => {
      console.log('WebSocket connection established!');
      this.stompClient.subscribe('/topic/notifications', (message: Message) => {
        this.notificationSubject.next(message.body);
      });
    };
  
    this.stompClient.activate();
    console.log("connexion faite");
  } 

  getNotification(): BehaviorSubject<string> {
    return this.notificationSubject;
  }
  
}
