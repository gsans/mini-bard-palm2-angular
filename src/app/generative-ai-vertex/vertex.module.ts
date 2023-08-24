import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { PredictionServiceClient, GoogleCloudCredentials } from './prediction.service';

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
        PredictionServiceClient
      ],
    };
  }
}