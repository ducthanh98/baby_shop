import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {CommonService} from '../../shared/services/common.service';
import {ActivatedRoute, Router} from '@angular/router';
import {IResponse} from '../../shared/interfaces/Iresponse.interface';
import {ToastrService} from 'ngx-toastr';
import {Cart} from "../../shared/interfaces/cart.interface";

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit, OnDestroy {
  id = 0;
  private sub: any;
  products = [];
  attributes = {};
  attribute = {};
  quantity = 1;

  constructor(private commonService: CommonService,
              private route: ActivatedRoute,
              private toastrService: ToastrService,
              private router: Router
  ) {
  }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.id = +params.id; // (+) converts string 'id' to a number
      this.getProductByID();
    });
  }

  getProductByID() {
    this.products = [];
    this.attributes = [];
    this.commonService.doGet(`product/${this.id}`)
      .subscribe(
        (res: IResponse<any>) => {
          if (res.statusCode === 0) {
            this.products = res.data;

            this.parseAttributes();

          } else {
            this.products = [];
            this.toastrService.error(res.message);
          }
        }, (err) => {
          this.toastrService.error(err.message);
        }
      );
  }

  parseAttributes() {
    const tmp = {};
    for (let i = 0; i < this.products.length; i++) {
      if (!tmp[this.products[i].attribute1_name]) {
        tmp[this.products[i].attribute1_name] = [this.products[i].attribute1_value];
      } else {
        tmp[this.products[i].attribute1_name].push(this.products[i].attribute1_value);
      }
      if (this.products[i].attribute2_name == null) {
        continue;
      }

      if (!tmp[this.products[i].attribute2_name]) {
        tmp[this.products[i].attribute2_name] = [this.products[i].attribute2_value];
      } else {
        tmp[this.products[i].attribute2_name].push(this.products[i].attribute2_value);
      }

      if (this.products[i].attribute3_name == null) {
        continue;
      }
      if (!tmp[this.products[i].attribute3_name]) {
        tmp[this.products[i].attribute3_name] = [this.products[i].attribute3_value];
      } else {
        tmp[this.products[i].attribute3_name].push(this.products[i].attribute3_value);
      }
    }


    tmp[this.products[0].attribute1_name] = [...new Set(tmp[this.products[0].attribute1_name])];
    if (this.products[0].attribute2_name != null) {
      tmp[this.products[0].attribute2_name] = [...new Set(tmp[this.products[0].attribute2_name])];
    }

    if (this.products[0].attribute3_name != null) {
      tmp[this.products[0].attribute3_name] = [...new Set(tmp[this.products[0].attribute3_name])];
    }

    this.attributes = tmp;
    for (const key in this.attributes) {
      this.attribute[key] = this.attributes[key][0];
    }
  }

  checkVariant(product) {
    if (this.products[0].attribute3_name != null) {
      return this.attribute[product.attribute1_name] == product.attribute1_value &&
        this.attribute[product.attribute2_name] == product.attribute2_value &&
        this.attribute[product.attribute3_name] == product.attribute3_value;
    }

    if (this.products[0].attribute2_name != null) {
      return this.attribute[product.attribute1_name] == product.attribute1_value &&
        this.attribute[product.attribute2_name] == product.attribute2_value;
    }

    if (this.products[0].attribute1_name != null) {
      return this.attribute[product.attribute1_name] == product.attribute1_value;
    }
  }


  keys(attributes) {
    return Object.keys(attributes);
  }


  setAttributeVariant(key, value) {
    this.attribute[key] = value;
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  getNameVariant(product){

    let name = product.name
    if (product.attribute1_value) {
      name = `${name} ${product.attribute1_value}`;
    }

    if (product.attribute2_value) {
      name = `${name} - ${product.attribute2_value}`;
    }

    if (product.attribut3_value) {
      name = `${name} - ${product.attribute3_value}`;
    }
    return name;
  }


  onSubmit(product) {
    let name = product.name
    if (product.attribute1_value) {
      name = `${name} ${product.attribute1_value}`;
    }

    if (product.attribute2_value) {
      name = `${name} - ${product.attribute2_value}`;
    }

    if (product.attribut3_value) {
      name = `${name} - ${product.attribute3_value}`;
    }

    const tmp: Cart = {
      product_variant_id: product.product_variant_id,
      price: product.price,
      image: product.path,
      product: name  ,
      quantity: this.quantity
    };

    let cart: Array<Cart>;
    try {
      const str = localStorage.getItem('cart');
      if (!str) {
        throw new Error('Cart empty');
      }
      cart = JSON.parse(str);

      cart.forEach(item => {
        if (item.product_variant_id === tmp.product_variant_id) {
          item.quantity += tmp.quantity;
        }
      });

    } catch (e) {
      cart = new Array<Cart>();
    }

    cart.push(tmp);

    localStorage.setItem('cart', JSON.stringify(cart));
    this.router.navigate(['pages', 'cart']);

    // const body = {product_variant_id: product.product_variant_id, user_id: 10893, quantity: this.quantity};
    // this.commonService.doPost('product/order', body)
    //   .subscribe(
    //     (res: IResponse<any>) => {
    //       if (res.statusCode === 0) {
    //         this.toastrService.success(res.message);
    //
    //       } else {
    //         this.toastrService.error(res.message);
    //       }
    //     }, (err) => {
    //       this.toastrService.error(err.message);
    //     }
    //   );

  }

}
