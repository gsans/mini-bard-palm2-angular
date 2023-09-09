import { Node } from '@angular/compiler';
import Quill from 'quill';
const Clipboard = Quill.import('modules/clipboard')
const Delta = Quill.import('delta')

class PlainClipboard extends Clipboard {
  onPaste(e: ClipboardEvent) {
    e.preventDefault()
    const quill = Quill.find(e.currentTarget);
    const range = quill.getSelection()
    const text = e.clipboardData?.getData('text/plain')
    const delta = new Delta()
      .retain(range.index)
      .delete(range.length)
      .insert(text)
    const index = text?.length + range.index
    const length = 0
    quill.updateContents(delta, 'silent')
    quill.setSelection(index, length, 'silent')
    quill.scrollIntoView()
  }
}

Quill.register('modules/clipboard', PlainClipboard, true)