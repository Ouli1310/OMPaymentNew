import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Balance, Profil, User } from 'src/app/model/user';
import { ProfilService } from 'src/app/service/profil.service';
import { TokenStorageService } from 'src/app/service/token-storage.service';
import { TransactionService } from 'src/app/service/transaction.service';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-profil',
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.css']
})
export class ProfilComponent implements OnInit {

  currentUserId: any;
  currentUser: User = new User;
  profil: Profil = new Profil()
  balance: Balance = new Balance()

  constructor(
    private token: TokenStorageService, 
    private userService: UserService, 
    private profilService: ProfilService,
    private transactionService: TransactionService,
    private tokenStorage: TokenStorageService,
    private router: Router
    ) { }

  ngOnInit(): void {

    if (this.tokenStorage.getToken() == null) {
      console.error("No token");
      this.router.navigate([''])

    }
    this.currentUserId = this.token.getUser().id;
    console.log(this.currentUserId)
    this.userService.getUserById(this.currentUserId).subscribe(

      data => {
        this.currentUser = data
        console.log(this.currentUser)
        this.profilService.getProfilById(this.currentUser.profil).subscribe(
          data => {
this.profil = data
this.transactionService.getProfile(this.currentUserId, this.currentUser.msisdn).subscribe(
  data => {
    this.balance = data.balance
    console.log(this.balance)
      }
  
)
          }
        )
        
    
        }) }


}
