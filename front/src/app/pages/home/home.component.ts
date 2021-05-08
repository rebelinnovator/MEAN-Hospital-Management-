import { Component, OnInit } from '@angular/core';
import { CaregiverService } from 'src/app/shared/services/caregiver.service';
import { OwlOptions } from 'ngx-owl-carousel-o';
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
} from '@angular/forms';
import { ValidationService } from 'src/app/shared/services/validation.service';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ConstantService } from 'src/app/shared/services/constant.service';
import { GlobalService } from 'src/app/shared/services/global.service';
import { NavigationService } from 'src/app/shared/services/navigation.service';
import { GetSkillsHomePage, SkillSetData } from '../caregiver/caregiver.interface';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styles: [' .caregivers-section { min-height: 550px !important; }']
})
export class HomeComponent implements OnInit {
  caregiverSearchForm: FormGroup;
  showSearchForm: boolean = false;
  currentSkillSet: string;
  personalCareArray: SkillSetData[];
  specialCareArray: SkillSetData[];
  personalCareArrayToShow: SkillSetData[];
  specialCareArrayToShow: SkillSetData[];
  showAllButton: boolean = true;
  isUserLoggedIn: boolean = false;
  customOptions: OwlOptions = {
    items: 1,
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: false,
    navSpeed: 700,
    autoWidth: true,
    navText: ['', ''],
    nav: false,
  };
  careGiverType: any = [
    { id: 1, name: 'Registered Nurse' },
    { id: 2, name: 'Enrolled Nurse' },
    { id: 3, name: 'Health Worker' },
    { id: 4, name: 'Personal Care Worker' },
    { id: 5, name: 'Out-Patient Escort Person' },
  ];
  showServices: boolean = false;
  minDate: object;
  maxDate: object;
  caregiverType: number = 0;
  allCaregiverTypes: any = [1, 3, 4, 5];
  // For Multiselect Dropdown
  settingsPersonalCare: any = {};
  settingsSpecialCare: any = {};
  showNurseMessage: boolean = false;
  isSearched: boolean = false;
  hoursArray: Array<string> = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
  showThirtyMinute: boolean = true;
  currentSkillsSection: string = 'Registered';
  constructor(
    private caregiverService: CaregiverService,
    private formBuilder: FormBuilder,
    private validationService: ValidationService,
    private router: Router,
    private toastr: ToastrService,
    private activatedRoute: ActivatedRoute,
    private constant: ConstantService,
    public global: GlobalService,
    private navigationService: NavigationService,
    private translate: TranslateService
  ) {
    const token = localStorage.getItem('token');
    if (token && token !== '' && token !== null && token !== undefined) {
      this.isUserLoggedIn = true;
    }
    this.caregiverType = Number(this.activatedRoute.snapshot.paramMap.get('caregiverType'));
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        let urlParts: any = [];
        urlParts = event.urlAfterRedirects.split('/');
        if (urlParts[2] && urlParts[2] !== '') {
          this.caregiverType = Number(urlParts[2]);
          if (this.caregiverType === 1) {
            this.currentSkillsSection = 'Registered';
          } else if (this.caregiverType === 3) {
            this.currentSkillsSection = 'Worker';
          } else if (this.caregiverType === 4) {
            this.currentSkillsSection = 'Personal';
          } else if (this.caregiverType === 5) {
            this.currentSkillsSection = 'Escort';
          }
          if (this.caregiverType !== 0 && this.allCaregiverTypes.includes(this.caregiverType)) {
            this.currentSkillSet = String(this.caregiverType);
            this.getSkills(String(this.caregiverType));
            document.getElementById('caregiver-type-section').scrollIntoView();
          }
        } else {
          this.getSkills('1');
        }
      }
    });
  }

  ngOnInit(): void {
    window.scrollTo(0, 0);
    if (this.caregiverType !== 0 && this.allCaregiverTypes.includes(this.caregiverType)) {
      this.currentSkillSet = String(this.caregiverType);
      this.getSkills(this.caregiverType);
      document.getElementById('caregiver-type-section').scrollIntoView();
    } else {
      this.getSkills('1');
    }
    const current = new Date();
    this.minDate = {
      year: current.getFullYear(),
      month: current.getMonth() + 1,
      day: current.getDate(),
    };
    this.maxDate = {
      year: current.getFullYear(),
      month: current.getMonth() + 7,
      day: current.getDate(),
    };
    this.setSearchForm();
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.settingsPersonalCare = {
        text: this.translate.instant('Personal Care'),
        selectAllText: this.translate.instant('Select All'),
        unSelectAllText: this.translate.instant('UnSelect All'),
        classes: 'myclass custom-class',
        singleSelection: false,
        lazyLoading: true,
        enableCheckAll: false,
        enableSearchFilter: false,
        badgeShowLimit: 2,
        searchPlaceholderText: this.translate.instant('Search Personal Care'),
        showCheckbox: true,
        maxHeight: 'auto'
      };
      this.settingsSpecialCare = {
        text: this.translate.instant('Special Care'),
        selectAllText: this.translate.instant('Select All'),
        unSelectAllText: this.translate.instant('UnSelect All'),
        classes: 'myclass custom-class',
        singleSelection: false,
        lazyLoading: true,
        enableCheckAll: false,
        enableSearchFilter: false,
        badgeShowLimit: 2,
        searchPlaceholderText: this.translate.instant('Search Special Care'),
        showCheckbox: true,
        noDataLabel: 'None',
        maxHeight: 'auto'
      };
      this.getSkills('1');
    })
  }
  searchInputChanged(event, field) {
    if (field === 'caregiver_type') {
      this.isSearched = true;
      this.getSkills(event.target.value, 1);
    }
  }
  setSearchForm() {
    this.caregiverSearchForm = this.formBuilder.group({
      registration_no: new FormControl('', [
        this.validationService.onlyNumber,
        this.validationService.trimValidator,
      ]),
      caregiver_type: new FormControl('', []),
      personal_care_skills: ['', []],
      special_care_skills: ['', []],
      date: new FormControl('', [Validators.required]),
      start_time: new FormControl('', [Validators.required]),
      start_minutes: new FormControl({ value: '00', disabled: false }, [Validators.required]),
      start_meridian: new FormControl({ value: 'AM', disabled: false }, [
        Validators.required,
      ]),
      end_time: new FormControl('', [Validators.required]),
      end_minutes: new FormControl({ value: '00', disabled: false }, [Validators.required]),
      end_meridian: new FormControl({ value: 'AM', disabled: false }, [
        Validators.required,
      ]),
    });
    this.settingsPersonalCare = {
      text: this.translate.instant('Personal Care'),
      selectAllText: this.translate.instant('Select All'),
      unSelectAllText: this.translate.instant('UnSelect All'),
      classes: 'myclass custom-class',
      singleSelection: false,
      lazyLoading: true,
      enableCheckAll: false,
      enableSearchFilter: false,
      badgeShowLimit: 2,
      searchPlaceholderText: this.translate.instant('Search Personal Care'),
      showCheckbox: true,
      maxHeight: 'auto'
    };
    this.settingsSpecialCare = {
      text: this.translate.instant('Special Care'),
      selectAllText: this.translate.instant('Select All'),
      unSelectAllText: this.translate.instant('UnSelect All'),
      classes: 'myclass custom-class',
      singleSelection: false,
      lazyLoading: true,
      enableCheckAll: false,
      enableSearchFilter: false,
      badgeShowLimit: 2,
      searchPlaceholderText: this.translate.instant('Search Special Care'),
      showCheckbox: true,
      noDataLabel: 'None',
      maxHeight: 'auto'
    };
  }
  caregiverSearch() {
    if (!this.caregiverSearchForm.valid) {
      this.validationService.validateAllFormFields(this.caregiverSearchForm);
      return false;
    }
    const {
      start_time,
      end_time,
      start_meridian,
      end_meridian,
      start_minutes,
      end_minutes,
      personal_care_skills,
      special_care_skills
    } = this.caregiverSearchForm.value;

    if (Number(start_time) === 0 || Number(end_time) === 0) {
      this.toastr.error(this.translate.instant(this.constant.HOURS_ERROR));
      return false;
    }
    let fullStartTime = 0;
    if (start_meridian === 'AM') {
      if (start_time === '12' || start_time === 12) {
        fullStartTime = 0;
      } else {
        fullStartTime = start_time;
      }
    } else if (start_meridian === 'PM') {
      if (start_time === '12' || start_time === 12) {
        fullStartTime = 12;
      } else {
        fullStartTime = Number(
          Number(start_time) + 12,
        );
      }
    }
    let fullEndTime = 0;
    if (end_meridian === 'AM') {
      if (end_time === '12' || end_time === 12) {
        fullEndTime = 24;
      } else {
        fullEndTime = end_time;
      }
    } else if (end_meridian === 'PM') {
      if (end_time === '12' || end_time === 12) {
        fullEndTime = 12;
      } else {
        fullEndTime = Number(
          Number(end_time) + 12,
        );
      }
    }
    // Check if full hour is there in search
    if (start_minutes === '30') {
      fullStartTime = Number(fullStartTime) + Number(0.5);
    }
    if (end_minutes === '30') {
      fullEndTime = Number(fullEndTime) + Number(0.5);
    }
    if (fullEndTime < fullStartTime) {
      this.toastr.error(this.translate.instant(this.constant.FROM_TIME));
      return false;
    }
    if (fullEndTime === fullStartTime) {
      this.toastr.error(this.translate.instant(this.constant.FROM_TIME));
      return false;
    }
    let hoursDifference: number = 0;
    hoursDifference = fullEndTime - fullStartTime;
    if (!Number.isInteger(hoursDifference)) {
      this.toastr.error(this.translate.instant(this.constant.HOURLY_DIFFERENCE_SEARCH));
      return false;
    }
    if (hoursDifference > 12) {
      this.toastr.error(this.translate.instant(this.constant.MAXIMUM_SERVICE));
      return false;
    }

    this.caregiverSearchForm.value.services = [];
    if (personal_care_skills && personal_care_skills.length > 0) {
      personal_care_skills.map(
        (personalCare: any) => {
          this.caregiverSearchForm.value.services.push(personalCare.id);
        },
      );
    }
    if (special_care_skills && special_care_skills.length > 0) {
      special_care_skills.map(
        (specialCare: any) => {
          this.caregiverSearchForm.value.services.push(specialCare.id);
        },
      );
    }
    delete this.caregiverSearchForm.value.personal_care_skills;
    delete this.caregiverSearchForm.value.special_care_skills;
    const encrytedData: any = btoa(
      JSON.stringify(this.caregiverSearchForm.value),
    );
    this.navigationService.navigateWithData(encrytedData);
  }
  setArray(value) {
    this.showAllButton = Boolean(value);
    if (this.showAllButton === true) {
      this.personalCareArrayToShow = this.personalCareArray.slice(0, 7);
      this.specialCareArrayToShow = this.specialCareArray.slice(0, 7);
    } else if (this.showAllButton === false) {
      this.personalCareArrayToShow = this.personalCareArray;
      this.specialCareArrayToShow = this.specialCareArray;
    }
  }
  getSkills(typeVal: any, showAll?) {
    this.currentSkillSet = typeVal;
    this.showServices = false;
    if (this.currentSkillSet === '1' || this.currentSkillSet === '2' || this.currentSkillSet === '3') { // 1==> RN, 2==> EN, 3 ==> HW
      this.showNurseMessage = true;
    } else {
      this.showNurseMessage = false;
    }
    this.caregiverService.getSkills(typeVal).subscribe(
      (returnData: GetSkillsHomePage) => {
        const { success, data } = returnData;
        if (success) {
          this.personalCareArray = [];
          this.specialCareArray = [];
          this.caregiverSearchForm.controls['personal_care_skills'].reset();
          this.caregiverSearchForm.controls['special_care_skills'].reset();
          if (data.length > 0) {
            data.map((skills: any) => {
              const { english_title, type } = skills;

              skills.itemName = this.translate.instant(english_title);
              if (type === this.global.personalCareType) {
                this.personalCareArray.push(skills);
              } else if (type === this.global.specialCareType) {
                this.specialCareArray.push(skills);
              }
            });
            this.showServices = true;
            if (this.specialCareArray.length > 1) {
              this.settingsSpecialCare.maxHeight = 300;
            } else {
              this.settingsSpecialCare.maxHeight = 'auto';
            }
            if (this.personalCareArray.length > 2) {
              this.settingsPersonalCare.maxHeight = 300;
            } else {
              this.settingsPersonalCare.maxHeight = 'auto';
            }
          }
          if (showAll !== '1') {
            this.setArray(1);
          }
        }
      },
      err => {
        this.personalCareArray = [];
        this.specialCareArray = [];
      },
    );
  }
  resetAndClose() {
    this.showServices = false;
    this.personalCareArray = [];
    this.specialCareArray = [];
    this.caregiverSearchForm.reset();
    this.caregiverSearchForm.patchValue({
      end_meridian: 'AM',
      start_meridian: 'AM',
      caregiver_type: '',
      start_minutes: '00',
      end_minutes: '00',
      start_time: '',
      end_time: '',
    })
    this.showSearchForm = !this.showSearchForm;
  }
  endTimeChanged() {
    const { end_time, end_meridian } = this.caregiverSearchForm.value;
    if (end_time === '12' && end_meridian === 'AM') {
      this.showThirtyMinute = false;
    } else {
      this.showThirtyMinute = true;
    }
  }
  redirect(event) {
    this.currentSkillsSection = event.target.value;
    if (event.target.value === 'Registered') {
      this.getSkills('1');
    } else if (event.target.value === 'Worker') {
      this.getSkills('3');
    } else if (event.target.value === 'Personal') {
      this.getSkills('4');
    } else if (event.target.value === 'Escort') {
      this.getSkills('5');
    }
  }
}
