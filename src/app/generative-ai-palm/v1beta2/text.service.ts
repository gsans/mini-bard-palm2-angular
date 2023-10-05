import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { MakerSuiteCredentials } from '../types';
import { createTextRequest, TextRequest, TextResponse, HarmCategory, SafetySetting } from './palm.types';
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
    text = text + ". Be very brief in your response so they can be read out loud. Don't use Markdown tables and code fences.";
    let prompt: TextRequest = createTextRequest(model, text, undefined, undefined, undefined, undefined, undefined, 
      [ { "category": HarmCategory.HARM_CATEGORY_DEROGATORY,
        "threshold": SafetySetting.HarmBlockThreshold.BLOCK_NONE }, 
        { "category": HarmCategory.HARM_CATEGORY_TOXICITY, 
          "threshold": SafetySetting.HarmBlockThreshold.BLOCK_NONE }, 
        { "category": HarmCategory.HARM_CATEGORY_VIOLENCE, 
          "threshold": SafetySetting.HarmBlockThreshold.BLOCK_NONE }, 
        { "category": HarmCategory.HARM_CATEGORY_SEXUAL, 
          "threshold": SafetySetting.HarmBlockThreshold.BLOCK_NONE },
        { "category": HarmCategory.HARM_CATEGORY_MEDICAL, 
          "threshold": SafetySetting.HarmBlockThreshold.BLOCK_NONE }, 
        { "category": HarmCategory.HARM_CATEGORY_DANGEROUS, 
          "threshold": SafetySetting.HarmBlockThreshold.BLOCK_NONE }]
      , undefined);

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
