import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardGuard } from 'src/app/shared/guards/auth-guard.guard';
import { FeedbackComponent } from './feedback/feedback.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'onboard',
        loadChildren: () =>
          import('./onboard/onboard.module').then(m => m.OnboardModule),
        canActivate: [AuthGuardGuard],
      },
      {
        path: 'profile',
        loadChildren: () =>
          import('./profile/profile.module').then(m => m.ProfileModule),
        canActivate: [AuthGuardGuard],
      },
      {
        path: 'appointment',
        loadChildren: () =>
          import('./appointment/appointment.module').then(
            m => m.AppointmentModule,
          ),
        canActivate: [AuthGuardGuard],
      },
      {
        path: 'feedback',
        component: FeedbackComponent,
        data: {
          title: 'Feedback',
        },
        // canActivate: [AuthGuardGuard],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClientRoutingModule { }
