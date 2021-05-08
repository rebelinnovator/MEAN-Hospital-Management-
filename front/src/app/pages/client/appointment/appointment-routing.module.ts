import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProfileResolver } from '../profile/profile.resolver';
import { UpcomingComponent } from './upcoming/upcoming.component';
import { PastComponent } from './past/past.component';

const routes: Routes = [
  { path: '', redirectTo: 'upcoming', pathMatch: 'full' },
  {
    path: 'upcoming',
    component: UpcomingComponent,
    data: {
      title: 'Upcoming Appointments',
    },
    resolve: {
      page: ProfileResolver,
    },
  },
  {
    path: 'past',
    component: PastComponent,
    data: {
      title: 'Past Appointments',
    },
    resolve: {
      page: ProfileResolver,
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AppointmentRoutingModule {}
