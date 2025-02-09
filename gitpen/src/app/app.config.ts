import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { ApplicationConfig, provideZoneChangeDetection, APP_INITIALIZER } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { HttpClient, provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { provideMarkdown } from 'ngx-markdown';
import { routes } from './app.routes';
import { ConfigService } from './config.service';


export function initializeApp(configService: ConfigService): () => Promise<void> {
    return () => configService.loadConfig();
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimations(),
    provideHttpClient(),
    provideMarkdown(),
    ConfigService,
    {
        provide: APP_INITIALIZER,
        useFactory: initializeApp,
        deps: [ConfigService],
        multi: true
    }
  ]
};
