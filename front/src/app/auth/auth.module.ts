import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthRoutingModule } from './auth-routing.module';
import { CaregiverRegisterComponent } from '../auth/caregiver-register/caregiver-register.component';
import { ClientLoginComponent } from './client-login/client-login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ControlMessagesModule } from '../control-messages/control-messages.module';
import { CaregiverLoginComponent } from './caregiver-login/caregiver-login.component';
import { RouterModule, Routes } from '@angular/router';
import { ConfirmEmailComponent } from './confirm-email/confirm-email.component';
import { ClientRegisterComponent } from './client-register/client-register.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { TranslateModule } from '@ngx-translate/core';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { SharedModule } from '../shared/shared.module';
import { PrivacyEnComponent } from './privacy-policy/privacy-en/privacy-en.component';
import { PrivacyChComponent } from './privacy-policy/privacy-ch/privacy-ch.component';

@NgModule({
  declarations: [
    ClientLoginComponent,
    ClientRegisterComponent,
    CaregiverRegisterComponent,
    CaregiverLoginComponent,
    ConfirmEmailComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    PrivacyPolicyComponent,
    PrivacyEnComponent,
    PrivacyChComponent,
  ],
  imports: [
    RouterModule,
    CommonModule,
    AuthRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    ControlMessagesModule,
    TranslateModule.forChild(),
    SharedModule
  ],
})
export class AuthModule { }
