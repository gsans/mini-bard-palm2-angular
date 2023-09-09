import { Component, Inject, ViewChild } from '@angular/core';
//import { PREDICTION_SERVICE_CLIENT_TOKEN } from '../generative-ai-vertex/vertex.module';
import { TEXT_SERVICE_CLIENT_TOKEN } from '../generative-ai-palm/palm.module';
import { TextServiceClient } from '../generative-ai-palm/v1beta2/text.service';
import { RichTextEditorComponent } from '../rich-text-editor/rich-text-editor.component';
import { AudioService } from '../read/audio.service';

const MAX_PHRASES = 1;

@Component({
  selector: 'app-text',
  templateUrl: './text.component.html',
  styleUrls: ['./text.component.scss'],
})
export class TextComponent {
  @ViewChild(RichTextEditorComponent)
  editor!: RichTextEditorComponent;
  
  title = 'vertex-ai-palm2-angular';
  editorEmpty: boolean = true;

  constructor(
    @Inject(TEXT_SERVICE_CLIENT_TOKEN) public client: TextServiceClient,
    private audio: AudioService
  ) { }

  editorChange(empty: boolean) {
    this.editorEmpty = empty;
  }

  async run(){
    //const response = await this.client.generateText("What is the largest number with a name?");
    //console.log(response?.candidates?.[0].output);
  }

  clear(){
    if (this.editor.quillInstance) {
      this.editor.quillInstance.setText('');
      this.editor.quillInstance.insertText(0, ' ');
      this.editor.quillInstance.focus();
    }
  }

  speakoutPrompt() {
    const text = this.editor.quillInstance.getText().trim();
    if (text.length==0) return;

    // Split text into phrases
    const phrases = text.split('.');

    // Take just the first N phrases
    const limitedPhrases = phrases.slice(0, MAX_PHRASES).join('.');

    if (limitedPhrases.length > 0) {
      this.audio.playTextToSpeech(limitedPhrases);
    }
  }
}

