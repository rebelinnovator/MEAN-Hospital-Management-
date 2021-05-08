import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ControlMessageComponent } from './control-message/control-message.component'

@NgModule({
  declarations: [ControlMessageComponent],
  imports: [CommonModule],
  exports: [ControlMessageComponent],
})
export class ControlMessagesModule { }
