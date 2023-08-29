import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { environment } from '../../environments/environment.development';

import { DISCUSS_SERVICE_CLIENT_TOKEN } from '../generative-ai-palm/palm.module';
import { DiscussServiceClient } from '../generative-ai-palm/v1beta2/discuss.service';
import { Message, MessageResponse } from '../generative-ai-palm/v1beta2/palm.types';

import { KatexOptions, MermaidAPI } from 'ngx-markdown';
import { ClipboardButtonComponent } from '../clipboard-button/clipboard-button.component';

declare global {
  interface Window {
    scrollIntoView?: any;
  }
}

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  @ViewChild('bottom') bottom!: ElementRef;
  readonly clipboardButton = ClipboardButtonComponent;

  title = 'Conversation';
  messages = <any>[];
  palmMessages: Array<Message> = [];
  loading = false;
  katexOptions: KatexOptions = {
    displayMode: true,
    throwOnError: false
  };
  public mermaidOptions: MermaidAPI.Config = {
    fontFamily: `"Source Code Pro", verdana, arial, sans-serif`,
    logLevel: MermaidAPI.LogLevel.Info,
    theme: MermaidAPI.Theme.Default,
    themeCSS: `
      path.arrowMarkerPath { fill: #7eb6f6; stroke:#7eb6f6; } 
      .node rect { fill: #1d262f; stroke:#1d262f; }
      .flowchart-link { stroke: #7eb6f6; fill: none; }
      .nodeLabel { color: #1d262f; }
      .node polygon { fill: #1d262f; stroke:#1d262f; }
      .actor { fill: white; stroke:#1d262f; }
      text.actor>tspan { color: #1d262f; fill:#1d262f; }
      .actor-man circle, line { color: #1d262f; fill:#1d262f; stroke:#1d262f; }
    `,
  };

  constructor(
    @Inject(DISCUSS_SERVICE_CLIENT_TOKEN) private client: DiscussServiceClient
  ) { }

  ngOnInit(): void {
    //this.addBotMessageLocal(`Human presence detected ⚠️. How can I help you? `);
    this.messages.push({
      type: 'md',
      customMessageData: `
      **Large text**
      sajdkjaskjdaskjndkjasjkdn jkankjnaskjnd kasjndkj naskjdakjdnkajndkasnkdnaskjdnkjasndkjankj dsnksjnkja dnkjad jsakd kadsjjadsnkadnkadjnakdjsndskdjaskadjnakjnds adadasjasdkjadnakdjnadsasdndksajsdajkdskajdaskjndaskadsndsanssdanaskjdakjdnkajndkasnkdnaskjdnkjasndkjankjnaskjdakjdnkajndkasnkdnaskjdnkjasndkjankjnaskjdakjdnkajndkasnkdnaskjdnkjasndkjankj   dsajsad sdasd

      **Code blocks**
      \`\`\`javascript
      var s = "JavaScript syntax highlighting";
      alert(s);
      \`\`\`

      **Emojis**
      :smile: \\:smile\\:
      
      **Katex**
      \$ E = mc^ 2 \$
      
      **MermaidJS**
      \`\`\`mermaid
      sequenceDiagram
      Alice->>+John: Hello John, how are you?
      Alice->>+John: John, can you hear me?
      John-->>-Alice: Hi Alice, I can hear you!
      John-->>-Alice: I feel great!
      \`\`\`
    `,
      reply: false,
    });
  }

  handleUserMessage(event: any) {
    this.addUserMessage(event.message);
  }

  private extractMessageResponse(response: MessageResponse): string {
    let answer = response.candidates?.[0]?.content ?? "";
    if (!answer) throw ("Error");
    return answer;
  }

  // Helpers
  private async addUserMessage(text: string) {
    let txt = text.replaceAll('\\n', '<br>');
    this.messages.push({
      type: 'md',
      customMessageData: txt,
      sender: '@gerardsans',
      date: new Date(),
      avatar: "https://pbs.twimg.com/profile_images/1688607716653105152/iL4c9mUH_400x400.jpg",
    } as any);

    this.loading = true;
    let response = await this.client.generateMessage(text, this.palmMessages);
    let answer = this.extractMessageResponse(response);
    if (answer) {
      this.palmMessages.push({ content: text }); // add user after call
      this.addBotMessage(answer);

      let newTitle = this.extractTitle(answer);
      if (newTitle) {
        this.title = `Conversation: ${newTitle}`;
      }
    }
    this.loading = false;
    this.scrollToBottom();
  }

  private addBotMessage(text: string) {
    this.palmMessages.push({ content: text }); // add robot response
    this.messages.push({
      type: 'md',
      customMessageData: text,
      reply: false,
      avatar: "/assets/sparkle_resting.gif",
    });
    this.scrollToBottom();
  }

  private addBotMessageLocal(text: string) {
    this.messages.push({
      type: 'text',
      text,
      sender: 'Bot',
      reply: true,
      date: new Date()
    });
  }

  private scrollToBottom() {
    requestAnimationFrame(() => {
      this.bottom.nativeElement.scrollIntoView({ behavior: 'smooth' });
    });
  }

  private extractTitle(text: string): string | null {
    debugger;
    const jsonPattern = /{[^]*?}/; // Regular expression to match a JSON object

    const match = text.match(jsonPattern);
    if (match) {
      try {
        const jsonObject = JSON.parse(match[0]);
        if (typeof jsonObject === 'object' && jsonObject !== null) {
          return jsonObject?.title;
        }
      } catch (error) {
        // JSON parsing error
      }
    }
    return null;
  }


}

window.document.addEventListener('copy', function (event) {
  debugger;
  const selection = window.getSelection();
  if (selection?.isCollapsed) {
    return;  // default action OK
  }
  const fragment = selection?.getRangeAt(0).cloneContents();
  const katexs = fragment?.querySelectorAll('.katex');
  if (katexs?.length === 0) {
    return;  // default action OK
  }
  katexs?.forEach(function (element) {
    const texSource = element.querySelector('annotation');
    if (texSource) {
      element.replaceWith(texSource);
      texSource.innerHTML = '$' + texSource.innerHTML + '$';
    }
  });
  fragment?.querySelectorAll('.katex-display annotation').forEach(function (element) {
    element.innerHTML = '$' + element.innerHTML + '$';
  })
  event?.clipboardData?.setData('text/plain', fragment?.textContent || "");
  event?.clipboardData?.setData('text/html', selection?.getRangeAt(0).cloneContents().textContent || "");
  event.preventDefault();
})