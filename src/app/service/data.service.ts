import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { Profil } from '../model/user';

@Injectable({
  providedIn: 'root'
})


export class DataService {

  private profilSource = new BehaviorSubject('noProfil')
  currentProfil = this.profilSource.asObservable()

  constructor() { }

  changeProfil(profil: string) {
    this.profilSource.next(profil)
  }
}
