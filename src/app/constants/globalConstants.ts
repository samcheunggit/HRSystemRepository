import { Injectable } from "@angular/core";


@Injectable()
export class GlobalConstants {
  
  // User type Constants
  admin_usertype: string = 'admin';
  principal_usertype: string = 'principal';
  secretary_usertype: string = 'secretary';
  employee_usertype: string = 'employee';
  
  //Dropzone Constants
  dropzone_api_key: number = 667391383193948;
  dropzone_upload_preset: string = "d14i1hri";
  dropzone_folder_profile: string = "lfrn_employee_profile_pictures";
  dropzone_url: string = 'https://api.cloudinary.com/v1_1/hhn3yyryw/image/upload';
  dropzone_preview_url : string = 'https://res.cloudinary.com/hhn3yyryw/image/upload/v1510570699/';
  dropzone_maxFilesize: number = 50;
  dropzone_acceptedFiles: string = 'image/*';
}