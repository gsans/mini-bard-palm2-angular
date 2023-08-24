import { Component, OnInit } from '@angular/core';
import { PredictionServiceClient } from '../generative-ai-vertex/prediction.service';

@Component({
  selector: 'app-root',
  templateUrl: './predict.component.html',
  styleUrls: ['./predict.component.scss']
})
export class PredictComponent implements OnInit {
  title = 'vertex-ai-palm2-angular';

  constructor(
    public client: PredictionServiceClient
  ) { }

  async ngOnInit(): Promise<void> {
    const response = await this.client.predict("What is the largest number with a name?");
    console.log(response.predictions[0].content);
  }

}
