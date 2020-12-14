import {Component, OnInit, AfterViewInit} from '@angular/core';
import {CommonService} from './../../shared/services/common.service';
import {AuthService} from './../../auth/auth.service';
import {IBody} from 'src/app/shared/interfaces/body.interface';
import {IResponse} from 'src/app/shared/interfaces/Iresponse.interface';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements AfterViewInit, OnInit {
  isLogin = false;
  lstHostel = [];
  products = []
  constructor(
    private commonService: CommonService,
    private authService: AuthService,
    private toastrService: ToastrService,
  ) {
  }

  ngOnInit(): void {
    this.getPopularProduct()
  }

  ngAfterViewInit(): void {
    this.commonService.generateScript()
  }

  getPopularProduct() {
    this.commonService.doGet('product/popular')
      .subscribe(
        (res: IResponse<any>) => {
          if (res.statusCode === 0) {
            this.products = res.data;
          } else {
            this.products = [];
            this.toastrService.error(res.message);
          }
        }, (err) => {
          this.toastrService.error(err.message);
        }
      );
  }

  keys(attributes){
    return Object.keys(attributes)
  }


}
