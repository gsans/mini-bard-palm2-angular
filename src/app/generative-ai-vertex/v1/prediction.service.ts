import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { GoogleCloudCredentials } from '../types';
import { createPrompt, TextRequest, TextResponse, createPromptStreaming } from './vertex.types';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PredictionServiceClient {
  private projectID: string = "";
  private accessToken: string = "";

  private baseUrl: string = "https://us-central1-aiplatform.googleapis.com/";
  private version: string = "v1";

  constructor(private http: HttpClient, private config: GoogleCloudCredentials) {
    this.projectID = config.projectId;
    this.accessToken = config.accessToken;
  }

  async predict(text: string, model: string = "text-bison") {
    let endpoint = this.buildEndpointUrl(model);
    let prompt: TextRequest = createPrompt(text);
    let headers = this.getAuthHeaders();

    return firstValueFrom(
      this.http.post<TextResponse>(endpoint, prompt, { headers })
    );
  }

  streamingPredict(text: string, model: string = "text-bison") {
    let endpoint = this.buildEndpointUrlStreaming(model);
    let prompt: any = createPromptStreaming(text);
    let headers = this.getAuthHeadersStreaming();

    return this.http.post(endpoint, prompt, { headers, ... {
      observe: "events",
      responseType: "text",
      reportProgress: true,
    } });
  }

  private buildEndpointUrl(model: string) {

    let url = this.baseUrl;               // base url
    url += this.version;                  // api version
    url += "/projects/" + this.projectID; // project id
    url += "/locations/us-central1";      // google cloud region
    url += "/publishers/google";          // publisher
    url += "/models/" + model;            // model
    url += ":predict";                    // action

    return url;
  }

  private buildEndpointUrlStreaming(model: string) {

    let url = this.baseUrl;               // base url
    url += this.version;                  // api version
    url += "/projects/" + this.projectID; // project id
    url += "/locations/us-central1";      // google cloud region
    url += "/publishers/google";          // publisher
    url += "/models/" + model;            // model
    url += ":serverStreamingPredict";     // action

    return url;
  }

  private getAuthHeaders() {
    return new HttpHeaders()
      .set('Authorization', `Bearer ${this.accessToken}`);
  }

  private getAuthHeadersStreaming() {
    return new HttpHeaders()
      .set('Authorization', `Bearer ${this.accessToken}`);
      //.set('Transfer-Encoding', 'chunked');
  }
}