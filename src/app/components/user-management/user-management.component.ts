import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Entite, Profil, User } from 'src/app/model/user';
import { EntiteService } from 'src/app/service/entite.service';
import { ProfilService } from 'src/app/service/profil.service';
import { TokenStorageService } from 'src/app/service/token-storage.service';
import { UserService } from 'src/app/service/user.service';
import { DialogAnimationsExampleDialogComponent } from '../dialog-animations-example-dialog/dialog-animations-example-dialog.component';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {

  displayedColumns: string[] = ['id', 'prenom', 'nom', 'email', 'profil', 'entite', 'msisdn', 'status', 'actions'];


  users: User[] = [];
  user: User = new User
  entite: Entite = new Entite
  profil: Profil = new Profil
  dataSource: MatTableDataSource<User> = new MatTableDataSource();

  constructor(
    private userService: UserService,
    private router: Router,
    private entiteServ: EntiteService,
    private profilServ: ProfilService,
    public dialog: MatDialog,
    private tokenStorage: TokenStorageService
  ) { }

  async ngOnInit(): Promise<void> {

    if (this.tokenStorage.getToken() == null) {
      console.error("No token");
      this.router.navigate([''])

    }

   
    await this.allUsers()
    
  }

 /**  allUsers() {
    this.userService.getAllUsers().subscribe(
      data => {
        this.users = data;
        this.dataSource = new MatTableDataSource(data)
        this.users.forEach(user => {
          this.entiteServ.getEntiteById(user.entite).subscribe(
           data => {this.entite = data
           console.log(this.entite)
           console.log(this.entite.name)}

          )
          this.profilServ.getProfilById(user.profil).subscribe(
            data => {
              this.profil = data
              console.log(this.profil)
              console.log(this.profil.name)})
   
            }
          )
        })

        console.log(this.users)
      }
    */

      async allUsers() {
        try {
          const users = await this.userService.getAllUsers().toPromise();
          this.dataSource = new MatTableDataSource(users);
      
          for (const user of users) {
            const [entite, profil] = await Promise.all([
              this.entiteServ.getEntiteById(user.entite).toPromise(),
              this.profilServ.getProfilById(user.profil).toPromise(),
            ]);
            console.log(entite.name, profil.name);
            user.entite = entite.name;
            user.profil = profil.name;
          }
      
          console.log(users);
        } catch (error) {
          console.error(error);
        }
      }
  

  updateUser(id: number) {
this.router.navigate(['ompayment/user/update-user/'+id])
  }

  blockOrUnblockUser(email: any) {
    this.userService.getUserByEmail(email).subscribe (
      data => {
        let user = data
        this.userService.blockOrUnblockUser(email, user.status).subscribe(
          response => {
            console.log(response)},
          error => console.log(error)
        );
      }
    )
   
  }

  openModal(message: string) {
    let mess = message;
    console.log(mess)
   
    this.dialog.open(DialogAnimationsExampleDialogComponent, {
      width: '250px',
      data: {message: mess}
     
    });
  }

  
  deleteUser(id: number) {
    this.openModal("Êtes-vous sûr de vouloir supprimer ce compte ?")
    this.userService.deleteUser(id).subscribe(
      data => {
          console.log("good riddance")
          this.router.navigate(['ompayment/user-management'])
      }
    )
  }
  



}
