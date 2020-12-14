import {Injectable} from '@angular/core';
import {CanActivate, Router, CanLoad, Route, RouterStateSnapshot, ActivatedRouteSnapshot} from '@angular/router';
import {AuthService} from './auth.service';


@Injectable({
  providedIn: 'root'
})

@Injectable()
export class AuthguardtokenGuard implements CanActivate, CanLoad {
  constructor(private _authService: AuthService, private _router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const {screen, isDefault} = route.data
    if (!this._authService.loggedInToken()) {
      this._router.navigate(['/auth/login']);
      return false;
    } else if (this._authService.checkPermission(screen) || isDefault) {
      return true;
    } else {
      this._router.navigate(['/not-found']);
    }
  }

  canLoad(route: Route): boolean {
    if (this._authService.loggedInToken()) {
      return true;
    } else {
      this._router.navigate(['/auth/login']);
      return false;
    }
  }

}
