import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { HTTP_INTERCEPTORS, provideHttpClient } from '@angular/common/http';

import { routes } from './app.routes';
import { TokenInterceptor } from './service/token-interceptor.service';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes), { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true }, provideHttpClient()]
};
