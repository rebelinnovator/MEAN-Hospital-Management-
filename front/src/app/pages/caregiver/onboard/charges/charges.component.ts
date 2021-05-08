import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  FormArray,
  FormBuilder,
} from '@angular/forms';
import { ValidationService } from 'src/app/shared/services/validation.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { GlobalService } from '../../../../shared/services/global.service';
import { CaregiverService } from 'src/app/shared/services/caregiver.service';
import { NavigationService } from 'src/app/shared/services/navigation.service';
import { ConstantService } from 'src/app/shared/services/constant.service';
import { GetCharges, ChargesObject, InputArray, ApiResponse } from '../../caregiver.interface';
import { TranslateService } from '@ngx-translate/core';
import { LayoutComponent } from '../layout/layout.component';

@Component({
  selector: 'app-charges',
  templateUrl: './charges.component.html',
})
export class ChargesComponent implements OnInit {
  currentStepFromStorage: string;
  CaregiverChargesForm = new FormGroup({});
  uniqueNumber: number = 0;
  hourlyRateArray: object = ['1', '2', '3', '4', '5', '6', '7'];
  chargesFromAPI: any = [];
  registrationNo: number = 0;
  editMode: boolean = false;
  chargesData: any = {};
  fb = new FormBuilder();
  currentUrlSection: string;
  profileMode: boolean = false;
  isHourlyRateRequired: boolean = false;

