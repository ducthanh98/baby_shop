import {Component, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {debounce, debounceTime} from 'rxjs/operators';
import {ToastrService} from 'ngx-toastr';
import {CommonService} from "../../../shared/common/common.service";
import {IResponse} from "../../../shared/interfaces/Iresponse.interface";
import {Router} from "@angular/router";

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {
  productForm: FormGroup;
  path = '';

  constructor(private fb: FormBuilder, private toastrService: ToastrService, private commonService: CommonService, private router: Router) {
  }

  ngOnInit(): void {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      options: new FormArray([]),
      variants: new FormArray([])
    });

    this.addProductAttribute();
    this.generateVariants();
  }

  generateVariants() {
    this.productForm.get('options').valueChanges
      .pipe(debounceTime(500))
      .subscribe(
        result => {
          const formArray = (this.productForm.controls.variants as FormArray);
          formArray.clear();

          const length = result.length;
          const tmp = {};
          if (!result[0].name || !result[0].value) {
            return
          }

          for (let i = 0; i < result[0].value.length; i++) {
            if (result[0].value[i] === '') {
              return this.toastrService.error('Option name or value can\'t be empty');
            } else {
              tmp['attribute1_name'] = result[0].name
              tmp['attribute1_value'] = result[0].value[i].value
            }

            if (length === 1 || !result[1].name || !result[1].value) {
              formArray.push(this.fb.group({
                attribute1_value: tmp['attribute1_value'],
                attribute1_name: tmp['attribute1_name'],
                attribute2_value: '',
                attribute2_name: '',
                attribute3_value: '',
                attribute3_name: '',
                price: 0,
                quantity: 0
              }));
              continue
            }


            for (let j = 0; j < result[1].value.length; j++) {
              if (result[1].value[j] !== '') {
                tmp['attribute2_name'] = result[1].name
                tmp['attribute2_value'] = result[1].value[j].value
              }

              if (length === 2) {
                formArray.push(this.fb.group({
                  attribute1_value: tmp['attribute1_value'],
                  attribute1_name: tmp['attribute1_name'],
                  attribute2_value: tmp['attribute2_value'],
                  attribute2_name: tmp['attribute2_name'],
                  attribute3_value: '',
                  attribute3_name: '',
                  price: 0,
                  quantity: 0
                }));
                continue
              }

              for (let k = 0; k < result[2].value.length; k++) {
                if (result[2].value[k] !== '') {
                  tmp['attribute3_name'] = result[2].name;
                  tmp['attribute3_value'] = result[2].value[k].value;
                }

                formArray.push(this.fb.group({
                  attribute1_value: tmp['attribute1_value'],
                  attribute1_name: tmp['attribute1_name'],
                  attribute2_value: tmp['attribute2_value'],
                  attribute2_name: tmp['attribute2_name'],
                  attribute3_value: tmp['attribute3_value'],
                  attribute3_name: tmp['attribute3_name'],
                  price: 0,
                  quantity: 0
                }));
                continue

              }

            }

          }
        }
      );
  }


  addProductAttribute() {
    const formArray = (this.productForm.controls.options as FormArray);
    if (formArray.length > 2) {
      return;
    }
    const form = this.fb.group({
      name: '',
      value: [],
    });
    formArray.push(form);
  }

  onSubmit() {
    if (this.path == '') {
      return this.toastrService.error('Image is required');
    }
    const body = {...this.productForm.value};
    const options = [];

    try {
      body.path = this.path;
      for (let i = 0; i < body.options.length; i++) {

        for (let j = 0; j < body.options[i].value.length; j++) {
          options.push({name: body.options[i].name, value: body.options[i].value[j].value})
        }

      }
    } catch (e) {
      return this.toastrService.error('Option name and value is required');
    }
    body.attributes = options;
    this.commonService.doPost('product', body)
      .subscribe(
        (res: IResponse<any>) => {
          this.toastrService.success(res.message);
          this.router.navigate(['/product']);

        }, (err) => {
          console.log(err);
          this.toastrService.error(err.message);
        }
      );
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

}
