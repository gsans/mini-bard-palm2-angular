import { NgModule, ModuleWithProviders, InjectionToken } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';

export const TEXT_SERVICE_CLIENT_TOKEN = new InjectionToken<any>('TextServiceClient');
import { MakerSuiteCredentials } from './types';

import { TextServiceClient as TextServiceClient_v1beta2 } from './v1beta2/text.service';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HttpClientModule,
  ]
})
export class PalmModule {
  static forRoot(config: MakerSuiteCredentials): ModuleWithProviders<PalmModule> {
    return {
      ngModule: PalmModule,
      providers: [
        { provide: MakerSuiteCredentials, useValue: config },
        {
          provide: TEXT_SERVICE_CLIENT_TOKEN,
          useFactory: this.textServicefactory,
          deps: [HttpClient, MakerSuiteCredentials]
        }
      ],
    };
  }

  private static textServicefactory(http: HttpClient, config: MakerSuiteCredentials) {
    if (config.version.toLowerCase() === 'v1beta2') {
      return new TextServiceClient_v1beta2(http, config);
    } else {
      throw new Error('Unsupported API version');
    }
  }
}