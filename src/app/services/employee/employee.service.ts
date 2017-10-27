import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import 'rxjs/add/operator/map';
import { AuthenticationService } from '../authentication/authentication.service';

interface EmployeeResponse {
    success: boolean;
    message: string;
    employee: Object;
}

interface AllEmployeeResponse {
    success: boolean;
    message: string;
    employees: Object;
}

@Injectable()
export class EmployeeService {
  
  employeeURLPrefix : string = '/employee'
  
  constructor(
  private http: HttpClient, 
  private authenticationService: AuthenticationService) { }

  getEmployeeById(){
    
    let employeeId = this.authenticationService.getEmployeeIdFromLoginUser();
    
    let params = new HttpParams().set('employeeId', employeeId);
    
//  converts the return type Observable<Response> that gets returned 
//  from this.http.get() to an Observable<EmployeeResponse> which 
//  it then returns to the caller.
    return this.http.get<EmployeeResponse>(this.employeeURLPrefix+'/profile', {params: params})
  }
  
  getAllEmployees(){

//  converts the return type Observable<Response> that gets returned 
//  from this.http.get() to an Observable<EmployeeResponse> which 
//  it then returns to the caller.
    return this.http.get<AllEmployeeResponse>(this.employeeURLPrefix+'/getAllEmployees')
  }
}