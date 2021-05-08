import { Component, OnInit, Input } from '@angular/core'
import { FormControl } from '@angular/forms'
import { ValidationService } from 'src/app/shared/services/validation.service'

@Component({
  selector: 'app-control-message',
  templateUrl: './control-message.component.html',
})
export class ControlMessageComponent implements OnInit {
  @Input() control: FormControl
  @Input() fieldName: string
  constructor(
    private validationService: ValidationService
  ) { }

  ngOnInit(): void { }
  get errorMessage() {
    for (const propertyName in this.control.errors) {
      if (
        this.control.errors.hasOwnProperty(propertyName) &&
        this.control.touched
      ) {
        if (propertyName === 'serverError') {
          return this.control.errors[propertyName]
        }
        return this.validationService.getValidatorErrorMessage(
          propertyName,
          this.control.errors[propertyName],
          this.fieldName
        )
      }
    }
    return null
  }
}