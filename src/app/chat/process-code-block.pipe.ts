import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'processCodeBlocks'
})
export class ProcessCodeBlocksPipe implements PipeTransform {

  transform(markdown: string): string {
    const processedMarkdown = markdown.replace(/```(\w*)\n([\s\S]*?)```/g, (match, language, code) => {
      const nbsp = code.replace(/ {1,}|\t+/g, (whitespace: any) => {
        // replace whitespace with equivalent &nbsp; https://en.wikipedia.org/wiki/Whitespace_character#Unicode
        return whitespace.replace(/\s/g, `\u{00A0}`);  
      });
      if (language === 'mermaid') {
        return `<div class="mermaid">${code}</div>`
      } else {
        return `\`\`\`${language}
${nbsp}
\`\`\``;
      }
    });

    return processedMarkdown;
  }
}