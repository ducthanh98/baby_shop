import {Injectable} from '@angular/core';
import {WebConstants} from './../../shared/constants/constants';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() {
  }

  loggedInToken() {
    const token = localStorage.getItem(WebConstants.ACCESS_TOKEN);
    if (token) {
      return true;
    } else {
      return false;
    }
  }

  get token() {
    return localStorage.getItem(WebConstants.ACCESS_TOKEN);
  }

  get userInfo() {
    return JSON.parse(localStorage.getItem(WebConstants.USER_INFO));
  }

  checkPermission(screen: string): boolean {
    const users = this.userInfo;
    const permission = `GET_${screen}`
    const check = users.findIndex(x => x.code === permission)

    if (check < 0) {
      return false;
    }
    return true;
  }
}
