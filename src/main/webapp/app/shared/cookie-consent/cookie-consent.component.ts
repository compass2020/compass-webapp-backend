import { Component, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { JhiCookieConsentService } from 'app/shared/cookie-consent/cookie-consent.service';
import { NgcCookieConsentService, NgcInitializeEvent, NgcNoCookieLawEvent, NgcStatusChangeEvent } from 'ngx-cookieconsent';
import { Subject } from 'rxjs';
import { pluck, switchMap, takeUntil, tap } from 'rxjs/operators';

@Component({
  selector: 'jhi-cookie-consent',
  template: '<!--jhi-cookie-consent-->',
})
export class JhiCookieConsentComponent implements OnInit, OnDestroy {
  private endSubscriptions: Subject<void> = new Subject<void>();

  constructor(
    private translateService: TranslateService,
    private ngcCookieConsentService: NgcCookieConsentService,
    private cookieConsentService: JhiCookieConsentService
  ) {}

  ngOnInit(): void {
    this.updateCookieConsentOnLanguageChange();
  }

  private updateCookieConsentOnLanguageChange(): void {
    this.translateService.onLangChange
      .pipe(
        pluck('lang'),
        switchMap(languageKey => this.translateService.getTranslation(languageKey)),
        pluck('cookieConsent', 'content'),
        tap(content => this.cookieConsentService.updateCookieConsentContent(content)),
        takeUntil(this.endSubscriptions)
      )
      .subscribe();

    // subscribe to cookie-consent observables to react to main events
    this.ngcCookieConsentService.popupOpen$.pipe(takeUntil(this.endSubscriptions)).subscribe(() => {
      // eslint-disable-next-line no-console
      console.log(`event: popupOpen$`);
    });

    this.ngcCookieConsentService.popupClose$.pipe(takeUntil(this.endSubscriptions)).subscribe(() => {
      // eslint-disable-next-line no-console
      console.log(`event: popupClose$`);
    });

    this.ngcCookieConsentService.initialize$.pipe(takeUntil(this.endSubscriptions)).subscribe((event: NgcInitializeEvent) => {
      // eslint-disable-next-line no-console
      console.log(`event: ${JSON.stringify(event)}`);
    });

    this.ngcCookieConsentService.statusChange$.pipe(takeUntil(this.endSubscriptions)).subscribe((event: NgcStatusChangeEvent) => {
      // eslint-disable-next-line no-console
      console.log(`event: ${JSON.stringify(event)}`);
    });

    this.ngcCookieConsentService.revokeChoice$.pipe(takeUntil(this.endSubscriptions)).subscribe(() => {
      // eslint-disable-next-line no-console
      console.log(`event: revokeChoice$`);
    });

    this.ngcCookieConsentService.noCookieLaw$.pipe(takeUntil(this.endSubscriptions)).subscribe((event: NgcNoCookieLawEvent) => {
      // eslint-disable-next-line no-console
      console.log(`event: ${JSON.stringify(event)}`);
    });
  }

  ngOnDestroy(): void {
    this.endSubscriptions.next();
    this.endSubscriptions.complete();
  }
}
