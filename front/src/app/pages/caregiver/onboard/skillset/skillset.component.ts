import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormControl,
  FormBuilder,
  FormArray,
  Validators,
} from '@angular/forms';
import { ValidationService } from 'src/app/shared/services/validation.service';
import { GlobalService } from 'src/app/shared/services/global.service';
import { Router } from '@angular/router';
import { CaregiverService } from 'src/app/shared/services/caregiver.service';
import { ToastrService } from 'ngx-toastr';
import { NavigationService } from 'src/app/shared/services/navigation.service';
import { ConstantService } from 'src/app/shared/services/constant.service';
import { SkillsData, GetSkillSet, GetSkills } from '../../caregiver.interface';
import { TranslateService } from '@ngx-translate/core';
import { LayoutComponent } from '../layout/layout.component';

interface ApiResponse {
  message: string;
  status: number;
  success: boolean;
  data: object;
}

@Component({
  selector: 'app-skillset',
  templateUrl: './skillset.component.html',
})
export class SkillsetComponent implements OnInit {
  skillSetForm: FormGroup;
  fb = new FormBuilder();
  currentCaregiverType: string;
  personalCareArray: any = [];
  specialCareArray: any = [];
  registeredNumber: string;
  currentUrlSection: string;
  profileMode: boolean = false;
  currentStepFromStorage: string;
  showMessage: boolean = false;
  constructor(
    private validationService: ValidationService,
    public global: GlobalService,
    private router: Router,
    private caregiverService: CaregiverService,
    private toastr: ToastrService,
    private navigationService: NavigationService,
    private constant: ConstantService,
    private translate: TranslateService,
    public layoutComponent: LayoutComponent
  ) {
    this.currentCaregiverType = localStorage.getItem('currentCaregiverType');
    if (this.currentCaregiverType === '1' || this.currentCaregiverType === '2' || this.currentCaregiverType === '3') { // 1==> RN 2==> EN 3 ==> HW
      this.showMessage = true;
    } else {
      this.showMessage = false;
    }
    this.registeredNumber = localStorage.getItem('registeredNumber');
    this.currentStepFromStorage = localStorage.getItem('currentOnBoardingStep');
  }
  async ngOnInit() {
    this.setSkillSetForm();
    const urlParts: any = this.router.url.split('/');
    if (urlParts[2]) {
      this.currentUrlSection = urlParts[2];
    }
    if (this.currentUrlSection === 'profile') {
      this.profileMode = true;
      localStorage.setItem('caregiverOnBoardCompleted', '1');  // 1 ==> Completed
      localStorage.setItem('currentOnBoardingStep', '0'); // 0 ==> Redirect to first step
    } else {
      this.profileMode = false;
      localStorage.setItem('caregiverOnBoardCompleted', '0'); // 0 ==> In Complete
    }
    await this.getSkills();
  }
  getSkillSet() {
    this.caregiverService.getSkillSet(this.registeredNumber).subscribe(
      (returnData: GetSkillSet) => {
        const { success, data } = returnData;
        if (success) {
          const { skills } = data[0];
          const personalCareFromResponse: any = [];
          const specialCareFromResponse: any = [];
          if (data[0]) {
            this.skillSetForm.patchValue(data[0]);
            if (skills && skills.length > 0) {
              skills.map((skillsInner: any) => {
                if (skillsInner.type === this.global.personalCareType) {
                  personalCareFromResponse.push(skillsInner);
                } else if (skillsInner.type === this.global.specialCareType) {
                  specialCareFromResponse.push(skillsInner);
                }
              });
            }
          }
          this.skillSetForm.patchValue({
            personal_care: this.prefillPersonalCareSelection(
              this.skillSetForm.get('personal_care').value,
              personalCareFromResponse,
            ),
            special_care: this.prefillSpecialCareSelection(
              this.skillSetForm.get('special_care').value,
              specialCareFromResponse,
            ),
          });
        }
      }
    );
  }
  prefillSpecialCareSelection(specialCare, selectedSkills) {
    return specialCare.map(i => {
      const data = selectedSkills.filter(
        x => Number(x.id) === Number(i.value),
      )[0];
      if (data) {
        i.selected = true;
      } else {
        i.selected = false;
      }
      return i;
    });
  }
  prefillPersonalCareSelection(personalCare, selectedSkills) {
    return personalCare.map(i => {
      const data = selectedSkills.filter(
        x => Number(x.id) === Number(i.value),
      )[0];
      if (data) {
        i.selected = true;
      } else {
        i.selected = false;
      }
      return i;
    });
  }
  async getSkills() {
    const returnData: any = await this.caregiverService
      .getSkills(this.currentCaregiverType)
      .toPromise();
    const { success, data } = returnData;
    if (success) {
      if (data) {
        if (data.length > 0) {
          data.map((care: any) => {
            if (care.type === this.global.personalCareType) {
              this.personalCareArray.push(care);
            } else if (care.type === this.global.specialCareType) {
              this.specialCareArray.push(care);
            }
          });
        } else {
          this.personalCareArray = [];
          this.specialCareArray = [];
        }
      }
    } else {
      this.personalCareArray = [];
      this.specialCareArray = [];
    }
    if (this.personalCareArray.length > 0) {
      this.skillSetForm.setControl(
        'personal_care',
        this.createPersonalCare(this.personalCareArray),
      );
    }
    if (this.specialCareArray.length > 0) {
      this.skillSetForm.setControl(
        'special_care',
        this.createSpecialCare(this.specialCareArray),
      );
    }
  }
  setSkillSetForm() {
    this.skillSetForm = new FormGroup({
      self_introduction: new FormControl('', [
        Validators.maxLength(300),
        this.validationService.trimValidator,
        // this.validationService.wordCountValidator,
      ]),
      skills: new FormControl('', []),
      special_care: new FormArray([]),
      personal_care: new FormArray([]),
    });
    setTimeout(() => {
      this.getSkillSet();
    }, 1000);
  }
  createSpecialCare(specialCareInput) {
    if (specialCareInput.length > 0) {
      return this.fb.array(
        specialCareInput.map(i => {
          return this.fb.group({
            name: i.english_title,
            selected: false,
            value: i.id,
          });
        }),
      );
    }
  }
  createPersonalCare(personalCareInput) {
    if (personalCareInput.length > 0) {
      return this.fb.array(
        personalCareInput.map(i => {
          return this.fb.group({
            name: i.english_title,
            selected: false,
            value: i.id,
          });
        }),
      );
    }
  }
  createSkillsArray() {
    this.skillSetForm.value.personal_care.map((personal: any, index) => {
      if (personal.selected === true) {
        const tempArray: any = {};
        tempArray.language = personal.value;
        this.skillSetForm.value.skills.push(personal.value);
      }
    });
    this.skillSetForm.value.special_care.map((special: any, index) => {
      if (special.selected === true) {
        const tempArray: any = {};
        tempArray.language = special.value;
        this.skillSetForm.value.skills.push(special.value);
      }
    });
  }
  public addSkillSet() {
    if (!this.skillSetForm.valid) {
      this.validationService.validateAllFormFields(this.skillSetForm);
      return false;
    }
    this.skillSetForm.value.skills = [];
    this.createSkillsArray();
    if (this.skillSetForm.value.skills.length === 0) {
      this.toastr.error(this.translate.instant(this.constant.SELECT_ONE_SKILL));
      return false;
    }
    this.skillSetForm.value.registration_no = this.registeredNumber;
    delete this.skillSetForm.value.personal_care;
    delete this.skillSetForm.value.special_care;
    this.caregiverService.addUpdateSkillSet(this.skillSetForm.value).subscribe(
      (returnData: ApiResponse) => {
        const { success, message } = returnData;
        if (success) {
          this.toastr.success(this.translate.instant(message));
          localStorage.setItem('currentOnBoardingStep', this.navigationService.caregiverSteps.availability);
          if (Number(this.currentStepFromStorage) > Number(this.navigationService.caregiverSteps.availability)) {
            this.global.currentOnBoardStep = this.currentStepFromStorage;
          } else {
            this.global.currentOnBoardStep = Number(this.navigationService.caregiverSteps.availability);
          }
          if (this.profileMode === true) {
            localStorage.setItem('currentOnBoardingStep', this.navigationService.caregiverSteps.onboardCompleted);
            const step = this.navigationService.caregiverSteps.availability;
            this.layoutComponent.changeDropDownValueFromComponent('Availability');
            this.navigationService.navigateCaregiver(this.navigationService.profileAction, step);
          } else {
            const step = this.navigationService.caregiverSteps.availability;
            this.navigationService.navigateCaregiver(this.navigationService.onboardAction, step);
          }
        }
      },
      err => {
        if (err.status === 400) {
          this.global.errorHandling(err, this.skillSetForm);
          this.validationService.validateAllFormFields(this.skillSetForm);
        }
      },
    );
  }
}
