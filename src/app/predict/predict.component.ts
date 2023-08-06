import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { RequestText, ResponseText } from '../models/vertex-ai';

@Component({
  selector: 'app-predict',
  templateUrl: './predict.component.html',
  styleUrls: ['./predict.component.scss']
})
export class PredictComponent implements OnInit {
  title = 'vertex-ai-palm2-angular';

  constructor(public http: HttpClient) {
  }

  ngOnInit(): void {
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${environment.GCLOUD_AUTH_PRINT_ACCESS_TOKEN}`);

    const body:RequestText = {
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
    this.http.post<ResponseText>(url, body, { headers }).subscribe(response => {
      console.log(response.predictions[0].content);
    });
  }

}
