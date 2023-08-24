import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { TextServiceClient } from './v1beta2/text.service';

export class MakerSuiteCredentials {
  apiKEY: string = '';
}

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
        TextServiceClient
      ],
    };
  }
}