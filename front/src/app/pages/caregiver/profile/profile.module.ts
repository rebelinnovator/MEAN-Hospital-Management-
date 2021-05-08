import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ControlMessagesModule } from 'src/app/control-messages/control-messages.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { OverviewComponent } from '../profile/overview/overview.component';
import { ProfileRoutingModule } from './profile-routing.module';
import { InfoComponent } from './info/info.component';
import { ReviewsComponent } from './reviews/reviews.component';
import { AvaibilityComponent } from './avaibility/avaibility.component';

@NgModule({
  declarations: [
    InfoComponent,
    ReviewsComponent,
    AvaibilityComponent,
    OverviewComponent,
  ],
  imports: [
    CommonModule,
    TranslateModule.forChild(),
    FormsModule,
    ReactiveFormsModule,
    ControlMessagesModule,
    ProfileRoutingModule,
    NgbModule,
  ],
})
export class ProfileModule {}
