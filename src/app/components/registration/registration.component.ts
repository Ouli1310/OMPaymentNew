
import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { User, Profil, Entite } from 'src/app/model/user';
import { AuthService } from 'src/app/service/auth.service';
import { EntiteService } from 'src/app/service/entite.service';
import { ProfilService } from 'src/app/service/profil.service';
import { TokenStorageService } from 'src/app/service/token-storage.service';
import { DialogAnimationsExampleDialogComponent } from '../dialog-animations-example-dialog/dialog-animations-example-dialog.component';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {

  registerForm!: UntypedFormGroup;

  /* form: any = {
    firstName: null,
    lastName: null,
    email: null,
    msisdn: null,
    password: null,
    profil: null
  }; */



  isSuccessful = false;
  errorMessage = '';
  profilChoisi!: Profil;
  profils!: Profil[];
  entiteChoisi!: Entite;
  entites!: Entite[];

  constructor(
    private authService: AuthService, 
    private formBuilder: UntypedFormBuilder, 
    private profilService: ProfilService,
    private entiteService: EntiteService,
    private router: Router,
    public dialog: MatDialog,
    private tokenStorage: TokenStorageService
    ) { }

  ngOnInit(): void {

    if (this.tokenStorage.getToken() == null) {
      console.error("No token");
      this.router.navigate([''])

    }

    this.registerForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      msisdn: [''],
      code: [''],
      profil: ['', Validators.required],
      entite: [''],
    })


    this.getProfils();

    this.getEntites();
  }

  get firstName() {
    return this.registerForm.get('firstName');
  }

  get lastName() {
    return this.registerForm.get('lastName');
  }

  get email() {
    return this.registerForm.get('email');
  }

  get msisdn() {
    return this.registerForm.get('msisdn');
  }

  get code() {
    return this.registerForm.get('code');
  }

  get profil() {
    return this.registerForm.get('profil');
  }

  
  get entite() {
    return this.registerForm.get('entite');
  }

  get f() {
    return this.registerForm.controls;
  }

  /**onSubmit(): void {
    const {firstName, lastName, email, msisdn, password, profil} = this.registerForm.value;
    this.authService.register(firstName, lastName, email, msisdn, password, profil).subscribe({
      next: data => {
        this.isSuccessful = true;
        this.isSignUpFailed = false;
      },
      error: err => {
        this.errorMessage = err.error.message
        this.isSignUpFailed = true;
      }
      
      
    })
  } */

  getProfils() {
    this.profilService.getAllProfils().subscribe (
      data => {
        this.profils = data;
      }
    )
  }

  getEntites() {
    this.entiteService.getAllEntites().subscribe(
      data => {
        this.entites = data
        console.log(this.entites)
      }
    )
  }

  getProfilChoisi(event: any) {
    this.profilChoisi = event.value;
    console.log(this.profilChoisi.code)
    if(this.profilChoisi.code == "AD") {
      this.entiteService.getEntiteByType("HEAD").subscribe (
        data => {
          this.entites = data
          console.log(this.entites)
        }
      )
    } else if(this.profilChoisi.code == "A" || this.profilChoisi.code == "CA") {
      this.entiteService.getEntiteByType("AGENCE").subscribe (
        data => {
          this.entites = data
          console.log(this.entites)
        }
      )
    } else {
      this.entiteService.getEntiteByType("OTHER").subscribe (
        data => {
          this.entites = data
          console.log(this.entites)
        }
      )
    }
   
  }

  getEntiteChoisi(event: any) {
    this.entiteChoisi = event.value;
    console.log(this.entiteChoisi)
  }

  openModal(errorMessage: string) {
    this.errorMessage = errorMessage;
    console.log(this.errorMessage)
   
    this.dialog.open(DialogAnimationsExampleDialogComponent, {
      width: '250px',
      data: {message: this.errorMessage}
     
    });
  }


  onSubmit(): void {
    const newUser = new User();
    newUser.firstName = this.f['firstName'].value
    newUser.lastName = this.f['lastName'].value
    newUser.email = this.f['email'].value
    newUser.profil = this.profilChoisi.id
   
      newUser.msisdn = this.f['msisdn'].value
      newUser.code = this.f['code']?.value
      
      newUser.entite = this.entiteChoisi?.id
    
  
    console.log(newUser)
    this.authService.registration(newUser).subscribe (
      {
        next: data => {
          this.isSuccessful = true;
          console.log(data)
          this.router.navigate(['ompayment/user-management'])
      console.log(this.isSuccessful)
        },   error: err => {
          this.errorMessage = err.error;
          this.openModal(this.errorMessage)
          console.log("fffffffffffffffffffffff")
          console.log(err.error)
        }

      }
    )
  }

  /** onSubmit(): void {
    const{firstName, lastName, email, msisdn, password, profil} = this.form;
    this.authService.register(firstName, lastName, email, msisdn, password, profil)
    .subscribe({
      next: data => {
        console.log(data);
        this.isSuccessful = true;
        this.isSignUpFailed = false;
      },
      error: err => {
        this.errorMessage = err.error.message;
        this.isSignUpFailed = true;
      }
    });
  } */



}
