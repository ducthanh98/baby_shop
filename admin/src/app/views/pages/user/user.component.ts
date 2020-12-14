import {Component, OnInit, ViewChild, AfterViewInit} from '@angular/core';
import {ModalDirective} from 'ngx-bootstrap/modal';
import {ConfirmDialogComponent} from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import {Validators, FormGroup, FormBuilder, AbstractControl, FormArray, FormControl} from '@angular/forms';
import {WebConstants} from '../../../shared/constants/constants';
import {IBody} from '../../../shared/interfaces/body.interface';
import {IResponse} from '../../../shared/interfaces/Iresponse.interface';
import {Amentities} from '../amentities/amentities.model';
import {CommonService} from '../../../shared/common/common.service';
import {ToastrService} from 'ngx-toastr';
import {AuthService} from "../../auth/auth.service";

enum Active {
  active = 1,
  deactive = 0,
}

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit, AfterViewInit {
  @ViewChild('userModal') public userModal: ModalDirective;
  @ViewChild(ConfirmDialogComponent) confirmModal: ConfirmDialogComponent;
  userForm: FormGroup;
  pageNumber = 1;
  totalPages = 1;
  roleData = [];
  pageSize = WebConstants.PAGE_SIZE;
  userData = [];
  id = null;
  baseUrl = '';
  email = '';
  address = '';
  status = '';


  constructor(
    private fb: FormBuilder,
    private commonService: CommonService,
    private toastrService: ToastrService,
    private authService: AuthService) {
  }

  ngOnInit() {
    this.initForm();
    this.getListUser();
    if (this.checkUpdatePermission()) {
      this.getListRole();

    }
  }

  checkUpdatePermission() {
    const userInfo = this.authService.userInfo
    const check = userInfo.findIndex(x => x.code === 'PUT_USER');
    if (check < 1) {
      return false;
    }
    return true;
  }


  ngAfterViewInit() {
    this.userModal.onHidden.subscribe(
      () => {
        this.userForm.reset();
      }
    );
  }

  initForm() {
    this.userForm = this.fb.group({
      roles: new FormArray([])
    });

  }

  getSelectedRoles() {
    const selected = this.userForm.value.roles
      .map((v, i) => v ? this.roleData[i].id : null)
      .filter(v => v !== null);
    return selected;
  }

  private addRoleCheckboxes() {
    this.roleData.forEach((o, i) => {
      const control = new FormControl(); // if first item set to true, else false
      (this.userForm.controls.roles as FormArray).push(control);
    });
  }

  comparePassword(c: AbstractControl) {
    const v = c.value;
    return (v.password === v.re_password) ? null : {
      passwordnotmatch: true
    };
  }

  getListRole() {
    this.commonService.doGet('role')
      .subscribe(
        (res: IResponse<any>) => {
          if (res.statusCode === 0) {
            this.roleData = res.data;
            this.addRoleCheckboxes()
          } else {
            this.roleData = [];
            this.toastrService.error(res.message);
          }
        }, (err) => {
          console.log(err);
          this.toastrService.error(err.message);
        }
      );
  }

  getListUser(pageNumber = this.pageNumber) {
    this.pageNumber = pageNumber;
    const body = {
      pageSize: 10,
      pageNumber: pageNumber,
      keyText: '',
      status: this.status,
      email: this.email,
      address: this.address
    };
    this.commonService.doGet('user', null, body)
      .subscribe(
        (res: IResponse<any>) => {
          if (res.statusCode === 0) {
            this.userData = res.data.list;
            this.totalPages = Math.ceil(res.data.count / 10);
          } else {
            this.userData = [];
            this.toastrService.error(res.message);
          }
        }, (err) => {
          console.log(err);
          this.toastrService.error(err.message);
        }
      );
  }

  openModal(id: number) {
    this.userModal.show();
    this.id = id;

    if (id) {

      this.commonService.doGet(`user/${id}`)
        .subscribe(
          (res: IResponse<any>) => {
            if (res.statusCode === 0) {
              const data = res.data

              const existRole = []

              for (const role of this.roleData) {

                const check = data.findIndex(x => x.role_id == role.id)
                if (check < 0) {
                  existRole.push(false)
                } else {
                  existRole.push(true)
                }

              }
              const forms = (this.userForm.controls.roles as FormArray)
              forms.setValue(existRole)

            } else {
              this.userData = [];
              this.toastrService.error(res.message);
            }
          }, (err) => {
            console.log(err);
            this.toastrService.error(err.message);
          }
        );

    }
  }

  openConfirm(id: number) {
    this.confirmModal.openModal();
    this.id = id;
  }

  onSubmit() {
    let url = '';
    let body: any = {ids: this.getSelectedRoles()};
    url = `user/${this.id}`;

    this.commonService.doPut(url, body)
      .subscribe(
        (data: IResponse<any>) => {
          if (data.statusCode === 0) {
            this.toastrService.success(data.message);
            this.userModal.hide();
            this.getListUser();
          } else {
            this.toastrService.error(data.message);
          }
        },
        (err: any) => {
          this.errorHandler(err);
        }
      );
  }

  errorHandler(err) {
    if (err.errors) {
      this.toastrService.error(err.errors.message);
    } else if (err.error) {
      this.toastrService.error(err.error.message);
    } else if (err.status === 0) {
      this.toastrService.error(WebConstants.SERVER_MAINTAIN);
    } else {
      this.toastrService.error(err.message);
    }
  }

}
