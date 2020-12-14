import {AfterViewInit, Component, OnInit} from '@angular/core';
import {CommonService} from '../../shared/services/common.service';
import {FormGroup, FormBuilder, Validators, AbstractControl} from '@angular/forms';
import {IResponse} from '../../shared/interfaces/Iresponse.interface';
import {WebConstants} from '../../shared//constants/constants';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit,AfterViewInit {
  loginForm: FormGroup;
  registerForm: FormGroup;

  constructor(
    private commonService: CommonService,
    private fb: FormBuilder,
    private router: Router,
    private toastrService: ToastrService) {
  }

  ngOnInit() {
    localStorage.removeItem(WebConstants.ACCESS_TOKEN);
    localStorage.removeItem(WebConstants.USER_INFO);
    this.initForm();

  }

  ngAfterViewInit(): void {
    this.commonService.generateScript()
  }


  initForm() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.email, Validators.required]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(16)]]
    });
    this.registerForm = this.fb.group({
        first_name: ['', Validators.required],
        last_name: ['', Validators.required],
        password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(16)]],
        re_pass: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
      },
      {
        validators: this.comparePassword
      });
  }

  comparePassword(c: AbstractControl) {
    const v = c.value;
    return (v.password === v.re_pass) ? null : {
      passwordnotmatch: true
    };
  }

  onSubmit() {
    if (this.loginForm.get('email').value === '' || this.loginForm.get('password').value === '' || this.loginForm.invalid) {
      return false;
    }
    this.commonService.doPost('auth/login', this.loginForm.value)
      .subscribe(
        (res: IResponse<any>) => {
          if (res.statusCode === 0) {
            localStorage.setItem(WebConstants.ACCESS_TOKEN, res.data[WebConstants.ACCESS_TOKEN]);
            localStorage.setItem(WebConstants.USER_INFO, JSON.stringify(res.data[WebConstants.USER_INFO]));
            this.router.navigate(['/pages/home']);
          } else {
            this.toastrService.error(res.message);
          }
        }, (err) => {
          this.commonService.errorHandler(err);
        }
      );
  }

  onSubmitRegister() {
    if (this.registerForm.get('email').value === '' || this.registerForm.get('password').value === '' || this.registerForm.invalid) {
      return false;
    }
    this.commonService.doPost('auth/register', this.registerForm.value)
      .subscribe(
        (res: IResponse<any>) => {
          if (res.statusCode === 0) {
            localStorage.setItem(WebConstants.ACCESS_TOKEN, res.data[WebConstants.ACCESS_TOKEN]);
            localStorage.setItem(WebConstants.USER_INFO, JSON.stringify(res.data[WebConstants.USER_INFO]));
            this.router.navigate(['/pages/home']);
          } else {
            this.toastrService.error(res.message);
          }
        }, (err) => {
          this.commonService.errorHandler(err);
        }
      );
  }

}
