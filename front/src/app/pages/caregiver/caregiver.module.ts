import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CaregiverRoutingModule } from './caregiver-routing.module';
import { TranslateModule } from '@ngx-translate/core';
import { ControlMessagesModule } from 'src/app/control-messages/control-messages.module';
import { CaregiverProfileResolver } from './profile.resolver';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { CaregiverOnboardResolver } from './onboard.resolver';
import { AcceptComponent } from './booking/accept/accept.component';
import { RejectComponent } from './booking/reject/reject.component';
import { AcceptedByOtherComponent } from './booking/accepted-by-other/accepted-by-other.component';
import { BookingConfirmedComponent } from './booking-confirmed/booking-confirmed.component';
import { ProfileViewResolver } from './profile-view.resolver';

@NgModule({
  declarations: [
    AcceptComponent,
    RejectComponent,
    AcceptedByOtherComponent,
    BookingConfirmedComponent,
  ],
  imports: [
    CommonModule,
    CaregiverRoutingModule,
    TranslateModule.forChild(),
    ControlMessagesModule,
    AngularMultiSelectModule,
  ],
  providers: [
    CaregiverProfileResolver,
    CaregiverOnboardResolver,
    ProfileViewResolver
  ],
})
export class CaregiverModule { }
