import { Component, OnInit, ViewEncapsulation, ChangeDetectorRef, EventEmitter, Input, Output } from '@angular/core';
import { AuthenticationService } from '../../../services/authentication/authentication.service';
import { LeaveService } from '../../../services/leave/leave.service';
import { MasterData } from '../../../constants/masterData';

@Component({
  selector: 'app-leavetable',
  templateUrl: './leavetable.component.html',
  styleUrls: ['./leavetable.component.css'],
  providers: [MasterData],
  encapsulation: ViewEncapsulation.None
})
export class LeavetableComponent implements OnInit {
  
  tableCols = this.masterData.leavetableCols
  
  @Output() onLeaveDataChanged = new EventEmitter<Object>();
  @Output() leaveId = new EventEmitter<String>();

  constructor(private authenticationService:AuthenticationService, 
              private leaveService: LeaveService,
              private masterData:MasterData,
              private cd: ChangeDetectorRef) { }

  ngOnInit() {
  }
  
  ngAfterViewInit(){
    this.getTableData();
  }
  
  getTableData(){
    let currentEmployeeId = this.authenticationService.getEmployeeIdFromLoginUser();
    
    this.leaveService.getLeavesByEmployeeId(currentEmployeeId).subscribe(
      (res) => {
          if(res.success){
            let defaultLeaveTableData = this.masterData.leavetableCols
            for (let value of defaultLeaveTableData) {
              if(value.id === "AL"){
                console.log("leave data: ",res.leave);
                value.remains = res.leave['annualleave']
              }
              if(value.id === "SL"){
                value.remains = res.leave['sickleave']
              }
              if(value.id === "OTL"){
                value.remains = res.leave['overtimeleave']
              }
            }
            console.log("leave object: ",res.leave);
            this.tableCols = defaultLeaveTableData
            this.cd.markForCheck();
            this.onLeaveDataChanged.emit(this.tableCols);
            this.leaveId.emit(res.leave['_id']);
          }
          else{
            console.log("add employee failed: "+res.message);
          }
      },
      error => {
          console.log("POST call in error", error);
      },
      ()=>{
      });
  }

}
