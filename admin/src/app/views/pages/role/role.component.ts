import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {ModalDirective} from 'ngx-bootstrap/modal';
import {ConfirmDialogComponent} from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {WebConstants} from '../../../shared/constants/constants';
import {CommonService} from '../../../shared/common/common.service';
import {ToastrService} from 'ngx-toastr';
import {IResponse} from '../../../shared/interfaces/Iresponse.interface';
import {AuthService} from '../../auth/auth.service';

@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.css']
})
export class RoleComponent implements OnInit, AfterViewInit {
  @ViewChild('createRoleModal') public createRoleModal: ModalDirective;
  @ViewChild('updateRoleModal') public updateRoleModal: ModalDirective;

  @ViewChild(ConfirmDialogComponent) confirmModal: ConfirmDialogComponent;
  updateRoleForm: FormGroup;
  createRoleForm: FormGroup;
  pageNumber = 1;
  totalPages = 1;
  permissionData = [];
  pageSize = WebConstants.PAGE_SIZE;
  roleData = [];
  id = null;
  baseUrl = '';

  constructor(
    private fb: FormBuilder,
    private commonService: CommonService,
    private toastrService: ToastrService,
    private authService: AuthService) {
  }

  ngOnInit() {
    this.initForm();

    this.getListRole();

    if (this.checkUpdatePermission()) {
      this.getListPermission();
    }
  }

  checkUpdatePermission() {
    const userinfo = this.authService.userInfo;
    const check = userinfo.findIndex(x => x.code === 'PUT_ROLE');

    if (check < 1) {
      return false;
    }
    return true;
  }

  ngAfterViewInit() {
    this.updateRoleModal.onHidden.subscribe(
      () => {
        this.updateRoleForm.reset();
      }
    );
  }

  initForm() {
    this.updateRoleForm = this.fb.group({
      name:['',Validators.required],
      status:[true,Validators.required],
      permissions: new FormArray([])
    });

    this.createRoleForm = this.fb.group({
      name: ['', Validators.required]
    });
  }

  getSelectedPermissions() {
    const selected = this.updateRoleForm.value.permissions
      .map((v, i) => v ? this.permissionData[i].id : null)
      .filter(v => v !== null);
    return selected;
  }

  private addPermissionCheckbox() {
    this.permissionData.forEach((o, i) => {
      const control = new FormControl(); // if first item set to true, else false
      (this.updateRoleForm.controls.permissions as FormArray).push(control);
    });
  }


  getListPermission() {
    this.commonService.doGet('permission')
      .subscribe(
        (res: IResponse<any>) => {
          if (res.statusCode === 0) {
            this.permissionData = res.data;
            this.addPermissionCheckbox();
          } else {
            this.permissionData = [];
            this.toastrService.error(res.message);
          }
        }, (err) => {
          console.log(err);
          this.toastrService.error(err.message);
        }
      );
  }

  getListRole() {

    this.commonService.doGet('role')
      .subscribe(
        (res: IResponse<any>) => {
          if (res.statusCode === 0) {
            this.roleData = res.data;
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

  openUpdateModal(id: number) {
    this.updateRoleModal.show();
    this.id = id;

    if (id) {

      this.commonService.doGet(`role/${id}`)
        .subscribe(
          (res: IResponse<any>) => {
            if (res.statusCode === 0) {
              const {role} = res.data;

              this.updateRoleForm.patchValue({
                name:role.role,
                status:role.active
              })

              const data = res.data.permissions;

              const existRole = [];

              for (const permission of this.permissionData) {

                const check = data.findIndex(x => x.permission_id == permission.id);
                if (check < 0) {
                  existRole.push(false);
                } else {
                  existRole.push(true);
                }

              }
              const forms = (this.updateRoleForm.controls.permissions as FormArray);
              forms.setValue(existRole);

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
  }

  openCreateModal() {
    this.createRoleModal.show();
  }

  onSubmitUpdateRole() {
    let url = '';
    const body: any = {ids: this.getSelectedPermissions(),...this.updateRoleForm.value};
    url = `role/${this.id}`;

    this.commonService.doPut(url, body)
      .subscribe(
        (data: IResponse<any>) => {
          if (data.statusCode === 0) {
            this.toastrService.success(data.message);
            this.updateRoleModal.hide();
            this.getListRole();
          } else {
            this.toastrService.error(data.message);
          }
        },
        (err: any) => {
          this.errorHandler(err);
        }
      );
  }

  onSubmitCreateRole() {
    const url = 'role';
    const body = this.createRoleForm.value;
    this.commonService.doPost(url, body)
      .subscribe(
        (data: IResponse<any>) => {
          if (data.statusCode === 0) {
            this.toastrService.success(data.message);
            this.createRoleModal.hide();
            this.getListRole();
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

  autoCheckGetMethod(screen: string) {
    const getRegex = new RegExp('^GET_.*');
    if (getRegex.test(screen)) {
      return;
    }

    screen = screen.replace(new RegExp('^(DELETE|POST|PUT)_'), '');
    const index = this.permissionData.findIndex(data => data.code === `GET_${screen}`);

    this.updateRoleForm.get('permissions').get(index.toString()).setValue(true);
  }


}
