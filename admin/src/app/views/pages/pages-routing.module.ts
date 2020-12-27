import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {UserComponent} from './user/user.component';
import {AuthguardtokenGuard} from '../auth/auth.guard';
import {RoleComponent} from './role/role.component';
import {ProductComponent} from "./product/product.component";
import {ProductDetailComponent} from "./product-detail/product-detail.component";
import {OrderComponent} from "./order/order.component";
import { ProductUpdateComponent } from './product-update/product-update.component';


const routes: Routes = [
  {
    path: 'user',
    data: {
      title: 'User',
      screen: 'USER'
    },
    canActivate: [AuthguardtokenGuard],
    component: UserComponent
  },
  {
    path: 'role',
    data: {
      title: 'Role',
      screen: 'ROLE'
    },
    canActivate: [AuthguardtokenGuard],
    component: RoleComponent
  },
  {
    path: 'product',
    data: {
      title: 'Product',
      screen: 'PRODUCT',
      isDefault: true,
    },
    canActivate: [AuthguardtokenGuard],
    component: ProductComponent
  },
  {
    path: 'product-detail',
    data: {
      title: 'Product Detail',
      screen: 'PRODUCT',
      isDefault: true,
    },
    canActivate: [AuthguardtokenGuard],
    component: ProductDetailComponent
  },
  {
    path: 'products/:id',
    data: {
      title: 'Update Product',
      screen: 'PRODUCT',
      isDefault: true,
    },
    canActivate: [AuthguardtokenGuard],
    component: ProductUpdateComponent
  },
  {
    path: 'order',
    data: {
      title: 'List Order',
      screen: 'ORDER',
      isDefault: true,
    },
    canActivate: [AuthguardtokenGuard],
    component: OrderComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule {
}
