import {Component, OnInit} from '@angular/core';
import {Cart} from '../../shared/interfaces/cart.interface';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cart: Array<Cart>;
  amount = 0;

  constructor() {
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
  }

  removeItem(i: number) {
    if (confirm('Are you sure you want to do this ?')) {
      this.cart.splice(i, 1);
      localStorage.setItem('cart', JSON.stringify(this.cart));
      this.calcAmount();
    }
  }

  calcAmount() {
    let amount = 0;
    this.cart.forEach(item => {
      amount += item.price * item.quantity;
    });

    this.amount = amount;
  }

}
