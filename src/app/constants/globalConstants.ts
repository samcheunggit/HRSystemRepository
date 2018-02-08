import { Injectable } from "@angular/core";


@Injectable()
export class GlobalConstants {
  
  // User type Constants
  admin_usertype: string = 'admin';
  principal_usertype: string = 'principal';
  secretary_usertype: string = 'secretary';
  employee_usertype: string = 'employee';
  
  // Dropzone Constants
  dropzone_api_key: number = 667391383193948;
  dropzone_upload_preset: string = "d14i1hri";
  dropzone_folder_profile: string = "lfrn_employee_profile_pictures";
  dropzone_url: string = 'https://api.cloudinary.com/v1_1/hhn3yyryw/image/upload';
  dropzone_preview_url : string = 'https://res.cloudinary.com/hhn3yyryw/image/upload/v1510570699/';
  dropzone_maxFilesize: number = 50;
  dropzone_acceptedFiles: string = 'image/*';
  
  // Leave Constants
  ampm_am: string = 'AM';
  ampm_pm: string = 'PM';
  ampm_wholeday: string = 'W';
  leavetype_AL: string = 'AL';
  leavetype_SL: string = 'SL';
  leavetype_OTL: string = 'OTL';
  leavetype_HL: string = 'HL';
  leavetype_ML: string = 'ML';
  leavetype_MGL: string = 'MGL';
  leavetype_FL: string = 'FL';
  leavetype_OL: string = 'OL';
  
  leavetype_AL_long: string = 'Annual Leave';
  leavetype_SL_long: string = 'Sick Leave';
  leavetype_OTL_long: string = 'OT Leave';
  leavetype_HL_long: string = 'Health Leave';
  leavetype_ML_long: string = 'Maternity Leave';
  leavetype_MGL_long: string = 'Marriage Leave';
  leavetype_FL_long: string = 'Funeral Leave';
  leavetype_OL_long: string = 'Other Leave';
}