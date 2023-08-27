import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { environment } from '../../environments/environment.development';

import { DISCUSS_SERVICE_CLIENT_TOKEN } from '../generative-ai-palm/palm.module';
import { DiscussServiceClient } from '../generative-ai-palm/v1beta2/discuss.service';
import { Message, MessageResponse } from '../generative-ai-palm/v1beta2/palm.types';

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

  title = 'vertex-ai-palm2-angular';
  messages = <any>[];
  palmMessages: Array<Message> = [];
  loading = false;

  constructor(
    @Inject(DISCUSS_SERVICE_CLIENT_TOKEN) private client: DiscussServiceClient
  ) { }

  ngOnInit(): void {
    //this.addBotMessageLocal(`Human presence detected ⚠️. How can I help you? `);
    // this.messages.push({
    //   type: 'md',
    //   customMessageData: 'heyho',
    //   reply: false,
    //   date: new Date(),
    //   sender: '@gerardsans',
    // });
  }

  handleUserMessage(event: any) {
    this.addUserMessage(event.message);
  }

  private extractMessageResponse(response: MessageResponse): string {
    let answer = response.candidates?.[0]?.content ?? "";
    if (!answer) throw("Error");
    return answer;
  }

  // Helpers
  private async addUserMessage(text: string) {
    this.messages.push({
      type: 'md',
      customMessageData: text,
      sender: '@gerardsans',
      date: new Date(),
      avatar: "https://pbs.twimg.com/profile_images/1688607716653105152/iL4c9mUH_400x400.jpg",
    } as any);

    this.loading = true;
    //let response = await this.client.generateMessage(text, this.palmMessages);
    let answer = '123'; //this.extractMessageResponse(response);
    if (answer) {
      this.palmMessages.push({ content: text }); // add user after call
      this.addBotMessage(answer);
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

  private scrollToBottom(){
    requestAnimationFrame(() => {
      this.bottom.nativeElement.scrollIntoView({ behavior: 'smooth' });
    });
  }
}

