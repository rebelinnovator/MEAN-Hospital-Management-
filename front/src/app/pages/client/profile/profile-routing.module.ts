// Libraries
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Layout
import { ClientProfileLayoutComponent } from './client-profile-layout/client-profile-layout.component';

// Resolver
import { ProfileResolver } from './profile.resolver';

// Components
import { AccountUserInfoComponent } from './account-user-info/account-user-info.component';
import { ServiceUserInfoComponent } from './service-user-info/service-user-info.component';
import { ServiceUserBackgroundComponent } from './service-user-background/service-user-background.component';
import { ServiceUserMedicalHistoryComponent } from './service-user-medical-history/service-user-medical-history.component';
import { ReferralBonusComponent } from './referral-bonus/referral-bonus.component';

const routes: Routes = [
  { path: '', redirectTo: 'account-user-info', pathMatch: 'full' },
  {
    path: '',
    component: ClientProfileLayoutComponent,
    children: [
      {
        path: 'account-user-info',
        component: AccountUserInfoComponent,
        data: {
          title: 'Account User Info',
        },
        resolve: {
          page: ProfileResolver,
        },
      },
      {
        path: 'service-user-info',
        component: ServiceUserInfoComponent,
        data: {
          title: 'Care Receiver Info',
        },
        resolve: {
          page: ProfileResolver,
        },
      },
      {
        path: 'service-user-background',
        component: ServiceUserBackgroundComponent,
        data: {
          title: 'User Background',
        },
        resolve: {
          page: ProfileResolver,
        },
      },
      {
        path: 'service-user-medical-history',
        component: ServiceUserMedicalHistoryComponent,
        data: {
          title: 'Medical History',
        },
        resolve: {
          page: ProfileResolver,
        },
      },
      {
        path: 'referral-bonus',
        component: ReferralBonusComponent,
        data: {
          title: 'Medical History',
        },
        resolve: {
          page: ProfileResolver,
        },
      },
    ],
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfileRoutingModule { }
