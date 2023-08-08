import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

const TOKEN_KEY = 'auth-token';
const USER_KEY = 'auth-user';
const PROFIL_KEY = 'auth-profil';

@Injectable({
  providedIn: 'root'
})
export class TokenStorageService {

  constructor() { }

  signout(): void {
    window.sessionStorage.clear();
    

  }

  public saveToken(token: string): void {
    window.sessionStorage.removeItem(TOKEN_KEY);
    window.sessionStorage.setItem(TOKEN_KEY, token);
    console.log(token)
  }

  public getToken(): string | null {
    return window.sessionStorage.getItem(TOKEN_KEY);
  }

  public saveUser(user: any): void {
    console.log("user to save", user)
    window.sessionStorage.removeItem(USER_KEY);
    window.sessionStorage.setItem(USER_KEY, JSON.stringify(user));
    console.log("save user", user)
  }

  public getUser(): any {
    const user = window.sessionStorage.getItem(USER_KEY);
    if(user) {
      return JSON.parse(user);
      console.log(user)
    }
    return{};
  }

  public saveProfil(profil: any): void {
    console.log("profil to save", profil)
    window.sessionStorage.removeItem(PROFIL_KEY);
    window.sessionStorage.setItem(PROFIL_KEY, JSON.stringify(profil));
    console.log("save profil", profil)
  }

  public getProfil(): any {
    const profil = window.sessionStorage.getItem(PROFIL_KEY);
    if(profil) {
      return JSON.parse(profil);
      console.log(profil)
    }
    return{};
  }

  }
