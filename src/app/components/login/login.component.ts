import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../services/authentication/authentication.service';

interface signedLoginUser {
  success: boolean;
  token: string;
  loginUser: Object;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  
  logoPath: string = './assets/logo.png'
  showForgotPWForm: boolean
  showLoginForm: boolean
  username: string
  password: string
  serverErrorMsg: string = ''

  constructor(
  private authenticationService:AuthenticationService,
  private router: Router) { }

  ngOnInit() {
    this.showForgotPWForm = false
    this.showLoginForm = true
  }

  switchForm() {
    this.showForgotPWForm = !this.showForgotPWForm;
    this.showLoginForm = !this.showLoginForm;
    return false;
  }
  
  userLogin(){
    this.serverErrorMsg ='';
    const loginUser = {
        username: this.username,
        password: this.password
    }
  
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
     });
  }
  

}
