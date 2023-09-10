import { Component, EventEmitter, HostListener, Output } from '@angular/core';
import { ContentChange } from 'ngx-quill';
import { Quill } from 'quill';
import './quill-label.blot';
import './quill-text-only.clipboard';
import './quill-markdown.module';

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
  lastIdea = "";
  ideasArray = [
    `Explain string theory to me like I'm nine`, 
    `Categorize an apple as fruit or vegetable`, 
    `Paraphrase "It looks like it's about to rain"`, 
    `Create JSON from characters in a popular board game`, 
    `Write a story about a magic backpack`,
    `Find the nouns in this sentence: "The rain in Spain falls mainly on the plain"`,
    `Write a JavaScript function and explain it to me`
  ];
  usedIndices: number[] = [];
  timeoutId: any | undefined;

  quillConfiguration = {
    toolbar: false,
    QuillMarkdown: { 
      ignoreTags: [],
      tags: { },
    },
    PlainClipboard: true
    //clipboard: true,
  }

  editorCreated(quill: Quill) {
    this.quillInstance = quill;
    this.quillInstance.focus();
    this.switchIdea();

/*     this.quillInstance.clipboard.addMatcher(Node.ELEMENT_NODE, function (node, delta) {
      var plaintext = node.innerText
      var Delta = Quill.import('delta')
      return new Delta().insert(plaintext)
    }); */
  }

  switchIdea() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }

    const ideasCopy = [...this.ideasArray];
    const remainingIdeas = ideasCopy.filter((_, i) => {
      return !this.usedIndices.includes(i);
    });
    const newIndex = Math.floor(Math.random() * remainingIdeas.length);

    // Get new idea and update tracking
    const newIdea = remainingIdeas[newIndex];
    this.usedIndices.push(newIndex);

    // reset when done through it all
    if (this.usedIndices.length === this.ideasArray.length) {
      this.usedIndices = [];
    }

    // Set placeholder
    this.quillInstance.root.dataset['placeholder'] = newIdea;
    this.lastIdea = newIdea;

    // Recursively call again after delay
    this.timeoutId = setTimeout(() => {
      if (this.editorEmpty) {
        this.switchIdea();
      }
      this.timeoutId = undefined;
    }, 5000);
  }

  @HostListener('keydown.tab', ['$event'])
  onTabKeydown(event: any) {
    if (this.isEditorEmpty) {
      this.quillInstance.setText(this.lastIdea);
      this.quillInstance.setSelection(this.lastIdea.length, 0);
      this.quillInstance.update();
      event.stopPropagation();
    }
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
    return text.trim().substring(0, 8196);
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
    this.switchIdea();
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
