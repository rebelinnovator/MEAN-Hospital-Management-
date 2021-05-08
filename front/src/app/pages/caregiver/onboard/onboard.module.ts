import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { OnboardRoutingModule } from './onboard-routing.module'
import { TranslateModule } from '@ngx-translate/core'
import { PersonalInfoComponent } from './personal-info/personal-info.component'
import { WorkInfoComponent } from './work-info/work-info.component'
import { SkillsetComponent } from './skillset/skillset.component'
import { AvailabilityComponent } from './availability/availability.component'
import { ChargesComponent } from './charges/charges.component'
import { DocumentsComponent } from './documents/documents.component'
import { TermsComponent } from './terms/terms.component'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { ControlMessagesModule } from 'src/app/control-messages/control-messages.module'
import { NgbModule } from '@ng-bootstrap/ng-bootstrap'
import { ThankyouComponent } from './thankyou/thankyou.component'
import { ReferralBonusComponent } from './referral-bonus/referral-bonus.component';
import { TermsEnComponent } from './terms/terms-en/terms-en.component';
import { TermsChComponent } from './terms/terms-ch/terms-ch.component'
@NgModule({
  declarations: [
    PersonalInfoComponent,
    WorkInfoComponent,
    SkillsetComponent,
    AvailabilityComponent,
    ChargesComponent,
    DocumentsComponent,
    TermsComponent,
    ThankyouComponent,
    ReferralBonusComponent,
    TermsEnComponent,
    TermsChComponent,
  ],
  imports: [
    CommonModule,
    OnboardRoutingModule,
    TranslateModule.forChild(),
    FormsModule,
    ReactiveFormsModule,
    ControlMessagesModule,
    NgbModule
  ],
})
export class OnboardModule { }
