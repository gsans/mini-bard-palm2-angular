import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export class MakerSuiteCredentials {
  apiKEY: string = "";
}

@Injectable({
  providedIn: 'root'
})
export class DiscussServiceClient {
  constructor(private http: HttpClient, private config: MakerSuiteCredentials) {

  }

  async embedText(prompt: string) {
    let apiKey = this.config?.apiKEY || "";
    let endpoint = this.buildEndpointUrlApiKey(apiKey);

    // return firstValueFrom(
    //   this.http.post<TextResponse>(endpoint, prompt)
    // );
  }

  buildEndpointUrlApiKey(apikey: string) {
    const BASE_URL = "https://generativelanguage.googleapis.com/";
    const API_VERSION = 'v1beta2';   // may be different at this time Eg: v1, v2, etc
    const MODEL = 'text-bison-001';  // may be different at this time

    let url = BASE_URL;              // base url
    url += API_VERSION;              // api version
    url += "/models/" + MODEL        // model
    url += ":generateMessage";             // action
    url += "?key=" + apikey;         // api key

    return url;
  }
}