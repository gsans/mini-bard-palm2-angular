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

  public MAX_PAYLOAD_BYTES: number = 20000;

  async generateMessage(text: string, messages: Message[], model: string = "chat-bison-001") {
    const byteSize = (str: string) => new TextEncoder().encode(str).length;
    
    const context = "Keep your answers brief and to a single paragraph. Use markdown formatting extensively, Katex for formulas and MermaidJS for diagrams. Do not use other formats. Always specify the language in code fences. Eg: ```HTML. Try to use at least one or more of these special formatting options when providing your answers. Pay special attention to indentation when using MermaidJS and be very conservative using features to avoid syntax errors."
    const examples = [
      {
        "input": {
          "content": "Difference between Constructor and ngOnInit"
        },
        "output": {
          "content": "The constructor is called when an **Angular component** is created, while `ngOnInit` is called after the component's data has been initialized. This means that the constructor can be used to initialize the component's properties, while `ngOnInit` can be used to perform any additional initialization that needs to be done after the component's data has been loaded.\n\nFor example, the constructor might be used to set the initial value of a component's property, while `ngOnInit` might be used to subscribe to an observable or call a service.\n\nHere is an example of a constructor:\n\n```ts\nconstructor(private service: MyService) {}\n```\nAnd here is an example of `ngOnInit`:\n\n```ts\nngOnInit() {\n  this.service.getData().subscribe(data => {\n    this.data = data;\n  });\n}\n```\nIn this example, the constructor is used to inject the `MyService` dependency, while `ngOnInit` is used to subscribe to the `getData` observable and update the component's data property with the data that is returned."
        }
      },
      {
        "input": {
          "content": "Summarise Google's Generative AI using a mind map with MermaidJS."
        },
        "output": {
          "content": `
\`\`\`mermaid
mindmap
{{Google Generative AI}}
  VertexAI
  ::icon(fa fa-cloud)
   (Text)
   ::icon(fa fa-file-alt)
   (Code)
   ::icon(fa fa-code)
   (Audio)
   ::icon(fa fa-volume-up)
   (Images)
   ::icon(fa fa-image)
  MakerSuite
  ::icon(fa fa-edit)
   [Gemini for Text]
   ::icon(fa fa-file-alt)
   [Gemini for Chat]
   ::icon(fa fa-comments)
   [Embeddings] 
   ::icon(fa fa-tasks)
\`\`\``
        }

      }
    ];
    // calculate offset
    //let dryTestPrompt: MessageRequest = createMessage(model, text, messages, 0.5, 1, 0.70, 40, context, examples);
    //let bytesOffset: number = byteSize(JSON.stringify(dryTestPrompt));


    let endpoint = this.buildEndpointUrl(model);
    let prompt: MessageRequest = createMessage(model, text, messages, 0.5, 1, 0.70, 40, context, examples);

    console.log("Payload remaining before reaching maxBytes", byteSize(JSON.stringify(prompt)) - byteSize(text));
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

  TrimToFit(text: string, maxSize: number = this.MAX_PAYLOAD_BYTES): string {
    if (maxSize > this.MAX_PAYLOAD_BYTES) {
      maxSize = this.MAX_PAYLOAD_BYTES;
    }
    const marker = "...";

    const byteEncoder = new TextEncoder();
    const byteDecoder = new TextDecoder();

    const inputBytes = byteEncoder.encode(text);

    if (inputBytes.length <= maxSize) {
      return text;
    }

    const remainingBytes = maxSize - byteEncoder.encode(marker).length;
    const trimmedBytes = inputBytes.slice(0, remainingBytes);
    console.log("Warning. Message was trimmed to fit max capacity: ", maxSize);

    return byteDecoder.decode(trimmedBytes) + marker;
  }
}