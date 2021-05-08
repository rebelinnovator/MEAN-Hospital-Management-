import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PagesRoutingModule } from './pages-routing.module';
import { HomeComponent } from './home/home.component';
import { TranslateModule } from '@ngx-translate/core';
import { ControlMessagesModule } from '../control-messages/control-messages.module';
import { ServiceDescriptionComponent } from './service-description/service-description.component';
import { StrokeComponent } from './Illness/stroke/stroke.component';
import { DementiaComponent } from './Illness/dementia/dementia.component';
import { DiabetesComponent } from './Illness/diabetes/diabetes.component';
import { WoundComponent } from './Illness/wound/wound.component';
import { PalliativeComponent } from './Illness/palliative/palliative.component';
import { PostSurgeryComponent } from './Illness/post-surgery/post-surgery.component';
import { MentallyChallengedComponent } from './Illness/mentally-challenged/mentally-challenged.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { SearchComponent } from './caregiver/search/search.component';
import { RecomendedChargesComponent } from './recomended-charges/recomended-charges.component';
import { TranslationComponent } from './translation/translation.component';
@NgModule({
  declarations: [
    HomeComponent,
    ServiceDescriptionComponent,
    StrokeComponent,
    DementiaComponent,
    DiabetesComponent,
    WoundComponent,
    PostSurgeryComponent,
    PalliativeComponent,
    MentallyChallengedComponent,
    ChangePasswordComponent,
    SearchComponent,
    RecomendedChargesComponent,
    TranslationComponent,
  ],
  imports: [
    CommonModule,
    PagesRoutingModule,
    TranslateModule.forChild(),
    ControlMessagesModule,
    FormsModule,
    ReactiveFormsModule,
    CarouselModule,
    NgbModule,
    AngularMultiSelectModule,
  ],
})
export class PagesModule {}
