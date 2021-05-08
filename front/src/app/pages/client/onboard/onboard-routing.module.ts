import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OnboardResolver } from './onboard.resolver';
import { ClientLayoutComponent } from './client-layout/client-layout.component';
import { AccountUserInfoComponent } from './account-user-info/account-user-info.component';
import { ServiceUserInfoComponent } from './service-user-info/service-user-info.component';
import { UserBackgroundComponent } from './user-background/user-background.component';
import { UserMedicalHistoryComponent } from './user-medical-history/user-medical-history.component';
import { TermsConditionsComponent } from './terms-conditions/terms-conditions.component';
import { ThankYouComponent } from './thank-you/thank-you.component';

const routes: Routes = [
  { path: '', redirectTo: 'user-info', pathMatch: 'full' },
  {
    path: '',
    component: ClientLayoutComponent,
    children: [
      {
        path: 'user-info',
        component: AccountUserInfoComponent,
        data: {
          title: 'Account User Info',
        },
        resolve: {
          page: OnboardResolver,
        },
      },
      {
        path: 'service-info',
        component: ServiceUserInfoComponent,
        data: {
          title: 'Care Receiver Info',
        },
        resolve: {
          page: OnboardResolver,
        },
      },
      {
        path: 'background',
        component: UserBackgroundComponent,
        data: {
          title: 'User Background',
        },
        resolve: {
          page: OnboardResolver,
        },
      },
      {
        path: 'medical-history',
        component: UserMedicalHistoryComponent,
        data: {
          title: 'Medical History',
        },
        resolve: {
          page: OnboardResolver,
        },
      },
      {
        path: 'terms-conditions',
        component: TermsConditionsComponent,
        data: {
          title: 'Terms and Conditions',
        },
        resolve: {
          page: OnboardResolver,
        },
      },
      {
        path: 'thank-you',
        component: ThankYouComponent,
        data: {
          title: 'Thank You',
        },
        resolve: {
          page: OnboardResolver,
        },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OnboardRoutingModule { }
