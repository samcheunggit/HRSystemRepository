import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { DataTable, DataTableResource } from 'angular-4-data-table-bootstrap-4';
import { LeaveManagementService } from '../../services/leaveManagement/leave-management.service';
import { SweetAlertService } from 'ngx-sweetalert2';

@Component({
  selector: 'app-leave-management',
  templateUrl: './leave-management.component.html',
  styleUrls: ['./leave-management.component.css'],
  providers: [SweetAlertService],
  encapsulation: ViewEncapsulation.None
})
export class LeaveManagementComponent implements OnInit {

  employeeName: string = "";
  public loading = false;
  lmResource:any;
  leaveTableData: any;
  lm = [];
  lmCount = 0;

    @ViewChild(DataTable) lmTable: DataTable;

    constructor(private leaveManagementService:LeaveManagementService, private swal:SweetAlertService) {
        
    }
    
    ngOnInit() {
      this.getAllLeaves();
    }

    reloadLMData(params) {
      if(this.lmResource)
        this.lmResource.query(params).then(items => this.lm = items);
    }

    rowClicked(row) {
        console.log("row item: ",row);
        this.saveAllLeaves(row);
        return false;
    }
    
    saveAllLeaves(allLeaves){
      this.loading =  true;
      // get leave management table data
      this.leaveManagementService.saveAllLeaves(allLeaves).subscribe(
        result =>{
          console.log("save result: ", result);
          if(result.success){
            this.getAllLeaves();
            this.swal.success({
                title: 'Saved successfully',
                showConfirmButton: false,
                timer: 1500
              }).catch(()=>{console.log("time out");});
          }
        },
        error =>{
          console.log("save leaves table data failed: "+error.message);
          this.swal.error({
                title: 'Saved Failed',
                html: 'Please contact IT support: <br>'
              });
          return false;
        },
        ()=>{
        }
      );
    }
    
    getAllLeaves(){
      this.loading =  true;
      // get leave management table data
      this.leaveManagementService.getAllLeaves().subscribe(
        result =>{
          this.leaveTableData = result.leaveTableData;
          this.initDataTable();
        },
        error =>{
          console.log("get leaves table data failed: "+error.message);
          return false;
        },
        ()=>{
        }
      );
    }
    
    initDataTable(){
      this.lmResource = new DataTableResource(this.leaveTableData);
      this.lmResource.count().then(count => this.lmCount = count);
      this.reloadLMData(JSON.parse('{"offset":0,"limit":'+(this.lmCount>10?10:this.lmCount)+'}'));
      this.loading =  false;
  }
}
