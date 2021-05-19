import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';

import { Card, CardField } from 'src/app/_models/card';
import { OrderAnswer } from 'src/app/_models/order';
import { CardService } from 'src/app/_services/card.service';
import { NotificationService } from 'src/app/_services/notification.service';
import { OrderService } from 'src/app/_services/order.service';

@Component({
  selector: 'app-order-form-complete',
  templateUrl: './order-form-complete.component.html'
})
export class OrderFormCompleteComponent implements OnInit {
  id: string;
  formValidate: FormGroup;
  form: FormGroup;
  order = null;
  validated = false;
  validationLoading = false;
  loading = false;
  validationSubmitted = false;
  submitted = false;
	files: File[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private cardService: CardService,
    private orderService: OrderService,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    // TODO - Implement initial validation to see if token if valid, currently it opening everything like http://localhost:4200/orders/blablabla/complete

    this.id = this.route.snapshot.params['id'];

    this.formValidate = this.formBuilder.group({
      personId: ['', Validators.required],
    });

    // this.form = this.formBuilder.group({
    //   name: ['', Validators.required],
    //   personId: ['', Validators.required],
    //   employeeId: ['', Validators.required]
    // });

    this.form = this.formBuilder.group({});
  }

  get v() { return this.formValidate.controls; }

  get f() { return this.form.controls; }

  onSelect(event) {
		console.log(event);
		this.files.shift(); // FIXME - workaround, better to remove array and have only one File variable
		this.files.push(...event.addedFiles);
	}

	onRemove(event) {
		console.log(event);
		this.files.splice(this.files.indexOf(event), 1);
  }
  
  onSubmitValidate() {
    this.validationSubmitted = true;

    // stop here if form is invalid
    if (this.formValidate.invalid) {
      return;
    }

    this.validationLoading = true;
    this.orderService.validatePersonId(this.id, this.v.personId.value)
      .pipe(first())
      .subscribe(
        data => {
          this.notificationService.success("sucess");
          this.getOrder();
        },
        error => {
          this.notificationService.error("error");
          this.validationLoading = false;
        }
      );
  }

  getOrder() {
    this.orderService.get(this.id)
      .pipe(first())
      .subscribe(
        order => {
          this.order = order;

          // this.form.patchValue({
          //   name: order.name,
          //   personId: order.personId,
          //   employeeId: order.employeeId
          // });

          this.getCard();
        },
        error => {
          this.notificationService.error(error);
          this.validationLoading = false;
        }
      );
  }

  getCard() {
    this.cardService.get(this.order.card.id)
      .pipe(first())
      .subscribe(
        card => {
          this.order.card = card;
          this.order.card.fields.forEach((cardField: CardField) => {
            this.form.addControl(cardField.id, new FormControl('', Validators.required));
          });

          this.validated = true;
          this.validationLoading = false;
        },
        error => {
          this.notificationService.error(error);
          this.validationLoading = false;
        }
      );
  }

  hasError(value: string) {
    return this.f[value].errors;
  }

  onSubmit() {
    this.submitted = true;

    if (this.form.invalid) {
      return;
    }

    this.loading = true;

    var answers = [];
    Object.keys(this.f).forEach(key => {
      var cardField = new CardField();
      cardField.id = key;

      var orderAnswer = new OrderAnswer();
      orderAnswer.answer = this.f[key].value;
      orderAnswer.cardField = cardField;

      answers.push(orderAnswer);
    });
    this.order.orderAnswers = answers;
    this.order.card = new Card(this.order.card.id);

    this.orderService.update(this.id, this.order)
      .pipe(first())
      .subscribe(
        data => {
          this.notificationService.success("sucess");
          this.router.navigate(['orders']);
        },
        error => {
          this.notificationService.error("error");
          this.loading = false;
        }
      );
  }
}
