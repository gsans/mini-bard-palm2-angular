import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { MakerSuiteCredentials } from '../types';
import { createTextRequest, TextRequest, TextResponse } from './palm.types';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TextServiceClient {
  private apiKey: string = "";

  private baseUrl: string = "https://generativelanguage.googleapis.com/";
  private version: string = "v1beta2";

  constructor(private http: HttpClient, private config: MakerSuiteCredentials) {
    this.apiKey = config.apiKey;
  }

  async generateText(text: string, model: string = "text-bison-001") {
    let endpoint = this.buildEndpointUrlApiKey(model);
    let prompt: TextRequest = createTextRequest(model, text);

    return firstValueFrom(
      this.http.post<TextResponse>(endpoint, prompt)
    );
  }

  private buildEndpointUrlApiKey(model: string) {

    let url = this.baseUrl;          // base url
    url += this.version;             // api version
    url += "/models/" + model        // model
    url += ":generateText";          // action
    url += "?key=" + this.apiKey;    // api key

    return url;
  }
}
