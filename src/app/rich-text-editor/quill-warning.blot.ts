import Quill from 'quill';
const BlockEmbed = Quill.import('blots/block/embed');

class Warning extends BlockEmbed {

  static create(value: string) {
    const node = super.create(value) as HTMLSpanElement;
    node.innerText = value;
    node.contentEditable = 'false';
    return node;
  }

  static value(node: HTMLElement) {
    return node.childNodes[0].textContent;
  }
}

Warning['blotName'] = 'warning';
Warning['tagName'] = 'SPAN';
Warning['className'] = 'ql-warning';

Quill.register({ 'formats/label': Warning });  