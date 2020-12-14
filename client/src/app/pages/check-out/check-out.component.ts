import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Cart} from '../../shared/interfaces/cart.interface';
import {IResponse} from '../../../../../admin/src/app/shared/interfaces/Iresponse.interface';
import {WebConstants} from '../../../../../admin/src/app/shared/constants/constants';
import {CommonService} from '../../shared/services/common.service';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-check-out',
  templateUrl: './check-out.component.html',
  styleUrls: ['./check-out.component.css']
})
export class CheckOutComponent implements OnInit {
  orderForm: FormGroup;
  cart: Array<Cart>;
  amount = 0;

  constructor(private fb: FormBuilder, private commonService: CommonService, private toastrService: ToastrService) {
  }

  ngOnInit() {
    this.init();
  }

  init() {
    const str = localStorage.getItem('cart');
    try {
      this.cart = JSON.parse(str);
      this.calcAmount();
    } catch (e) {
      this.cart = new Array<Cart>();
    }

    this.orderForm = this.fb.group({
      first_name: ['', [Validators.required]],
      last_name: ['', [Validators.required]],
      email: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      address1: ['', [Validators.required]],
      address2: ['', ],

    });
  }

  calcAmount() {
    let amount = 0;
    this.cart.forEach(item => {
      amount += item.price * item.quantity;
    });

    this.amount = amount;
  }

  onSubmit() {
    const data = {...this.orderForm.value, order_items: this.cart};
    if (this.orderForm.invalid) {
      return false;
    }

    this.commonService.doPost('order', data)
      .subscribe(
        (res: IResponse<any>) => {
          if (res.statusCode === 0) {

            localStorage.setItem('cart', JSON.stringify([]));
            this.toastrService.success('Order successfully');

            setTimeout(() => {
              location.replace('/');
            }, 2000);

          } else {
            this.toastrService.error(res.message);
          }
        }, (err) => {
          this.toastrService.error(err.errors.message);
        }
      );
  }

}
