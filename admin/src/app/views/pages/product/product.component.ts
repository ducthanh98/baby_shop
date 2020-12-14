import {Component, OnInit, ViewChild} from '@angular/core';
import {WebConstants} from "../../../shared/constants/constants";
import {FormBuilder} from "@angular/forms";
import {CommonService} from "../../../shared/common/common.service";
import {ToastrService} from "ngx-toastr";
import {AuthService} from "../../auth/auth.service";
import {IBody} from "../../../shared/interfaces/body.interface";
import {IResponse} from "../../../shared/interfaces/Iresponse.interface";

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

  pageNumber = 1;
  totalPages = 1;
  productData = [];
  pageSize = WebConstants.PAGE_SIZE;
  id = null;
  baseUrl = '';

  constructor(
    private fb: FormBuilder,
    private commonService: CommonService,
    private toastrService: ToastrService,
    private authService: AuthService) {
  }

  ngOnInit() {
    this.init()
  }

  init(pageNumber = this.pageNumber) {
    this.pageNumber = pageNumber;
    const body: IBody = {
      pageSize: 10,
      pageNumber: pageNumber,
      keyText: ''
    };
    this.commonService.doGet('product', null, body)
      .subscribe(
        (res: IResponse<any>) => {
          if (res.statusCode === 0) {
            this.productData = res.data.list;
            this.totalPages = Math.ceil(res.data.count / 10);
          } else {
            this.productData = [];
            this.toastrService.error(res.message);
          }
        }, (err) => {
          console.log(err);
          this.toastrService.error(err.message);
        }
      );
  }

  checkUpdatePermission(method) {
    const userInfo = this.authService.userInfo
    const check = userInfo.findIndex(x => x.code === `${method}_PRODUCT`)
    if (check < 1) {
      return false
    }
    return true
  }

}
