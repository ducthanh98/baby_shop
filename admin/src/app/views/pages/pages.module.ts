import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {PagesRoutingModule} from './pages-routing.module';
import {AmentitiesComponent} from './amentities/amentities.component';
import {SharedModule} from '../../shared/shared.module';
import {CommonService} from '../../shared/common/common.service';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import {ModalModule} from 'ngx-bootstrap/modal';
import {TokenInterceptorService} from '../auth/token-interceptor.service';
import {UserComponent} from './user/user.component';
import {RoleComponent} from './role/role.component';
import {ProductComponent} from './product/product.component';
import {ProductDetailComponent} from './product-detail/product-detail.component';
import {TagInputModule} from "ngx-chips";
import { OrderComponent } from './order/order.component';


@NgModule({
  declarations: [AmentitiesComponent, UserComponent, RoleComponent, ProductComponent, ProductDetailComponent, OrderComponent],
  imports: [
    CommonModule,
    PagesRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ModalModule.forRoot(),
    TagInputModule,
  ],
  providers: [
    CommonService,
    {
      provide: HTTP_INTERCEPTORS, useClass: TokenInterceptorService, multi: true
    }
  ], exports: [
    ModalModule
  ]
})
export class PagesModule {
}
