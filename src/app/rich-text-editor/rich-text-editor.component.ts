import { Component, EventEmitter, Output } from '@angular/core';
import { ContentChange } from 'ngx-quill';
import { Quill } from 'quill';
import './quill-label.blot';
//import './quill-text-only.clipboard';

@Component({
  selector: 'app-rich-text-editor',
  templateUrl: './rich-text-editor.component.html',
  styleUrls: ['./rich-text-editor.component.scss']
})
export class RichTextEditorComponent {
  quillInstance!: Quill;
  @Output() editorEmpty: EventEmitter<boolean> = new EventEmitter<boolean>();
  isEditorEmpty = true;
  @Output() speakerClicked = new EventEmitter<void>();


  quillConfiguration = {
    toolbar: false,
  }

  editorCreated(quill: Quill) {
    this.quillInstance = quill;
    this.quillInstance.focus();

/*     this.quillInstance.clipboard.addMatcher(Node.ELEMENT_NODE, function (node, delta) {
      var plaintext = node.innerText
      var Delta = Quill.import('delta')
      return new Delta().insert(plaintext)
    }); */
  }

  extractPrompt() {
    let text = '';
    const ops =  this.quillInstance.getContents();
    ops.forEach((op: any) => {
      if (op.insert?.label) {
        text += '\n\n' + op.insert.label + '\n\n';
      } else if (op.insert) {
        text += op.insert;
      }
    });
    return text.trim().substring(0, 1024);
  }

  insertAndFormat(text:string) {
    var range = this.quillInstance.getSelection();
    if (range) {
      if (range.length > 0) return; // range selected ignore
      const index = range.index;
      const length = text.length;

      this.quillInstance.insertEmbed(index, 'label', text, 'user');
      this.quillInstance.update('user');

      /* this.quillInstance.setText(text);
      this.quillInstance.formatText(index, length, {                   // unbolds 'hello' and set its color to blue
        'bold': true,
        'background-color': 'rgb(0, 0, 255)'
      });
      this.quillInstance.setSelection(index+length, 0); */
    } // else cursor is not in editor
  }

  clear() {
    if (this.quillInstance) {
      this.quillInstance.setText('');
      this.quillInstance.focus();
    }
  }

  contentChanged(change: ContentChange) {
    const isEmpty = change.text.trim().length === 0; 
    if (this.isEditorEmpty !== isEmpty) {
      this.isEditorEmpty = isEmpty;
      this.editorEmpty.emit(isEmpty);
    }
  }

  onSpeakerClick() {
    this.speakerClicked.emit();
  }
}
