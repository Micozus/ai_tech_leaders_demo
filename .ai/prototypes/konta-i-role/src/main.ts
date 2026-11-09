import { provideZonelessChangeDetection } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { RootComponent } from './app/root.component';

bootstrapApplication(RootComponent, {
  providers: [provideZonelessChangeDetection()],
}).catch((error: unknown) => console.error(error));
