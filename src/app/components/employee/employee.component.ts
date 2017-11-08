import { Component, OnInit } from '@angular/core';
import { EmployeeService } from '../../services/employee/employee.service';
import { LoginService } from '../../services/login/login.service';
import { GlobalConstants } from '../../constants/globalConstants';
import { DataTableResource } from 'angular-4-data-table-bootstrap-4';
import { AuthenticationService } from '../../services/authentication/authentication.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SweetAlertService } from 'ngx-sweetalert2';
import * as moment from 'moment';
import { forkJoin } from "rxjs/observable/forkJoin";

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css'],
  providers: [GlobalConstants, SweetAlertService]
})
export class EmployeeComponent implements OnInit {
  
  employeeForm: FormGroup;
  showForm : boolean = false;
  showTable : boolean = false;
  dateVisibilityControl : boolean = true;
  employee : any;
  allEmployees : any;
  genders = [{ id: 'M', value: 'Male'}, { id: 'F', value: 'Female'}];
  worktypes = [{ id: 'F', value: 'Full Time'}, { id: 'P', value: 'Part Time'}, { id: 'T', value: 'Temporary'}];

  items = [];
  itemCount = 0;
  itemResource:any;
  
  constructor(
  private employeeService: EmployeeService,
  private loginService: LoginService,
  private globalConstants: GlobalConstants,
  private authenticationService:AuthenticationService,
  private formBuilder:FormBuilder,
  private swal:SweetAlertService) {}

  ngOnInit() {

    this.buildEmployeeForm();

    this.getFormData(this.getCurrentUserType());
  }
  
  getCurrentUserType(){
    return this.authenticationService.getUserTypeFromLoginUser();
  }
  
  getFormData(userType){
     if(userType == this.globalConstants.admin_usertype ||
       userType == this.globalConstants.secretary_usertype ||
       userType == this.globalConstants.principal_usertype){
          // hide employee form at first
          this.showForm = false;
          // get employee by subscribe the observable in service
          this.employeeService.getAllEmployees().subscribe(
            result =>{
              this.allEmployees = result.employees;
              console.log("result : "+JSON.stringify(this.allEmployees));
              this.initDataTable();
            },
            error =>{
              console.log("get employees failed: "+error.message);
              return false;
          });
       }
    else{
      // get employee by subscribe the observable in service
      this.employeeService.getEmployeeById().subscribe(
        profile =>{
          this.employee = profile.employee;
          
          console.log("employee worktype: "+this.employee.worktype);
        },
        error =>{
          console.log("get employee failed: "+error.message);
          return false;
        },
        () =>{this.showForm = true;});
    }
  }
  
  initDataTable(){
    this.itemResource = new DataTableResource(this.allEmployees);
    this.itemResource.count().then(count => this.itemCount = count);
    this.showTable = true;
    this.reloadItems(JSON.parse('{"offset":0,"limit":'+(this.itemCount>10?10:this.itemCount)+'}'));
  }

  reloadItems(params) {
      this.itemResource.query(params).then(items => this.items = items);
  }

  rowClick(rowEvent) {
    this.employee = rowEvent.row.item;
    
    this.showForm = true;
    
    this.employeeForm.enable();
    
    this.dateVisibilityControl = false;
    
    this.updateEmployeeFormModel(this.employee);
  }
  
  buildEmployeeForm(){
    this.employeeForm = this.formBuilder.group({
      id: [null],
      title: [null, Validators.required],
      worktype: [null, Validators.required],
      dateofjoin:[null, Validators.required],
      isactive: [null],
      fullname: [null, Validators.required],
      birthday: [null, Validators.required],
      telno: [null, Validators.required],
      gender: [null, Validators.required],
      address: [null, Validators.required],
      ecname: [null, Validators.required],
      ectelno: [null, Validators.required],
      ecrelation: [null, Validators.required]
    });
    
    this.employeeForm.disable();
    
    this.employeeForm.valueChanges.subscribe(data => {
//       console.log('Form changes'+JSON.stringify(data))
    })
  }
  
  clearForm(){
    this.employeeForm.reset();
    // get all date picker element and empty their value, 
    // because they cannot be cleaned through resetting the form
    // let datepickerList = document.querySelectorAll('.datepicker-actions__input');
    // for (let i = 0, element; (element = datepickerList[i]); i++) {
    //     element.value = "";
    // }
  }
  
  formateDate(date: string){
    return moment(date).format("YYYY-MM-DD");
  }
  
