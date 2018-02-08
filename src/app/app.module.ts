/*  Modules  */
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes} from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { DataTableModule } from 'angular-4-data-table-bootstrap-4';
import { MyDatePickerModule } from 'mydatepicker';
import { DropzoneModule } from 'ngx-dropzone-wrapper';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { LoadingModule } from 'ngx-loading';
import { CalendarModule } from 'angular-calendar';
import { DateTimePickerModule } from 'ng-pick-datetime';


import * as $ from 'jquery';

/* Intercepter */
import { TokenInterceptor } from './services/authentication/tokenInterceptor';

/*  Components  */
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { EmployeeComponent } from './components/employee/employee.component';
import { LeaveComponent } from './components/leave/leave.component';
import { ImageDropzoneComponent } from './components/employee/image-dropzone/image-dropzone.component';
import { LeavetableComponent } from './components/leave/leavetable/leavetable.component';
import { LeaveManagementComponent } from './components/leave-management/leave-management.component';
import { UserManagementComponent } from './components/user-management/user-management.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';

/*  Services  */
import { AuthenticationService } from './services/authentication/authentication.service';
import { EmployeeService } from './services/employee/employee.service';
import { LoginService } from './services/login/login.service';
import { LeaveService } from './services/leave/leave.service';
import { LeaveManagementService } from './services/leaveManagement/leave-management.service';
import { UserManagementService } from './services/userManagement/user-management.service';

/* Guards */
import { AuthGuard } from './guards/authGuard';








const DROPZONE_CONFIG: DropzoneConfigInterface = {
  // Change this to your upload POST address:
  url: 'https://api.cloudinary.com/v1_1/hhn3yyryw/image/upload',
  maxFilesize: 50,
  maxFiles: 1,
  addRemoveLinks: true,
  clickable: true,
  acceptedFiles: 'image/*'
};

const appRoutes: Routes = [
  {path:'', component:LoginComponent},
  {path:'home', component:HomeComponent, canActivate: [AuthGuard]},
  {path:'employee', component:EmployeeComponent, canActivate: [AuthGuard]},
  {path:'leave', component:LeaveComponent, canActivate: [AuthGuard]},
  {path:'leave-management', component:LeaveManagementComponent, canActivate: [AuthGuard]},
  {path:'user-management', component:UserManagementComponent, canActivate: [AuthGuard]},
  // do not need to guard reset password page
  {path:'reset-password/:token', component:ResetPasswordComponent}
]

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    NavbarComponent,
    EmployeeComponent,
    ImageDropzoneComponent,
    LeaveComponent,
    LeavetableComponent,
    LeaveManagementComponent,
    UserManagementComponent,
    ResetPasswordComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(appRoutes),
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    DataTableModule,
    MyDatePickerModule,
    DropzoneModule.forRoot(DROPZONE_CONFIG),
    LoadingModule,
    CalendarModule.forRoot(),
    DateTimePickerModule
  ],
  providers: [
    AuthenticationService, 
    AuthGuard, 
    EmployeeService,
    LoginService,
    LeaveService,
    LeaveManagementService,
    UserManagementService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
