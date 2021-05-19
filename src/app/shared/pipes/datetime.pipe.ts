import { Pipe, PipeTransform } from "@angular/core";
import { NgbDate, NgbDateStruct } from "@ng-bootstrap/ng-bootstrap";
import * as moment from 'moment';

@Pipe({
    name: 'datePlaceholder'
})
export class DatePlaceholderPipe implements PipeTransform {

    transform(value: string): string {
        return "YYYY-MM-DD";
    }
}

@Pipe({
    name: 'ngbDateToUtcDateFormat'
})
export class NgbDateToUtcDateFormatPipe implements PipeTransform {

    transform(date: NgbDateStruct | NgbDate, format: string = 'YYYY-MM-DD'): string {
        if (date) {
            const dateMoment = moment.utc(`${date.year}-${date.month}-${date.day}`, 'YYYY-M-D');
            return dateMoment.isValid() ? dateMoment.format(format) : '';
        }
        return null;
    }
}

@Pipe({
    name: 'utcToDateFormat'
})
export class UtcToDateFormatPipe implements PipeTransform {
    timezone: string;
    dateFormat: string;

    constructor() {
        // this.timezone = this.userService.getPreference('timezone', defaultTimezone);
        this.dateFormat = "YYYY-MM-DD";
    }

    transform(dateTimeStr: string, timezone: boolean = true): string {
        if (dateTimeStr) {
            const dateTimeMoment = moment.utc(dateTimeStr);
            return dateTimeMoment.isValid()
                ? dateTimeMoment.format(this.dateFormat)
                // ? (timezone ? dateTimeMoment.tz(this.timezone).format(this.dateFormat) : dateTimeMoment.format(this.dateFormat))
                : '';
        }
        return '';
    }
}

@Pipe({
    name: 'statusNameFormat'
})
export class StatusNameFormat implements PipeTransform {

    transform(status: string): string {
        switch (status) {
            case "36e3b5b1-9b0d-11eb-970a-0242ac110002":
                status = "Waiting Employee";
                break;

            case "3b1bb6fd-9b0d-11eb-970a-0242ac110002":
                status = "Validating Fields";
                break;

            case "3f7813a0-9b0d-11eb-970a-0242ac110002":
                status = "Created";
                break;

            case "41dfc923-9b0d-11eb-970a-0242ac110002":
                status = "In Production";
                break;

            case "4465d449-9b0d-11eb-970a-0242ac110002":
                status = "Finished"
                break;
        }
        return status;
    }
}