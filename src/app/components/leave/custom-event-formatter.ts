import { LOCALE_ID, Inject } from '@angular/core';
import { CalendarEventTitleFormatter, CalendarEvent } from 'angular-calendar';
import * as moment from 'moment';


export class CustomEventTitleFormatter extends CalendarEventTitleFormatter {
  constructor(@Inject(LOCALE_ID) private locale: string) {
    super();
  }

  // you can override any of the methods defined in the parent class

  month(event: CalendarEvent): string {
    if(event.title === 'OT Leave'){
          return `${event.title}  <b>${moment(event.start).format('DD/MM/YYYY hh:mm A')} - ${moment(event.end).format('DD/MM/YYYY hh:mm A')}</b>`;
      }
      else{
          return `${event.title}  <b>${moment(event.start).format('DD/MM/YYYY')} - ${moment(event.end).format('DD/MM/YYYY')}</b>`;
      }
  }
}