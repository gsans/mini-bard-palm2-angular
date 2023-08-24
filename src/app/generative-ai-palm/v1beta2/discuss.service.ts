import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { MakerSuiteCredentials } from '../types';
import { createMessage, MessageRequest, MessageResponse } from './palm.types';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DiscussServiceClient {
  private apiKey: string = "";

  private baseUrl: string = "https://generativelanguage.googleapis.com/";
  private version: string = "v1beta2";

  constructor(private http: HttpClient, private config: MakerSuiteCredentials) {
    this.apiKey = config.apiKey;
  }

  async generateMessage(text: string, model: string = "text-bison-001") {
    let endpoint = this.buildEndpointUrl(model);
    let prompt: MessageRequest = createMessage(model, text);

    return firstValueFrom(
      this.http.post<MessageResponse>(endpoint, prompt)
    );
  }

  private buildEndpointUrl(model: string) {

    let url = this.baseUrl;          // base url
    url += this.version;             // api version
    url += "/models/" + model        // model
    url += ":generateMessage";       // action
    url += "?key=" + this.apiKey;    // api key

    return url;
  }
}