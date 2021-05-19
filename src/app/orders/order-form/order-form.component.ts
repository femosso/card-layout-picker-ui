import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';

import { CardService } from 'src/app/_services/card.service';
import { OrderService } from 'src/app/_services/order.service';
import { NotificationService } from 'src/app/_services/notification.service';
import { Card } from 'src/app/_models/card';

@Component({
  selector: 'app-order-form',
  templateUrl: './order-form.component.html'
})
export class OrderFormComponent implements OnInit {
  cards = [];
  selectedCardIndex = 0;
  form: FormGroup;
  id: string;
  isAddMode: boolean;
  loadingPage = true;
  loadingSubmit = false;
  submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private orderService: OrderService,
    private cardService: CardService,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.isAddMode = !this.id;

    this.form = this.formBuilder.group({
      name: ['', Validators.required],
      personId: ['', Validators.required],
      employeeId: ['', Validators.required]
    });

    this.cardService.getAll()
      .pipe(first())
      .subscribe(
        cards => {
          this.cards = cards;
          this.loadingPage = false;
        }
      );
  }

  changeSelectedCard(direction: string) {
    switch (direction) {
      case 'next':
        this.selectedCardIndex = (this.selectedCardIndex + 1) % this.cards.length;
        break;
      case 'prev':
        this.selectedCardIndex = (this.selectedCardIndex == 0 ? this.cards.length - 1 : this.selectedCardIndex - 1);
        break;
    }
  }

  // convenience getter for easy access to form fields
  get f() { return this.form.controls; }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.form.invalid) {
      return;
    }

    this.loadingSubmit = true;
    if (this.isAddMode) {
      this.createOrder();
    } else {
      this.updateOrder();
    }
  }

  private createOrder() {
    this.form.value.card = new Card(this.cards[this.selectedCardIndex].id);
    this.orderService.register(this.form.value)
      .pipe(first())
      .subscribe(
        data => {
          this.notificationService.success('Registration successful');
          this.router.navigate(['orders']);
        },
        error => {
          this.notificationService.error(error);
          this.loadingSubmit = false;
        }
      );
  }

  private updateOrder() {
    this.orderService.update(this.id, this.form.value)
      .pipe(first())
      .subscribe(
        data => {
          this.notificationService.success('Update successful');
          this.router.navigate(['orders']);
        },
        error => {
          this.notificationService.error(error);
          this.loadingSubmit = false;
        }
      );
  }
}
