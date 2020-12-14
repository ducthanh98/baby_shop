import {Component, OnInit, ViewChild} from '@angular/core';
import {Socket} from 'ngx-socket-io';
import {IResponse} from '../../../shared/interfaces/Iresponse.interface';
import {CommonService} from '../../../shared/common/common.service';
import {ToastrService} from 'ngx-toastr';
import {ConfirmDialogComponent} from "../../../shared/components/confirm-dialog/confirm-dialog.component";
import {AuthService} from "../../auth/auth.service";

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {
  id = '';
  status = 0;
  orders = [];
  pageSize = 10;
  email = '';
  pageNumber = 1;
  totalPages = 1;
  body = {status: 0, id: 1};
  item = {} as any;

  @ViewChild(ConfirmDialogComponent) confirmModal: ConfirmDialogComponent;

  constructor(private commonService: CommonService, private toastrService: ToastrService, private authService: AuthService) {
  }

  ngOnInit() {
    this.getListOrder();
  }

  getListOrder(pageNumber = this.pageNumber) {
    this.pageNumber = pageNumber;
    const body = {
      pageSize: 10,
      pageNumber: pageNumber,
      keyText: '',
      status: this.status,
      email: this.email,
      id: this.id
    };

    if (!this.status) {
      body.status = 0;
    }

    if (!this.id) {
      body.id = '0';
    }

    this.commonService.doGet('order', null, body)
      .subscribe(
        (res: IResponse<any>) => {
          if (res.statusCode === 0) {
            const {list} = res.data;
            const tmp = [];
            for (let i = 0; i < list.length; i++) {

              let isExist = false;

              for (let j = 0; j < tmp.length; j++) {
                if (list[i].id === tmp[j].id) {

                  isExist = true;
                  tmp[j].products.push({...list[i]});

                }
              }
              if (!isExist) {
                tmp.push({id: list[i].id, products: [{...list[i]}]});
              }

            }
            this.orders = tmp;

            this.totalPages = Math.ceil(res.data.count / 10);
          } else {
            this.orders = [];
            this.toastrService.error(res.message);
          }
        }, (err) => {
          console.log(err);
          this.toastrService.error(err.message);
        }
      );
  }

  generateProductInfo(order) {
    let name = order.name;

    if (order.attribute1_value) {
      name = `${name} ${order.attribute1_value}`;
    }

    if (order.attribute2_value) {
      name = `${name} - ${order.attribute2_value}`;
    }

    if (order.attribut3_value) {
      name = `${name} - ${order.attribute3_value}`;
    }

    return `${name} x ${order.quantity}`;
  }

  getPrice(products) {
    let price = 0;

    products.forEach(product => {
      price += product.quantity * product.price;
    });

    return price;
  }

  openConfirm(id, status, item) {
    this.confirmModal.openModal();
    this.body.id = id;
    this.body.status = status;
    this.item = item;
  }

  updateStatusOrder() {
    const body = this.body;

    this.commonService.doPut('order', body)
      .subscribe(
        (res: IResponse<any>) => {
          if (res.statusCode === 0) {
            this.item.status = body.status;
            this.toastrService.success('Update successfully');

          } else {
            this.toastrService.error(res.message);
          }
        }, (err) => {
          this.toastrService.error(err.errors.message);
        }
      );
  }

  checkUpdatePermission(method) {
    const userInfo = this.authService.userInfo
    const check = userInfo.findIndex(x => x.code === `${method}_ORDER`);
    if (check < 1) {
      return false;
    }
    return true;
  }

}
