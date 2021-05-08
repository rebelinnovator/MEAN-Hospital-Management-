import { Injectable } from '@angular/core';
import { FormGroup, FormControl, AbstractControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class ValidationService {
  constructor(private translate: TranslateService) { }

  getValidatorErrorMessage(
    validatorName: string,
    validatorValue?: any,
    fieldName?: any,
  ) {
    if (!fieldName) {
      fieldName = 'This';
    }
    const config = {
      required: `${this.translate.instant('Required')}`,
      // required: `${fieldName} ${this.translate.instant('is required')}`,
      invalidEmailAddress: `${this.translate.instant('Invalid email address')}`,
      invalidPassword:
        `${this.translate.instant('Invalid password. Password must be 6 characters long, at least 1 capital letter, 1 small letter and 1 numeric character')}`,
      minlength: `${this.translate.instant('Minimum length')} ${validatorValue.requiredLength}`,
      maxlength: `${this.translate.instant('Maximum length')} ${validatorValue.requiredLength}`,
      min: `${this.translate.instant('Minimum length')} ${validatorValue.min}`,
      max: `${this.translate.instant('Maximum length')} ${validatorValue.max}`,
      equalTo: `${this.translate.instant('Confirm password not matching')}`,
      invalidUrl: `${this.translate.instant('Invalid website url')}`,
      invalidPattern: `${fieldName} ${this.translate.instant('is Invalid')}`,
      pattern: `${fieldName} ${this.translate.instant('is Invalid')}`,
      invalidNumber: `${this.translate.instant('Please enter valid number')}`,
      invalidTime: `${this.translate.instant('Please enter hour between 1 to 12')}`,
      whitespace: `${this.translate.instant('Whitespaces are not allowed')}`,
      invalidWordCount: `${this.translate.instant('Only 50 words are allowed')}`,
      invalidChar: `${this.translate.instant('Only Characters are allowed')}`,
      invalidHeight: `${this.translate.instant('Invalid height')}`,
      mobileFormat: `${this.translate.instant('Invalid mobile number')}`,
    };

    return config[validatorName];
  }

  trimValidator(control) {
    if (control.value && control.value !== null) {
      control.value = String(control.value);
      if (control.value.startsWith(' ')) {
        return { whitespace: true };
      }
    }
    return null;
  }

  emailValidator(control) {
    // RFC 2822 compliant regex
    if (control.value) {
      if (control.value.match(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/)) {
        return null;
      } else {
        return { invalidEmailAddress: true };
      }
    } else {
      return null;
    }
  }

  // ^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{4,8}$
  // ^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,}$

  passwordValidator(control) {
    // {6,100}           - Assert password is between 6 and 100 characters
    // (?=.*[0-9])       - Assert a string has at least one number
    if (control.value) {
      if (
        control.value.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\s).{6,}$/)
      ) {
        return null;
      } else {
        return { invalidPassword: true };
      }
    }
  }

  urlValidator(control) {
    if (control.value) {
      if (
        control.value.match(
          /^(http[s]?:\/\/){0,1}(www\.){0,1}[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,5}[\.]{0,1}/,
        )
      ) {
        return null;
      } else {
        return { invalidUrl: true };
      }
    }
  }

  alphaNumericValidator(control) {
    if (control.value) {
      if (control.value.match(/^[a-z A-Z0-9_]*$/)) {
        return null;
      } else {
        return { invalidPattern: true };
      }
    }
  }
  wordCountValidator(control) {
    if (control.value) {
      if (control.value.split(' ').length <= 50) {
        return null;
      } else {
        return { invalidWordCount: true };
      }
    }
  }

  MatchPassword(AC: AbstractControl) {
    const password = AC.get('password').value; // to get value in input tag
    const confirmPassword = AC.get('cnfmpassword').value; // to get value in input tag
    if (password && confirmPassword) {
      if (password !== confirmPassword) {
        AC.get('cnfmpassword').setErrors({ equalTo: true });
      } else {
        AC.get('cnfmpassword').setErrors(null);
      }
    }
  }

  mobileNumber(control) {
    if (control.value) {
      if (control.value.split('').length === 8) {
        return null;
      } else {
        return { mobileFormat: true };
      }
    }
  }

  // ^[1-9]+[0-9]*$
  // (^\d*\.?\d*[1-9]+\d*$)|(^[1-9]+\d*\.\d*$)

  onlyNumber(control) {
    if (control.value) {
      if (control.value.toString().match(/^\d{0,15}(\.\d{0,2})?$/)) {
        return null;
      } else {
        return { invalidNumber: true };
      }
    }
  }
  onlyNumberTime(control) {
    if (control.value) {
      if (control.value.toString().match(/^\d{0,10}(\.\d{0,2})?$/)) {
        if (control.value > 0 && control.value <= 12) {
          return null;
        } else {
          return { invalidTime: true };
        }
      } else {
        return { invalidNumber: true };
      }
    }
  }

  heightValidation(control) {
    if (control.value) {
      if (control.value.toString().match(/^[0-9]+\.([ ]?[0-9]{1,2}[\"]?|)$/)) {
        return null;
      } else {
        return { invalidHeight: true };
      }
    }
  }

  // Validate all fields on submit
  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });
  }

  // Validate all fields on submit for formarray
  validateAllFormArrayFields(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach((field: any) => {
      Object.values(field.controls).forEach((subField: any) => {
        Object.keys(subField.controls).forEach(innerField => {
          const control = subField.get(innerField);
          if (control instanceof FormControl) {
            control.markAsTouched({ onlySelf: true });
          } else if (control instanceof FormGroup) {
            this.validateAllFormFields(control);
          }
        });
      });
    });
  }

  onlyChars(control) {
    if (control.value) {
      if (
        control.value
          .toString()
          .match(/^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/)
      ) {
        return null;
      } else {
        return { invalidChar: true };
      }
    }
  }
}
