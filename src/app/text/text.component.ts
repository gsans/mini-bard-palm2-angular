import { Component, Inject, ViewChild } from '@angular/core';
// import { PREDICTION_SERVICE_CLIENT_TOKEN } from '../generative-ai-vertex/vertex.module';
// import { PredictionServiceClient } from '../generative-ai-vertex/v1/prediction.service';
// import { TextResponse } from '../generative-ai-vertex/v1/vertex.types';
import { TEXT_SERVICE_CLIENT_TOKEN } from '../generative-ai-palm/palm.module';
import { TextServiceClient } from '../generative-ai-palm/v1beta2/text.service';
import { TextResponse } from '../generative-ai-palm/v1beta2/palm.types';
import { RichTextEditorComponent } from '../rich-text-editor/rich-text-editor.component';
import { AudioService } from '../read/audio.service';
const MAX_PHRASES = 10;

@Component({
  selector: 'app-text',
  templateUrl: './text.component.html',
  styleUrls: ['./text.component.scss'],
})
export class TextComponent {
  @ViewChild(RichTextEditorComponent)
  editor!: RichTextEditorComponent;
  editorEmpty: boolean = true;
  playing: boolean = false;

  constructor(
    @Inject(TEXT_SERVICE_CLIENT_TOKEN) public client: TextServiceClient,
    //@Inject(PREDICTION_SERVICE_CLIENT_TOKEN) public client: PredictionServiceClient,
    private audio: AudioService
  ) { }

  editorChange(empty: boolean) {
    this.editorEmpty = empty;
  }

  async run() {
    if (!this.editor) return;
    const prompt = this.editor.extractPrompt();

    // PaLM
    const response = await this.client.generateText(prompt);
    if (response.filters && response.filters.length > 0){
      this.logBlockedResponse(prompt, response);
      this.editor.insertAndFormat("Response was blocked. Try changing your prompt to avoid any derogatory, toxic, sexual, violent, dangerous or medical related content.", true);
    } else {
      const text = (response?.candidates?.[0].output || '').trim();
      this.editor.insertAndFormat(text);
    }

    // Vertex AI
    //const response: TextResponse = await this.client.predict(prompt);
    //const text = (response?.predictions?.[0].content).trim();
    // if (text.length > 0) {
    //   this.editor.insertAndFormatMarkdown(text);
    // }

    // Vertex AI Stream
    // this.client.streamingPredict(prompt).subscribe({
    //   next: (response: any) => {
    //     console.log('stream-chunk');
    //     response.forEach( (element: any) => {
    //       const text = (element.outputs?.[0].structVal?.content?.stringVal?.[0]).trim();
    //       this.editor.insertStream(text);
    //     });
    //   },
    //   complete: () => { console.log('stream-end'); },
    //   error: (error) => { console.log(error); }
    // })
  }

  clear() {
    this.editor.clear();
  }

  speakoutPrompt() {
    if (this.audio.isAudioStreamingPlaying()) {
      this.audio.pause();
      return;
    }
    const prompt = this.editor.extractPrompt();
    if (prompt.length == 0) return;
    const phrases = prompt.split('.');
    const limitedPhrases = phrases.slice(0, MAX_PHRASES).join('.');
    if (limitedPhrases.length > 0) {
      this.audio.playStreamAudio(limitedPhrases);
    }
  }

  extractText(ops: any) {
    let text = '';
    ops.forEach((op: any) => {
      if (op.insert?.label) {
        text += '\n\n' + op.insert.label + '\n\n';
      } else if (op.insert) {
        text += op.insert;
      }
    });
    return text;
  }

  private logBlockedResponse(prompt: string, response: TextResponse) {
    if (!response.filters || response.filters.length == 0) return;

    console.log("Response was blocked.");
    console.log(`Original prompt: ${prompt}`);
    console.log(`Filters applied:\n${JSON.stringify(response.filters, null, " ")}`);
    console.log(`Safety settings and category ratings:\n${JSON.stringify(response.safetyFeedback, null, " ")}`);
  }
}

