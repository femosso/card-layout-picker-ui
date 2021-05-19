import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { faAngleDown, faAngleUp, faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import { NgbDate, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import { NgbDateToUtcDateFormatPipe } from 'src/app/shared/pipes/datetime.pipe';

import { Order, OrderStatus } from 'src/app/_models/order';
import { User } from 'src/app/_models/user';
import { AuthService } from 'src/app/_services/auth.service';
import { NotificationService } from 'src/app/_services/notification.service';
import { OrderService, SearchTerm } from 'src/app/_services/order.service';
import { NgbdSortableHeader, SortEvent } from '../../shared/table/sortable.directive';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
})
export class OrderListComponent implements OnInit {
  iconCalendar = faCalendarAlt;
  iconMinimize = faAngleUp;
  iconMaximize = faAngleDown;

  user: User;

  orders$: Observable<Order[]>;
  total$: Observable<number>;
  selectAll: boolean;

  @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;

  searchForm: FormGroup;
  form: FormGroup;

  today = new Date();
  calendarMaxDate: NgbDateStruct = { year: this.today.getFullYear(), month: this.today.getMonth() + 1, day: this.today.getDate() };
  fromDate: NgbDate;
  toDate: NgbDate;

  statusTypes: OrderStatus[] = [];
  loadingSubmit = false;

  constructor(
    public service: OrderService,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private notificationService: NotificationService,
    private ngbDateToUtcDateFormat: NgbDateToUtcDateFormatPipe,
  ) {
    this.authService.user.subscribe(x => this.user = x);

    this.orders$ = service.orders$;
    this.total$ = service.total$;
  }

  ngOnInit(): void {
    this.searchForm = this.formBuilder.group({
      name: [''],
      statusId: [''],
      fromDate: [''],
      toDate: ['']
    });

    this.form = this.formBuilder.group({

    });

    this.service.getStatusTypes()
      .pipe(first())
      .subscribe(statusTypes => {
        this.statusTypes = statusTypes;
      });
  }

  onSort({ column, direction }: SortEvent) {
    // resetting other headers
    this.headers.forEach(header => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });

    this.service.sortColumn = column;
    this.service.sortDirection = direction;
  }

  onSearch() {
    // stop here if form is invalid
    if (this.searchForm.invalid) {
      return;
    }

    let searchTerms: SearchTerm[] = [];
    searchTerms.push({ name: "name", value: this.searchForm.value.name });
    searchTerms.push({ name: "statusId", value: this.searchForm.value.statusId });

    this.service.searchTerms = searchTerms;
    this.service.toDate = this.ngbDateToUtcDateFormat.transform(this.searchForm.value.toDate);
    this.service.fromDate = this.ngbDateToUtcDateFormat.transform(this.searchForm.value.fromDate);
  }

  clearFilter() {
    this.searchForm.reset();
    this.onSearch();
  }

  isRole(role: string) {
    //return this.user.role == role;
    return true;
  }

  checkUncheckAll() {
    this.orders$.subscribe(orders => {
      for (var i = 0; i < orders.length; i++) {
        orders[i].checked = this.selectAll;
      }
    });
  }

  isAllSelected() {
    this.orders$.subscribe(orders => {
      this.selectAll = orders.every(function (order: Order) {
        return order.checked == true;
      })
    });
  }

  onSubmit() {
    this.loadingSubmit = true;
    this.orders$.subscribe(orders => {
      this.service.status(orders.filter(order => order.checked === true))
        .subscribe(response => {
          this.loadingSubmit = false;
          this.notificationService.success("success");

        }, error => {
          this.notificationService.error(error);
          this.loadingSubmit = false;
        });
    });
  }
}
