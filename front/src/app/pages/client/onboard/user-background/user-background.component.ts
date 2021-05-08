// Libraries
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Options } from 'ng5-slider';
import { TranslateService } from '@ngx-translate/core';

// Services
import { GlobalService } from 'src/app/shared/services/global.service';
import { ValidationService } from 'src/app/shared/services/validation.service';
import { ClientService } from 'src/app/shared/services/client.service';
import { NavigationService } from 'src/app/shared/services/navigation.service';
import { ConstantService } from 'src/app/shared/services/constant.service';
import { SeederResponse, GetServiceUserBackground, ServiceUserBackground, ApiResponse } from '../../client.interface';

// Component
import { ClientLayoutComponent } from '../client-layout/client-layout.component';

@Component({
  selector: 'app-user-background',
  templateUrl: './user-background.component.html'
})
export class UserBackgroundComponent implements OnInit {
  regularForm: FormGroup;
  userData: ServiceUserBackground;
  slug: string;
  selfcareAbilities: any;
  liftingDeviceTxtBox: boolean = false;
  dialectLangTxtBox: boolean = false;
  otherDrugTxtBox: boolean = false;
  languages = [
    { id: 1, name: 'Cantonese', selected: false },
    { id: 2, name: 'Mandarin', selected: false },
    { id: 3, name: 'English', selected: false },
    { id: 4, name: 'Others', selected: false },
  ];
  otherDevices = [
    { id: 1, name: 'Wear Pacemaker', selected: false },
    { id: 2, name: 'Hard to swallow', selected: false },
    { id: 3, name: 'Incontinence', selected: false },
    { id: 4, name: 'Drug Allergy', selected: false },
    { id: 5, name: 'Violence', selected: false },
  ];
  sliderOptions: Options = {
    showTicksValues: true,
    stepsArray: [
      { value: 0 },
      { value: 1 },
      { value: 2 },
      { value: 3 },
      { value: 4 },
      { value: 5 },
    ],
  };
  constructor(
    private toastr: ToastrService,
    private globalService: GlobalService,
    private validationService: ValidationService,
    private clientService: ClientService,
    private navigationService: NavigationService,
    private constant: ConstantService,
    private translate: TranslateService,
    public layout: ClientLayoutComponent,
  ) {
    this.slug = localStorage.getItem('slug');
  }

  ngOnInit(): void {
    this.setForm();
    this.getSelfcareAbilities();
  }

  getSelfcareAbilities() {
    this.clientService.getSelfcareAbilitiesList().subscribe(
      (response: SeederResponse) => {
        const { success, data } = response;
        if (success) {
          this.selfcareAbilities = data;
          if (this.slug) {
            this.getUserBackground();
          }
        }
      }
    );
  }

  setForm() {
    this.regularForm = new FormGroup({
      slug: new FormControl('', []),
      other_lang: new FormControl('', []),
      service_user_weight: new FormControl('', [
        Validators.required,
        this.validationService.onlyNumber,
      ]),
      service_user_height: new FormControl('', [
        Validators.required,
        this.validationService.onlyNumber,
      ]),
      service_user_diet: new FormControl(null, [Validators.required]),
      service_user_physical_ability: new FormControl(null, []),
      service_user_eye_sight: new FormControl(null, [Validators.required]),
      service_user_hearing: new FormControl(null, [Validators.required]),
      service_user_lifting: new FormControl(null, [Validators.required]),
      service_user_lifting_specific: new FormControl('', []),
      service_user_lower_left_leg_limb_mobility: new FormControl(0, []),
      service_user_lower_right_leg_limb_mobility: new FormControl(0, []),
      service_user_left_hand_mobility: new FormControl(0, []),
      service_user_right_hand_mobility: new FormControl(0, []),
      service_user_assisting_device: new FormControl(null, []),
      specific_drug: new FormControl('', []),
    });
  }

  setSelfCareAbilities() {
    const { selfCareAbilities } = this.userData;
    if (selfCareAbilities && selfCareAbilities.length) {
      this.selfcareAbilities = this.selfcareAbilities.map(ability => {
        ability.subAbilities.map(sub => {
          sub.selected = selfCareAbilities.find(
            e => e.id === sub.id) ? true : false;
        });
        return ability;
      });
    } else {
      this.selfcareAbilities = this.selfcareAbilities.map(ability => {
        ability.subAbilities.map(sub => {
          sub.selected = false;
        });
        return ability;
      });
    }
  }

  setLanguages() {
    const { languages } = this.userData;
    if (languages && languages.length) {
      this.languages = this.languages.map(lang => {
        lang.selected = languages.find(
          e => Number(e.language) === lang.id) ? true : false;
        return lang;
      });
    }

    // check for dialect language and set its value
    const dialectLang = languages.find(e => e.language === '4');
    if (languages && dialectLang) {
      this.dialectLangTxtBox = true;
      this.regularForm.controls['other_lang'].setValidators([Validators.required]);
      this.regularForm.patchValue({ other_lang: dialectLang.other_lang });
    }
  }

  setOtherDevices() {
    const { otherDevices } = this.userData;
    if (otherDevices && otherDevices.length) {
      this.otherDevices = this.otherDevices.map(device => {
        device.selected = otherDevices.find(
          e => Number(e.other_device) === device.id) ? true : false;
        return device;
      });
    }

    // check for dialect language and set its value
    const specificDrug = otherDevices.find(e => e.other_device === '4');
    if (otherDevices && specificDrug) {
      this.otherDrugTxtBox = true;
      this.regularForm.controls['specific_drug'].setValidators([Validators.required]);
      this.regularForm.patchValue({ specific_drug: specificDrug.specific_drug });
    }
  }

