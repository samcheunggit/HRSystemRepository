import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';

interface UserManagementResponse {
    success: boolean;
    message: string;
    users: Object;
}

@Injectable()
export class UserManagementService {

  loginURLPrefix : string = '/loginUser'
  
  constructor(private http: HttpClient) { }
  
  // get all users
  getAllUsers(){
    return this.http.get<UserManagementResponse>(this.loginURLPrefix+'/getAllUsers');
  }
  
  saveUserDetails(user){
    return this.http.post<UserManagementResponse>(this.loginURLPrefix+'/saveUserDetails', user);
  }
  
  // sendEmailTest(){
  //   return this.http.get<UserManagementResponse>(this.loginURLPrefix+'/sendEmailTest');
  // }
}