  addNewEmployeeForm(){
    this.clearForm();
    this.showForm = true;
    this.employeeForm.enable();
    this.dateVisibilityControl = false;
    return false;
  }
  
  hideAndCleanForm(){
    this.clearForm();
    this.showForm = false;
  }
  
  updateEmployeeFormModel(employee){

    this.employeeForm.patchValue({
      id: employee._id,
      title: employee.title,
      worktype: employee.worktype,
      dateofjoin: this.formateDate(employee.dateofjoin),
      isactive: employee.isactive,
      fullname: employee.fullname,
      birthday: this.formateDate(employee.birthday),
      telno: employee.telno,
      gender: employee.gender,
      address: employee.address,
      ecname: employee.ecname,
      ectelno: employee.ectelno,
      ecrelation: employee.ecrelation
    });

  }

  deleteEmployee(employee){
    
    this.swal.confirm({
      title: 'Are you sure',
      text: 'to delete employee '+employee.fullname+' and related login account?'
    })
    .then(() => {
      // subscribe two observables in parallel
      forkJoin([this.employeeService.deleteEmployee(employee._id), this.loginService.deleteLoginUserByEmployeeId(employee._id)]).subscribe(
        results => {
        // result[0] is deleteEmploye route, result[1] is deleteLoginUser route
        if(results[0].success && results[1].success){
          this.getFormData(this.getCurrentUserType());
          this.swal.success({
                title: 'Deleted successfully',
                showConfirmButton: false,
                timer: 1500
              }).catch(()=>{console.log("time out");});
        }
        else{
          console.log("deleted failed - employe return message: "+results[0].message);
          console.log("deleted failed - login user return message: "+results[1].message);
              this.swal.error({
                title: 'Deleted Failed',
                html: 'Please contact IT support: <br>'
              });
        }
      },
      error => {
        console.log("POST call in error", error);
        this.swal.error({
          title: 'Deleted Failed',
          html: 'Please contact IT support: <br>'
        });
      },
      ()=>{
        this.addNewEmployeeForm();
      });
    })
    .catch(() => console.log('canceled'));

    return false;
  }
  
  saveEmployee(employee){
    // update employee
    if (this.employeeForm.valid && this.employeeForm.controls.id.value) {
        this.employeeService.updateEmployee(employee).subscribe(
        (res) => {
            if(res.success){
              this.getFormData(this.getCurrentUserType());
              this.swal.success({
                title: 'Saved successfully',
                showConfirmButton: false,
                timer: 1500
              }).catch(()=>{console.log("time out");});
            }
            else{
              console.log("update employee failed: "+res.message);
              this.swal.error({
                title: 'Save Failed',
                html: 'Please contact IT support: <br>'+res.message
              });
            }
        },
        error => {
            console.log("POST call in error", error);
        },
        ()=>{
          this.addNewEmployeeForm();
        });
    }
    // add employee
    if (this.employeeForm.valid && !this.employeeForm.controls.id.value) {
        this.employeeService.addEmployee(employee).subscribe(
        (res) => {
            if(res.success){
              this.getFormData(this.getCurrentUserType());
              this.addNewLoginUser(res.employee);
            }
            else{
              console.log("add employee failed: "+res.message);
              this.swal.error({
                title: 'Save Failed',
                html: 'Please contact IT support: <br>'+res.message
            });
            }
        },
        error => {
            console.log("POST call in error", error);
        },
        ()=>{
          this.addNewEmployeeForm();
        });
    }
  }
  
  addNewLoginUser(newAddedEmployee){
    this.loginService.registerLoginUser(newAddedEmployee).subscribe(
        (res) => {
            if(res.success){
                this.swal.success({
                  title: 'Save successfully',
                  text: "Login Account is created as well and sent the password to employee's email",
                  showConfirmButton: false,
                  timer: 3000
                }).catch(()=>{console.log("time out");});
            }
            else{
              console.log("add login user failed: "+res.message);
              console.log("add new login user failed: ");
                this.swal.error({
                  title: 'Save Failed',
                  html: 'Please contact IT support: <br>'+res.message
                });
            }
        },
        error => {
            console.log("POST call in error", error);
            console.log("add new login user failed: ");
                this.swal.error({
                  title: 'Save Failed',
                  html: 'Please contact IT support: <br>'+error
                });
        },
        () =>{
          this.addNewEmployeeForm();
        });
  }
}
