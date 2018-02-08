import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import 'rxjs/add/operator/map';
import { AuthenticationService } from '../authentication/authentication.service';

interface LeaveTableResponse {
    success: boolean;
    message: string;
    leaveTableData: any;
}

@Injectable()
export class LeaveManagementService {

  leaveManagementURLPrefix : string = '/leaveManagement'
  
  constructor(
  private http: HttpClient, 
  private authenticationService: AuthenticationService) { }

  getAllLeaves(){
    return this.http.get<LeaveTableResponse>(this.leaveManagementURLPrefix+'/getAllLeaves')
  }
  
  saveAllLeaves(allLeaves){
    return this.http.post<LeaveTableResponse>(this.leaveManagementURLPrefix+'/saveAllLeaves', allLeaves);
  }

}
