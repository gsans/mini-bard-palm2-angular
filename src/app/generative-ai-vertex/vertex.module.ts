import { NgModule, ModuleWithProviders, InjectionToken } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';

export const PREDICTION_SERVICE_CLIENT_TOKEN = new InjectionToken<any>('PredictionServiceClient');
import { GoogleCloudCredentials } from './types';

import { PredictionServiceClient as PredictionServiceClient_v1beta1 } from './v1beta1/prediction.service';
import { PredictionServiceClient as PredictionServiceClient_v1 } from './v1/prediction.service';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HttpClientModule,
  ]
})
export class VertexModule {
  static forRoot(config: GoogleCloudCredentials): ModuleWithProviders<VertexModule> {
    return {
      ngModule: VertexModule,
      providers: [
        { provide: GoogleCloudCredentials, useValue: config },
        {
          provide: PREDICTION_SERVICE_CLIENT_TOKEN,
          useFactory: this.predictionServicefactory,
          deps: [HttpClient, GoogleCloudCredentials]
        }
      ],
    };
  }

  private static predictionServicefactory(http: HttpClient, config: GoogleCloudCredentials) {
    if (config.version.toLowerCase() === 'v1') {
      return new PredictionServiceClient_v1(http, config);
    } else if (config.version.toLowerCase() === 'v1beta1') {
      return new PredictionServiceClient_v1beta1(http, config);
    } else {
      throw new Error('Unsupported API version');
    }
  }
}