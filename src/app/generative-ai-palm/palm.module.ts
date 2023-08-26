import { NgModule, ModuleWithProviders, InjectionToken } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';

export const TEXT_SERVICE_CLIENT_TOKEN = new InjectionToken<any>('TextServiceClient');
export const DISCUSS_SERVICE_CLIENT_TOKEN = new InjectionToken<any>('DiscussServiceClient');
export const MODEL_SERVICE_CLIENT_TOKEN = new InjectionToken<any>('ModelServiceClient');

import { MakerSuiteCredentials } from './types';

import { TextServiceClient as TextServiceClient_v1beta2 } from './v1beta2/text.service';
import { DiscussServiceClient as DiscussServiceClient_v1beta2 } from './v1beta2/discuss.service';
import { ModelServiceClient as ModelServiceClient_v1beta2 } from './v1beta2/model.service';

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
        },
        {
          provide: DISCUSS_SERVICE_CLIENT_TOKEN,
          useFactory: this.discussServicefactory,
          deps: [HttpClient, MakerSuiteCredentials]
        },
        {
          provide: MODEL_SERVICE_CLIENT_TOKEN,
          useFactory: this.modelServicefactory,
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

  private static discussServicefactory(http: HttpClient, config: MakerSuiteCredentials) {
    if (config.version.toLowerCase() === 'v1beta2') {
      return new DiscussServiceClient_v1beta2(http, config);
    } else {
      throw new Error('Unsupported API version');
    }
  }

  private static modelServicefactory(http: HttpClient, config: MakerSuiteCredentials) {
    if (config.version.toLowerCase() === 'v1beta2') {
      return new ModelServiceClient_v1beta2(http, config);
    } else {
      throw new Error('Unsupported API version');
    }
  }
}