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
  selector: 'app-custom-chat',
  templateUrl: './custom-chat.component.html',
  styleUrls: ['./custom-chat.component.scss']
})
export class CustomChatComponent implements OnInit {
  @ViewChild('bottom') bottom!: ElementRef;
  readonly clipboardButton = ClipboardButtonComponent;
  disabled: boolean = false;

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
        path.arrowMarkerPath { fill: #1d262f; stroke:#1d262f; } 
        .node rect { fill: white; stroke:#1d262f; }
        .flowchart-link { stroke: #1d262f; fill: none; }
        .entityBox { fill: white; stroke:#1d262f; }
        .nodeLabel { color: #1d262f; }
        .node polygon { fill: white; stroke:#1d262f; }
        .actor { fill: white; stroke:#1d262f; }
        text.actor>tspan { color: #1d262f; fill:#1d262f; }
        .actor-man circle, line { color: #1d262f; fill:white; stroke:#1d262f; }
      `,
  };
  large_text_section = ''; /* `**Large text**
    sajdkjaskjdaskjndkjasjkdn jkankjnaskjnd kasjndkj naskjdakjdnkajndkasnkdnaskjdnkjasndkjankj dsnksjnkja dnkjad jsakd kadsjjadsnkadnkadjnakdjsndskdjaskadjnakjnds adadasjasdkjadnakdjnadsasdndksajsdajkdskajdaskjndaskadsndsanssdanaskjdakjdnkajndkasnkdnaskjdnkjasndkjankjnaskjdakjdnkajndkasnkdnaskjdnkjasndkjankjnaskjdakjdnkajndkasnkdnaskjdnkjasndkjankj   dsajsad sdasd
  ` */
  model = {
    prompt: "",
  };

  constructor(
    @Inject(DISCUSS_SERVICE_CLIENT_TOKEN) private client: DiscussServiceClient
  ) { }

  ngOnInit(): void {
    //this.addBotMessageLocal(`Human presence detected ⚠️. How can I help you? `);
    this.messages.push({
      type: 'md',
      text: `
      ${this.large_text_section}
      **Markdown for improved readability**
      This is _funky_.

      **Code blocks for coding**
\`\`\`ts
var s = "JavaScript syntax highlighting";
alert(s);
\`\`\`

\`\`\`HTML
<div class= "cdk-visually-hidden cdk-focus-trap-anchor" aria-hidden="true">
  Empty
</div>
\`\`\`

      **Emoji shortnames**
      :wave: \\:wave\\: :volcano: \\:volcano\\: :helicopter: \\:helicopter\\: 
    
      **Katex for Math**
      \$ E = mc^ 2 \$
    
      **MermaidJS for diagrams**
      \`\`\`mermaid
      sequenceDiagram
      Alice->>+John: Hello John, how are you?
      Alice->>+John: John, can you hear me?
      John-->>-Alice: Hi Alice, I can hear you!
      John-->>-Alice: I feel great!
      \`\`\`

    ` ,
      reply: false,
      avatar: "https://pbs.twimg.com/profile_images/1688607716653105152/iL4c9mUH_400x400.jpg",
    }); 
  }

  handleUserMessage() {
    this.addUserMessage(this.model.prompt);
    setTimeout(()=>{
      this.model.prompt = ''; // reset input
    });
  }

  private extractMessageResponse(response: MessageResponse): string {
    let answer = response.candidates?.[0]?.content ?? "";
    if (!answer) throw ("Error");
    return answer;
  }

  // Helpers
  private async addUserMessage(text: string) {
    //let txt = text.replaceAll('\n', '\\n');
    
    // Split the text into code and non-code sections
    let sections = text.split(/(```[^`]+```)/);

    // Process non-code sections and replace new lines with <br>
    for (let i = 0; i < sections.length; i++) {
      if (i % 2 === 0) { // Non-code sections
        sections[i] = sections[i].replace(/\n/g, "<br>");
      }
    }

    // Join the sections back together
    let txt = sections.join('');

    this.messages.push({
      type: 'md',
      text: txt,
      sender: '@gerardsans',
      date: new Date(),
      avatar: "https://pbs.twimg.com/profile_images/1688607716653105152/iL4c9mUH_400x400.jpg",
    } as any);
    //this.scrollToBottom();

    this.loading = true;
    //disable after timeout
    setTimeout(() => {
      this.loading = false; //silent recovery
    }, 5000);

    let response;
    let answer;
    if (this.disabled) {
      answer = 'Test reply!';
    } else {
      response = await this.client.generateMessage(text, this.palmMessages);
      answer = this.extractMessageResponse(response);
    }
    if (answer) {
      this.palmMessages.push({ content: text }); // add user after call
      this.addBotMessage(answer);

      // let newTitle = this.extractTitle(answer);
      // if (newTitle) {
      //   this.title = `Conversation: ${newTitle}`;
      // }
    }
    this.loading = false;
    //this.scrollToBottom();
  }

  private addBotMessage(text: string) {
    this.palmMessages.push({ content: text }); // add robot response
    this.messages.push({
      type: 'md',
      text: text,
      sender: 'Bot',
      reply: false,
      avatar: "/assets/sparkle_resting.gif",
    });
    //this.scrollToBottom();
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

  retry(text: string) {
    if (this.isUserMessage(text)) {
      this.addUserMessage(text); /* retry exact prompt */
    }
  }
  isUserMessage(text: string) {
    //find original message
    const message = this.messages.find((message: any) => message.text === text);
    return (message && message.sender /* user message */);
  }

  showReply(text: string) {
    // only if it is a user prompt (it has a sender)
    return this.messages.find((message: any) => message.text === text && message.sender);
  }
}

window.document.addEventListener('copy', function (event) {
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
