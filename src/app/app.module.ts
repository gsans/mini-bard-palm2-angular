import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PredictComponent } from './predict/predict.component';

import { NbThemeModule, NbLayoutModule, NbChatModule, NbSpinnerModule } from '@nebular/theme';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

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
    VertexModule.forRoot({
      projectID: environment.PROJECT_ID,
      accessToken: environment.GCLOUD_AUTH_PRINT_ACCESS_TOKEN,
    })
  ],
  providers: [],
  bootstrap: [PredictComponent]
})
export class AppModule { }
