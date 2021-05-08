// Libraries
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Ng5SliderModule } from 'ng5-slider';

// Routing
import { OnboardRoutingModule } from './onboard-routing.module';

// Resolver
import { OnboardResolver } from './onboard.resolver';

// Control Messages
import { ControlMessagesModule } from 'src/app/control-messages/control-messages.module';

// Components
import { AccountUserInfoComponent } from './account-user-info/account-user-info.component';
import { ServiceUserInfoComponent } from './service-user-info/service-user-info.component';
import { UserBackgroundComponent } from './user-background/user-background.component';
import { UserMedicalHistoryComponent } from './user-medical-history/user-medical-history.component';
import { TermsConditionsComponent } from './terms-conditions/terms-conditions.component';
import { ThankYouComponent } from './thank-you/thank-you.component';
import { TncChComponent } from './terms-conditions/tnc-ch/tnc-ch.component';
import { TncEnComponent } from './terms-conditions/tnc-en/tnc-en.component';

@NgModule({
  declarations: [
    AccountUserInfoComponent,
    ServiceUserInfoComponent,
    UserBackgroundComponent,
    UserMedicalHistoryComponent,
    TermsConditionsComponent,
    ThankYouComponent,
    TncChComponent,
    TncEnComponent,
  ],
  imports: [
    CommonModule,
    OnboardRoutingModule,
    TranslateModule.forChild(),
    FormsModule,
    ReactiveFormsModule,
    ControlMessagesModule,
    NgbModule,
    Ng5SliderModule,
  ],
  providers: [OnboardResolver],
})
export class OnboardModule { }
