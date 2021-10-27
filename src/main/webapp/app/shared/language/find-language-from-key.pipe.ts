import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'findLanguageFromKey' })
export class FindLanguageFromKeyPipe implements PipeTransform {
  private languages: { [key: string]: { name: string; rtl?: boolean } } = {
    bg: { name: 'Български' },
    en: { name: 'English' },
    et: { name: 'Eesti' },
    de: { name: 'Deutsch' },
    ro: { name: 'Română' },
    mk: { name: 'Македонски' },
    // jhipster-needle-i18n-language-key-pipe - JHipster will add/remove languages in this object
  };

  transform(lang: string): string {
    return this.languages[lang].name;
  }
}
