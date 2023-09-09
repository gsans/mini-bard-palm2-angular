import { Component, EventEmitter, Output } from '@angular/core';
import { ContentChange } from 'ngx-quill';
import { Delta, Quill } from 'quill';

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
    this.quillInstance.insertText(0, ' ');
    this.quillInstance?.focus();
    this.quillInstance.root.dataset['placeholder'] = "test";
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
