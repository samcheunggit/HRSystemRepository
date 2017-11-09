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
    MyDatePickerModule
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
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
