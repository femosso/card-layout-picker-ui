import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { NotificationService } from 'src/app/_services/notification.service';
import { OrderService } from 'src/app/_services/order.service';

@Component({
  selector: 'app-order-form-validate',
  templateUrl: './order-form-validate.component.html'
})
export class OrderFormValidateComponent implements OnInit {
  id: string;
  order = null;
  loadingPage = true;
  loadingApprove = false;
  loadingReject = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private orderService: OrderService,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.getOrder();
  }

  getOrder() {
    this.orderService.get(this.id)
      .pipe(first())
      .subscribe(
        order => {
          this.order = order;
          this.loadingPage = false;
        },
        error => {
          this.notificationService.error(error);
          this.loadingPage = false;
        }
      );
  }

  onSubmit(action: string) {
    switch (action) {
      case 'approve':
        this.loadingApprove = true;
        this.order.statusId = "3f7813a0-9b0d-11eb-970a-0242ac110002";
        break;
      case 'reject':
        this.loadingReject = true;
        this.order.statusId = "36e3b5b1-9b0d-11eb-970a-0242ac110002";
        break;
    }

    this.orderService.update(this.id, this.order)
      .pipe(first())
      .subscribe(
        data => {
          this.notificationService.success("sucess");
          this.router.navigate(['orders']);
        },
        error => {
          this.notificationService.error("error");
          this.loadingApprove = false;
          this.loadingReject = false;
        }
      );
  }

}
