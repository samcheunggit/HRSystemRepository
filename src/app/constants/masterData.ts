import { Injectable } from "@angular/core";


@Injectable()
export class MasterData {
    
    // Gender
    genders = [{ id: 'M', value: 'Male'}, { id: 'F', value: 'Female'}];
    // Work Types
    worktypes = [{ id: 'F', value: 'Full Time'}, { id: 'P', value: 'Part Time'}, { id: 'T', value: 'Temporary'}];
    // Leave Types
    leavetypes = [{ id: 'AL', value: 'Annual Leave'}, { id: 'SL', value: 'Sick Leave'}, { id: 'OTL', value: 'Over Time Leave'}, 
                  { id: 'HL', value: 'Health Leave'}, { id: 'ML', value: 'Maternity Leave'}, { id: 'MGL', value: 'Marriage Leave'}, { id: 'FL', value: 'Funeral Leave'}, { id: 'OL', value: 'Other Leave'}];
    // AM /PM
    ampms = [{ id: 'AM', value: 'AM'}, { id: 'PM', value: 'PM'}, { id: 'W', value: 'Whole Day'}];
    // Leave Table
    leavetableCols = [
        { id: 'AL', title: 'Annual Leave', remains: 0},
        { id: 'SL', title: 'Sick Leave', remains: 0},
        { id: 'OTL', title: 'OT Leave', remains: 0},
    ];
    // User Types
    userTypes = [{id: 'admin', value: 'admin'}, {id: 'principle', value: 'principle'}, {id: 'secretary', value: 'secretary'}, {id: 'employee', value: 'employee'}];
    
}