import { NgModule } from '@angular/core';
import { CompassSharedLibsModule } from './shared-libs.module';
import { FindLanguageFromKeyPipe } from './language/find-language-from-key.pipe';
import { AlertComponent } from './alert/alert.component';
import { AlertErrorComponent } from './alert/alert-error.component';
import { LoginModalComponent } from './login/login.component';
import { HasAnyAuthorityDirective } from './auth/has-any-authority.directive';
import { JhMaterialModule } from 'app/shared/jh-material.module';
import { QRCodeModule } from 'angularx-qrcode';
import { ToastrModule } from 'ngx-toastr';
import { MetersPipePipe } from 'app/meters-pipe.pipe';
import { NgxPaginationModule } from 'ngx-pagination';
import { CreateQuestionComponent } from 'app/create-question/create-question.component';

@NgModule({
  imports: [JhMaterialModule, QRCodeModule, CompassSharedLibsModule, ToastrModule.forRoot()],
  declarations: [
    FindLanguageFromKeyPipe,
    AlertComponent,
    AlertErrorComponent,
    LoginModalComponent,
    HasAnyAuthorityDirective,
    MetersPipePipe,
    CreateQuestionComponent,
  ],
  entryComponents: [LoginModalComponent],
  exports: [
    JhMaterialModule,
    QRCodeModule,
    CompassSharedLibsModule,
    FindLanguageFromKeyPipe,
    AlertComponent,
    AlertErrorComponent,
    LoginModalComponent,
    ToastrModule,
    HasAnyAuthorityDirective,
    MetersPipePipe,
    NgxPaginationModule,
    CreateQuestionComponent,
  ],
})
export class CompassSharedModule {}
