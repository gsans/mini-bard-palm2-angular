import Quill from 'quill';
const Delta = Quill.import('delta')

class PlainClipboard {
  constructor(private quill: Quill) {
    this.quill.root.addEventListener('paste', this.onPaste.bind(this));
  }

  onPaste(e: ClipboardEvent) {
    e.preventDefault();
    const originalCursor = this.quill.getSelection()?.index || 0;
    const range = this.quill.getSelection() || undefined;
    const plainText = e.clipboardData?.getData('text/plain');
    const htmlText = e.clipboardData?.getData('text/html');

    if (!plainText && !htmlText) return;

    // Check if code block formatting is present in the current selection
    const formats = this.quill.getFormat(range);

    if (formats['code-block']) {
      // Handle code block content
      // For example, insert it into a code block blot
      // Assuming you have a custom code block blot named 'code-block'
      const delta = new Delta().retain(range?.index || originalCursor).insert(htmlText || plainText, formats);
      this.quill.updateContents(delta, 'user');
    } else {
      // Handle non-code block content
      const delta = new Delta()
        .retain(range?.index || originalCursor)
        .delete(range?.length || 0)
        .insert(plainText || htmlText);
      const index = (plainText?.length || 0) + (range?.index || 0);
      const length = 0;
      this.quill.updateContents(delta, 'silent');
      this.quill.setSelection(index, length, 'silent');
    }
  }
}

Quill.register('modules/PlainClipboard', PlainClipboard, true);