import { DEBUG_INFO_ENABLED } from 'app/app.constants';
import { NgcCookieConsentConfig } from 'ngx-cookieconsent';

export const COOKIE_CONFIG: NgcCookieConsentConfig = {
  cookie: {
    domain: DEBUG_INFO_ENABLED ? 'localhost' : 'compass.schmelz.univie.ac.at', // it is mandatory to set a domain, for cookies to work properly (see https://goo.gl/S2Hy2A)
  },
  position: 'bottom-right',
  theme: 'classic',
  palette: {
    popup: {
      background: '#fff',
      text: '#000',
      link: '#e95420',
    },
    button: {
      background: '#e95420',
      text: '#ffffff',
      border: 'transparent',
    },
  },
  type: 'info',
  content: {
    message: 'This website uses cookies to ensure you get the best experience on our website.',
    dismiss: 'Got it!',
    deny: 'Refuse cookies',
    link: 'Learn more',
    href: '#',
    policy: 'Cookie Policy',
  },
};
