import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { MakerSuiteCredentials } from '../types';
import { createEmbedding, EmbeddingResponse } from './palm.types';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ModelServiceClient {
  private apiKey: string = "";

  private baseUrl: string = "https://generativelanguage.googleapis.com/";
  private version: string = "v1beta2";

  constructor(private http: HttpClient, private config: MakerSuiteCredentials) {
    this.apiKey = config.apiKey;
  }

  async embedText(text: string, model: string = "embedding-gecko-001") {
    let apiKey = this.config.apiKey;
    let prompt = createEmbedding(model, text);
    let endpoint = this.buildEndpointUrl(model);

    return firstValueFrom(
      this.http.post<EmbeddingResponse>(endpoint, prompt)
    );
  }

  private buildEndpointUrl(model: string) {

    let url = this.baseUrl;          // base url
    url += this.version;             // api version
    url += "/models/" + model        // model
    url += ":embedText";             // action
    url += "?key=" + this.apiKey;    // api key

    return url;
  }
}