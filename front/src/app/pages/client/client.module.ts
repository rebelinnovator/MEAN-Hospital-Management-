import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ClientRoutingModule } from './client-routing.module';
import { ControlMessagesModule } from 'src/app/control-messages/control-messages.module';
import { FeedbackComponent } from './feedback/feedback.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [FeedbackComponent],
  imports: [
    CommonModule,
    ClientRoutingModule,
    TranslateModule.forChild(),
    ControlMessagesModule,
    ReactiveFormsModule,
  ],
})
export class ClientModule {}
