import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../services/authentication/authentication.service';
import { LoginService } from '../../services/login/login.service';
import { SweetAlertService } from 'ngx-sweetalert2';

interface signedLoginUser {
  success: boolean;
  token: string;
  loginUser: Object;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [SweetAlertService]
})
export class LoginComponent implements OnInit {
  
  @ViewChild('forgotPWForm') forgotPWForm: any;
  @ViewChild('loginForm') loginForm: any;
  public loading = false;
  logoPath: string = './assets/logo.png'
  showForgotPWForm: boolean
  showLoginForm: boolean
  username: string
  password: string
  serverErrorMsg: string = ''
  forgotPWServerErrorMsg: string = ''
  form_forgotPWEmail: string

  constructor(
  private authenticationService:AuthenticationService,
  private loginService:LoginService,
  private router: Router,
  private swal:SweetAlertService) { }

  ngOnInit() {
    this.showForgotPWForm = false
    this.showLoginForm = true
  }

  switchForm() {
    if(this.forgotPWForm)
    this.forgotPWForm.reset();
    
    if(this.loginForm)
    this.loginForm.reset();
    
    this.serverErrorMsg = '';
    
    this.showForgotPWForm = !this.showForgotPWForm;
    this.showLoginForm = !this.showLoginForm;
    return false;
  }
  
  userLogin(){
    this.loginForm.controls['username'].markAsTouched(true);
    this.loginForm.controls['password'].markAsTouched(true);
    
    this.serverErrorMsg ='';
    const loginUser = {
        username: this.username,
        password: this.password
    }
    
    if(this.loginForm.valid){
      this.authenticationService.authenticateLogin(loginUser).subscribe(
        (data) => {
            console.log("POST call successful value returned in body", data);
            if(data.success){
              console.log("login successfully");
              this.authenticationService.storeTokenAndUser(data.token, data.loginUser);
              this.router.navigate(['home']);
            }
            else{
              console.log("login failed: "+data.message);
              this.serverErrorMsg = data.message;
              this.username = "";
              this.password = "";
            }
        },
        error => {
            console.log("POST call in error", error);
            this.serverErrorMsg = error
        },
        () => {
            console.log("The POST observable is now completed.");
            this.loginForm.reset();
     });
    }
  }
  
  forgotPassword(){
    if(this.forgotPWForm.valid){
      this.loading = true;
      this.loginService.forgotPassword(this.form_forgotPWEmail).subscribe(
        (data) => {
            console.log("forgot password data: ",data);
            if(data.success){
              console.log("reset password message: "+data.message);
              this.swal.success({
                title: 'Reset password email is sent!',
                text: 'Please check your email to reset your password.',
                showConfirmButton: true
              })
              .then(() => {
                this.forgotPWForm.reset();
                this.switchForm();
              })
              .catch(()=>{console.log("time out");});
            }
            else{
              this.forgotPWServerErrorMsg = data.message
            }
        },
        error => {
            console.log("POST call in error", error);
            this.forgotPWServerErrorMsg = error
        },
        () => {
          this.loading = false;
          console.log("The POST observable is now completed.");
     });
    }
    else{
      this.forgotPWForm.controls['forgotPWEmail'].markAsTouched(true);
    }
  }
}
