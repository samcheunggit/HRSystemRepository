import { Injectable } from "@angular/core";


@Injectable()
export class GlobalConstants {
  
  admin_usertype : string = 'admin';
  principal_usertype: string = 'principal';
  secretary_usertype: string = 'secretary';
  employee_usertype: string = 'employee';

}