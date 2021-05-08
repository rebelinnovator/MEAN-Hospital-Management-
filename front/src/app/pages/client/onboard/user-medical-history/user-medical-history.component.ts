// Libraries
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

// Services
import { GlobalService } from 'src/app/shared/services/global.service';
import { ValidationService } from 'src/app/shared/services/validation.service';
import { ClientService } from 'src/app/shared/services/client.service';
import { NavigationService } from 'src/app/shared/services/navigation.service';
import { ConstantService } from 'src/app/shared/services/constant.service';
import { IllnessList, IllnessData, GetServiceUserMedHistory, MedicalHistory, ApiResponse } from '../../client.interface';

// Component
import { ClientLayoutComponent } from '../client-layout/client-layout.component';

@Component({
  selector: 'app-user-medical-history',
  templateUrl: './user-medical-history.component.html'
})
export class UserMedicalHistoryComponent implements OnInit {
  regularForm: FormGroup;
  userData: MedicalHistory;
  slug: string;
  illnessList: Array<IllnessData>;
  showCancerTxtBox: boolean = false;
  specificCancer: string;
  showFractureTxtBox: boolean = false;
  specificFracture: string;

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
    this.getIllnesses();
  }

  getIllnesses() {
    this.clientService.getIllnessList().subscribe(
      (response: IllnessList) => {
        const { success, data } = response;
        if (success) {
          this.illnessList = data;
          if (this.slug) {
            this.getUserMedicalHistory();
          }
        }
      }
    );
  }

  setForm() {
    this.regularForm = new FormGroup({
      slug: new FormControl('', []),
      service_user_other_medical_history: new FormControl('', []),
    });
  }

  setIllness() {
    const { illness } = this.userData;
    if (illness && illness.length) {
      this.illnessList = this.illnessList.map(ill => {
        ill.selected = illness.find(e => e.id === ill.id) ? true : false;

        if (ill.children.length) {
          ill.children.map(child => {
            child.selected = illness.find(
              e => e.id === child.id) ? true : false;
          });
        }
        return ill;
      });
    } else {
      this.illnessList = this.illnessList.map(ill => {
        ill.selected = false;
        if (ill.children && ill.children.length) {
          ill.children.map(child => {
            child.selected = false;
          });
        }
        return ill;
      });
    }
  }

  getUserMedicalHistory() {
    this.clientService.getServiceUserMedicalHistory(this.slug).subscribe(
      (response: GetServiceUserMedHistory) => {
        const { success, data } = response;
        if (success) {
          this.userData = data;
          this.regularForm.patchValue(this.userData);

          const { illness } = this.userData;

          if (illness && illness.length) {
            const cencer = illness.find(e => e.id === 2);
            if (cencer) {
              const { pivot: { specific_title } } = cencer;
              this.showCancerTxtBox = true;
              this.specificCancer = specific_title;
            }

            const fracture = illness.find(e => e.id === 13);
            if (fracture) {
              const { pivot: { specific_title } } = fracture;
              this.showFractureTxtBox = true;
              this.specificFracture = specific_title;
            }
          }

          // set illnesses
          this.setIllness();
        }
      }
    );
  }

  illChange(event, id) {
    const illness = this.illnessList.find(e => e.id === id);
    illness.selected = event.target.checked;

    // cancer
    if (id === 2 && !this.showCancerTxtBox) {
      this.showCancerTxtBox = true;
    } else if (id === 2 && this.showCancerTxtBox) {
      this.showCancerTxtBox = false;
      this.specificCancer = null;
    }

    // fracture
    if (id === 6 && !event.target.checked) {
      illness.children.map((i) => { i.selected = false; return i; })
      this.showFractureTxtBox = false;
      this.specificFracture = null;
    }

  }

  illChildChange(event, dataId, childId) {
    const parent = this.illnessList.find(e => e.id === dataId);
    const child = parent.children.find(child1 => child1.id === childId);
    child.selected = event.target.checked;

    if (childId === 13 && event.target.checked) {
      this.showFractureTxtBox = true;
    } else if (childId === 13 && !event.target.checked) {
      this.showFractureTxtBox = false;
      this.specificFracture = null;
    }
  }

  onReactiveFormSubmit() {
    if (!this.regularForm.valid) {
      this.validationService.validateAllFormFields(this.regularForm);
      return false;
    }

    if (this.showCancerTxtBox && !this.specificCancer) {
      this.toastr.warning(this.translate.instant(this.constant.SPECIFY_CANCER));
      return false;
    }

    if (this.showFractureTxtBox && !this.specificFracture) {
      this.toastr.warning(this.translate.instant(this.constant.SPECIFY_FRAC));
      return false;
    }

    const fractureObj = this.illnessList.find((i) => i.id === 6)
    if (fractureObj.selected) {
      const childSelected = fractureObj.children.some((i) => i.selected);
      if (!childSelected) {
        this.toastr.warning(this.translate.instant(this.constant.SPECIFY_ONE_FRAC));
        return false;
      }
    } else {
      fractureObj.children.map((i) => { i.selected = false; return i; })
      this.showFractureTxtBox = false;
      this.specificFracture = null;
    }

    const hepatitisObj = this.illnessList.find((i) => i.id === 16)
    if (hepatitisObj.selected) {
      const childSelected = hepatitisObj.children.some((i) => i.selected);
      if (!childSelected) {
        this.toastr.warning(this.translate.instant(this.constant.SPECIFY_ONE_HEPA));
        return false;
      }
    } else {
      hepatitisObj.children.map((i) => { i.selected = false; return i; })
    }


    // illness array set
    this.regularForm.value.illnesses = [];
    this.illnessList.map(ill => {
      if (ill.selected && !ill.is_specific) {
        this.regularForm.value.illnesses.push({ illness_id: ill.id });
      } else if (ill.selected && ill.is_specific) {
        this.regularForm.value.illnesses.push({
          illness_id: ill.id,
          specific_title: this.specificCancer,
        });
      }

      if (ill.children.length) {
        ill.children.map(child => {
          if (child.selected && !child.is_specific) {
            this.regularForm.value.illnesses.push({ illness_id: child.id });
          } else if (child.selected && child.is_specific) {
            this.regularForm.value.illnesses.push({
              illness_id: child.id,
              specific_title: this.specificFracture,
            });
          }
        });
      }
    });

    this.clientService.addUpdateServiceUserMedicalHistory(this.regularForm.value).subscribe(
      (response: ApiResponse) => {
        const { success, message } = response;
        if (success) {
          this.toastr.success(this.translate.instant(message));
          const step = this.navigationService.clientSteps.terms;
          this.globalService.currentOnBoardStep = Number(step);
          this.globalService.currentStep = Number(step);
          localStorage.setItem('current_step', step);
          this.layout.changeDropDownValueFromComponent('Terms');
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
