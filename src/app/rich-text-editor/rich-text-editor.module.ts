import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RichTextEditorComponent } from './rich-text-editor.component';
import { QuillModule } from 'ngx-quill'
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';


@NgModule({
  declarations: [
    RichTextEditorComponent
  ],
  imports: [
    CommonModule,
    QuillModule.forRoot(),
    MatIconModule,
    MatButtonModule
  ],
  exports: [
    RichTextEditorComponent
  ],
})
export class RichTextEditorModule { }
