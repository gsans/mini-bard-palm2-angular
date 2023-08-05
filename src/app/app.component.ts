import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../environments/environment.development';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'vertex-ai-palm2-angular';
  messages = <any>[];
  loading = false;

  // Random ID to maintain session with server
  sessionId = Math.random().toString(36).slice(-5);

  constructor(public http: HttpClient) { 
  }

  ngOnInit(): void {
    this.addBotMessage('Human presence detected �. How can I help you? ');

    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${environment.GCLOUD_AUTH_PRINT_ACCESS_TOKEN}`);
    const options = {
      "headers": headers,
    }

    const body = {
      "instances": [
        {
          "prompt": "Write a recipe for a chocolate cake."
        }
      ],
      "parameters": {
        "temperature": 0.2,
        "maxOutputTokens": 100,
        "topP": 0.95,
        "topK": 40
      }
    };
    const url = `https://us-central1-aiplatform.googleapis.com/v1/projects/${environment.PROJECT_ID}/locations/us-central1/publishers/google/models/text-bison:predict`;
    // this.http.post(url, body, options).subscribe(Response => {
    //   console.log(Response)
    // });
  }


  handleUserMessage(event:any) {
    console.log(event);
    const text = event.message;
    this.addUserMessage(text);

    this.loading = true;

    // Make an HTTP Request
      this.addBotMessage("Done!");
      this.loading = false;
  }
  // Helpers
  addUserMessage(text:string) {
    this.messages.push({
      text,
      sender: 'You',
      reply: true,
      date: new Date()
    } as any);
  }

  addBotMessage(text:string) {
    this.messages.push({
      text,
      sender: 'Bot',
      date: new Date()
    });
  }
}

