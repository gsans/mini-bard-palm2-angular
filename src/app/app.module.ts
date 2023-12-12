import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { HttpClientModule, HttpClient, provideHttpClient, withFetch } from '@angular/common/http'; 

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PredictComponent } from './predict/predict.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { PalmModule } from './generative-ai-palm/palm.module';
import { VertexModule } from './generative-ai-vertex/vertex.module';
import { environment } from '../environments/environment.development';

import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';

import { TextComponent } from './text/text.component';

import { MarkdownModule, MARKED_OPTIONS, MarkedOptions, MarkedRenderer, CLIPBOARD_OPTIONS } from 'ngx-markdown';
import { ClipboardButtonComponent } from './clipboard-button/clipboard-button.component';
import { ReadComponent } from './read/read.component';

import { AudioService } from './read/audio.service';
import { RichTextEditorModule } from './rich-text-editor/rich-text-editor.module';
import { QuillModule } from 'ngx-quill';
import { ProcessCodeBlocksPipe } from './custom-chat/process-code-block.pipe';
import { RouterScrollService } from './router-scroll.service';
import { CustomChatComponent } from './custom-chat/custom-chat.component';

import { TextFieldModule } from '@angular/cdk/text-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';

import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';


// function that returns `MarkedOptions` with renderer override
export function markedOptionsFactory(): MarkedOptions {
  const renderer = new MarkedRenderer();
  const linkRenderer = renderer.link;
  renderer.link = (href, title, text) => {
    let target = `target="_blank"`;
    const isSVG = text.lastIndexOf("svg") >= 0;
    if (isSVG) {
      target = ` target="" `;
    }
    const html = linkRenderer.call(renderer, href, title, text);
    return html.replace(/^<a /, `<a role="link" tabindex="0" ${target} rel="nofollow noopener noreferrer" `);
  };

  return {
    renderer,
  };
}

@NgModule({
  declarations: [
    AppComponent,
    PredictComponent,
    TextComponent,
    ClipboardButtonComponent,
    ReadComponent,
    ProcessCodeBlocksPipe,
    CustomChatComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,

    BrowserAnimationsModule,
    VertexModule.forRoot({
       projectId: environment.PROJECT_ID,
       accessToken: environment.GCLOUD_AUTH_PRINT_ACCESS_TOKEN,
       version: "v1" // options: v1beta1, v1
    }),
    PalmModule.forRoot({
      apiKey: environment.API_KEY,
      version: "v1beta2" // options: v1beta2
    }), 
    MatIconModule,
    MatListModule,
    MatSidenavModule,
    MatToolbarModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    TextFieldModule,
    MatProgressSpinnerModule,

    MarkdownModule.forRoot({
      loader: HttpClient,
      markedOptions: {
        provide: MARKED_OPTIONS,
        useFactory: markedOptionsFactory,
      },
      clipboardOptions: {
        provide: CLIPBOARD_OPTIONS,
        useValue: {
          buttonComponent: ClipboardButtonComponent,
        },
      },
    }),

    QuillModule.forRoot(),
    RichTextEditorModule,
    FormsModule,
  ],
  providers: [
    provideHttpClient(withFetch()),
    AudioService,
    RouterScrollService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
