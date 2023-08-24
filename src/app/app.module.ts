import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PredictComponent } from './predict/predict.component';

import { NbThemeModule, NbLayoutModule, NbChatModule, NbSpinnerModule } from '@nebular/theme';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { PalmModule } from './generative-ai-palm/palm.module';
import { VertexModule } from './generative-ai-vertex/vertex.module';
import { environment } from '../environments/environment.development';

@NgModule({
  declarations: [
    AppComponent,
    PredictComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NbThemeModule.forRoot({ name: 'dark' }),
    NbLayoutModule,
    NbEvaIconsModule,
    NbChatModule,
    NbSpinnerModule,
    BrowserAnimationsModule,
    // VertexModule.forRoot({
    //   projectId: environment.PROJECT_ID,
    //   accessToken: environment.GCLOUD_AUTH_PRINT_ACCESS_TOKEN,
    //   version: "v1" // options: v1beta1, v1
    // })
    PalmModule.forRoot({
      apiKey: environment.API_KEY,
      version: "v1beta2" // options: v1beta2
    })
  ],
  bootstrap: [PredictComponent]
})
export class AppModule { }
