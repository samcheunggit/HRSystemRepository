import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../services/authentication/authentication.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(
  private router: Router, 
  private authenticationService: AuthenticationService) { }

  ngOnInit() {
  }
  
  logout(){
    this.authenticationService.logout();
    this.router.navigate(['']);
    return false;
  }

}
