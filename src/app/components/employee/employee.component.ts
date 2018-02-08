import { Component, OnInit, ViewChild, ElementRef, EventEmitter, Input, Output } from '@angular/core';
import { EmployeeService } from '../../services/employee/employee.service';
import { LoginService } from '../../services/login/login.service';
import { LeaveService } from '../../services/leave/leave.service';
import { GlobalConstants } from '../../constants/globalConstants';
import { MasterData } from '../../constants/masterData';
import { DataTableResource } from 'angular-4-data-table-bootstrap-4';
import { AuthenticationService } from '../../services/authentication/authentication.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SweetAlertService } from 'ngx-sweetalert2';
import * as moment from 'moment';
import { forkJoin } from "rxjs/observable/forkJoin";
import {IMyDpOptions} from 'mydatepicker';
import { ImageDropzoneComponent } from './image-dropzone/image-dropzone.component'; 

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css'],
  providers: [GlobalConstants, MasterData, SweetAlertService]
})
export class EmployeeComponent implements OnInit {
  
  @ViewChild(ImageDropzoneComponent) child:ImageDropzoneComponent;

  public myDatePickerOptions: IMyDpOptions = {
        // other options...
        dateFormat: 'dd-mmm-yyyy',
        showTodayBtn: true,
        monthSelector: true,
        yearSelector: true
    };

  public loading = false;
  employeeForm: FormGroup;
  showForm : boolean = false;
  showTable : boolean = false;
  employee : any;
  allEmployees : any;
  genders = this.masterData.genders;
  worktypes = this.masterData.worktypes;

  items = [];
  itemCount = 0;
  itemResource:any;
  uploadImageDone:boolean = true;
  
  constructor(
  private employeeService: EmployeeService,
  private loginService: LoginService,
  private leaveService: LeaveService,
  private globalConstants: GlobalConstants,
  private masterData: MasterData,
  private authenticationService:AuthenticationService,
  private formBuilder:FormBuilder,
  private swal:SweetAlertService) {}

  ngOnInit() {

    this.buildEmployeeForm();

    this.getFormData();
  }
  
