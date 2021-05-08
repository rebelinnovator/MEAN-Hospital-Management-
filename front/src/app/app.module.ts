import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import {
  HttpClient,
  HttpClientModule,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PageslayoutComponent } from './layouts/pageslayout/pageslayout.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { SharedModule } from './shared/shared.module';
import { HeaderComponent } from './shared/header/header.component';
import { FooterComponent } from './shared/footer/footer.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AboutComponent } from './pages/about/about.component';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { NgxSpinnerModule } from 'ngx-spinner';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { NgbDateCustomParserFormatter } from './dateformat';
import { HttpConfigInterceptor } from '../app/shared/interceptor/HttpConfigInterceptor';
import { LayoutProfileComponent } from './pages/caregiver/profile/layout/layout.component';
import { LayoutComponent } from './pages/caregiver/onboard/layout/layout.component';
import { ClientFaqComponent } from './pages/client-faq/client-faq.component';
import { CaregiverFaqComponent } from './pages/caregiver-faq/caregiver-faq.component';

// client
import { ClientLayoutComponent } from './pages/client/onboard/client-layout/client-layout.component';
import { ClientProfileLayoutComponent } from './pages/client/profile/client-profile-layout/client-profile-layout.component';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    PageslayoutComponent,
    AuthLayoutComponent,
    HeaderComponent,
    FooterComponent,
    ClientFaqComponent,
    CaregiverFaqComponent,
    AboutComponent,
    LayoutComponent,
    LayoutProfileComponent,
    ClientLayoutComponent,
    ClientProfileLayoutComponent,
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    AppRoutingModule,
    NgbModule,
    SharedModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    NgxSpinnerModule,
    HttpClientModule,
    ToastrModule.forRoot({
      maxOpened: 1,
      autoDismiss: true,
      preventDuplicates: true,
    }),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient],
      },
    }),
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpConfigInterceptor,
      multi: true,
    },
    { provide: NgbDateParserFormatter, useClass: NgbDateCustomParserFormatter }
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
