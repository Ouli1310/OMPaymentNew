import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth.service';
import { TokenStorageService } from 'src/app/service/token-storage.service';
import { ConfirmedValidator } from 'src/app/_helpers/confirm.validators';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private tokenStorageService: TokenStorageService,
    private formBuilder: UntypedFormBuilder,
    private router: Router) { }

  ngOnInit(): void {

    this.changePasswordForm = this.formBuilder.group({
      password: ['', Validators.required],
      password2: ['', Validators.required]
    },
    { 
      validator: ConfirmedValidator('password', 'password2')
    })

    

      this.email = this.tokenStorageService.getUser();
      console.log(this.email)
  }

  changePasswordForm!: UntypedFormGroup;
  errorMessage = '';
  newPassword!: String;
  submitted = false;
  email!: String;
  match = false;

  get password() {
    return this.changePasswordForm.get('password');
  }

  get password2() {
    return this.changePasswordForm.get('password2');
  }

  get f() {
    return this.changePasswordForm.controls;
  }

  changePassword(): any{
    this.authService.changePassword(this.email, this.f['password'].value).subscribe (
      data => {
        this.newPassword = data
        this.router.navigate(['/ompayment/login'])
        console.log(this.newPassword)
    })
  }
  

}
