import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs';
import { tokenNotExpired } from 'angular2-jwt';
import { GlobalConstants } from '../../constants/globalConstants';

interface LoginUserResponse {
    success: boolean;
    message: string;
    token: string;
    loginUser: Object;
}

@Injectable()
export class AuthenticationService {

  token: any;
  loginUser: any;
  loginURLPrefix: string = '/loginUser';

  constructor(private http: HttpClient) {}
  
  authenticateLogin(loginUser){
    return this.http.post<LoginUserResponse>(this.loginURLPrefix+'/authenticate', loginUser)
  }

  storeTokenAndUser(token, loginUser) {
    localStorage.setItem('token', token);
    // localStorage only stores string, need stringify JSON object
    localStorage.setItem('loginUser', JSON.stringify(loginUser));
    this.loginUser = loginUser;
    this.token = token;
  }
  
  private getLoginUser(){
    return JSON.parse(localStorage.getItem('loginUser'));
  }
  
  getUsernameFromLoginUser(){
    return this.getLoginUser().username;
  }

  getEmployeeIdFromLoginUser() {
    return this.getLoginUser().employeeid;
  }
  
  getUserTypeFromLoginUser(){
    return this.getLoginUser().usertype;
  }

  getToken() {
    const token = localStorage.getItem('token');
    this.token = token;
    return this.token;
  }
  
  isNormalEmployee(){
    return (this.getUserTypeFromLoginUser() == 'employee')
  }

  isLoggedIn() {
    //  The tokenNotExpired function can be used to check whether a JWT exists 
    //  in local storage, and if it does, whether it has expired or not. 
    //  If the token is valid, tokenNotExpired returns true, 
    //  otherwise it returns false.
    return tokenNotExpired();
  }

  logout() {
    this.token = null;
    this.loginUser = null;
    localStorage.clear();
  }
}