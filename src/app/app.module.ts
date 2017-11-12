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
import { DROPZONE_CONFIG } from 'ngx-dropzone-wrapper';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';

import * as $ from 'jquery';

/* Intercepter */
import { TokenInterceptor } from './services/authentication/tokenInterceptor';

/*  Components  */
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { EmployeeComponent } from './components/employee/employee.component';

/*  Services  */
import { AuthenticationService } from './services/authentication/authentication.service';
import { EmployeeService } from './services/employee/employee.service';
import { LoginService } from './services/login/login.service';

/* Guards */
import { AuthGuard } from './guards/authGuard';

const DEFAULT_DROPZONE_CONFIG: DropzoneConfigInterface = {
 // Change this to your upload POST address:
  // url: 'https://httpbin.org/post',
  maxFilesize: 50,
  acceptedFiles: 'image/*'
};

const appRoutes: Routes = [
  {path:'', component:LoginComponent},
  {path:'home', component:HomeComponent, canActivate: [AuthGuard]},
  {path:'employee', component:EmployeeComponent, canActivate: [AuthGuard]}
]

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    NavbarComponent,
    EmployeeComponent
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
    DropzoneModule
  ],
  providers: [
    AuthenticationService, 
    AuthGuard, 
    EmployeeService,
    LoginService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    },
    {
      provide: DROPZONE_CONFIG,
      useValue: DEFAULT_DROPZONE_CONFIG
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
