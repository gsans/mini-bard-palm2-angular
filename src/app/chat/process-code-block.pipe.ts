import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'processCodeBlocks'
})
export class ProcessCodeBlocksPipe implements PipeTransform {

  transform(markdown: string): string {
    const processedMarkdown = markdown.replace(/```(\w*)\n([\s\S]*?)```/g, (match, language, code) => {
      const nbsp = code.replace(/ {1,}|\t+/g, (whitespace: any) => {
        return whitespace.replace(/\s/g, '&nbsp;');
      });
      if (language === 'mermaid') {
        return `<div class="mermaid">${code}</div>`
      } else {
        return `<pre><code>${nbsp}</code></pre>`;
      }
    });

    return processedMarkdown;
  }
}