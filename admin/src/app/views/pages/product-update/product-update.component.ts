import { Route } from '@angular/compiler/src/core';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { map, tap } from 'rxjs/operators';
import { CommonService } from '../../../shared/common/common.service';
import { IResponse } from '../../../shared/interfaces/Iresponse.interface';

@Component({
  selector: 'app-product-update',
  templateUrl: './product-update.component.html',
  styleUrls: ['./product-update.component.css']
})
export class ProductUpdateComponent implements OnInit {
  product = {} as any;
  products = [];
  path = '';
  product_id = 0;
  updateForm: FormGroup;
  categories = [];

  constructor(private route: ActivatedRoute, private toastrService: ToastrService, private commonService: CommonService, private fb: FormBuilder) { }

  ngOnInit() {
    this.initForm();
    this.route.paramMap
      .pipe(map(params => params.get('id')), tap(id => (this.product_id = +id)))
      .subscribe(id => {
        this.fetchCategories();
      });

  }

  uploadFile(event) {
    const form = new FormData()
    form.append('files', event.target.files[0]);

    this.commonService.doPost('files/upload', form)
      .subscribe(
        (res) => {
          this.path = res[0].filename;
        }, (err) => {
          console.log(err);
          this.toastrService.error(err.message);
        }
      );
  }

  initForm() {
    this.updateForm = this.fb.group({
      name: [''],
      status: [true],
      category_id: [''],
      variants: new FormArray([])
    })

  }


  fetchCategories() {
    this.commonService.doGet('product/category')
      .subscribe(
        (res: IResponse<any>) => {
          if (res.statusCode === 0) {
            this.categories = res.data;
            this.getProduct();

          } else {
            this.categories = [];
            this.toastrService.error(res.message);
          }
        }, (err) => {
          this.toastrService.error(err.message);
        }
      );
  }

  generateVariants() {
    const formArray = (this.updateForm.controls.variants as FormArray);
    formArray.clear();

    for (let i = 0; i < this.products.length; i++) {
      const name = this.getNameVariant(this.products[i])

      formArray.push(this.fb.group({
        id: this.products[i].product_variant_id,
        name,
        price: this.products[i].price,
        quantity: this.products[i].quantity
      }));

    }
  }

  getNameVariant(product) {

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

  getProduct() {

    this.commonService.doGet(`product/${this.product_id}`)
      .subscribe(
        (res: IResponse<any>) => {
          if (res.statusCode === 0) {
            if (res.data.length > 0) {
              this.product = res.data[0];
              this.updateForm.patchValue({ name: this.product.name, status: this.product.status, category_id: this.product.category_id });
              this.path = this.product.path
            }
            this.products = res.data;
            this.generateVariants();


          } else {
            this.product = {};
            this.toastrService.error(res.message);
          }
        }, (err) => {
          console.log(err);
          this.toastrService.error(err.message);
        }
      );
  }

  updateProductBase() {
    if (this.path == '') {
      return this.toastrService.error('Image is required');
    }
    const body = { ...this.updateForm.value, path: this.path };

    this.commonService.doPut(`product/base/${this.product_id}`, body)
      .subscribe(
        (res: IResponse<any>) => {
          this.toastrService.success(res.message);

        }, (err) => {
          console.log(err);
          this.toastrService.error(err.message);
        }
      );
  }

  updateProductVariant(index) {
    console.log(index)
    const formArray = (this.updateForm.controls.variants as FormArray);
    const body = {...formArray.get(index.toString()).value};

    this.commonService.doPut(`product/variants/${body.id}`, body)
      .subscribe(
        (res: IResponse<any>) => {
          this.toastrService.success(res.message);

        }, (err) => {
          console.log(err);
          this.toastrService.error(err.message);
        }
      );
  }



}
