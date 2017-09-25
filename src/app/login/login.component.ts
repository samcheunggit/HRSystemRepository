import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }
  
  logoPath = './assets/logo.png'
  
  showForgotPWForm = false
  showLoginForm = true

  public switchForm() {
//     element.animate({height: "toggle", opacity: "toggle"}, "slow");
    this.showForgotPWForm = !this.showForgotPWForm;
    this.showLoginForm = !this.showLoginForm;
    return false;
  }

}