  getFormData(){
    this.loading = true;
     if(!this.authenticationService.isNormalEmployee()){
          // hide employee form at first
          this.showForm = false;
          // get employee by subscribe the observable in service
          this.employeeService.getAllEmployees().subscribe(
            result =>{
              this.allEmployees = result.employees;
              this.initDataTable();
            },
            error =>{
              console.log("get employees failed: "+error.message);
              return false;
            },
            ()=>{
              this.loading = false;
            }
          );
       }
    else{
      // get employee by subscribe the observable in service
      this.employeeService.getEmployeeById().subscribe(
        profile =>{
          this.employee = profile.employee;
          this.updateEmployeeFormModel(this.employee);
        },
        error =>{
          console.log("get employee failed: "+error.message);
          return false;
        },
        () =>{
          this.showForm = true;
          this.loading = false;
        });
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
    
    this.updateEmployeeFormModel(this.employee);
  }
  
  buildEmployeeForm(){
    this.employeeForm = this.formBuilder.group({
      id: [null],
      profilepic: [null],
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
      // console.log('Form changes'+JSON.stringify(data))
    })
  }
  
  clearForm(){
    // set employee object to null, because reset the form the employee object is still exist
    this.employee = null;
    this.employeeForm.reset();
    if(this.child){
      this.child.resetDropZone();
    }
    // reset form cannot mark date picker as pristine
    this.employeeForm.controls.dateofjoin.markAsPristine();
    this.employeeForm.controls.birthday.markAsPristine();
  }
  
  addNewEmployeeForm(){
    this.clearForm();
    this.showForm = true;
    this.employeeForm.enable();
    return false;
  }
  
  updateEmployeeFormModel(employee){
    
    let dateofjoin_employee = new Date(employee.dateofjoin);
    let birthday_employee = new Date(employee.birthday);

    this.employeeForm.patchValue({
      id: employee._id,
      profilepic: employee.profilepic,
      title: employee.title,
      worktype: employee.worktype,
      dateofjoin: {
        date:{
          year: dateofjoin_employee.getFullYear(),
          month: dateofjoin_employee.getMonth() + 1,
          day: dateofjoin_employee.getDate()}
      },
      isactive: employee.isactive,
      fullname: employee.fullname,
      birthday: {
        date:{
          year: birthday_employee.getFullYear(),
          month: birthday_employee.getMonth() + 1,
          day: birthday_employee.getDate()}
      },
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
      this.loading = true;
      // subscribe two observables in parallel
      forkJoin([this.employeeService.deleteEmployee(employee._id),
                this.loginService.deleteLoginUserByEmployeeId(employee._id),
                this.employeeService.deleteEmployeeProfile(employee.profilepic),
                this.leaveService.deleteLeaveByEmployeeId(employee._id),
                this.leaveService.deleteLeaveDetailsByEmployeeId(employee._id)]).subscribe(
        results => {
        // result[0] is deleteEmploye route, result[1] is deleteLoginUser route
        if(results[0].success && results[1].success &&
          results[2].success && results[3].success &&
          results[4].success){
          this.getFormData();
          this.swal.success({
                title: 'Deleted successfully',
                showConfirmButton: false,
                timer: 1500
              }).catch(()=>{console.log("time out");});
        }
        else{
          console.log("deleted failed - employe return message: "+results[0].message);
          console.log("deleted failed - login user return message: "+results[1].message);
          console.log("deleted failed - employe profile pic return message: "+results[2].message);
          console.log("deleted failed - Leave return message: "+results[3].message);
          console.log("deleted failed - Leave Details return message: "+results[4].message);
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
        this.loading = false;
      });
    })
    .catch(() => console.log('canceled'));

    return false;
  }
  
  dateObjToJSDate(dateObj){
    return moment(new Date(dateObj.date.year, dateObj.date.month, dateObj.date.day)).format('MM/DD/YYYY');
  }
  
  saveEmployee(employee){
    
    this.loading = true;
    // retrieve and set date from date object first
    employee.dateofjoin = this.dateObjToJSDate(employee.dateofjoin);
    employee.birthday =  this.dateObjToJSDate(employee.birthday);
    // update employee
    if (this.employeeForm.valid && this.employeeForm.controls.id.value) {
      forkJoin([this.employeeService.updateEmployee(employee),
                  this.leaveService.updateEmployeeNameForLeave(employee.fullname, employee.id)]).subscribe(
          results => {
          // result[0] is updateEmployee route, result[1] is updateEmployeeNameForLeave route
          if(results[0].success && results[1].success){
            this.getFormData();
                this.swal.success({
                  title: 'Saved successfully',
                  showConfirmButton: false,
                  timer: 1500
                }).catch(()=>{console.log("time out");});
          }
          else{
            console.log("update employee failed: "+results[0].message);
            console.log("update employee failed: "+results[1].message);
                this.swal.error({
                  title: 'Save Failed',
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
          this.loading = false;
        });
    }
    // add employee
    if (this.employeeForm.valid && !this.employeeForm.controls.id.value) {
      
      // ask for new employee email for creating login account
      this.swal.confirm({
        title: 'Please enter employee email for registration',
        input: 'email',
        showCancelButton: true,
        confirmButtonText: 'Submit',
        showLoaderOnConfirm: true,
        allowOutsideClick: false
      }).then((email) => {
        if (email) {
          this.employeeService.addEmployee(employee).subscribe(
            (res) => {
                if(res.success){
                  this.getFormData();
                  // add email property to newly created employee for login table
                  let newAddedEmployee = res.employee;
                  newAddedEmployee['email'] = email;
                  this.addLoginUserAndCreateLeave(newAddedEmployee);
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
      }).catch(() => {
        this.loading = false;
        console.log('canceled')
        });
    }
  }
  
  addLoginUserAndCreateLeave(newAddedEmployee){
    // subscribe two observables in parallel
      forkJoin([this.leaveService.createLeave(newAddedEmployee),
                this.loginService.registerLoginUser(newAddedEmployee)]).subscribe(
        results => {
        // result[0] is createLeave route, result[1] is registerLoginUser route
        if(results[0].success && results[1].success){
          this.swal.success({
            title: 'Save successfully',
            text: "Login Account is created as well and sent the password to employee's email",
            showConfirmButton: false,
            timer: 3000
          }).catch(()=>{console.log("time out");});
        }
        else{
          console.log("create leave failed: "+results[0].message);
          console.log("add login user failed: "+results[1].message);
          this.swal.error({
            title: 'Save Failed',
            html: 'Please contact IT support: <br>'+results[0].message+'<br>'+results[1].message
          });
        }
      },
      error => {
        console.log("POST call in error", error);
        this.swal.error({
          title: 'Save Failed',
          html: 'Please contact IT support: <br>'+error
        });
      },
      ()=>{
        this.addNewEmployeeForm();
        this.loading = false;
      });
  }

  onPublicIdChanged(event){
    console.log("parent employee public id changed: ",event);
    this.employeeForm.patchValue({profilepic: event});
  }
  
  isUploadImageDone(event){
    console.log("parent upload image done: ",event);
    this.uploadImageDone = event;
  }
}
