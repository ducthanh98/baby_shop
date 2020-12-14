import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {PagesComponent} from './pages.component';
import {HomeComponent} from "./home/home.component";
import {ProductComponent} from "./product/product.component";
import {CartComponent} from "./cart/cart.component";
import {CheckOutComponent} from "./check-out/check-out.component";

const routes: Routes = [
  {
    path: '',
    component: PagesComponent,
    children: [
      {path: 'home', component: HomeComponent},
      {path: 'products/:id', component: ProductComponent},
      {path: 'cart', component: CartComponent},
      {path: 'check-out', component: CheckOutComponent},

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule {
}

export const pageRoutingComponent = [
  HomeComponent
];
