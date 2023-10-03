import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { MakerSuiteCredentials } from '../types';
import { createMessage, MessageRequest, MessageResponse, Message } from './palm.types';
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

  async generateMessage(text: string, messages: Message[], model: string = "chat-bison-001") {
    const context = "Keep your answers brief and to a single paragraph. Use markdown formatting, Katex for formulas and MermaidJS for diagrams. Always specify the language in code fences. Eg: ```HTML. Try to use at least one or more of these special formatting options when providing your answers."
    const examples = [
      {
        "input": {
          "content": "Difference between Constructor and ngOnInit"
        },
        "output": {
          "content": "The constructor is called when an **Angular component** is created, while `ngOnInit` is called after the component's data has been initialized. This means that the constructor can be used to initialize the component's properties, while `ngOnInit` can be used to perform any additional initialization that needs to be done after the component's data has been loaded.\n\nFor example, the constructor might be used to set the initial value of a component's property, while `ngOnInit` might be used to subscribe to an observable or call a service.\n\nHere is an example of a constructor:\n\n```ts\nconstructor(private service: MyService) {}\n```\nAnd here is an example of `ngOnInit`:\n\n```ts\nngOnInit() {\n  this.service.getData().subscribe(data => {\n    this.data = data;\n  });\n}\n```\nIn this example, the constructor is used to inject the `MyService` dependency, while `ngOnInit` is used to subscribe to the `getData` observable and update the component's data property with the data that is returned."
        }
      }
    ];
    let endpoint = this.buildEndpointUrl(model);
    let prompt: MessageRequest = createMessage(model, text, messages, 0.5, 1, 0.70, 40, context, examples);

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