import { Component, OnInit } from '@angular/core';
import { CaregiverService } from 'src/app/shared/services/caregiver.service';
import {
  FormGroup,
  FormControl,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { ValidationService } from 'src/app/shared/services/validation.service';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router, ActivatedRoute } from '@angular/router';
import { ConstantService } from 'src/app/shared/services/constant.service';
import { GlobalService } from 'src/app/shared/services/global.service';
import { NavigationService } from 'src/app/shared/services/navigation.service';
import Moment from 'moment';
import { extendMoment } from 'moment-range';
import Swal from 'sweetalert2';
import { CaregiverList, LocationList, GetClientApointmentCount, GetLocationList, GetSkillsHomePage, SearchCaregiver } from '../caregiver.interface';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';

interface ApiResponse {
  message: string;
  status: number;
  success: boolean;
  data: any;
}
@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
})
export class SearchComponent implements OnInit {
  caregiverSearchForm: FormGroup;
  showBookBlock: boolean = false;
  caregiverList: CaregiverList[];
  pageNumber: number = 1;
  perPageRecord: number = 10;
  callMoreApi: boolean = true;
  dataToSend: any = {};
  servicesArray: any = [];
  selectedItems: object = [];
  locationList: LocationList[];
  experienceYears: object = [];
  showSelectedError: boolean = false;
  employerDetailsToShow: CaregiverList;
  educationDetailsToShow: CaregiverList[];
  searchData: any = [];
  selectedCaregiver: Array<string> = [];
  clientSlug: string;
  transportSubsidy: number = 0;
  showTransportSubsidy: boolean = false;
  currentClientAppointmentCount: number = 0;
  disableBookingButton: boolean = false;
  isClientLoggedIn: boolean = true;
  disableAddButton: boolean = true;
  sortRatingValue: string = 'desc';
  careGiverType: Array<object> = [
    { id: 1, name: 'Registered Nurse' },
    { id: 2, name: 'Enrolled Nurse' },
    { id: 3, name: 'Health Worker' },
    { id: 4, name: 'Personal Care Worker' },
    { id: 5, name: 'Out-Patient Escort Person' },
  ];
  minDate: object;
  maxDate: object;
  caregiverServiceFee: number;
  clientServiceFee: number;
  hoursDifference: number = 1;
  settingsServices: object = {};
  clientCurrentStep: string;
  chargesCount: number = 0;
  moment: any = {};
  showServiceErorr: boolean = false;
  hoursArray: Array<string> = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
  showThirtyMinute: boolean = true;
  currentServiceType: string = '1';
  constructor(
    private caregiverService: CaregiverService,
    private formBuilder: FormBuilder,
    private validationService: ValidationService,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private router: ActivatedRoute,
    private route: Router,
    private constant: ConstantService,
    private global: GlobalService,
    private navigationService: NavigationService,
    private translate: TranslateService
  ) {
    this.moment = extendMoment(Moment);
    if (localStorage.getItem('user_type')) {
      if (localStorage.getItem('user_type') === this.global.clientUserType) {
        this.isClientLoggedIn = true;
      } else if (localStorage.getItem('user_type') === this.global.caregiverUserType) {
        this.isClientLoggedIn = false;
      }
    }
    if (
      localStorage.getItem('current_step') ||
      localStorage.getItem('current_step') !== undefined
    ) {
      this.clientCurrentStep = localStorage.getItem('current_step');
    } else {
      this.clientCurrentStep = null;
    }
    this.dataToSend.recordPerPage = this.constant.PER_PAGE_RECORD;
    this.dataToSend.pageNumber = this.constant.INITIAL_PAGE_NUMBER;
    this.searchData = this.router.snapshot.paramMap.get('data');
    this.clientSlug = localStorage.getItem('slug');
    if (this.clientSlug && this.clientSlug !== null) {
      this.getClientApointmentCount();
    }
  }
  async ngOnInit() {
    window.scrollTo(0, 0);
    this.setSearchForm();
    this.getLocationList();
    await this.getSystemSettings();
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
    const iterationNUmber = this.constant.ITERATION_NUMBER_EXPERIENCE_YEARS;
    this.experienceYears = Array(iterationNUmber)
      .fill(1)
      .map((x, i) => i + 1);
    if (this.searchData && this.searchData !== null) {
      this.searchData = JSON.parse(atob(this.searchData));
      const { caregiver_type, registration_no, services } = this.searchData
      if (caregiver_type && caregiver_type !== '') {
        this.getSkills(this.searchData.caregiver_type);
      }
      this.caregiverSearchForm.patchValue(this.searchData);
      const tempArray: any = [];
      if (registration_no === '' || registration_no === null) {
        delete this.searchData.registration_no;
      }
      if (services.length > 0) {
        services.map((service: any) => {
          if (typeof service === 'number') {
            tempArray.push(service);
          } else if (typeof service === 'object') {
            tempArray.push(service.id);
          }
        });
      }
      this.searchData.services = tempArray;
      this.dataToSend = this.searchData;
      const {
        start_meridian,
        start_time,
        end_meridian,
        end_time,
        start_minutes,
        end_minutes
      } = this.dataToSend;
      this.perPageRecord = this.constant.PER_PAGE_RECORD;
      this.pageNumber = this.constant.INITIAL_PAGE_NUMBER;
      const date = new Date(
        this.searchData.date.year,
        this.searchData.date.month - 1,
        this.searchData.date.day,
      );
      const formatedDated =
        date.getFullYear() +
        '-' +
        ('0' + (date.getMonth() + 1)).slice(-2) +
        '-' +
        ('0' + date.getDate()).slice(-2);
      this.dataToSend.date = formatedDated;
      this.dataToSend.recordPerPage = this.perPageRecord;
      this.dataToSend.pageNumber = this.pageNumber;
      let startTimeNumber = 0;
      let endTimeNumber = 0;
      if (start_meridian === 'AM') {
        if (start_time === '12' || start_time === 12) {
          startTimeNumber = 0;
          this.dataToSend.from_time = `00:${start_minutes}`;
        } else {
          startTimeNumber = start_time;
          this.dataToSend.from_time = String(
            ('0' + start_time).slice(-2) + ':' + start_minutes,
          );
        }
      } else if (start_meridian === 'PM') {
        if (start_time === '12') {
          this.dataToSend.from_time = `12:${start_minutes}`;
        } else {
          const time = Number(start_time) + 12;
          this.dataToSend.from_time = String(time + ':' + start_minutes);
        }
        startTimeNumber = Number(start_time) + 12;
      }
      if (end_meridian === 'AM') {
        if (end_time === '12' || end_time === 12) {
          endTimeNumber = 24;
          this.dataToSend.to_time = '23:59';
        } else {
          endTimeNumber = end_time;
          this.dataToSend.to_time = String(
            ('0' + end_time).slice(-2) + ':' +
            end_minutes,
          );
        }
      } else if (end_meridian === 'PM') {
        if (end_time === '12') {
          this.dataToSend.to_time = `12:${end_minutes}`;
          endTimeNumber = 12;
        } else {
          const time = Number(end_time) + 12;
          this.dataToSend.to_time = String(time + ':' + end_minutes);
          endTimeNumber = Number(end_time) + 12;
        }
        // endTimeNumber = Number(end_time) + 12;
      }
      this.hoursDifference = endTimeNumber - startTimeNumber;
      this.dataToSend.orderBy = 'feedback';
      this.dataToSend.orderDir = this.sortRatingValue;
      this.searchCaregiver();
    } else {
      if (this.callMoreApi === true) {
        this.dataToSend.orderBy = 'feedback';
        this.dataToSend.orderDir = this.sortRatingValue;
        this.searchCaregiver();
      }
    }
    this.settingsServices = {
      singleSelection: false,
      text: this.translate.instant('Select Services'),
      lazyLoading: true,
      enableCheckAll: false,
      enableSearchFilter: false,
      badgeShowLimit: 1,
      searchPlaceholderText: this.translate.instant('Search Services')
    };
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.settingsServices = {
        singleSelection: false,
        text: this.translate.instant('Select Services'),
        lazyLoading: true,
        enableCheckAll: false,
        enableSearchFilter: false,
        badgeShowLimit: 1,
        searchPlaceholderText: this.translate.instant('Search Services')
      };
      this.getSkills(this.currentServiceType);
    })
  }
  enableDisableButton(event) {
    if (event.target.value && event.target.value !== '' && !isNaN(event.target.value)) {
      this.disableAddButton = false;
    } else {
      this.disableAddButton = true;
    }
  }
  getClientApointmentCount() {
    this.caregiverService.getClientApointmentCount(this.clientSlug).subscribe(
      (returnData: GetClientApointmentCount) => {
        const { success, data: { total_active_bookings } } = returnData;
        if (success) {
          if (total_active_bookings) {
            this.currentClientAppointmentCount =
              total_active_bookings;
          } else {
            this.currentClientAppointmentCount = 0;
          }
          if (this.currentClientAppointmentCount >= 5) {
            this.disableBookingButton = true;
          }
        }
      }
    );
  }
  onItemSelect(item: any) {
    this.searchInputChanged(item.id, 'services');
  }
  OnItemDeSelect(item: any) {
    this.searchInputChanged(item.id, 'services');
  }
  async getSystemSettings() {
    const returnData: any = await this.caregiverService.getSystemSettings().toPromise();
    const { success, data } = returnData;
    if (success) {
      this.caregiverServiceFee = data.find(x => x.title === 'caregiver_service_fee')['value'];
      this.clientServiceFee = data.find(x => x.title === 'client_service_fee')['value'];
      this.sortRatingValue = data.find(x => x.title === 'sort_by_rating')['value'];
    } else {
      this.caregiverServiceFee = 0;
      this.clientServiceFee = 0;
    }
  }
  open(content, data) {
    this.employerDetailsToShow = data;
    this.employerDetailsToShow.currentEmployer = {};
    this.employerDetailsToShow.previousEmployer = [];
    if (data.employer.length > 0) {
      data.employer.map((employerData: any) => {
        const { is_current_employer } = employerData;
        if (is_current_employer === this.constant.IS_CURRENT_EMPLOYER) {
          this.employerDetailsToShow.currentEmployer = employerData;
        } else {
          this.employerDetailsToShow.previousEmployer.push(employerData);
        }
      });
    }
    if (this.employerDetailsToShow.currentEmployer) {
      const { from_year, from_month } = this.employerDetailsToShow.currentEmployer;
      const currentDate = new Date();
      let inputDate: any;
      inputDate = new Date(from_year, from_month - 1, 1);
      let dy = currentDate.getFullYear() - inputDate.getFullYear();
      let dm = currentDate.getMonth() - inputDate.getMonth();
      let dd = currentDate.getDate() - inputDate.getDate();
      if (dd < 0) {
        dm -= 1;
        dd += 30;
      }
      if (dm < 0) {
        dy -= 1;
        dm += 12;
      }
      this.employerDetailsToShow.currentEmployer.yearsExperience = dy;
      this.employerDetailsToShow.currentEmployer.monthsExperience = dm;
    }
    if (this.employerDetailsToShow.previousEmployer.length > 0) {
      this.employerDetailsToShow.previousEmployer.map((previous: any) => {
        const { to_year, to_month, from_year, from_month } = previous;
        const currentDate = new Date(to_year, to_month - 1, 1);
        let inputDate: any;
        inputDate = new Date(from_year, from_month - 1, 1);
        let dy = currentDate.getFullYear() - inputDate.getFullYear();
        let dm = currentDate.getMonth() - inputDate.getMonth();
        const dd = currentDate.getDate() - inputDate.getDate();
        if (dd < 0) {
          dm -= 1;
        }
        if (dm < 0) {
          dy -= 1;
          dm += 12;
        }
        previous.yearsExperience = dy;
        previous.monthsExperience = dm;
      });
    }
    this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
      windowClass: 'employee-modal',
      centered: true,
    });
  }
  openEducation(content, data) {
    this.educationDetailsToShow = [];
    this.educationDetailsToShow = data.education;
    this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
      windowClass: 'employee-modal',
      centered: true,
    });
  }
  changeSorting(event, type) {
    this.dataToSend.recordPerPage = 10;
    this.dataToSend.pageNumber = 1;
    if (!event.target.value || event.target.value === '') {
      delete this.dataToSend.orderBy;
      delete this.dataToSend.orderDir;
    } else {
      if (type === 'price') {
        this.dataToSend.orderBy = 'price';
        this.dataToSend.orderDir = event.target.value;
        if (this.chargesCount > 0) {
          this.dataToSend.durationSort = 'false';
        } else {
          this.dataToSend.durationSort = 'true';
        }
      } else if (type === 'experience') {
        this.dataToSend.orderBy = 'experience';
        this.dataToSend.orderDir = event.target.value;
      } else if (type === 'feedback') {
        this.dataToSend.orderBy = 'feedback';
        this.dataToSend.orderDir = event.target.value;
      }
    }
    this.searchCaregiver();
  }
  setSearchForm() {
    this.caregiverSearchForm = this.formBuilder.group({
      registration_no: new FormControl('', [
        this.validationService.onlyNumber,
        this.validationService.trimValidator,
      ]),
      caregiver_type: new FormControl('', []),
      location_id: new FormControl('', []),
      date: new FormControl('', [Validators.required]),
      min_exp: new FormControl('', []),
      start_time: new FormControl('', [Validators.required]),
      start_minutes: new FormControl({ value: '00', disabled: false }, [Validators.required]),
      start_meridian: new FormControl({ value: 'AM', disabled: false }, [
        Validators.required,
      ]),
      end_time: new FormControl('', [
        Validators.required,
        Validators.pattern('^[0-9]*$'),
        this.validationService.onlyNumber,
        this.validationService.trimValidator,
        this.validationService.onlyNumberTime,
      ]),
      end_minutes: new FormControl({ value: '00', disabled: false }, [Validators.required]),
      end_meridian: new FormControl({ value: 'AM', disabled: false }, [
        Validators.required,
      ]),
      services: new FormControl('', [])
    });
  }
  searchInputChanged(event, field) {
    let getSearchResult: boolean = true;
    this.perPageRecord = this.constant.PER_PAGE_RECORD;
    this.pageNumber = this.constant.INITIAL_PAGE_NUMBER;
    this.dataToSend.recordPerPage = this.perPageRecord;
    this.dataToSend.pageNumber = this.pageNumber;

    if (field !== 'date' && field !== 'services') {
      this.dataToSend[`${field}`] = event.target.value;
      getSearchResult = true;
    }
    const { start_time, start_meridian, end_time, end_meridian, services, date, start_minutes, end_minutes } = this.caregiverSearchForm.value
    if (end_time === '12' && end_meridian === 'AM') {
      this.showThirtyMinute = false;
    } else {
      this.showThirtyMinute = true;
    }
    if (field === 'start_time' || field === 'start_meridian' || field === 'start_minutes') {
      if (!start_time) {
        this.toastr.error(this.translate.instant(this.constant.ENTER_START_TIME));
      } else {
        if (start_time >= 0 && start_time <= 12) {
          if (start_meridian === 'AM') {
            if (start_time === '12' || start_time === 12) {
              this.dataToSend.from_time = `00:${start_minutes}`;
            } else {
              this.dataToSend.from_time = String(('0' + start_time).slice(-2) + ':' + start_minutes);
            }
          } else if (start_meridian === 'PM') {
            if (start_time === '12' || start_time === 12) {
              this.dataToSend.from_time = `12:${start_minutes}`;
            } else {
              const time = Number(start_time) + 12;
              this.dataToSend.from_time = String(time + ':' + start_minutes);
            }
          }
        } else {
          this.caregiverSearchForm.controls.start_time.setErrors({
            serverError: this.translate.instant(this.constant.HOURS_ERROR),
          });
          this.caregiverList = [];
          getSearchResult = false;
          return false;
        }
      }
    }
    if (field === 'end_time' || field === 'end_meridian' || field === 'end_minutes') {
      if (!end_time) {
        this.toastr.error(this.translate.instant(this.constant.ENTER_START_TIME));
      } else {
        if (end_time >= 0 && end_time <= 12) {
          if (end_meridian === 'AM') {
            if (end_time === '12' || end_time === 12) {
              this.dataToSend.to_time = '23:59';
            } else {
              this.dataToSend.to_time = String(('0' + end_time).slice(-2) + ':' + end_minutes);
            }
          } else if (end_meridian === 'PM') {
            if (end_time === '12' || end_time === 12) {
              this.dataToSend.to_time = `12:${end_minutes}`;
            } else {
              const time = Number(end_time) + 12;
              this.dataToSend.to_time = String(time + ':' + end_minutes);
            }
          }
        } else {
          this.caregiverSearchForm.controls.end_time.setErrors({
            serverError: this.translate.instant(this.constant.HOURS_ERROR),
          });
          this.caregiverList = [];
          getSearchResult = false;
          return false;
        }
      }
    }
    if (field === 'services') {
      if (services.length > 0) {
        const tempArray: any = [];
        services.map((service: any) => {
          tempArray.push(service.id);
        });
        this.dataToSend.services = tempArray;
      } else {
        this.dataToSend.services = [];
      }
    }
    if (field === 'caregiver_type') {
      if (event.target.value) {
        this.getSkills(event.target.value);
      }
    }
    if (field === 'date') {
      const newDate = new Date(date.year, date.month - 1, date.day);
      const formatedDated =
        newDate.getFullYear() +
        '-' +
        ('0' + (newDate.getMonth() + 1)).slice(-2) +
        '-' +
        ('0' + newDate.getDate()).slice(-2);
      this.dataToSend.date = formatedDated;
    }
    if (
      field === 'start_time' ||
      field === 'start_meridian' ||
      field === 'end_meridian' ||
      field === 'end_time' ||
      field === 'start_minutes' ||
      field === 'end_minutes'
    ) {
      if (!start_time) {
        this.caregiverSearchForm.controls.end_time.setErrors({
          serverError: this.translate.instant(this.constant.START_END_REQUIRED),
        });
        this.caregiverList = [];
        getSearchResult = false;
        return false;
      } else if (start_time === '' && end_time !== '') {
        this.caregiverSearchForm.controls.start_time.setErrors({
          serverError: this.translate.instant(this.constant.START_END_REQUIRED),
        });
        this.caregiverList = [];
        getSearchResult = false;
        return false;
      } else if (start_time === '' && end_time === '') {
        return true;
      }
    }
    let startTimeNumber = 0;
    let endTimeNumber = 0;
    if (start_time !== '' && start_meridian !== '' && end_time !== '' && end_meridian !== '' && start_minutes !== '' && end_minutes !== '') {
      if (start_meridian === 'AM') {
        if (start_time === '12' || start_time === 12) {
          startTimeNumber = 0;
        } else {
          startTimeNumber = Number(start_time);
        }
      } else if (start_meridian === 'PM') {
        if (start_time === '12' || start_time === 12) {
          startTimeNumber = 12;
        } else {
          startTimeNumber = Number(Number(start_time) + 12);
        }
      }
      if (end_meridian === 'AM') {
        if (end_time === '12' || end_time === 12) {
          endTimeNumber = 24;
        } else {
          endTimeNumber = Number(end_time);
        }
      } else if (end_meridian === 'PM') {
        if (end_time === '12' || end_time === 12) {
          endTimeNumber = 12;
        } else {
          endTimeNumber = Number(Number(end_time) + 12);
        }
      }
      if (this.dataToSend.date && this.dataToSend.from_time) {
        const input = `${this.dataToSend.date} ${this.dataToSend.from_time}`;
        const utcDateTime = this.moment(input);
        const now = this.moment();
        if (now > utcDateTime) {
          getSearchResult = false;
          this.toastr.error(this.translate.instant(this.constant.SIX_HOURS));
          this.caregiverList = [];
        } else {
          getSearchResult = true;
        }
      }
      if (start_minutes === '30') {
        startTimeNumber = Number(startTimeNumber) + Number(0.5);
      }
      if (end_minutes === '30') {
        endTimeNumber = Number(endTimeNumber) + Number(0.5);
      }
      if (endTimeNumber === startTimeNumber) {
        this.toastr.error(this.translate.instant(this.constant.FROM_TIME));
        this.caregiverList = [];
        getSearchResult = false;
        return false;
      }
      this.hoursDifference = endTimeNumber - startTimeNumber;
      if (this.hoursDifference > 12) {
        this.toastr.error(this.translate.instant(this.constant.MAXIMUM_SERVICE));
        this.caregiverList = [];
        getSearchResult = false;
        return false;
      }
    }
    if (this.hoursDifference < 0) {
      this.hoursDifference = 1;
      this.toastr.error(this.translate.instant(this.constant.END_TIME_LARGER));
      this.caregiverList = [];
      getSearchResult = false;
      return false;
    }
    if (Number(endTimeNumber) < Number(startTimeNumber)) {
      this.toastr.error(this.translate.instant(this.constant.END_TIME_LARGER));
      this.caregiverList = [];
      getSearchResult = false;
      return false;
    }
    if (!Number.isInteger(this.hoursDifference)) {
      this.toastr.error(this.translate.instant(this.constant.HOURLY_DIFFERENCE_SEARCH));
      this.caregiverList = [];
      getSearchResult = false;
      return false;
    }
    for (const [key, value] of Object.entries(this.dataToSend)) {
      if (!value || value === '' || value === null) {
        delete this.dataToSend[`${key}`];
      }
    }
    if (this.dataToSend.from_time) {
      if (!this.dataToSend.to_time) {
        getSearchResult = false;
      }
    } else if (this.dataToSend.to_time) {
      if (!this.dataToSend.from_time) {
        getSearchResult = false;
      }
    }
    if (this.dataToSend.services) {
      if (this.dataToSend.services.length > 8) {
        this.showServiceErorr = true;
      } else {
        this.showServiceErorr = false;
      }
    }
    if (getSearchResult) {
      this.searchCaregiver();
    }
  }
  getLocationList() {
    this.caregiverService.getLocationList().subscribe(
      (returnData: GetLocationList) => {
        const { success, data } = returnData;
        this.locationList = [];
        if (success) {
          this.locationList = data;
        }
      },
      err => {
        this.locationList = [];
      },
    );
  }
  getSkills(typeVal: any) {
    this.currentServiceType = typeVal;
    this.caregiverService.getSkills(typeVal).subscribe(
      (returnData: GetSkillsHomePage) => {
        const { success, data } = returnData;
        this.servicesArray = [];
        this.selectedItems = [];
        if (success) {
          this.caregiverSearchForm.controls['services'].reset();
          if (data.length > 0) {
            data.map((skills: any) => {
              skills.category = '';
              const { type } = skills;
              if (Number(type) === Number(this.global.personalCareType)) {
                skills.category = 'Personal';
              } else if (Number(type) === Number(this.global.specialCareType)) {
                skills.category = 'Special';
              }
              skills.itemName = this.translate.instant(skills.english_title);
              this.servicesArray.push(skills);
              if (this.searchData) {
                const tempServiceArray: any = [];
                this.servicesArray.map((service: any) => {
                  if (this.searchData.services.indexOf(service.id) !== -1) {
                    tempServiceArray.push(service);
                  }
                });
                this.caregiverSearchForm.patchValue({
                  services: tempServiceArray,
                });
              }
            });
          }
        }
      }
    );
  }
  loadMore() {
    this.caregiverService.searchCaregiver(this.dataToSend).subscribe(
      (returnData: SearchCaregiver) => {
        const { success, data } = returnData;
        if (success) {
          if (data) {
            const { next } = data;
            if (next && next !== null) {
              this.dataToSend.pageNumber = this.dataToSend.pageNumber + 1;
              this.pageNumber = this.pageNumber + 1;
            } else {
              this.callMoreApi = false;
            }
            if (data.data) {
              if (data.data.length > 0) {
                data.data.map((caregiver: any) => {
                  const { total_exp, charges } = caregiver;
                  if (total_exp) {
                    const months = total_exp % 12;
                    const years = (total_exp - months) / 12;
                    caregiver.yearsExperience = years;
                    caregiver.monthsExperience = months;
                  } else {
                    caregiver.yearsExperience = 0;
                    caregiver.monthsExperience = 0;
                  }
                  if (charges.length > 0) {
                    const chargesObject = charges.find(
                      x => x.hour === this.hoursDifference,
                    );
                    if (chargesObject && chargesObject !== undefined) {
                      caregiver.chargesObject = chargesObject;
                    } else {
                      caregiver.chargesObject = caregiver.charges[0];
                      this.chargesCount++;
                    }
                  }
                  caregiver.chargesObject.totalAmount = 0;
                  caregiver.chargesObject.serviceFee = Number(
                    (caregiver.chargesObject.price *
                      this.hoursDifference *
                      this.clientServiceFee) /
                    100,
                  );
                  const caregiverCharges = Number(
                    Number(caregiver.chargesObject.price) *
                    Number(this.hoursDifference),
                  );
                  caregiver.chargesObject.totalAmount = Number(
                    Number(caregiverCharges) +
                    Number(caregiver.chargesObject.serviceFee),
                  );
                  caregiver.disabled = false;
                  this.caregiverList.push(caregiver);
                });
              }
            }
          }
        }
      }
    );
  }
  searchCaregiver() {
    this.caregiverService.searchCaregiver(this.dataToSend).subscribe(
      (returnData: SearchCaregiver) => {
        const { success, data } = returnData;
        if (success) {
          this.showBookBlock = false;
          this.selectedCaregiver = [];
          const { next } = data;
          if (next && next !== null) {
            this.dataToSend.pageNumber = this.dataToSend.pageNumber + 1;
          } else {
            this.callMoreApi = false;
          }
          this.caregiverList = data.data;
          if (this.caregiverList.length > 0) {
            this.caregiverList.map((careGiver: any) => {
              const { total_exp, charges } = careGiver;
              if (total_exp && total_exp > 0) {
                const months = total_exp % 12;
                const years = (total_exp - months) / 12;
                careGiver.yearsExperience = years;
                careGiver.monthsExperience = months;
              } else {
                careGiver.yearsExperience = 0;
                careGiver.monthsExperience = 0;
              }

              if (charges.length > 0) {
                const chargesObject = charges.find(
                  x => x.hour === this.hoursDifference,
                );
                if (chargesObject && chargesObject !== undefined) {
                  careGiver.chargesObject = chargesObject;
                } else {
                  careGiver.chargesObject = careGiver.charges[0];
                  this.chargesCount++;
                }
                careGiver.chargesObject.serviceFee = Number(
                  (careGiver.chargesObject.price *
                    this.hoursDifference *
                    this.clientServiceFee) /
                  100,
                );
                careGiver.chargesObject.totalAmount = 0;
                const caregiverCharges = Number(
                  Number(careGiver.chargesObject.price) *
                  Number(this.hoursDifference),
                );
                careGiver.chargesObject.totalAmount = Number(
                  Number(caregiverCharges) +
                  Number(careGiver.chargesObject.serviceFee),
                );
              }
              careGiver.disabled = false;
            });
          }
        }
      }
    );
  }
  addTransportSubsidy() {
    const transportSubsidy = (document.getElementById(
      'transport_subsidy',
    ) as HTMLInputElement).value;
    if (transportSubsidy) {
      if (Number(transportSubsidy) < 1 || Number(transportSubsidy) > 500) {
        this.toastr.error(this.translate.instant(this.constant.TRANSPORT_SUBSIDY_ERROR));
      } else {
        this.transportSubsidy = Number(transportSubsidy);
        this.showTransportSubsidy = true;
      }
    } else {
      this.toastr.error(this.translate.instant(this.constant.TRANSPORT));
      this.showTransportSubsidy = false;
      this.transportSubsidy = 0;
    }
  }
  removeTransportSubsidy() {
    (document.getElementById('transport_subsidy') as HTMLInputElement).value =
      '';
    this.showTransportSubsidy = false;
    this.transportSubsidy = 0;
    this.disableAddButton = true;
  }
  selectCaregiver(event) {
    if (this.selectedCaregiver.includes(event.target.value)) {
      this.selectedCaregiver.splice(
        this.selectedCaregiver.indexOf(event.target.value),
        1,
      );
    } else {
      this.selectedCaregiver.push(event.target.value);
    }
    if (this.selectedCaregiver.length > 0) {
      this.showBookBlock = true;
      if (this.selectedCaregiver.length >= 3) {
        this.caregiverList.map((caregiverData: any) => {
          if (this.selectedCaregiver.includes(String(caregiverData.id))) {
            caregiverData.disabled = false;
          } else {
            caregiverData.disabled = true;
          }
        });
      } else if (this.selectedCaregiver.length < 3) {
        this.caregiverList.map((caregiverData: any) => {
          caregiverData.disabled = false;
        });
      }
    } else {
      this.showBookBlock = false;
    }
    const body = document.getElementById('root');
    body.className = this.selectedCaregiver.length > 0 ? 'pop-open' : '';
    // body.className === 'pop-open' ? body.className = '' : body.className = 'pop-open';
  }
  bookCaregiver() {
    let callApi: boolean = true;
    const { start_meridian, start_time, end_meridian, end_time, services, date, start_minutes, end_minutes, caregiver_type } = this.caregiverSearchForm.value;
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
        fullStartTime = Number(Number(start_time) + 12);
      }
    }
    let fullEndTime = 0;
    if (end_meridian === 'AM') {
      if (end_time === '12' || end_time === 12) {
        fullEndTime = 24;
      } else {
        fullEndTime = Number(end_time);
      }
    } else if (end_meridian === 'PM') {
      if (end_time === '12' || end_time === 12) {
        fullEndTime = 12;
      } else {
        fullEndTime = Number(Number(end_time) + 12);
      }
    }
    if (start_minutes === '30') {
      fullStartTime = Number(fullStartTime) + Number(0.5);
    }
    if (end_minutes === '30') {
      fullEndTime = Number(fullEndTime) + Number(0.5);
    }
    if (!caregiver_type) {
      this.caregiverSearchForm.controls.caregiver_type.markAsTouched();
      this.caregiverSearchForm.controls.caregiver_type.setErrors({ serverError: this.translate.instant(this.constant.SELECT_CAREGIVER_TYPE) });
      return false;
    }
    if (!services || services.length === 0) {
      this.caregiverSearchForm.controls.services.markAsTouched();
      this.caregiverSearchForm.controls.services.setErrors({ serverError: this.translate.instant(this.constant.SELECT_SERVICES) });
      return false;
    } else {
      this.caregiverSearchForm.controls.caregiver_type.setErrors(null);
    }
    if (services.length > 0) {
      this.caregiverSearchForm.controls.caregiver_type.setErrors(null);
    }
    if (!date) {
      this.caregiverSearchForm.controls.date.markAsTouched();
      this.caregiverSearchForm.controls.date.setErrors({ serverError: this.translate.instant(this.constant.SELECT_DATE) });
      return false;
    } else {
      this.caregiverSearchForm.controls.date.setErrors(null);
    }
    if (!start_time) {
      this.caregiverSearchForm.controls.start_time.markAsTouched();
      this.caregiverSearchForm.controls.start_time.setErrors({ serverError: this.translate.instant(this.constant.SELECT_START_END) });
      return false;
    } else {
      this.caregiverSearchForm.controls.start_time.setErrors(null);
    }
    if (!end_time) {
      this.caregiverSearchForm.controls.end_time.markAsTouched();
      this.caregiverSearchForm.controls.end_time.setErrors({ serverError: this.translate.instant(this.constant.SELECT_START_END) });
      return false;
    } else {
      this.caregiverSearchForm.controls.end_time.setErrors(null);
    }
    if (this.clientSlug && this.clientSlug !== null) {
      if (
        this.clientCurrentStep &&
        (this.clientCurrentStep === null || this.clientCurrentStep === 'null')
      ) {
        if (this.selectedCaregiver.length > 3) {
          this.toastr.error(this.translate.instant(this.constant.MAX_CAREGVIER));
          return false;
        } else {
          if (callApi) {
            const dataToSend: any = {
              slug: this.clientSlug,
              date: this.dataToSend.date
            };
            if (this.showTransportSubsidy === true) {
              dataToSend.transport_subsidy = Number(this.transportSubsidy);
            }
            let startTimeNumber = 0;
            let endTimeNumber = 0;
            if (start_meridian === 'AM') {
              if (start_time === '12' || start_time === 12) {
                startTimeNumber = 0;
                this.dataToSend.start_time = '00:00';
              } else {
                startTimeNumber = start_time;
                this.dataToSend.start_time = String(start_time + ':' + start_minutes);
              }
            } else if (start_meridian === 'PM') {
              if (start_time === '12' || start_time === 12) {
                startTimeNumber = 12;
              } else {
                startTimeNumber = Number(Number(start_time) + 12);
              }
              if (start_time === '12') {
                this.dataToSend.start_time = '12' + ':' + start_minutes;
              } else {
                const time =
                  Number(start_time) + 12;
                this.dataToSend.start_time = String(time + ':' + start_minutes);
              }
            }
            if (end_meridian === 'AM') {
              if (end_time === '12' || end_time === 12) {
                endTimeNumber = 24;
                this.dataToSend.end_time = '23:59';
              } else {
                endTimeNumber = end_time;
                this.dataToSend.end_time = String(end_time + ':' + end_minutes);
              }
            } else if (end_meridian === 'PM') {
              if (end_time === '12' || end_time === 12) {
                endTimeNumber = 12;
              } else {
                endTimeNumber = Number(Number(end_time) + 12);
              }
              if (end_time === '12' || end_time === 12) {
                this.dataToSend.end_time = '12' + ':' + end_minutes;
              } else {
                const time = Number(end_time) + 12;
                this.dataToSend.end_time = String(time + ':' + end_minutes);
              }
            }
            if (start_minutes === '30') {
              startTimeNumber = Number(startTimeNumber) + Number(0.5);
            }
            if (end_minutes === '30') {
              endTimeNumber = Number(endTimeNumber) + Number(0.5);
            }
            if (Number(endTimeNumber) < Number(startTimeNumber)) {
              this.toastr.error(this.translate.instant(this.constant.END_TIME_LARGER));
              return false;
            }
            let hoursDifference: number = 0;
            hoursDifference = endTimeNumber - startTimeNumber;
            if (!Number.isInteger(hoursDifference)) {
              this.toastr.error(this.translate.instant(this.constant.HOURLY_DIFFERENCE_SEARCH));
              return false;
            }
            dataToSend.start_time = this.dataToSend.start_time;
            dataToSend.end_time = this.dataToSend.end_time;
            dataToSend.services = this.dataToSend.services;
            dataToSend.duration = this.hoursDifference;
            dataToSend.caregiver = [];
            this.selectedCaregiver.map((selected: any) => {
              const matched: any = this.caregiverList.filter(
                x => Number(x.id) === Number(selected),
              )[0];

              if (matched && matched !== undefined) {
                const tempArray: any = {};
                tempArray.caregiver_id = matched.id;
                tempArray.caregiver_charges = Number(
                  matched.chargesObject.price * this.hoursDifference,
                );
                tempArray.caregiver_service_fee = Number(
                  Number(
                    matched.chargesObject.price *
                    this.hoursDifference *
                    this.caregiverServiceFee,
                  ) / 100,
                );
                tempArray.client_service_fee = Number(
                  Number(
                    matched.chargesObject.price *
                    this.hoursDifference *
                    this.clientServiceFee,
                  ) / 100,
                );
                tempArray.total_amount =
                  Number(matched.chargesObject.price * this.hoursDifference) +
                  Number(tempArray.client_service_fee);
                if (this.showTransportSubsidy === true) {
                  tempArray.total_amount = Number(
                    tempArray.total_amount + this.transportSubsidy,
                  );
                }
                tempArray.caregiver_charges_hour = dataToSend.duration;
                tempArray.caregiver_charges_price =
                  matched.chargesObject.price;
                dataToSend.caregiver.push(tempArray);
              }
            });
            const minutes = this.diffMinutes(dataToSend);
            if (minutes <= this.global.clientMinutes) {
              callApi = false;
              this.toastr.error(this.translate.instant(this.constant.SIX_HOURS));
              return false;
            }
            if (callApi) {
              this.caregiverService.addBooking(dataToSend).subscribe(
                (returnData: ApiResponse) => {
                  const { success } = returnData;
                  if (success) {
                    this.getClientApointmentCount();
                    this.route.navigate([this.navigationService.bookingConfirmed]);
                  }
                });
            }
          }
        }
      } else {
        this.toastr.error(this.translate.instant(this.constant.COMPLETE_ONBOARD));
      }
    } else if (
      this.clientSlug &&
      (this.clientCurrentStep !== null || this.clientCurrentStep !== 'null')
    ) {
      this.toastr.error(this.translate.instant(this.constant.COMPLETE_ONBOARD));
    } else {
      Swal.fire({
        title: this.translate.instant(this.constant.LOGIN_TO_BOOK),
        type: 'warning',
        showCancelButton: false,
        confirmButtonColor: '#3085d6',
        confirmButtonText: `<a href="/auth/client-login">${this.translate.instant('Client Login')}</a>`
      });
    }
  }
  diffMinutes(dataToSend) {
    const input = `${dataToSend.date} ${dataToSend.start_time}`;
    const utcDateTime = this.moment(input).format('YYYY-MM-DD HH:mm:ss');
    const duration = this.moment(utcDateTime).diff(this.moment().format('YYYY-MM-DD HH:mm:ss'), 'minutes');
    return duration;
  }
}