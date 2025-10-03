import { ApplicationConfig, LOCALE_ID, provideBrowserGlobalErrorListeners, provideZoneChangeDetection} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes';
import { MAT_DATE_FORMATS, MAT_DATE_LOCALE, provideNativeDateAdapter } from '@angular/material/core';
import { TRANSLATIONS, TRANSLATIONS_FORMAT } from '@angular/core';

const APP_MAT_DATE_FORMAT = {
  parse: {
    dateInput: 'DD/MM/YYYY', // this is how your date will be parsed from Input
  },
  display: {
    dateInput: 'DD/MM/YYYY', // this is how your date will get displayed on the Input
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY'
  }
};

export const appConfig: ApplicationConfig = {
  providers: [
      provideNativeDateAdapter(),
    { provide: MAT_DATE_FORMATS, useValue: APP_MAT_DATE_FORMAT},
    { provide: MAT_DATE_LOCALE, useValue: 'th-TH', },
    { provide: LOCALE_ID, useValue: 'th' },       
    provideHttpClient(),
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
  ]
};
