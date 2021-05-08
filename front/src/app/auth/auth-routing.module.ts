import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthLayoutComponent } from '../layouts/auth-layout/auth-layout.component';
import { CaregiverRegisterComponent } from '../auth/caregiver-register/caregiver-register.component';
import { ClientLoginComponent } from './client-login/client-login.component';
import { CaregiverLoginComponent } from './caregiver-login/caregiver-login.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { ClientRegisterComponent } from './client-register/client-register.component';
import { ConfirmEmailComponent } from './confirm-email/confirm-email.component';
import { LogindGuard } from '../shared/guards/auth-guard.guard';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';

const routes: Routes = [
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      { path: '', redirectTo: '/auth/caregiver-register', pathMatch: 'full' },
      {
        path: 'caregiver-register',
        component: CaregiverRegisterComponent,
        canActivate: [LogindGuard],
        data: {
          title: 'Caregiver Register',
        },
      },
      {
        path: 'client-register',
        component: ClientRegisterComponent,
        canActivate: [LogindGuard],
        data: {
          title: 'Client Register',
        },
      },
      {
        path: '',
        component: CaregiverRegisterComponent,
        canActivate: [LogindGuard],
        data: {
          title: 'Register',
        },
      },
      {
        path: 'client-login',
        component: ClientLoginComponent,
        canActivate: [LogindGuard],
        data: {
          title: 'Client Login',
        },
      },
      {
        path: 'client-login/:searchData',
        component: ClientLoginComponent,
        canActivate: [LogindGuard],
        data: {
          title: 'Client Login',
        },
      },
      {
        path: 'caregiver-login',
        component: CaregiverLoginComponent,
        canActivate: [LogindGuard],
        data: {
          title: 'Caregiver Login',
        },
      },
      {
        path: 'confirm-email',
        component: ConfirmEmailComponent,
        // canActivate: [LogindGuard],
        data: {
          title: 'Confirm Email',
        },
      },
      {
        path: 'forgot-password',
        component: ForgotPasswordComponent,
        canActivate: [LogindGuard],
        data: {
          title: 'Forgot Password',
        },
      },
      {
        path: 'reset-password',
        component: ResetPasswordComponent,
        canActivate: [LogindGuard],
        data: {
          title: 'Reset password',
        },
      },
      {
        path: 'privacy-policy',
        component: PrivacyPolicyComponent,
        data: {
          title: 'Privacy Policy',
        },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule { }
