import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthServiceService } from '../services/auth-service.service';
import { ToastrService } from 'ngx-toastr';
import { HeaderComponent } from '../header/header.component';
import { GlobalService } from '../services/global.service';
import { ConstantService } from '../services/constant.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuardGuard implements CanActivate {
  constructor(
    private authService: AuthServiceService,
    private router: Router,
    private toastr: ToastrService,
    private headerComponent: HeaderComponent,
    private global: GlobalService,
    private constant: ConstantService
  ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<boolean> | Promise<boolean> | boolean {
    if (this.authService.isLoggedIn()) {
      return true;
    } else {
      this.toastr.error(this.constant.LOGIN_TO_CONTINUE);
      this.global.logout();
      this.headerComponent.logout();
      this.router.navigate(['/auth/caregiver-login'], { queryParams: { redirectURL: state.url } });
    }
  }
}
@Injectable({
  providedIn: 'root',
})
export class LogindGuard implements CanActivate {
  constructor(
    private authService: AuthServiceService,
    private router: Router,
  ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<boolean> | Promise<boolean> | boolean {
    if (this.authService.isLoggedIn()) {
      if (localStorage.getItem('registeredNumber')) {
        this.router.navigateByUrl('/caregiver/onboard/personal-info');
      } else {
        const url = this.authService.redirectClient();
        this.router.navigateByUrl(url);
      }
    } else {
      return true;
    }
  }
}
