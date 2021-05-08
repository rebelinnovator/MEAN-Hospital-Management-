import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutProfileComponent } from '../profile/layout/layout.component';
import { OverviewComponent } from '../profile/overview/overview.component';
import { InfoComponent } from './info/info.component';
import { ReviewsComponent } from './reviews/reviews.component';
import { AvaibilityComponent } from './avaibility/avaibility.component';
import { ProfileViewResolver } from '../profile-view.resolver';

const routes: Routes = [
  { path: '', redirectTo: 'profile', pathMatch: 'full' },
  {
    path: '',
    component: LayoutProfileComponent,
    children: [
      {
        path: 'overview/:id',
        component: OverviewComponent,
        data: {
          title: 'Overview',
        },
        resolve: {
          page: ProfileViewResolver,
        },
      },
      {
        path: 'info/:id',
        component: InfoComponent,
        data: {
          title: 'Information',
        },
        resolve: {
          page: ProfileViewResolver,
        },
      },
      {
        path: 'review/:id',
        component: ReviewsComponent,
        data: {
          title: 'Reviews',
        },
        resolve: {
          page: ProfileViewResolver,
        },
      },
      {
        path: 'availability/:id',
        component: AvaibilityComponent,
        data: {
          title: 'Availability',
        },
        resolve: {
          page: ProfileViewResolver,
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
