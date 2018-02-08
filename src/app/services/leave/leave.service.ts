import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';

interface LeaveResponse {
    success: boolean;
    message: string;
    leave: Object;
}

@Injectable()
export class LeaveService {
    
  leaveURLPrefix : string = '/leave'

  constructor(private http: HttpClient) { }
  
  createLeave(employee){
    return this.http.post<LeaveResponse>(this.leaveURLPrefix+'/createLeave', employee);
  }
  
  getLeavesByEmployeeId(employeeId){
    let params = new HttpParams().set('employeeId', employeeId);
    return this.http.get<LeaveResponse>(this.leaveURLPrefix+'/getLeavesByEmployeeId', {params: params});
  }
  
  getLeaveDetailsByEmployeeId(employeeId){
    let params = new HttpParams().set('employeeId', employeeId);
    return this.http.get<LeaveResponse>(this.leaveURLPrefix+'/getLeaveDetailsByEmployeeId', {params: params});
  }
  
  updateEmployeeNameForLeave(employeeName, employeeId){
    let object = {
      employeeId: employeeId,
      employeeName: employeeName
    }
    return this.http.post<LeaveResponse>(this.leaveURLPrefix+'/updateEmployeeNameForLeave', object);
  }
  
  saveLeave(leaveId, newRemainsDay, leaveType){
    let leave = {
      leaveId: leaveId,
      newRemainsDay: newRemainsDay,
      leaveType: leaveType
    }
    return this.http.post<LeaveResponse>(this.leaveURLPrefix+'/saveLeave', leave);
  }
  
  saveLeaveDetails(leaveId, employeeId, leaveType, leaveFrom, leaveTo, remarks){
    let leaveDetails = {
      leaveid: leaveId,
      employeeid: employeeId,
      leavetype: leaveType,
      leavefrom: leaveFrom,
      leaveto: leaveTo,
      remarks: remarks
    }
    
    return this.http.post<LeaveResponse>(this.leaveURLPrefix+'/saveLeaveDetails', leaveDetails);
  }
  
  deleteLeaveByEmployeeId(employeeId){
    let params = new HttpParams().set('employeeId', employeeId);
    return this.http.delete<LeaveResponse>(this.leaveURLPrefix+'/deleteLeaveByEmployeeId', {params: params});
  }
  
  deleteLeaveDetailsByEmployeeId(employeeId){
    let params = new HttpParams().set('employeeId', employeeId);
    return this.http.delete<LeaveResponse>(this.leaveURLPrefix+'/deleteLeaveDetailsByEmployeeId', {params: params});
  }
}