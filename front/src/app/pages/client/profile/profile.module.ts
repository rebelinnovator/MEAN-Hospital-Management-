// Libraries
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { ControlMessagesModule } from 'src/app/control-messages/control-messages.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Ng5SliderModule } from 'ng5-slider';

// Routing
import { ProfileRoutingModule } from './profile-routing.module';

// Resolver
import { ProfileResolver } from './profile.resolver';

// Components
import { AccountUserInfoComponent } from './account-user-info/account-user-info.component';
import { ServiceUserInfoComponent } from './service-user-info/service-user-info.component';
import { ServiceUserBackgroundComponent } from './service-user-background/service-user-background.component';
import { ServiceUserMedicalHistoryComponent } from './service-user-medical-history/service-user-medical-history.component';
import { ReferralBonusComponent } from './referral-bonus/referral-bonus.component';

@NgModule({
  declarations: [
    AccountUserInfoComponent,
    ServiceUserInfoComponent,
    ServiceUserBackgroundComponent,
    ServiceUserMedicalHistoryComponent,
    ReferralBonusComponent,
  ],
  imports: [
    CommonModule,
    NgbModule,
    TranslateModule.forChild(),
    ProfileRoutingModule,
    ControlMessagesModule,
    FormsModule,
    ReactiveFormsModule,
    Ng5SliderModule,
  ],
  providers: [ProfileResolver],
})
export class ProfileModule {}
