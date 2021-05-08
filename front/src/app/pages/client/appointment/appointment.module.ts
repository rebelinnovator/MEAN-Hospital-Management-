// Libraries
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';

// Routing
import { AppointmentRoutingModule } from './appointment-routing.module';

// Resolver
import { ProfileResolver } from '../profile/profile.resolver';

// Components
import { UpcomingComponent } from './upcoming/upcoming.component';
import { PastComponent } from './past/past.component';

@NgModule({
  declarations: [UpcomingComponent, PastComponent],
  imports: [
    CommonModule,
    NgbModule,
    TranslateModule.forChild(),
    AppointmentRoutingModule,
  ],
  providers: [ProfileResolver],
})
export class AppointmentModule {}
