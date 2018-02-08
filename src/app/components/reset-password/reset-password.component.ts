import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginService } from '../../services/login/login.service';
import { SweetAlertService } from 'ngx-sweetalert2';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css'],
  providers: [SweetAlertService],
  encapsulation: ViewEncapsulation.None
})
export class ResetPasswordComponent implements OnInit {
  
  logoPath: string = './assets/logo.png'
  loginUser: any = null
  resetPasswordForm: FormGroup;
  isPasswordMatch: boolean = false;
  token: string;
  public loading = false;
  
  constructor(private activatedRoute: ActivatedRoute,
              private router: Router, 
              private loginService:LoginService,
              private swal:SweetAlertService) { }

  ngOnInit() {
    // hide for testing purpose
    this.token = this.activatedRoute.snapshot.paramMap.get('token');
    this.checkResetPasswordTokenValidity(this.token);
    this.buildResetPasswordForm();
  }
  
  buildResetPasswordForm(){
    this.resetPasswordForm = new FormGroup({
      'newPassword': new FormControl(null, [Validators.required, Validators.minLength(8)]),
      'confirmPassword': new FormControl(null, [Validators.required, Validators.minLength(8)])
    });
  }
  
  checkResetPasswordTokenValidity(token){
    this.loginService.checkResetPasswordTokenValidity(token).subscribe(
        (result) => {
            if(result.success){
            this.loginUser = result.loginUser
            }
            else{
              this.swal.error({
                title: 'Token is invalid or expired!',
                html: 'Please go to forgot passward page and type your email again. <br>',
                showConfirmButton: true
              })
              .then(() => {
                this.router.navigate(['']);
              })
              .catch(()=>{console.log("time out");});
            }
        },
        error => {
            console.log("POST call in error", error);
        },
        () => {
            console.log("The POST observable is now completed.");
     });
  }
  
  passwordMatchValidator(newPassword, confirmPassword) {
    this.isPasswordMatch = (newPassword === confirmPassword);
  }
  
  submitPassword(){
    if (this.resetPasswordForm.valid) {
      let newPassword = this.resetPasswordForm.controls.newPassword.value;
      let confirmPassword = this.resetPasswordForm.controls.confirmPassword.value;
      this.passwordMatchValidator(newPassword, confirmPassword);
      if(this.isPasswordMatch){
        this.resetPassword(newPassword);
      }
      
    } else {
      this.resetPasswordForm.controls.newPassword.markAsDirty();
      this.resetPasswordForm.controls.confirmPassword.markAsDirty();
    }
  }
  
  resetPassword(newPassword){

    if(this.loginUser){
      this.loading = true;
      this.loginService.resetPassword(newPassword, this.token).subscribe(
        (result) => {
            if(result.success){
              this.swal.success({
                title: 'Password is changed successfully',
                showConfirmButton: false,
                timer: 1500
              })
              .catch(()=>{console.log("time out");});
            }
            else{
              this.swal.error({
                title: 'Reset Password Failed',
                html: 'Please contact IT support <br>',
                showConfirmButton: true
              })
              .catch(()=>{console.log("time out");});
            }
        },
        error => {
            console.log("POST call in error", error);
        },
        () => {
            this.loading = false;
            console.log("The POST observable is now completed.");
            this.router.navigate(['']);
     });
    }
  }
  
  get newPassword() { return this.resetPasswordForm.get('newPassword'); }
  
  get confirmPassword() { return this.resetPasswordForm.get('confirmPassword'); }

}
