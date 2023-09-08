import { Component, Inject, ViewChild } from '@angular/core';
//import { PREDICTION_SERVICE_CLIENT_TOKEN } from '../generative-ai-vertex/vertex.module';
import { TEXT_SERVICE_CLIENT_TOKEN } from '../generative-ai-palm/palm.module';
import { TextServiceClient } from '../generative-ai-palm/v1beta2/text.service';
import { RichTextEditorComponent } from '../rich-text-editor/rich-text-editor.component';

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
    @Inject(TEXT_SERVICE_CLIENT_TOKEN) public client: TextServiceClient
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
}