  constructor(
    private validationService: ValidationService,
    private router: Router,
    private global: GlobalService,
    private caregiverService: CaregiverService,
    private toastr: ToastrService,
    private navigationService: NavigationService,
    private constant: ConstantService,
    private translate: TranslateService,
    public layoutComponent: LayoutComponent
  ) {
    this.currentStepFromStorage = localStorage.getItem('currentOnBoardingStep');
  }
  ngOnInit(): void {
    const urlParts: any = this.router.url.split('/');
    if (urlParts[2] && urlParts[2] !== '') {
      this.currentUrlSection = urlParts[2];
    }
    if (this.currentUrlSection === 'profile') {
      this.profileMode = true;
      localStorage.setItem('caregiverOnBoardCompleted', '1'); // 1==> Completed
    } else {
      this.profileMode = false;
      localStorage.setItem('caregiverOnBoardCompleted', '0'); // 0==> Not Completed
    }
    this.setChargesForm();
    this.onlinePaymentValidation();
    this.registrationNo = Number(localStorage.getItem('registeredNumber'));
    this.getCharges();
  }
  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
  setChargesForm() {
    this.CaregiverChargesForm = new FormGroup({
      hourly_rate: this.createHourlyRate(this.hourlyRateArray),
      payment_method_online: new FormControl(),
      payment_method_cheque: new FormControl(),
      fps_mobile_number: new FormControl('', [
        Validators.maxLength(this.global.lengthValidatorMobile),
        Validators.minLength(this.global.lengthValidatorMobile),
        this.validationService.onlyNumber,
      ]),
      bank_name: new FormControl('', [Validators.maxLength(this.global.lengthValidatorBankName)]),
      bank_code: new FormControl('', [Validators.maxLength(this.global.lengthValidatorBankCode)]),
      branch_code: new FormControl('', [Validators.maxLength(this.global.lengthValidatorBankCode)]),
      account_no: new FormControl('', [
        Validators.maxLength(this.global.lengthValidatorACC),
        this.validationService.onlyNumber,
      ]),
      account_name: new FormControl('', [Validators.maxLength(this.global.lengthValidatorACC)]),
    });
  }
  createHourlyRate(hourlyInput) {
    return this.fb.array(
      hourlyInput.map(i => {
        return this.fb.group({
          hour: i,
          price: '',
          value: '',
          id: '',
        });
      }),
    );
  }
  onlinePaymentValidation() {
    const fpsMobileNumber = this.CaregiverChargesForm.get('fps_mobile_number');
    const bankName = this.CaregiverChargesForm.get('bank_name');
    const bankCode = this.CaregiverChargesForm.get('bank_code');
    const branchCode = this.CaregiverChargesForm.get('branch_code');
    const accountNo = this.CaregiverChargesForm.get('account_no');
    const accountName = this.CaregiverChargesForm.get('account_name');
    this.CaregiverChargesForm.get(
      'payment_method_online',
    ).valueChanges.subscribe(paymentMethodOnline => {
      if (paymentMethodOnline === true) {
        fpsMobileNumber.setValidators([
          Validators.required,
          this.validationService.onlyNumber,
        ]);
        bankName.setValidators([Validators.required]);
        // bankCode.setValidators([
        //   Validators.required,
        //   this.validationService.onlyNumber,
        // ]);
        branchCode.setValidators([
          Validators.required,
          this.validationService.onlyNumber,
        ]);
        accountNo.setValidators([
          Validators.required,
          this.validationService.onlyNumber,
        ]);
        accountName.setValidators([Validators.required]);
      } else if (paymentMethodOnline === false) {
        this.CaregiverChargesForm.controls['fps_mobile_number'].setValue(null);
        this.CaregiverChargesForm.controls['bank_name'].setValue(null);
        this.CaregiverChargesForm.controls['bank_code'].setValue(null);
        this.CaregiverChargesForm.controls['branch_code'].setValue(null);
        this.CaregiverChargesForm.controls['account_no'].setValue(null);
        this.CaregiverChargesForm.controls['account_name'].setValue(null);
        fpsMobileNumber.setValidators(null);
        bankName.setValidators(null);
        bankCode.setValidators(null);
        branchCode.setValidators(null);
        accountNo.setValidators(null);
        accountName.setValidators(null);
      }
      fpsMobileNumber.updateValueAndValidity();
      bankName.updateValueAndValidity();
      bankCode.updateValueAndValidity();
      branchCode.updateValueAndValidity();
      accountNo.updateValueAndValidity();
      accountName.updateValueAndValidity();
    });
  }
  getCharges() {
    this.caregiverService
      .getCharges(this.registrationNo)
      .subscribe((returnData: GetCharges) => {
        const { success, data } = returnData;
        if (success) {
          const { account_name, account_no, bank_code, bank_name, branch_code, charges, fps_mobile_number, payment_method_cheque, payment_method_online } = data;
          this.chargesFromAPI = charges;
          const chargesObj = {
            hourly_rate: [],
            fps_mobile_number: '',
            bank_name: '',
            bank_code: '',
            branch_code: '',
            account_no: '',
            account_name: '',
            payment_method_online: false,
            payment_method_cheque: false,
          };
          if (charges.length > 0) {
            this.CaregiverChargesForm.controls.hourly_rate['controls'].map(
              (control: any, index) => {
                const matched = charges.find(
                  element => element.hour === index + 1,
                );
                if (matched) {
                  chargesObj.hourly_rate.push(matched);
                } else {
                  chargesObj.hourly_rate.push({
                    id: '',
                    caregiver_id: '',
                    hour: index + 1,
                    price: '',
                  });
                }
              },
            );
          }
          chargesObj.fps_mobile_number = fps_mobile_number;
          chargesObj.bank_name = bank_name;
          chargesObj.bank_code = bank_code;
          chargesObj.branch_code = branch_code;
          chargesObj.account_no = account_no;
          chargesObj.account_name = account_name;
          chargesObj.payment_method_online = Boolean(payment_method_online);
          chargesObj.payment_method_cheque = Boolean(payment_method_cheque);
          this.CaregiverChargesForm.patchValue(chargesObj);
          this.chargesData = this.CaregiverChargesForm.value.hourly_rate;
          if (this.chargesData.length !== 0) {
            this.editMode = true;
          }
        }
      });
  }
  changeMode(event, i) {
    this.editMode = true;
    const charges = this.CaregiverChargesForm.get('hourly_rate') as FormArray;
    charges.at(i).setValue({
      price: event.target.value,
      hour: charges.controls[i]['controls']['hour']['value'],
      value: charges.controls[i]['controls']['value']['value'],
      id: charges.controls[i]['controls']['id']['value'],
    });
  }
  createChargesArray(chargesArray) {
    this.chargesFromAPI.map((apiResponse: ChargesObject) => {
      const { id, hour, caregiver_id, price } = apiResponse;
      const tempArray: any = {};
      const matched = this.CaregiverChargesForm.value.hourly_rate.find(
        element => element.hour === hour,
      );
      if (hour < 7) {
        tempArray.id = id;
        tempArray.hour = hour;
        tempArray.price = matched.price;
      } else {
        const matchedLastNew = this.CaregiverChargesForm.value.hourly_rate.find(
          element => element.hour === 7,
        );
        tempArray.id = id;
        tempArray.hour = hour;
        tempArray.price = matchedLastNew.price;
      }
      chargesArray.push(tempArray);
    });
    this.CaregiverChargesForm.value.hourly_rate.map(
      (inputArray: InputArray) => {
        const { id, hour, price } = inputArray;
        if (id === '' || id === null) {
          chargesArray.push({
            hour,
            price,
          });
        }
      },
    );
    const matchedLast = this.CaregiverChargesForm.value.hourly_rate.find(
      element => element.hour === '7' || element.hour === 7,
    );
    if (matchedLast && matchedLast !== undefined) {
      for (let i = 8; i < 13; i++) {
        const tempArray: any = {};
        const filter = this.chargesFromAPI.filter(x => Number(x.hour) === i)[0];
        if (filter && filter !== undefined) {
          tempArray.id = this.chargesFromAPI.filter(x => Number(x.hour) === i)[0].id
        }
        tempArray.hour = String(i);
        tempArray.price = matchedLast.price;
        chargesArray.push(tempArray);
      }
    }
    chargesArray.map((final: any) => {
      if (final.price !== null && final.price !== '') {
        this.CaregiverChargesForm.value.charges.push(final);
      } else {
        if (final.id) {
          this.CaregiverChargesForm.value.deleted_charges.push(final.id);
        }
      }
    });
    return chargesArray;
  }
  eventCheck(fieldId) {
    if (this.CaregiverChargesForm.value.payment_method_cheque === true && this.CaregiverChargesForm.value.payment_method_online === true) {
      (document.getElementById(fieldId) as HTMLInputElement).checked = false;
      if (fieldId === 'cheque') {
        this.CaregiverChargesForm.patchValue({
          payment_method_cheque: false
        })
      } else if (fieldId === 'transfer') {
        this.CaregiverChargesForm.patchValue({
          payment_method_online: false
        })
      }
      this.toastr.error(this.translate.instant(this.constant.CANNOT_ACCEPT));
    }
  }
  addUpdateCharges() {
    let j = 0;
    if (!this.CaregiverChargesForm.valid) {
      this.validationService.validateAllFormFields(this.CaregiverChargesForm);
      return false;
    }
    const { hourly_rate } = this.CaregiverChargesForm.value
    let { payment_method_cheque, payment_method_online } = this.CaregiverChargesForm.value;
    this.CaregiverChargesForm.value.charges = [];
    this.CaregiverChargesForm.value.deleted_charges = [];
    let chargesArray: any = [];
    chargesArray = this.createChargesArray(chargesArray);
    for (let i = 0; i <= 6; i++) {
      if (!hourly_rate[i].price) {
        j++;
      }
    }

    // This part will handle the hourly rate madatory fields  
    if (j > 0) {
      this.toastr.error(this.translate.instant(this.constant.ALL_HOUR_INPUT));
      this.isHourlyRateRequired = true;
      return false;
    }
    else {
      this.isHourlyRateRequired = false;
    }

    if (payment_method_cheque === null && payment_method_online === null) {
      this.toastr.error(this.translate.instant(this.constant.SELECT_PAYMENT_METHOD));
      return false;
    } else if (payment_method_cheque === false && payment_method_online === false) {
      this.toastr.error(this.translate.instant(this.constant.SELECT_PAYMENT_METHOD));
      return false;
    }
    if (payment_method_online === null) {
      payment_method_online = false;
    }
    this.onlinePaymentValidation();
    payment_method_online = Number(
      payment_method_online,
    );
    payment_method_cheque = Number(
      payment_method_cheque,
    );

    if (payment_method_cheque === 1 && payment_method_online === 1) {
      this.toastr.error(this.translate.instant(this.constant.CANNOT_ACCEPT));
      return false;
    }
    this.CaregiverChargesForm.value.registration_no = this.registrationNo;
    this.caregiverService
      .addUpdateCharges(this.CaregiverChargesForm.value)
      .subscribe(
        (returnData: ApiResponse) => {
          const { success, message } = returnData;
          if (success) {
            this.toastr.success(this.translate.instant(message));
            this.setRedirection();
          }
        },
        err => {
          if (err.status === 400) {
            this.global.errorHandling(err, this.CaregiverChargesForm);
            this.validationService.validateAllFormFields(
              this.CaregiverChargesForm,
            );
          }
        },
      );
  }
  setRedirection() {
    if (this.profileMode) {
      localStorage.setItem('currentOnBoardingStep', this.navigationService.caregiverSteps.onboardCompleted);
      this.layoutComponent.changeDropDownValueFromComponent('Referral')
      const step = this.navigationService.caregiverSteps.documents;
      this.navigationService.navigateCaregiver(this.navigationService.profileAction, step);
    } else {
      localStorage.setItem('currentOnBoardingStep', this.navigationService.caregiverSteps.documents);
      if (Number(this.currentStepFromStorage) > Number(this.navigationService.caregiverSteps.charges)) {
        this.global.currentOnBoardStep = this.currentStepFromStorage;
      } else {
        this.global.currentOnBoardStep = Number(this.navigationService.caregiverSteps.charges);
      }
      this.layoutComponent.changeDropDownValueFromComponent('Documents')
      const step = this.navigationService.caregiverSteps.documents;
      this.navigationService.navigateCaregiver(this.navigationService.onboardAction, step);
    }
  }
  convertString(value) {
    return String(value);
  }
}
