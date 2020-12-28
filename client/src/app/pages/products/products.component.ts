import { AfterViewInit, Component, OnInit } from '@angular/core';
import { CommonService } from '../../shared/services/common.service';
import { AuthService } from '../../auth/auth.service';
import { ToastrService } from 'ngx-toastr';
import { IResponse } from '../../shared/interfaces/Iresponse.interface';

declare var $: any;

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {

  products = [];
  categories = [];
  total = 0;
  pageNumber = 1;
  priceFrom = 0;
  priceTo = 0;
  categoryID = 0;
  keyText = '';


  constructor(
    private commonService: CommonService,
    private authService: AuthService,
    private toastrService: ToastrService,
  ) {
  }

  ngOnInit(): void {
    this.fetchProducts();
    this.fetchCategories();
  }


  fetchProducts(pageNumber = this.pageNumber) {
    const params = {
      pageSize: $('.page-size') ? $('.page-size').val() : 8,
      pageNumber,
      keyText: this.keyText,
      price_from: this.priceFrom ? this.priceFrom : 0,
      price_to: this.priceTo ? this.priceTo : 0,
      category_id: +$('.category-id').val(),
      sort_by: $('.sort-by').val(),
      status: true,
    };

    this.commonService.doGet('product', null, params)
      .subscribe(
        (res: IResponse<any>) => {
          if (res.statusCode === 0) {
            this.products = res.data.list;
            this.total = Math.ceil(res.data.count / 10);
          } else {
            this.products = [];
            this.toastrService.error(res.message);
          }
        }, (err) => {
          this.toastrService.error(err.message);
        }
      );
  }

  fetchCategories() {
    this.commonService.doGet('product/category')
      .subscribe(
        (res: IResponse<any>) => {
          if (res.statusCode === 0) {
            this.categories = res.data;

            setTimeout(() => {
              $('.nice-select').niceSelect();
            });

          } else {
            this.categories = [];
            this.toastrService.error(res.message);
          }
        }, (err) => {
          this.toastrService.error(err.message);
        }
      );
  }

  keys(attributes) {
    return Object.keys(attributes);
  }

}
