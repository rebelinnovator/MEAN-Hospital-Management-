import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageslayoutComponent } from '../layouts/pageslayout/pageslayout.component';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { ServiceDescriptionComponent } from './service-description/service-description.component';
import { StrokeComponent } from './Illness/stroke/stroke.component';
import { DementiaComponent } from './Illness/dementia/dementia.component';
import { DiabetesComponent } from './Illness/diabetes/diabetes.component';
import { WoundComponent } from './Illness/wound/wound.component';
import { PostSurgeryComponent } from './Illness/post-surgery/post-surgery.component';
import { PalliativeComponent } from './Illness/palliative/palliative.component';
import { MentallyChallengedComponent } from './Illness/mentally-challenged/mentally-challenged.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { RecomendedChargesComponent } from './recomended-charges/recomended-charges.component';
import { ClientFaqComponent } from './client-faq/client-faq.component';
import { CaregiverFaqComponent } from './caregiver-faq/caregiver-faq.component';

const routes: Routes = [
  {
    path: '',
    component: PageslayoutComponent,
    children: [
      {
        path: '',
        component: HomeComponent,
        data: {
          title: 'Home',
          userType: '0'
        },
      },
      {
        path: 'home/:caregiverType',
        component: HomeComponent,
        data: {
          title: 'Home',
          userType: '0'
        },
      },
      {
        path: 'caregiver',
        loadChildren: () =>
          import('./caregiver/caregiver.module').then(m => m.CaregiverModule),
      },
      {
        path: 'client',
        loadChildren: () =>
          import('./client/client.module').then(m => m.ClientModule),
      },
      {
        path: 'client-faq',
        component: ClientFaqComponent,
        data: {
          title: 'Client Faq',
          userType: '0'
        },
      },
      {
        path: 'caregiver-faq',
        component: CaregiverFaqComponent,
        data: {
          title: 'Caregiver Faq',
          userType: '0'
        },
      },
      {
        path: 'service-description',
        component: ServiceDescriptionComponent,
        data: {
          title: 'Service Description',
          userType: '0'
        },
      },
      {
        path: 'about',
        component: AboutComponent,
        data: {
          title: 'About us',
          userType: '0'
        },
      },
      {
        path: 'stroke',
        component: StrokeComponent,
        data: {
          title: 'Stroke',
          userType: '0'
        },
      },
      {
        path: 'dementia',
        component: DementiaComponent,
        data: {
          title: 'Dementia',
          userType: '0'
        },
      },
      {
        path: 'diabetes',
        component: DiabetesComponent,
        data: {
          title: 'Diabetes',
          userType: '0'
        },
      },
      {
        path: 'wound',
        component: WoundComponent,
        data: {
          title: 'Wound',
          userType: '0'
        },
      },
      {
        path: 'post-surgery',
        component: PostSurgeryComponent,
        data: {
          title: 'Post Surgery',
          userType: '0'
        },
      },
      {
        path: 'palliative',
        component: PalliativeComponent,
        data: {
          title: 'Palliative',
          userType: '0'
        },
      },
      {
        path: 'mentally-challenged',
        component: MentallyChallengedComponent,
        data: {
          title: 'Mentally Challenged',
          userType: '0'
        },
      },
      {
        path: 'caregiver-change-password',
        component: ChangePasswordComponent,
        data: {
          title: 'Caregiver Change Password',
          userType: '0'
        },
      },
      {
        path: 'client-change-password',
        component: ChangePasswordComponent,
        data: {
          title: 'Client Change Password',
          userType: '0'
        },
      },
      {
        path: 'recommended-charges',
        component: RecomendedChargesComponent,
        data: {
          title: 'Client Change Password',
          userType: '0'
        },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule { }
