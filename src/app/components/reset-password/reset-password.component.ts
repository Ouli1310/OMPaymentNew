import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth.service';
import { TokenStorageService } from 'src/app/service/token-storage.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

  constructor( 
    private authService: AuthService,
    private tokenStorageService: TokenStorageService,
    private formBuilder: UntypedFormBuilder,
    private router: Router,
    private tokenStorage: TokenStorageService
    ) { }

  ngOnInit(): void {

    this.resetPasswordForm = this.formBuilder.group({
      email: ['', Validators.required]})
    

  }

  resetPasswordForm!: UntypedFormGroup;
  errorMessage = '';
  resetToken!: String;
  submitted = false;

  get email() {
    return this.resetPasswordForm.get('email');
  }

  get f() {
    return this.resetPasswordForm.controls;
  }

  newPassword(): any{
    this.authService.resetPassword(this.f['email'].value).subscribe (
      data => {
        console.log(data)
        this.resetToken = data
        this.router.navigate(['/ompayment/changePassword'])
    })
  }
    
  
  

}