  getUserBackground() {
    this.clientService.getServiceUserBackground(this.slug).subscribe(
      (response: GetServiceUserBackground) => {
        const { success, data } = response;
        if (success) {
          this.userData = data;
          this.regularForm.patchValue(this.userData);

          // set self care abilities
          this.setSelfCareAbilities();

          // set languages
          this.setLanguages();

          // set other devices
          this.setOtherDevices();

          if (
            this.userData.service_user_lifting &&
            this.userData.service_user_lifting === '4'
          ) {
            this.liftingDeviceTxtBox = true;
          }
        }
      }
    );
  }

  liftingChange(event) {
    if (event.target.value === '4') {
      this.liftingDeviceTxtBox = true;
      this.regularForm.controls['service_user_lifting_specific'].setValidators([
        Validators.required,
      ]);
    } else {
      this.liftingDeviceTxtBox = false;
      this.regularForm.controls['service_user_lifting_specific'].clearValidators();
      this.regularForm.value.service_user_lifting_specific = null;
    }
  }

  selfcareChange(event, id) {
    this.selfcareAbilities.map(ability => {
      const subData = ability.subAbilities.find(e => e.id === id);
      if (subData) {
        subData.selected = event.target.checked;
      }
      return ability;
    });
  }

  langChange(event, id) {
    const language = this.languages.find(e => e.id === id);
    language.selected = event.target.checked;

    if (id === 4 && event.target.checked) {
      this.dialectLangTxtBox = true;
      this.regularForm.controls['other_lang'].setValidators([Validators.required]);
    } else if (id === 4 && !event.target.checked) {
      this.dialectLangTxtBox = false;
      this.regularForm.controls['other_lang'].clearValidators();
      this.regularForm.patchValue({ other_lang: null });
    }
  }

  deviceChange(event, id) {
    const device = this.otherDevices.find(e => e.id === id);
    device.selected = event.target.checked;

    if (id === 4 && event.target.checked) {
      this.otherDrugTxtBox = true;
      this.regularForm.controls['specific_drug'].setValidators([Validators.required]);
    } else if (id === 4 && !event.target.checked) {
      this.otherDrugTxtBox = false;
      this.regularForm.controls['specific_drug'].clearValidators();
      this.regularForm.patchValue({ specific_drug: null });
    }
  }

  onReactiveFormSubmit() {
    if (!this.regularForm.valid) {
      this.validationService.validateAllFormFields(this.regularForm);
      return false;
    }

    const { service_user_lower_left_leg_limb_mobility, service_user_lower_right_leg_limb_mobility, service_user_left_hand_mobility, service_user_right_hand_mobility } = this.regularForm.value;

    // left right leg mobility to string
    this.regularForm.value.service_user_lower_left_leg_limb_mobility = service_user_lower_left_leg_limb_mobility.toString();
    this.regularForm.value.service_user_lower_right_leg_limb_mobility = service_user_lower_right_leg_limb_mobility.toString();

    // left righ hand to mobility to string
    this.regularForm.value.service_user_left_hand_mobility = service_user_left_hand_mobility.toString();
    this.regularForm.value.service_user_right_hand_mobility = service_user_right_hand_mobility.toString();

    // Number for height and weight
    const { service_user_weight, service_user_height } = this.regularForm.value;
    this.regularForm.value.service_user_weight = Number(service_user_weight);
    this.regularForm.value.service_user_height = Number(service_user_height);

    // languages array set
    this.regularForm.value.languages = [];
    this.languages.map(lang => {
      if (lang.selected) {
        this.regularForm.value.languages.push({ language: lang.id });
      }
    });

    // other devices array set
    this.regularForm.value.other_devices = [];
    this.otherDevices.map(device => {
      if (device.selected) {
        this.regularForm.value.other_devices.push({ other_device: device.id });
      }
    });

    if (!this.regularForm.value.languages.length) {
      this.toastr.error(this.translate.instant(this.constant.SELECT_ONE_LANGUAGE));
      return false;
    }

    // self care abilities array set
    this.regularForm.value.selfCareAbilities = [];
    this.selfcareAbilities.map(ability => {
      ability.subAbilities.map(sub => {
        if (sub.selected) {
          this.regularForm.value.selfCareAbilities.push(sub.id);
        }
      });
    });
    if (this.regularForm.value.selfCareAbilities.length === 0) {
      this.toastr.error(this.translate.instant(this.constant.SELECT_ONE_SELFCARE));
      return false;
    }

    const { service_user_assisting_device } = this.regularForm.value;
    if (service_user_assisting_device === null || service_user_assisting_device === 'null') {
      delete this.regularForm.value.service_user_assisting_device;
    }

    this.clientService.addUpdateServiceUserBackground(this.regularForm.value).subscribe(
      (response: ApiResponse) => {
        const { success, message } = response;
        if (success) {
          this.toastr.success(this.translate.instant(message));
          const step = this.navigationService.clientSteps.medicalHistory;
          this.globalService.currentOnBoardStep = Number(step);
          this.globalService.currentStep = Number(step);
          localStorage.setItem('current_step', step);
          this.layout.changeDropDownValueFromComponent('Medical');
          this.navigationService.navigateClient(this.navigationService.onboardAction, step);
        }
      },
      error => {
        if (error.status === 400) {
          this.globalService.errorHandling(error, this.regularForm);
        }
      },
    );
  }
}
