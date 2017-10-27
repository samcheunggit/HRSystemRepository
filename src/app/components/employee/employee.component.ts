import { Component, OnInit } from '@angular/core';
import { EmployeeService } from '../../services/employee/employee.service';
import { GlobalConstants } from '../../constants/globalConstants';
import { DataTableResource } from 'angular-4-data-table-bootstrap-4';
import { AuthenticationService } from '../../services/authentication/authentication.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css'],
  providers: [GlobalConstants]
})
export class EmployeeComponent implements OnInit {
  
  employeeForm: FormGroup;
  
  showTable : boolean = false;
  employee : any;
  allEmployees : any;
  genders = [{ id: 'M', value: 'Male'}, { id: 'F', value: 'Female'}];
  worktypes = [{ id: 'F', value: 'Full Time'}, { id: 'P', value: 'Part Time'}, { id: 'T', value: 'Temporary'}];
  
  items = [];
  itemCount = 0;
  itemResource:any;
  
  constructor(
  private employeeService: EmployeeService,
  private globalConstants: GlobalConstants,
  private authenticationService:AuthenticationService,
  private formBuilder:FormBuilder) {}

  ngOnInit() {
    let userType = this.authenticationService.getUserTypeFromLoginUser();
    console.log("user type: "+userType);
    
    this.buildEmployeeForm();
    
    if(userType == this.globalConstants.admin_usertype ||
       userType == this.globalConstants.secretary_usertype ||
       userType == this.globalConstants.principal_usertype){
      
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
        },
        error =>{
          console.log("get employee failed: "+error.message);
          return false;
      });
    }
  }
  
  initDataTable(){
    this.itemResource = new DataTableResource(this.allEmployees);
    this.itemResource.count().then(count => this.itemCount = count);
    this.showTable = true;
  }

  reloadItems(params) {
      this.itemResource.query(params).then(items => this.items = items);
  }

  rowClick(rowEvent) {
    this.employee = rowEvent.row.item;
    
    this.employeeForm.enable();
    
    this.updateEmployeeFormModel(this.employee);
  }
  
  buildEmployeeForm(){
    this.employeeForm = this.formBuilder.group({

      title: [null, Validators.required],
      worktype: [null, Validators.required],
      dateofjoin: [null, Validators.required],
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
//       console.log('Form changes', data)
    })
  }
  
  clearForm(){
    this.employeeForm.reset();
    return false;
  }
  
  formateDate(date: string){
    return moment(date).format("YYYY-MM-DD");
  }
  
  addNewEmployeeForm(){
    this.clearForm();
    this.employeeForm.enable();
    return false;
  }
  
  updateEmployeeFormModel(employee){

    this.employeeForm.patchValue({
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
    console.log("deleted employee: "+JSON.stringify(employee));
    return false;
  }
  
  saveEmployee(employee){
    console.log("Form called! "+JSON.stringify(employee));
    if (this.employeeForm.valid) {
    console.log("Form Submitted!");
    }
  }
}
