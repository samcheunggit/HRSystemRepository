import { Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy, ViewChild, TemplateRef } from '@angular/core';
import { CalendarEvent, CalendarEventTitleFormatter } from 'angular-calendar';
import { startOfDay, endOfDay, subDays, addDays, endOfMonth, isSameDay, isSameMonth, addHours } from 'date-fns';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs/Subject';
import { SweetAlertService } from 'ngx-sweetalert2';
import { GlobalConstants } from '../../constants/globalConstants';
import { MasterData } from '../../constants/masterData';
import * as moment from 'moment';
import { forkJoin } from "rxjs/observable/forkJoin";
import { LeaveService } from '../../services/leave/leave.service';
import { AuthenticationService } from '../../services/authentication/authentication.service';
import { CustomEventTitleFormatter } from './custom-event-formatter';

const colors: any = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3'
  },
  blue: {
    primary: '#FF4500',
    secondary: '#FFD700'
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA'
  }
};

@Component({
  selector: 'app-leave',
  templateUrl: './leave.component.html',
  styleUrls: ['./leave.component.css'],
  providers: [
    GlobalConstants, MasterData, SweetAlertService,
    {
      provide: CalendarEventTitleFormatter,
      useClass: CustomEventTitleFormatter
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class LeaveComponent implements OnInit {
  
  view: string = 'month';

  viewDate: Date = new Date();
  
  activeDayIsOpen: boolean = false;
  
  showApplyForm: boolean = false;
  
  leaveData: any = null;
  
  leaveEvents: any = null;
  
  leaveId: string = null;
  
  public loading = false;
  
  // application form 
  form_leaveType: string;
  form_leavePeriod: string;
  form_ampm: string;
  form_remarks: string;

  // master data
  leavetypes = this.masterData.leavetypes;
  ampms = this.masterData.ampms;
  
  // calender variables
  
  // refresh calendar
  refresh: Subject<any> = new Subject();
  // events
  events: CalendarEvent[] = [];

  constructor(private swal:SweetAlertService, 
              private masterData:MasterData, 
              private globalConstants: GlobalConstants,
              private leaveService: LeaveService,
              private authenticationService:AuthenticationService) {}
  
  ngOnInit(){
    this.getLeaveDetailsByEmployeeId(this.getEmployeeId());
  }

  applyLeave(){
    this.showApplyForm = true;
    return false;
  }
  
  eventClicked({ event }: { event: CalendarEvent }): void {
    console.log('Event clicked', event);
  }

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    console.log("day clicked");
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
        this.viewDate = date;
      }
    }
  }

  applyForm(){
    // check if any required field is empty first
    if(!this.form_leaveType || !this.form_leavePeriod){
      this.swal.error({ title: 'Leave form is not completed!' });
    }
    else{
      let applyDay = this.confirmDays();
      let dateOverlap = this.isDatesOverlap();
      let currentLeaveType = null;
      let dateUnit = this.form_leaveType==='OTL'?"hours":"days"
      
      // get current leave type value from master data
      for (let leaveType of this.leavetypes) {
          if (leaveType.id===this.form_leaveType) {
              currentLeaveType = leaveType.value
          }
      }
      
      if(applyDay != 0 && !dateOverlap){
        this.swal.confirm({
          title: 'Check Days',
          html: '<div class="text-left">'+
                'Leave Type: '+currentLeaveType+
                '<br>Leave From: '+moment(this.form_leavePeriod.toString().split(',').shift()).format(this.form_leaveType==='OTL'?"DD-MM-YYYY HH:mmm":"DD-MMMM-YYYY")+
                '<br>Leave To: '+moment(this.form_leavePeriod.toString().split(',').pop()).format(this.form_leaveType==='OTL'?"DD-MM-YYYY HH:mmm":"DD-MMMM-YYYY")+
                '<br><p class="font-weight-bold">Total Leave Taken: '+applyDay+' '+dateUnit+'</p></div>'
        })
        .then(() => {
          // 1. Check leave type and corresponding days remain, 
          // if days remain > apply day, then perform update in leave table
          // else alert user do not have enough leaves
          let newRemainsDay = this.checkDays(this.form_leaveType, applyDay);
          if(newRemainsDay==0){
            this.swal.error({ title: 'You do not have enough leaves!' });
          }
          else{
            // 2. After checking and its valid, save all leave details in leaveDetails table
            let splitDates = this.splitLeavePeriod();
            this.saveLeaveAndLeaveDetails(applyDay, newRemainsDay, splitDates.leaveDateFrom, splitDates.leaveDateTo);
          }
        })
        .catch(() => console.log('canceled'));
      }
      else{
        this.swal.error({ title: 'Dates overlapped!' });
      }
    }
  }
  
  splitLeavePeriod(){
    let leavePeriod =this.form_leavePeriod.toString().split(',');
    let leaveFrom = moment(leavePeriod.shift());
    let leaveTo = moment(leavePeriod.pop());
    
    return {leaveDateFrom: leaveFrom, leaveDateTo: leaveTo}
  }
  
  isDatesOverlap(){
    let splitDates = this.splitLeavePeriod();
    let LeaveFromInput = splitDates.leaveDateFrom;
    let leaveToInput = splitDates.leaveDateTo;
    let result = false;

    for(let event of this.leaveEvents){
      let leaveFromOrigin = moment(event.leavefrom);
      let leaveToOrigin = moment(event.leaveto);
      result = ((LeaveFromInput.isSameOrBefore(leaveToOrigin)) && (leaveToInput.isSameOrAfter(leaveFromOrigin)));
    }
    return result
  }
  
  confirmDays(){
    
    let splitDates = this.splitLeavePeriod();
    let leaveFrom = splitDates.leaveDateFrom;
    let leaveTo = splitDates.leaveDateTo;
    let applyDay = 0;
    
    if(leaveFrom.isValid() && leaveTo.isValid()){
      let duration = moment.duration(leaveFrom.diff(leaveTo));
      if(this.form_leaveType === this.globalConstants.leavetype_OTL){
        applyDay = Math.abs(duration.asHours());
      }
      else{
        // round up day because date time picker will return 1 min difference in the same day
        // e.g. 22/11/2017 - 22/11/2017  will return 22/11/2017 12:00 - 22/11/2017 12:01
        applyDay = Math.round(Math.abs(duration.asDays()))+1;
        
        // AM/PM will take 0.5 day
        if(this.form_ampm == this.globalConstants.ampm_am || this.form_ampm == this.globalConstants.ampm_pm){
          applyDay = applyDay-0.5;
        }
      }
    }
    return applyDay;
  }
  
  checkDays(leaveType, appliedDay){
    let result = 0;
    for (let data of this.leaveData) {
      if (data.id===leaveType) {
            result = (data.remains>appliedDay)?(data.remains-appliedDay):0  
      }
    }
    return result
  }
  
  saveLeaveAndLeaveDetails(applyDay, newRemainsDay, leaveFrom, leaveTo){
    // Update LeaveTable: leaveId, updatedRemains, leaveType
    // Insert LeaveDetailsTable: leaveId, employeeId, leaveType, leaveFrom, leaveTo, remarks
    forkJoin([this.leaveService.saveLeave(this.leaveId, newRemainsDay, this.form_leaveType),
      this.leaveService.saveLeaveDetails(this.leaveId, this.getEmployeeId(), this.form_leaveType, leaveFrom, leaveTo, this.form_remarks)]).subscribe(
        results => {
        // result[0] is createLeave route, result[1] is registerLoginUser route
        if(results[0].success && results[1].success){
          this.swal.success({
            title: 'Application is sent successfully',
            html: "waiting for principal's approval...",
            showConfirmButton: false,
            timer: 3000
          }).catch(()=>{console.log("time out");});
        }
        else{
          console.log("save leave failed: "+results[0].message);
          console.log("save leave details failed: "+results[1].message);
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
        // empty all events in calendar then get a new event lists and get back to calendar again
        this.emptyCalendar();
        this.getLeaveDetailsByEmployeeId(this.getEmployeeId());
        this.showApplyForm = false;
    });
  }
  
  getLeaveDetailsByEmployeeId(employeeId){
    if(employeeId){
      this.loading = true;
       this.leaveService.getLeaveDetailsByEmployeeId(employeeId).subscribe(
        (res) => {
            if(res.success){
              console.log("success: ",res.leave);
              this.leaveEvents = res.leave;
              this.markEventOnCalender();
            }
            else{
              console.log("failed to get leave details: "+res.message);
            }
        },
        error => {
            console.log("POST call in error", error);
        },
        ()=>{
          this.loading =false;
        });
    }
  }
  
  markEventOnCalender(){
    if(this.leaveEvents){
      for(let event of this.leaveEvents){
        this.events.push({
          title: this.getleaveTypeTitle(event.leavetype),
          start: new Date(event.leavefrom),
          end: new Date(event.leaveto),
          color: {
            primary: '#FF4500',
            secondary: '#FFD700'
          }
        });
      }
      this.refresh.next();
    }
  }
  
  onLeaveDataChanged(event){
    console.log("leave data is changed", event);
    this.leaveData = event;
  }
  
  setLeaveId(event){
    console.log("leave id is changed", event);
    this.leaveId = event;
  }
  
  getEmployeeId(){
    return this.authenticationService.getEmployeeIdFromLoginUser();
  }
  
  emptyCalendar(){
    this.events = [];
    this.refresh.next();
  }
  
  getleaveTypeTitle(leaveType){
    let result = ""
    switch(leaveType){
      case this.globalConstants.leavetype_AL: result = this.globalConstants.leavetype_AL_long
      break;
      case this.globalConstants.leavetype_SL: result = this.globalConstants.leavetype_SL_long
      break;
      case this.globalConstants.leavetype_OTL: result = this.globalConstants.leavetype_OTL_long
      break;
      case this.globalConstants.leavetype_HL: result = this.globalConstants.leavetype_HL_long
      break;
      case this.globalConstants.leavetype_ML: result = this.globalConstants.leavetype_ML_long
      break;
      case this.globalConstants.leavetype_MGL: result = this.globalConstants.leavetype_MGL_long
      break;
      case this.globalConstants.leavetype_FL: result = this.globalConstants.leavetype_FL_long
      break;
      case this.globalConstants.leavetype_OL: result = this.globalConstants.leavetype_OL_long
      break;
      default: ""
      break;
    }
    return result 
  }
  
}
