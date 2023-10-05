import { Component, Inject, ViewChild } from '@angular/core';
//import { PREDICTION_SERVICE_CLIENT_TOKEN } from '../generative-ai-vertex/vertex.module';
import { TEXT_SERVICE_CLIENT_TOKEN } from '../generative-ai-palm/palm.module';
import { TextServiceClient } from '../generative-ai-palm/v1beta2/text.service';
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

  constructor(
    @Inject(TEXT_SERVICE_CLIENT_TOKEN) public client: TextServiceClient,
    private audio: AudioService
  ) { }

  editorChange(empty: boolean) {
    this.editorEmpty = empty;
  }

  async run() {
    if (!this.editor) return;
    const prompt = this.editor.extractPrompt();
    const response = await this.client.generateText(prompt);
    const text = (response?.candidates?.[0].output || '').trim();
    if (text.length > 0) {
      this.editor.insertAndFormatMarkdown(text);
    }
  }

  clear() {
    this.editor.clear();
  }

  speakoutPrompt() {
    const prompt = this.editor.extractPrompt();
    if (prompt.length == 0) return;
    const phrases = prompt.split('.');
    const limitedPhrases = phrases.slice(0, MAX_PHRASES).join('.');
    if (limitedPhrases.length > 0) {
      this.audio.playTextToSpeech(limitedPhrases);
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
}

