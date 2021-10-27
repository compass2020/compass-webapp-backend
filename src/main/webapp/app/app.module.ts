import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import './vendor';
import { CompassSharedModule } from 'app/shared/shared.module';
import { CompassCoreModule } from 'app/core/core.module';
import { CompassAppRoutingModule } from './app-routing.module';
import { CompassHomeModule } from './home/home.module';
import { CompassEntityModule } from './entities/entity.module';
import { CompassAppCreateCourseModule } from './create-course/create-course.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import 'hammerjs';
import { CompassAppMyCoursesModule } from './my-courses/my-courses.module';
import { CompassAppResultSessionsModule } from './result-sessions/result-sessions.module';
import 'cookieconsent/build/cookieconsent.min';
import { CompassAppManageQuestionsModule } from './manage-questions/manage-questions.module';
// jhipster-needle-angular-add-module-import JHipster will add new module here
import { MainComponent } from './layouts/main/main.component';
import { NavbarComponent } from './layouts/navbar/navbar.component';
import { FooterComponent } from './layouts/footer/footer.component';
import { PageRibbonComponent } from './layouts/profiles/page-ribbon.component';
import { ActiveMenuDirective } from './layouts/navbar/active-menu.directive';
import { ErrorComponent } from './layouts/error/error.component';
import { ShareQrcodeComponent } from './share-qrcode/share-qrcode.component';
import { PrintQrcodesComponent } from './print-qrcodes/print-qrcodes.component';
import { FeedbackComponent } from './feedback/feedback.component';
import localeDe from '@angular/common/locales/de';
import localeBg from '@angular/common/locales/bg';
import localeRo from '@angular/common/locales/ro';
import localeET from '@angular/common/locales/et';
import localeMK from '@angular/common/locales/mk';
import { registerLocaleData } from '@angular/common';
import { ShowQRComponent } from './show-qr/show-qr.component';
import { PrintMapComponent } from './print-map/print-map.component';
import { MonitorSessionComponent } from './monitor-session/monitor-session.component';
import { ViewComponent } from './view/view.component';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { NumberPickerModule } from 'ng-number-picker';
import { PrivacyComponent } from './privacy/privacy.component';
import { PrintShareQrcodesComponent } from './print-share-qrcodes/print-share-qrcodes.component';
import { MinuteSecondsPipe } from './minute-seconds.pipe';
registerLocaleData(localeDe);
registerLocaleData(localeBg);
registerLocaleData(localeRo);
registerLocaleData(localeET);
registerLocaleData(localeMK);

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    CompassSharedModule,
    CompassCoreModule,
    CompassHomeModule,
    CompassAppCreateCourseModule,
    CompassAppMyCoursesModule,
    CompassAppResultSessionsModule,
    CompassAppManageQuestionsModule,
    // jhipster-needle-angular-add-module JHipster will add new module here
    CompassEntityModule,
    CompassAppRoutingModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    NumberPickerModule,
  ],
  declarations: [
    MainComponent,
    NavbarComponent,
    ErrorComponent,
    PageRibbonComponent,
    ActiveMenuDirective,
    FooterComponent,
    ShareQrcodeComponent,
    PrintQrcodesComponent,
    FeedbackComponent,
    ShowQRComponent,
    PrintMapComponent,
    PrintShareQrcodesComponent,
    MonitorSessionComponent,
    ViewComponent,
    PrivacyComponent,
    MinuteSecondsPipe,
  ],
  bootstrap: [MainComponent],
})
export class CompassAppModule {}
