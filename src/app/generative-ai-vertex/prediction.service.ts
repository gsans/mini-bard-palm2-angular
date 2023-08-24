import { Injectable, Optional, Provider, EnvironmentProviders } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { createPrompt, TextRequest, TextResponse } from '../models/vertex-ai';
import { firstValueFrom } from 'rxjs';

export class GoogleCloudCredentials {
  projectID: string = "";
  accessToken: string = "";
}

@Injectable({
  providedIn: 'root'
})
export class PredictionServiceClient {
  constructor(private http: HttpClient, private config: GoogleCloudCredentials) {

  }

  async predict(text: string) {
    let projectID = this.config.projectID;
    let accessToken = this.config.accessToken;

    let endpoint = this.buildEndpointUrl(projectID);
    let prompt: TextRequest = createPrompt(text);
    let headers = this.getAuthHeaders(accessToken);

    return firstValueFrom(
      this.http.post<TextResponse>(endpoint, prompt, { headers })
    );
  }

  buildEndpointUrl(projectId: string) {
    const BASE_URL = "https://us-central1-aiplatform.googleapis.com/";
    const API_VERSION = 'v1';        // may be different at this time
    const MODEL = 'text-bison';

    let url = BASE_URL;              // base url
    url += API_VERSION;              // api version
    url += "/projects/" + projectId; // project id
    url += "/locations/us-central1"; // google cloud region
    url += "/publishers/google";     // publisher
    url += "/models/" + MODEL;       // model
    url += ":predict";               // action

    return url;
  }

  getAuthHeaders(accessToken: string) {
    return new HttpHeaders()
      .set('Authorization', `Bearer ${accessToken}`);
  }
}