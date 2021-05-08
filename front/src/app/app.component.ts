import { Component, OnInit, OnDestroy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { GlobalService } from './shared/services/global.service';
import {
  Router,
  ActivatedRoute,
  NavigationStart,
  NavigationEnd,
  NavigationCancel,
  NavigationError,
} from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Title } from '@angular/platform-browser';
import { fromEvent, Observable, Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { ConstantService } from './shared/services/constant.service';
declare var ClientJS: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy {
  public onlineEvent: Observable<Event>;
  public offlineEvent: Observable<Event>;
  public subscriptions: Subscription[] = [];
  routerSub: Subscription;
  title = 'Caregiver';
  routeOptions: any;
  constructor(
    public translate: TranslateService,
    private global: GlobalService,
    private router: Router,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private titleService: Title,
    private toastr: ToastrService,
    private constant: ConstantService
  ) {
    // Generate Fingerprint Starts 
    const client = new ClientJS();
    const ua = client.getBrowserData().ua;
    const canvasPrint = client.getCanvasPrint();
    const fingerprint = client.getCustomFingerprint(ua, canvasPrint);
    this.global.deviceID = fingerprint;
    // Generate Fingerprint Ends
    translate.addLangs(['en', 'zh']);
    if (localStorage.getItem('currentLanguage') && (localStorage.getItem('currentLanguage') !== null || localStorage.getItem('currentLanguage') !== 'null')) {
      this.global.currentLanguage = localStorage.getItem('currentLanguage');
    } else {
      this.global.currentLanguage = 'zh';
      localStorage.setItem('currentLanguage', this.global.currentLanguage);
    }
    translate.setDefaultLang(this.global.currentLanguage);
  }

  ngOnInit(): void {
    this.onlineEvent = fromEvent(window, 'online');
    this.offlineEvent = fromEvent(window, 'offline');
    this.subscriptions.push(this.onlineEvent.subscribe(event => {
      this.toastr.success(this.constant.INTERNET_CONNECTED);
    }));
    this.subscriptions.push(this.offlineEvent.subscribe(e => {
      this.toastr.error(this.constant.NO_INTERNET);
    }));
    this.routerSub = this.router.events.subscribe(e => {
      if (e instanceof NavigationStart) {
        this.spinner.show();
      }
      if (e instanceof NavigationEnd) {
        this.spinner.hide();
      }
      if (e instanceof NavigationCancel) {
        this.spinner.hide();
      }
      if (e instanceof NavigationError) {
        this.spinner.hide();
      }
    });
    this.routerSub = this.router.events.subscribe(e => {
      if (e instanceof NavigationEnd) {
        this.runOnRouteChange();
      }
    });
  }

  ngOnDestroy() {
    this.routerSub.unsubscribe();
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  runOnRouteChange(): void {
    this.route.children.forEach((route: ActivatedRoute) => {
      let activeRoute: ActivatedRoute = route;
      while (activeRoute.firstChild) {
        activeRoute = activeRoute.firstChild;
      }
      this.routeOptions = activeRoute.snapshot.data;
    });

    if (this.routeOptions) {
      if (this.routeOptions.hasOwnProperty('title')) {
        this.setTitle(this.routeOptions.title);
      }
    }
  }

  setTitle(newTitle: string) {
    this.titleService.setTitle(newTitle + ' | Caregiver');
  }
}
