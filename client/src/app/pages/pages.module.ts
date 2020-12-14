import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PagesComponent} from './pages.component';

import {PagesRoutingModule, pageRoutingComponent} from './pages-routing.module';
import {LayoutModule} from '../layout/layout.module';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {TokenInterceptorService} from '../auth/token-interceptor.service';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SharedModule} from '../shared/shared.module';
import {SafeHtmlPipe} from '../shared/pipes/safehtml.pipe';
import {ProductComponent} from './product/product.component';
import { CartComponent } from './cart/cart.component';
import { CheckOutComponent } from './check-out/check-out.component';

@NgModule({
  declarations: [
    PagesComponent,
    ...pageRoutingComponent,
    ProductComponent,
    CartComponent,
    CheckOutComponent
  ],
  imports: [
    CommonModule,
    PagesRoutingModule,
    LayoutModule,
    FormsModule,
    ReactiveFormsModule
  ],
})
export class PagesModule {
}
