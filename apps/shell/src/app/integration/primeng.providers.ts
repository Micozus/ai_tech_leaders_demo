import { EnvironmentProviders } from '@angular/core';
import { DEVMENTOR_PRESET } from '@org/ui';
import { providePrimeNG } from 'primeng/config';

export function provideAppPrimeNG(): EnvironmentProviders {
  return providePrimeNG({ theme: { preset: DEVMENTOR_PRESET } });
}
