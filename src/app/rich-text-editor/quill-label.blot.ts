import Quill from 'quill';
const BlockEmbed = Quill.import('blots/block/embed');

class Label extends BlockEmbed {

  static create(value: string) {
    const node = super.create(value) as HTMLSpanElement;
    node.innerText = value;
    node.contentEditable = 'false';
    //this._addRemovalButton(node);
    return node;
  }

  static value(node: HTMLElement) {
    return node.childNodes[0].textContent;
  }

  private static _addRemovalButton(node: HTMLSpanElement) {
    const button = document.createElement('button');
    button.innerText = 'x';
    button.onclick = () => node.remove();
    button.contentEditable = 'false';
    node.appendChild(button);
    const span = document.createElement('span');
    span.innerText = ' ';
    node.appendChild(span);
  }
}

Label['blotName'] = 'label';
Label['tagName'] = 'SPAN';
Label['className'] = 'ql-label';

Quill.register({'formats/label': Label});  