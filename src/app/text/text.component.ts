import { Component, Inject, ViewChild } from '@angular/core';
//import { PREDICTION_SERVICE_CLIENT_TOKEN } from '../generative-ai-vertex/vertex.module';
import { TEXT_SERVICE_CLIENT_TOKEN } from '../generative-ai-palm/palm.module';
import { TextServiceClient } from '../generative-ai-palm/v1beta2/text.service';
import { RichTextEditorComponent } from '../rich-text-editor/rich-text-editor.component';
import { AudioService } from '../read/audio.service';
import { DeltaStatic } from 'quill';

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

  async run() {
    const prompt = this.extractText(this.editor.quillInstance.getContents()).trim().substring(0, 1024);
    const response = await this.client.generateText(prompt);
    const text = response?.candidates?.[0].output || '';
    if (this.editor && text.trim().length>0) {
      this.editor.insertAndFormat(text);
    }
    console.log(text);
  }

  clear() {
    this.editor.clear();
  }

  speakoutPrompt() {
    const text = this.extractText(this.editor.quillInstance.getContents()).trim();
    if (text.length == 0) return;
    const phrases = text.split('.');
    const limitedPhrases = phrases.slice(0, MAX_PHRASES).join('.');
    if (limitedPhrases.length > 0) {
      this.audio.playTextToSpeech(limitedPhrases);
    }
  }

  extractText(ops: any) {
    let text = '';
    ops.forEach((op:any) => {
      if (op.insert?.label) {
        text += '\n\n' + op.insert.label + '\n\n';
      } else if (op.insert) {
        text += op.insert;
      }    
    }); 
    return text;
  }
}

