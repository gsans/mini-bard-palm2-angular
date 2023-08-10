import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { createPrompt, TextRequest, TextResponse } from '../models/vertex-ai';

@Component({
  selector: 'app-root',
  templateUrl: './predict.component.html',
  styleUrls: ['./predict.component.scss']
})
export class PredictComponent implements OnInit {
  title = 'vertex-ai-palm2-angular';
  endpoint: string = "";
  headers: HttpHeaders | undefined;
  prompt: TextRequest = createPrompt("What is the largest number with a name?");

  constructor(public http: HttpClient) {
  }

  ngOnInit(): void {
    //this.TestVertexAIWithApiKey();
    this.TestVertexAIWithoutApiKey();
  }

  TestVertexAIWithApiKey() {
    const API_KEY = '<YOUR_API_KEY>';

    this.buildEndpointUrl(API_KEY);

    this.http.post<TextResponse>(this.endpoint, this.prompt)
      .subscribe(response => {
        console.log(response.predictions[0].content);
      });
  }

  TestVertexAIWithoutApiKey() {
    // const PROJECT_ID = '<YOUR_PROJECT_ID>';
    // const GCLOUD_AUTH_PRINT_ACCESS_TOKEN = '<YOUR_GCLOUD_AUTH_PRINT_ACCESS_TOKEN>';

    const PROJECT_ID = environment.PROJECT_ID;
    const GCLOUD_AUTH_PRINT_ACCESS_TOKEN = environment.GCLOUD_AUTH_PRINT_ACCESS_TOKEN;
    
    this.buildEndpointUrl(PROJECT_ID);
    this.getAuthHeaders(GCLOUD_AUTH_PRINT_ACCESS_TOKEN);

    this.http.post<TextResponse>(this.endpoint, this.prompt, { headers: this.headers })
      .subscribe(response => {
        console.log(response.predictions[0].content);
      });
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

    this.endpoint = url;
  }

  buildEndpointUrlApiKey(apikey: string) {
    const BASE_URL = "https://generativelanguage.googleapis.com/";
    const API_VERSION = 'v1beta2';   // may be different at this time Eg: v1, v2, etc
    const MODEL = 'text-bison-001';  // may be different at this time

    let url = BASE_URL;              // base url
    url += API_VERSION;              // api version
    url += "/models/" + MODEL        // model
    url += ":generateText";          // action
    url += "?key=" + apikey;         // api key

    this.endpoint = url;
  }

  getAuthHeaders(accessToken: string) {
    this.headers = new HttpHeaders()
      .set('Authorization', `Bearer ${accessToken}`);
  }

}
