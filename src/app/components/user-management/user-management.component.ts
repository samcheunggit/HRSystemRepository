import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { UserManagementService } from '../../services/userManagement/user-management.service';
import { DataTable, DataTableResource } from 'angular-4-data-table-bootstrap-4';
import { MasterData } from '../../constants/masterData';
import { SweetAlertService } from 'ngx-sweetalert2';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css'],
  providers: [MasterData, SweetAlertService],
  encapsulation: ViewEncapsulation.None
})
export class UserManagementComponent implements OnInit {

  public loading = false;
  
  userResource:any;
  userTableData: any;
  user = [];
  userCount = 0;
  
  userTypes = this.masterData.userTypes;
  
   @ViewChild(DataTable) userTable: DataTable;
  
  constructor(private userManagementService:UserManagementService, private masterData: MasterData, private swal:SweetAlertService) { }

  ngOnInit() {
    this.getAllUsers();
  }
  
  reloadUserData(params) {
    if(this.userResource)
      this.userResource.query(params).then(items => this.user = items);
  }

  rowClicked(row) {
    console.log("row item: ",row);
    this.saveUserDetails(row);
    return false;
  }
  
  getAllUsers(){
    this.loading =  true;
    // get user management table data
    this.userManagementService.getAllUsers().subscribe(
      result =>{
        this.userTableData = result.users;
        this.initDataTable();
      },
      error =>{
        console.log("get users table data failed: "+error.message);
        return false;
      },
      ()=>{
        this.loading =  false;
      }
    );
  }
  
  initDataTable(){
    this.userResource = new DataTableResource(this.userTableData);
    this.userResource.count().then(count => this.userCount = count);
    this.reloadUserData(JSON.parse('{"offset":0,"limit":'+(this.userCount>10?10:this.userCount)+'}'));
    this.loading =  false;
  }
  
  saveUserDetails(user){
    this.loading =  true;
    // get user management table data
    this.userManagementService.saveUserDetails(user).subscribe(
      result =>{
        console.log("save user details result: ",result);
        this.swal.success({
                title: 'Saved successfully',
                showConfirmButton: false,
                timer: 1500
              }).catch(()=>{console.log("time out");});
      },
      error =>{
        console.log("save user details failed: "+error.message);
        this.swal.error({
                title: 'Saved Failed',
                html: 'Please contact IT support: <br>'+error.message
              });
        return false;
      },
      ()=>{
        this.loading =  false;
      }
    );
  }
  
  // sendEmailTest(){
  //   this.userManagementService.sendEmailTest().subscribe(
  //     result =>{
  //       console.log("send email test result: ",result);
  //     },
  //     error =>{
  //       console.log("send email failed: "+error.message);
  //       return false;
  //     },
  //     ()=>{
  //     }
  //   );
  //   return false;
  // }

}
