import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardGuard } from 'src/app/shared/guards/auth-guard.guard';
import { SearchComponent } from './search/search.component';
import { AcceptComponent } from './booking/accept/accept.component';
import { RejectComponent } from './booking/reject/reject.component';
import { CaregiverProfileResolver } from './profile.resolver';
import { CaregiverOnboardResolver } from './onboard.resolver';
import { AcceptedByOtherComponent } from './booking/accepted-by-other/accepted-by-other.component';
import { BookingConfirmedComponent } from './booking-confirmed/booking-confirmed.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'onboard',
        loadChildren: () =>
          import('./onboard/onboard.module').then(m => m.OnboardModule),
        canActivate: [AuthGuardGuard],
        resolve: {
          page: CaregiverOnboardResolver,
        },
      },
      {
        path: 'profile',
        loadChildren: () =>
          import('./onboard/onboard.module').then(m => m.OnboardModule),
        canActivate: [AuthGuardGuard],
        resolve: {
          page: CaregiverProfileResolver,
        },
      },
      {
        path: 'profile-view',
        loadChildren: () =>
          import('./profile/profile.module').then(m => m.ProfileModule),
      },
      {
        path: 'search',
        component: SearchComponent,
        data: {
          title: 'Search Caregiver',
          userType: '0'
        },
      },
      {
        path: 'search/:data',
        component: SearchComponent,
        data: {
          title: 'Search Caregiver',
          userType: '0'
        },
      },
      {
        path: 'booking-confirmed',
        component: BookingConfirmedComponent,
        data: {
          title: 'Booking Confirmed',
          userType: '3'
        },
      },
      {
        path: 'booking/accept',
        component: AcceptComponent,
        data: {
          title: 'Accept Booking',
          userType: '2'
        },
        // canActivate: [AuthGuardGuard],
      },
      {
        path: 'booking/reject',
        component: RejectComponent,
        data: {
          title: 'Reject Booking',
          userType: '2'
        },
        // canActivate: [AuthGuardGuard],
      },
      {
        path: 'booking/already-accepted-by-other-caregiver',
        component: AcceptedByOtherComponent,
        data: {
          title: 'Booking Already Accepted',
          userType: '2'
        },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CaregiverRoutingModule { }
