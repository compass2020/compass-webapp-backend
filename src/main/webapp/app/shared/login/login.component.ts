import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';

import { LoginService } from 'app/core/login/login.service';

@Component({
  selector: 'jhi-login-modal',
  templateUrl: './login.component.html',
})
export class LoginModalComponent implements AfterViewInit {
  @ViewChild('username', { static: false })
  username?: ElementRef;

  authenticationError = false;

  loginForm = this.fb.group({
    username: [''],
    password: [''],
    rememberMe: [false],
  });

  constructor(
    private loginService: LoginService,
    private router: Router,
    public activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private translate: TranslateService
  ) {}

  ngAfterViewInit(): void {
    if (this.username) {
      setTimeout(() => this.username.nativeElement.focus(), 0);
    }
  }

  cancel(): void {
    this.authenticationError = false;
    this.loginForm.patchValue({
      username: '',
      password: '',
    });
    this.activeModal.dismiss('cancel');
  }

  login(): void {
    if (this.loginForm.get('username')!.value !== 'android') {
      this.loginService
        .login({
          username: this.loginForm.get('username')!.value,
          password: this.loginForm.get('password')!.value,
          rememberMe: this.loginForm.get('rememberMe')!.value,
        })
        .subscribe(
          () => {
            this.authenticationError = false;
            this.activeModal.close();
            if (
              this.router.url === '/account/register' ||
              this.router.url.startsWith('/account/activate') ||
              this.router.url.startsWith('/account/reset/')
            ) {
              this.router.navigate(['']);
            }
          },
          () => (this.authenticationError = true)
        );
    } else {
      this.toastr.warning('', this.translate.instant('error.userNotAllowed'), {
        positionClass: 'toast-top-center',
        timeOut: 5000,
      });
    }
  }

  register(): void {
    this.activeModal.dismiss('to state register');
    this.router.navigate(['/account/register']);
  }

  requestResetPassword(): void {
    this.activeModal.dismiss('to state requestReset');
    this.router.navigate(['/account/reset', 'request']);
  }
}
